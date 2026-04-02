<?php
include 'conexão.php';
$sql = "SELECT * FROM produtos";
$resultado = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela de Funcionarios</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">  
    </head>

    <body>

        <header>
            <div class="nav-container">
            <nav class="menu-links" >
               <a href="#" class="menu-links-meninas" >meninas</a>
               <a href="#" class="menu-links-meninos" >meninos</a>
               <a href="#" class="menu-links-bebes" >bebês</a>
                
            </nav>
            <a href="index.html" class="logo">
                <img src="img/logoabj.webp" alt="Balão Logo">
            </a>

            <div class="user-actions">
                <a href="login.html" title="Entrar ou Cadastrar"><i class="fa-regular fa-user"></i></a>
                <div style="position: relative; display: inline-block; cursor: pointer;" onclick="toggleCart()">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <span id="cart-count" class="cart-badge">0</span>
            </div>

                <i class="fa-regular fa-heart"></i>
                <a href="#contato" ><i class="fa-regular fa-comment"></i></a>
            </div>
        </div>
    </header>

        <main class="container">
        <h1>Controle de Estoque</h1>
        
        <table class="tabela-estilizada">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Tamanho</th>
                    <th>Cor</th>
                    <th>Qtd.estoque</th>
                    <th>Imagem</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php while($dados = $resultado->fetch_assoc()) { ?>
                    <tr>
                        <td><?php echo $dados['nome']; ?></td>
                        <td><?php echo $dados['categoria']; ?></td>
                        <td><?php echo $dados['descricao']; ?></td>
                        <td><?php echo 'R$' . $dados['preco']; ?> </td>
                        <td><?php echo $dados['tamanho']; ?> </td>
                        <td><?php echo $dados['cor']; ?> </td>
                        <td><?php echo $dados['quantidade_estoque']; ?> </td>
<td>
    <img src="img/<?php echo basename($dados['imagem']); ?>" alt="Produto" style="width: 50px; height: 50px;">
</td>                        <td>
                            <?php 
                                if($dados['quantidade_estoque'] > 10) {
                                    echo "<span class='verde'>Em estoque</span>";
                                } else {
                                    echo "<span class='vermelho'>Repor!</span>";
                                }
                            ?>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </main>
    
</body>
</html>