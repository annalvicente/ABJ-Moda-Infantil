<?php
include 'conexão.php'; // Usa a conexão $conn que já funciona

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome_produto'];
    $preco = $_POST['preco_produto'];
    $imagem = $_POST['imagem_produto'];
    $estoque = $_POST['qtd_estoque'];
    
    // Verifica se as medidas foram marcadas (1 para sim, 0 para não)
    $p = isset($_POST['medida_p']) ? 1 : 0;
    $m = isset($_POST['medida_m']) ? 1 : 0;
    $g = isset($_POST['medida_g']) ? 1 : 0;

    $sql = "INSERT INTO produtos (nome, preco, imagem, estoque, medida_p, medida_m, medida_g) 
            VALUES ('$nome', '$preco', '$imagem', '$estoque', '$p', '$m', '$g')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Produto cadastrado com sucesso!'); window.location='painel.html';</script>";
    } else {
        echo "Erro: " . $conn->error;
    }
}
?>