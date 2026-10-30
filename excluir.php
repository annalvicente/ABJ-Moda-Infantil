<!-- Script PHP para eliminar um produto do banco de dados e remover todas as suas conexões com as 
 tabelas de favoritos e carrinho antes de redirecionar para o painel de funcionários. -->

<?php
include 'conexão.php';

$id = $_GET['id'];

if ($id) {
   
    $conn->query("DELETE FROM favoritos WHERE id_produto = $id");
    $conn->query("DELETE FROM carrinho WHERE id_produto = $id");

    $conn->query("DELETE FROM produtos WHERE id = $id");
}

header("Location: tfuncionarios.php");
exit;   
?>