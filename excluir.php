<?php
include 'conexão.php';

$id = $_GET['id'];

if ($id) {
    $conn->query("DELETE FROM produtos WHERE id = $id");
}

header("Location: tfuncionarios.php");
?>