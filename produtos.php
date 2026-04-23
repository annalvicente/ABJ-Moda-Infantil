<?php
include 'conexão.php';

// 1. Capturando os dados de texto
$id         = $_POST['id']; 
$nome       = $_POST['nome'];
$categoria  = $_POST['categoria'];
$descricao  = $_POST['descricao'];
$preco      = $_POST['preco'];
$tamanho    = $_POST['tamanho'];
$cor        = $_POST['cor'];
$quantidade = $_POST['quantidade_estoque'];

// 2. Lógica para Upload da Imagem 1 (Peça)
$imagem1 = $_POST['imagem_atual'] ?? 'padrao.webp'; // Se não subir nova, mantém a atual
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
    $extensao = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
    $novo_nome = md5(uniqid()) . "." . $extensao; // Gera nome único para não sobrescrever
    $destino = "img/" . $novo_nome;
    
    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $destino)) {
        $imagem1 = $novo_nome;
    }
}

// 3. Lógica para Upload da Imagem 2 (No Corpo)
$imagem2 = $_POST['imagem_corpo_atual'] ?? 'padrao_corpo.webp'; 
if (isset($_FILES['imagem_corpo']) && $_FILES['imagem_corpo']['error'] == 0) {
    $extensao_corpo = pathinfo($_FILES['imagem_corpo']['name'], PATHINFO_EXTENSION);
    $novo_nome_corpo = md5(uniqid()) . "_corpo." . $extensao_corpo; 
    $destino_corpo = "img/" . $novo_nome_corpo;
    
    if (move_uploaded_file($_FILES['imagem_corpo']['tmp_name'], $destino_corpo)) {
        $imagem2 = $novo_nome_corpo;
    }
}

// 4. Decisão: INSERT ou UPDATE
if (empty($id)) {
    // SQL para ADICIONAR novo produto
    $sql = "INSERT INTO produtos (nome, categoria, descricao, preco, tamanho, cor, quantidade_estoque, imagem, imagem_corpo) 
            VALUES ('$nome', '$categoria', '$descricao', '$preco', '$tamanho', '$cor', '$quantidade', '$imagem1', '$imagem2')";
} else {
    // SQL para EDITAR produto existente
    $sql = "UPDATE produtos SET 
            nome='$nome', 
            categoria='$categoria', 
            descricao='$descricao', 
            preco='$preco', 
            tamanho='$tamanho', 
            cor='$cor', 
            quantidade_estoque='$quantidade',
            imagem='$imagem1',
            imagem_corpo='$imagem2'
            WHERE id=$id";
}

// 5. Execução e Redirecionamento
if ($conn->query($sql)) {
    header("Location: tfuncionarios.php");
} else {
    echo "Erro ao salvar no banco de dados: " . $conn->error;
}
?>