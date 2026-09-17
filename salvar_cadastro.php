<?php
include 'conexão.php';
header('Content-Type: application/json');

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados inválidos']);
    exit;
}

$tipo   = $dados['tipo'] ?? 'cliente';
$tabela = ($tipo === 'cliente') ? 'clientes' : 'vendedores';

$nome       = $dados['nome']       ?? '';
$email      = $dados['email']      ?? '';
$cpf        = $dados['cpf']        ?? '';
$nascimento = $dados['nascimento'] ?? '';
$telefone   = $dados['telefone']   ?? '';
$senha      = password_hash($dados['senha'] ?? '', PASSWORD_DEFAULT);

$sql  = "INSERT INTO $tabela (nome, email, cpf, data_nascimento, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $nome, $email, $cpf, $nascimento, $telefone, $senha);

if ($stmt->execute()) {
    echo json_encode(['status' => 'sucesso']);
} else {
    echo json_encode(['status' => 'erro', 'mensagem' => $conn->error]);
}
