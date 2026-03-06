<?php
session_start();
include 'conexão.php'; // Usa a conexão padrão que já criamos ($conn)

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $tipo = $_POST['tipo_usuario']; // Deve vir do <select> ou <input> do login.html

    // Define a tabela baseada no tipo
    $tabela = ($tipo == 'vendedor') ? 'vendedores' : 'clientes';
    
    // Procura o usuário
    $sql = "SELECT * FROM $tabela WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Verifica a senha
        if (password_verify($senha, $row['senha'])) {
            // Salva na Sessão PHP (Segurança no Servidor)
            $_SESSION['usuario_nome'] = $row['nome'];
            $_SESSION['tipo'] = $tipo;

            // --- PULO DO GATO ---
            // Cria um script para salvar no localStorage também. 
            // Assim o seu index.html atual vai reconhecer o login na hora!
            echo "<script>
                const usuario = {
                    nome: '" . $row['nome'] . "',
                    tipo: '" . $tipo . "'
                };
                localStorage.setItem('usuario_logado_atual', JSON.stringify(usuario));
                alert('Bem-vindo, " . $row['nome'] . "!');
                window.location='index.html';
            </script>";
        } else {
            echo "<script>alert('Senha incorreta!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Usuário não encontrado!'); window.history.back();</script>";
    }
}

$conn->close();
?>