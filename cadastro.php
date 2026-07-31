<?php
session_start();

if (!file_exists('conexão.php')) {
    die(json_encode(['status' => 'erro', 'mensagem' => 'Arquivo conexão.php não encontrado!']));
}
require_once 'conexão.php';

header('Content-Type: application/json');

// Define a chave de segurança para novos vendedores
define('CHAVE_SEGURANCA_LOJA', 'VENDEDOR-SISTEMA');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome            = trim($_POST['nome']            ?? '');
    $email           = trim($_POST['email']           ?? '');
    $senha           = $_POST['senha']                ?? '';
    $cpf             = trim($_POST['cpf']             ?? '');
    $data_nascimento = $_POST['data_nascimento']      ?? '';
    $telefone        = trim($_POST['telefone']        ?? '');
    $tipo_usuario    = $_POST['tipo_form']            ?? 'cliente';
    $chave_loja      = trim($_POST['chave_loja']      ?? ''); // Campo enviado no formulário

    // Validações básicas
    if (empty($nome) || empty($email) || empty($senha)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Nome, e-mail e senha são obrigatórios.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'E-mail inválido.']);
        exit;
    }

    // 🔒 VALIDAÇÃO DE SEGURANÇA PARA VENDEDORES
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

    // Verifica se e-mail já está cadastrado
    $stmt_check = $conn->prepare("SELECT id FROM $tabela WHERE email = ?");
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Este e-mail já está cadastrado.']);
        exit;
    }

    $senha_criptografada = password_hash($senha, PASSWORD_DEFAULT);

    // Prepared statement — seguro contra SQL Injection
    $stmt = $conn->prepare(
        "INSERT INTO $tabela (nome, email, cpf, data_nascimento, telefone, senha)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssssss", $nome, $email, $cpf, $data_nascimento, $telefone, $senha_criptografada);

    if ($stmt->execute()) {
        $label = ($tipo_usuario === 'vendedor') ? 'Vendedor' : 'Cliente';
        echo json_encode(['status' => 'sucesso', 'mensagem' => "Cadastro de $label realizado com sucesso!"]);
    } else {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao salvar: ' . $conn->error]);
    }
    exit;
}

echo json_encode(['status' => 'erro', 'mensagem' => 'Requisição inválida.']);