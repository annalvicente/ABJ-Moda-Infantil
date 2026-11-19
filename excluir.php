<?php
session_start();
include 'conexao.php';

if (!isset($_SESSION['tipo']) || $_SESSION['tipo'] !== 'vendedor') {
    header("Location: index.php?login=1");
    exit();
}

$id = $_GET['id'];

if ($id) {
    $conn->query("DELETE FROM favoritos WHERE id_produto = $id");
    $conn->query("DELETE FROM carrinho WHERE id_produto = $id");
    $conn->query("DELETE FROM produtos WHERE id = $id");
}

header("Location: tfuncionarios.php?sucesso=3");
exit;   
?>