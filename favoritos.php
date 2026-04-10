<?php 
// Conecta ao banco logo no início da página
include 'conexão.php'; 
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Favoritos</title>
    <link rel="stylesheet" href="style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <div class="container">
        <h1>Meus Favoritos</h1>
        
        <div id="lista-favoritos">
            <p style="text-align:center;">Carregando seus favoritos...</p>
        </div>

        <div class="acoes-lista" ">
             <button class="btn-fav-carrinho" onclick="adicionarFavoritosAoCarrinho()">
                <i class="fa-solid fa-cart-plus"></i> Adicionar Selecionados ao Carrinho
            </button>
        </div>

        <br>
        <a href="index.php" class="voltar">← Voltar para a Loja</a>
    </div>

    <script src="favoritos.js"></script>
    <script src="acoesfav.php"></script>
</body>
</html>