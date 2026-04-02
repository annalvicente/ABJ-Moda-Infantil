<?php
include 'conexão.php'; // Aqui você define a variável $conn

// 2. Receber os dados do formulário
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $tipo = $_POST['tipo_form']; 

    // --- CADASTRO DE CLIENTE ---
    if ($tipo == 'cliente') {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); 

        $sql = "INSERT INTO clientes (nome, email, senha) VALUES ('$nome', '$email', '$senha')";

        // CORREÇÃO: Trocado $conexao por $conn
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Cliente cadastrado com sucesso!'); window.location='index.html';</script>";
        } else {
            echo "Erro: " . $sql . "<br>" . $conn->error;
        }
    }

}

$conn->close(); // CORREÇÃO: Trocado para $conn
?>

