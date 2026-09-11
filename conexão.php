<?php
$host = "localhost";
$user = "root"; 
$pass = "Home@spSENAI2025!"; // senha do MySQL
$db   = "loja_kids";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}
?>