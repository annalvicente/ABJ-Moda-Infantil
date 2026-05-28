
<?php
// acoescart.php
include 'conexão.php';
 
header('Content-Type: application/json');
 
$acao = isset($_GET['acao']) ? $_GET['acao'] : '';
 
// LISTAR ITENS
if ($acao == 'listar') {
    // CORRIGIDO: colunas corretas do banco (id_produto, não produto_id)
    $sql = "SELECT c.id AS id_carrinho, c.id_produto, c.quantidade, p.nome, p.preco, p.imagem 
            FROM carrinho c 
            JOIN produtos p ON c.id_produto = p.id";
            
    $result = $conn->query($sql);
    $itens = [];
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $itens[] = $row;
        }
    }
    echo json_encode($itens);
    exit;
}
 
// ADICIONAR ITEM
if ($acao == 'adicionar') {
    $produto_id = isset($_POST['produto_id']) ? intval($_POST['produto_id']) : 0;
    
    if ($produto_id > 0) {
        // CORRIGIDO: coluna correta é id_produto
        $check = $conn->query("SELECT id, quantidade FROM carrinho WHERE id_produto = $produto_id");
        
        if ($check && $check->num_rows > 0) {
            $row = $check->fetch_assoc();
            $nova_qtd = $row['quantidade'] + 1;
            $conn->query("UPDATE carrinho SET quantidade = $nova_qtd WHERE id = " . $row['id']);
        } else {
            // CORRIGIDO: coluna correta é id_produto
            $conn->query("INSERT INTO carrinho (id_produto, quantidade) VALUES ($produto_id, 1)");
        }
        echo json_encode(['status' => 'sucesso']);
    }
    exit;
}
 
// REMOVER ITEM
if ($acao == 'remover') {
    $id_carrinho = isset($_POST['id_carrinho']) ? intval($_POST['id_carrinho']) : 0;
    
    if ($id_carrinho > 0) {
        $conn->query("DELETE FROM carrinho WHERE id = $id_carrinho");
        echo json_encode(['status' => 'sucesso']);
    }
    exit;
}
?>