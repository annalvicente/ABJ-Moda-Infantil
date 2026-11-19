<?php
session_start();

if (!file_exists('conexao.php')) {
    die(json_encode(['status' => 'erro', 'mensagem' => 'Arquivo conexao.php não encontrado!']));
}
require_once 'conexao.php';

header('Content-Type: application/json');

// Define a chave de segurança para novos vendedores
define('CHAVE_SEGURANCA_LOJA', 'VENDEDOR-SISTEMA');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome            = trim($_POST['nome']            ?? '');
    $email           = trim($_POST['email']           ?? '');
    $senha           = $_POST['senha']                ?? '';
    $cpf             = trim($_POST['cpf']             ?? '');
    $data_nascimento = trim($_POST['data_nascimento'] ?? '');
    $telefone        = trim($_POST['telefone']        ?? '');
    $tipo_usuario    = $_POST['tipo_form']            ?? 'cliente';
    $chave_loja      = trim($_POST['chave_loja']      ?? '');

    // 1. Validação de obrigatoriedade de todos os campos
    if (
        empty($nome) ||
        empty($email) ||
        empty($cpf) ||
        empty($data_nascimento) ||
        empty($telefone) ||
        empty($senha)
    ) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Todos os campos são obrigatórios!']);
        exit;
    }

    // 1.1 Validação de tamanho e caracteres do Nome (mín 3 e máx 80 caracteres, apenas letras e espaços)
    if (mb_strlen($nome, 'UTF-8') < 3 || mb_strlen($nome, 'UTF-8') > 80) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'O nome deve ter entre 3 e 80 caracteres.']);
        exit;
    }
    if (!preg_match('/^[\p{L}\s]+$/u', $nome)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'O nome não pode conter números ou caracteres especiais.']);
        exit;
    }

    // 2. Validação de tamanho e formato de e-mail (máx 100 caracteres)
    if (mb_strlen($email, 'UTF-8') > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'E-mail inválido ou muito longo (máx. 100 caracteres).']);
        exit;
    }

    // 3. Validação de CPF (11 dígitos numéricos)
    $cpf_numeros = preg_replace('/\D/', '', $cpf);
    if (strlen($cpf_numeros) !== 11) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'CPF inválido. Informe os 11 dígitos.']);
        exit;
    }

    // 3.1 Validação de Data de Nascimento (mínimo 18 anos e máximo 120 anos)
    $data_nasc_obj = DateTime::createFromFormat('Y-m-d', $data_nascimento);
    if (!$data_nasc_obj || $data_nasc_obj->format('Y-m-d') !== $data_nascimento) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Data de nascimento inválida.']);
        exit;
    }

    $hoje = new DateTime();
    $idade = $hoje->diff($data_nasc_obj)->y;

    if ($data_nasc_obj > $hoje || $idade < 18 || $idade > 120) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Você precisa ter pelo menos 18 anos para se cadastrar.']);
        exit;
    }

    // 4. Validação de Telefone (10 ou 11 dígitos numéricos)
    $tel_numeros = preg_replace('/\D/', '', $telefone);
    if (strlen($tel_numeros) < 10 || strlen($tel_numeros) > 11) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Telefone inválido. Informe DDD + número.']);
        exit;
    }

    // 5. Validação de tamanho mínimo da senha (sem espaços vazios)
    if (strlen(trim($senha)) < 6) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'A senha deve ter no mínimo 6 caracteres.']);
        exit;
    }

    // 6. Validação de segurança para vendedores
    if ($tipo_usuario === 'vendedor') {
        if (empty($chave_loja)) {
            echo json_encode(['status' => 'erro', 'mensagem' => 'Informe o código de autorização da loja para cadastrar vendedor.']);
            exit;
        }

        if ($chave_loja !== CHAVE_SEGURANCA_LOJA) {
            echo json_encode(['status' => 'erro', 'mensagem' => 'Código de autorização da loja incorreto!']);
            exit;
        }
    }

    $tabela = ($tipo_usuario === 'vendedor') ? 'vendedores' : 'clientes';

    // 7. Verifica se e-mail ou CPF já estão cadastrados
    $stmt_check = $conn->prepare("SELECT id FROM $tabela WHERE email = ? OR cpf = ?");
    $stmt_check->bind_param("ss", $email, $cpf);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Este e-mail ou CPF já está cadastrado.']);
        exit;
    }
    $stmt_check->close();

    $senha_criptografada = password_hash($senha, PASSWORD_DEFAULT);

    // 8. Inserção segura com Prepared Statement
    $stmt = $conn->prepare(
        "INSERT INTO $tabela (nome, email, cpf, data_nascimento, telefone, senha)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssssss", $nome, $email, $cpf, $data_nascimento, $telefone, $senha_criptografada);

    if ($stmt->execute()) {
        $label = ($tipo_usuario === 'vendedor') ? 'Vendedor' : 'Cliente';
        echo json_encode(['status' => 'sucesso', 'mensagem' => "Cadastro de $label realizado com sucesso!"]);
    } else {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao salvar: ' . $stmt->error]);
    }
    $stmt->close();
    exit;
}

echo json_encode(['status' => 'erro', 'mensagem' => 'Requisição inválida.']);
?>