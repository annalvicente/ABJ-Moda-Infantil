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
    <title>Tela de Funcionários</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">   
</head>

<body>
    <header>
            <a href="index.html" class="logo">
                <img src="img/logoabj.webp" alt="Balão Logo">
            </a>
        
    </header>

    <main class="container">
        <h1>Controle de Estoque</h1>
        <div class="adicao">
            
            <a href="formulario.php" >
                <i class="fa-solid fa-plus"></i> Adicionar Roupa
            </a>
        </div>
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
                    <th>Ações</th> </tr>
            </thead>
            <tbody>
                <?php while($dados = $resultado->fetch_assoc()) { ?>
                    <tr>
                        <td><?php echo $dados['nome']; ?></td>
                        <td><?php echo $dados['categoria']; ?></td>
                        <td><?php echo $dados['descricao']; ?></td>
                        <td>R$ <?php echo number_format($dados['preco'], 2, ',', '.'); ?></td>
                        <td><?php echo $dados['tamanho']; ?></td>
                        <td><?php echo $dados['cor']; ?></td>
                        <td><?php echo $dados['quantidade_estoque']; ?></td>
                        <td><img src="img/<?php echo basename($dados['imagem']); ?>" width="50"></td>
                        <td>
                            <?php 
                                if($dados['quantidade_estoque'] > 10) {
                                    echo "<span class='verde'>Em estoque</span>";
                                } else {
                                    echo "<span class='vermelho'>Repor!</span>";
                                }
                            ?>
                        </td>
                        <td >
                            <a class="alterar"  href="formulario.php?id=<?php echo $dados['id']; ?>" title="Editar">
                               <i class="fa-solid fa-pen"></i>

                            </a>
                        <a class="excluir"  href="excluir.php?id=<?php echo $dados['id']; ?>" title="Excluir"  onclick="return confirm('Tem certeza que deseja excluir esta peça?')">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </main>
</body>
</html>