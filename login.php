<?php
session_start();

// Inclui a conexão com o banco (com acento, igual ao arquivo real)
if (!file_exists('conexão.php')) {
    die("<script>alert('Erro crítico: conexão.php não encontrado!'); window.location='index.html';</script>");
}
require_once 'conexão.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email        = trim($_POST['email'] ?? '');
    $senha        = $_POST['senha'] ?? '';
    $tipo_usuario = $_POST['tipo_usuario'] ?? 'cliente'; // campo enviado pelo index.html

    if (empty($email) || empty($senha)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Preencha e-mail e senha.']);
        exit;
    }

    // Escolhe a tabela certa
    $tabela = ($tipo_usuario === 'vendedor') ? 'vendedores' : 'clientes';

    // Busca o usuário pelo e-mail (prepared statement — seguro)
    $stmt = $conn->prepare("SELECT id, nome, senha FROM $tabela WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        // Usuário não existe
        echo json_encode(['status' => 'erro', 'mensagem' => 'E-mail não cadastrado.']);
        exit;
    }

    $usuario = $resultado->fetch_assoc();

    // Verifica a senha
    if (!password_verify($senha, $usuario['senha'])) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Senha incorreta.']);
        exit;
    }

    // Login OK — salva na sessão
    $_SESSION['cliente_id']   = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];
    $_SESSION['tipo']         = $tipo_usuario;

    $redirect = ($tipo_usuario === 'vendedor') ? 'tfuncionarios.php' : 'index.html';

    echo json_encode([
        'status'   => 'sucesso',
        'mensagem' => 'Bem-vindo(a), ' . $usuario['nome'] . '!',
        'redirect' => $redirect
    ]);
    exit;
}
