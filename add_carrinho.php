<?php
session_start();
// Conexão com o seu banco de dados (substitua com as suas variáveis)
$conexao = new mysqli("localhost", "usuario", "senha", "nome_do_banco");

if ($conexao->connect_error) {
    die(json_encode(['sucesso' => false, 'erro' => 'Falha na conexão']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto_id = intval($_POST['produto_id']);
    $quantidade = intval($_POST['quantidade']);
    $session_id = session_id(); // Identificador único da sessão do visitante atual

    // Verifica se o produto já está no carrinho desta sessão
    $stmt = $conexao->prepare("SELECT id, quantidade FROM carrinho WHERE session_id = ? AND produto_id = ?");
    $stmt->bind_param("si", $session_id, $produto_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        // Se já existe, apenas aumenta a quantidade
        $item = $resultado->fetch_assoc();
        $nova_qtd = $item['quantidade'] + $quantidade;
        
        $update = $conexao->prepare("UPDATE carrinho SET quantidade = ? WHERE id = ?");
        $update->bind_param("ii", $nova_qtd, $item['id']);
        $executou = $update->execute();
    } else {
        // Se não existe, insere um novo registro
        $insert = $conexao->prepare("INSERT INTO carrinho (session_id, produto_id, quantidade) VALUES (?, ?, ?)");
        $insert->bind_param("sii", $session_id, $produto_id, $quantidade);
        $executou = $insert->execute();
    }

    if ($executou) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'Erro ao salvar no banco']);
    }
}
?>