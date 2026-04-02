<?php
include 'conexão.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $tipo = $_POST['tipo_form']; 

    // Mudei para aceitar 'vendedor' ou 'funcioa' (que estava no seu value anterior)
    if ($tipo == 'vendedor' ) {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $cpf = $_POST['cpf'];
        $data_nascimento = $_POST['data_nascimento'];
        $telefone = $_POST['telefone'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); 

        // IMPORTANTE: Verifique se esses nomes de colunas existem na tabela 'vendedores'
        $sql = "INSERT INTO vendedores (nome, email, cpf, data_nascimento, telefone, senha) 
                VALUES ('$nome', '$email', '$cpf', '$data_nascimento', '$telefone', '$senha')";

        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Vendedor cadastrado com sucesso!'); window.location='tfuncionarios.php';</script>";
        } else {
            // Isso aqui vai te dizer exatamente qual coluna está errada
            echo "Erro no Banco: " . $conn->error;
        }
    }
}
$conn->close(); 
?>