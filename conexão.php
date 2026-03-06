<?php
$host = "localhost";
$user = "root"; // Altere se o seu usuário for diferente
$pass = "Home@spSENAI2025!"; // Coloque a senha do seu MySQL80
$db   = "loja_kids";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}
?>