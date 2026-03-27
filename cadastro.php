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

    // --- CADASTRO DE VENDEDOR ---
    if ($tipo == 'vendedor') {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $cpf = $_POST['cpf'];
        $data_nascimento = $_POST['data_nascimento'];
        $telefone = $_POST['telefone'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO vendedores (nome, email, cpf, data_nascimento, telefone, senha) 
                VALUES ('$nome', '$email', '$cpf', '$data_nascimento', '$telefone', '$senha')";

        // CORREÇÃO: Trocado $conexao por $conn
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Vendedor cadastrado com sucesso!'); window.location='index.html';</script>";
        } else {
            echo "Erro: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close(); // CORREÇÃO: Trocado para $conn
?>

<?php
include 'conexão.php'; // Aqui você tem o $conn

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Pegando o tipo (cliente ou vendedor) do formulário
    $tipo = $_POST['tipo_form']; 

    // --- CADASTRO DE CLIENTE ---
    if ($tipo == 'cliente') {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); 

        $sql = "INSERT INTO clientes (nome, email, senha) VALUES ('$nome', '$email', '$senha')";

        // USANDO $conn (que vem do conexão.php)
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Cliente cadastrado com sucesso!'); window.location='index.html';</script>";
        } else {
            echo "Erro ao cadastrar cliente: " . $conn->error;
        }
    }

    // --- CADASTRO DE VENDEDOR ---
    if ($tipo == 'vendedor') {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $cpf = $_POST['cpf'];
        $data_nascimento = $_POST['data_nascimento'];
        $telefone = $_POST['telefone'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO vendedores (nome, email, cpf, data_nascimento, telefone, senha) 
                VALUES ('$nome', '$email', '$cpf', '$data_nascimento', '$telefone', '$senha')";

        // USANDO $conn
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Vendedor cadastrado com sucesso!'); window.location='index.html';</script>";
        } else {
            echo "Erro ao cadastrar vendedor: " . $conn->error;
        }
    }
}

$conn->close();
?>