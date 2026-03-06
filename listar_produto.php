<?php
include 'conexão.php';

$sql = "SELECT * FROM produtos ORDER BY id DESC";
$resultado = $conn->query($sql);

$produtos = [];

if ($resultado->num_rows > 0) {
    while($linha = $resultado->fetch_assoc()) {
        $produtos[] = $linha;
    }
}

// Retorna os dados em formato JSON para o JavaScript ler
header('Content-Type: application/json');
echo json_encode($produtos);
?>