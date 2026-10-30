<?php
session_start();

// Configura o cabeçalho para responder sempre em JSON
header('Content-Type: application/json');

// Conexão com o banco de dados
$conexao = new mysqli("localhost", "root", "", "nome_do_seu_banco");

if ($conexao->connect_error) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Falha na conexão com o banco']);
    exit;
}

// Garante que o usuário está logado para ter o id_cliente
if (!isset($_SESSION['id_cliente'])) {
    http_response_code(401); // Retorna 401 para o JS abrir o alerta de login
    echo json_encode(['status' => 'erro', 'mensagem' => 'Usuário não autenticado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_cliente = $_SESSION['id_cliente'];
    $id_produto = isset($_POST['produto_id']) ? intval($_POST['produto_id']) : 0;
    // Se a quantidade não for informada no POST, assume 1 como padrão
    $quantidade = isset($_POST['quantidade']) ? intval($_POST['quantidade']) : 1;

    if ($id_produto <= 0) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Produto inválido']);
        exit;
    }

    // 1. Verifica se o produto já está no carrinho deste cliente
    $stmt = $conexao->prepare("SELECT id, quantidade FROM carrinho WHERE id_cliente = ? AND id_produto = ?");
    $stmt->bind_param("ii", $id_cliente, $id_produto);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        // Se já existe, atualiza a quantidade
        $item = $resultado->fetch_assoc();
        $nova_qtd = $item['quantidade'] + $quantidade;
        
        $update = $conexao->prepare("UPDATE carrinho SET quantidade = ? WHERE id = ?");
        $update->bind_param("ii", $nova_qtd, $item['id']);
        $executou = $update->execute();
    } else {
        // Se não existe, insere o novo registro conforme sua tabela
        $insert = $conexao->prepare("INSERT INTO carrinho (id_cliente, id_produto, quantidade) VALUES (?, ?, ?)");
        $insert->bind_param("iii", $id_cliente, $id_produto, $quantidade);
        $executou = $insert->execute();
    }

    // 2. Retorna a chave 'status' para casar com o que o seu JS espera
    if ($executou) {
        echo json_encode(['status' => 'sucesso']);
    } else {
        echo json_encode(['status' => 'erro', 'mensagem' => $conexao->error]);
    }
}
?>