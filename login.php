<?php
session_start();
include 'conexão.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // 1. Tenta procurar na tabela de CLIENTES primeiro
    $sql_cliente = "SELECT * FROM clientes WHERE email = '$email'";
    $res_cliente = $conn->query($sql_cliente);

    if ($res_cliente->num_rows > 0) {
        $row = $res_cliente->fetch_assoc();
        if (password_verify($senha, $row['senha'])) {
            $_SESSION['usuario_nome'] = $row['nome'];
            $_SESSION['tipo'] = 'cliente';
            
            echo "<script>alert('Bem-vindo Cliente!'); window.location='index.html';</script>";
            exit();
        }
    }

    // 2. Se não achou no cliente, tenta na de VENDEDORES
    $sql_vendedor = "SELECT * FROM vendedores WHERE email = '$email'";
    $res_vendedor = $conn->query($sql_vendedor);

    if ($res_vendedor->num_rows > 0) {
        $row = $res_vendedor->fetch_assoc();
        if (password_verify($senha, $row['senha'])) {
            $_SESSION['usuario_nome'] = $row['nome'];
            $_SESSION['tipo'] = 'vendedor';
            
            // MUDE AQUI para o nome exato do seu arquivo de funcionário
            echo "<script>alert('Bem-vindo Vendedor!'); window.location='tfuncionarios.php';</script>";
            exit();
        }
    }

    // 3. Se chegou aqui, é porque não achou em nenhum ou a senha errou
    echo "<script>alert('E-mail ou senha incorretos!'); window.history.back();</script>";
}
$conn->close();
?>