<?php
include 'conexão.php';

// 1. Criamos uma simulação de vendedor logado (ID 1). 
// No futuro, você vai pegar isso da $_SESSION['id_vendedor'] após o login do funcionário.
$id_vendedor_logado = 1; 

// 2. Buscar os produtos do banco
$sql = "SELECT p.*, c.nome AS nome_categoria 
        FROM produtos p 
        LEFT JOIN categoria c ON p.id_categoria = c.id";
$resultado = $conn->query($sql);

// 3. Buscar as categorias dinamicamente para listar no Modal de cadastro/edição
$sql_categorias = "SELECT * FROM categoria";
$resultado_categorias = $conn->query($sql_categorias);
$categorias = [];
if ($resultado_categorias) {
    while ($cat = $resultado_categorias->fetch_assoc()) {
        $categorias[] = $cat;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela de Funcionários</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="funcionario.css">   
</head>

<body>
<header class="header-admin">
    <div class="header-left"></div>
    <a href="tfuncionarios.php" class="logo">
        <img src="img/logoabj.webp" alt="Balão Logo">
    </a>
    <div class="header-right">
        <a href="index.html" class="btn-visualizar">
            <i class="fa-solid fa-shop"></i> Ver loja
        </a>
    </div>
</header>

<main class="container">
    <div class="header-tabela">
        <h1 class="h1-tabela"> Controle de Estoque</h1>
        <div class="adicao">  
            <button onclick="abrirModal()" class="adicao"> + Novo Produto </button>
        </div>
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
                <th>Imagens (Peça / Corpo)</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php while($dados = $resultado->fetch_assoc()) { ?>
                <tr>
                    <td><?php echo htmlspecialchars($dados['nome']); ?></td>
                    <td><?php echo htmlspecialchars($dados['nome_categoria'] ?? 'Sem Categoria'); ?></td>
                    <td><?php echo htmlspecialchars($dados['descricao']); ?></td>
                    <td>R$ <?php echo number_format($dados['preco'], 2, ',', '.'); ?></td>
                    <td><?php echo htmlspecialchars($dados['tamanho']); ?></td>
                    <td><?php echo htmlspecialchars($dados['cor']); ?></td>
                    <td><?php echo $dados['quantidade_estoque']; ?></td>
                    
                    <td>
                        <div class="fotos-grid">
                            <img src="img/<?php echo basename($dados['imagem']); ?>" title="Foto da Peça">
                            <img src="img/<?php echo basename($dados['imagem_corpo']); ?>" title="Foto no Corpo">
                        </div>
                    </td>

                    <td>
                        <?php 
                            if($dados['quantidade_estoque'] > 10) {
                                echo "<span> Em estoque</span>";
                            } else {
                                echo "<span> Repor!</span>";
                            }
                        ?>
                    </td>
                    <td>
                        <a class="alterar" href="javascript:void(0)" 
                           onclick="abrirModal(
                               '<?php echo $dados['id']; ?>', 
                               '<?php echo addslashes($dados['nome']); ?>', 
                               '<?php echo $dados['id_categoria']; ?>', 
                               '<?php echo addslashes($dados['descricao']); ?>', 
                               '<?php echo $dados['preco']; ?>', 
                               '<?php echo $dados['tamanho']; ?>', 
                               '<?php echo $dados['cor']; ?>', 
                               '<?php echo $dados['quantidade_estoque']; ?>',
                               '<?php echo $dados['imagem']; ?>', 
                               '<?php echo $dados['imagem_corpo']; ?>'
                           )">
                           <i class="fa-solid fa-pen"></i>
                        </a>
                        
                        <a class="excluir" href="excluir.php?id=<?php echo $dados['id']; ?>" onclick="return confirm('Tem certeza que deseja excluir esta peça?')">
                            <i class="fa-solid fa-trash"></i>
                        </a>
                    </td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</main>

<div id="modalProduto" class="modal">
    <div class="modal-content">
        <span class="close" onclick="fecharModal()">&times;</span>
        <h2 class="h2-modal" id="modalTitulo">Adicionar Nova Roupa</h2>

        <form action="produtos.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="id" id="prod_id">
            
            <input type="hidden" name="id_vendedor" value="<?php echo $id_vendedor_logado; ?>">
            
            <div class="form-group">
                <label>Nome da Peça:</label>
                <input type="text" name="nome" id="prod_nome" required>
            </div>

            <div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select name="id_categoria" id="prod_categoria">
                        <option value="">Selecione</option>
                        <?php foreach($categorias as $cat) { ?>
                            <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['nome']); ?></option>
                        <?php } ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tamanho:</label>
                    <input type="text" name="tamanho" id="prod_tamanho">
                </div>
            </div>

            <div>
                <div class="form-group">
                    <label>Cor:</label>
                    <input type="text" name="cor" id="prod_cor">
                </div>
                <div class="form-group">
                    <label>Preço (R$):</label>
                    <input type="number" step="0.01" name="preco" id="prod_preco" required>
                </div>
            </div>

            <div class="form-group">
                <label>Quantidade em Estoque:</label>
                <input type="number" name="quantidade_estoque" id="prod_qtd" required>
            </div>

            <div class="form-group">
                <label>Descrição:</label>
                <textarea name="descricao" id="prod_desc" rows="2"></textarea>
            </div>

            <input type="hidden" name="imagem_atual" id="prod_imagem_atual">
            <input type="hidden" name="imagem_corpo_atual" id="prod_imagem_corpo_atual">
            
            <div>
                <div class="form-group">
                    <label>Foto da Peça (.webp):</label>
                    <input type="file" name="imagem" accept="image/webp">
                </div>
                <div class="form-group">
                    <label>Foto no Corpo (.webp):</label>
                    <input type="file" name="imagem_corpo" accept="image/webp">
                </div>
            </div>

            <button type="submit" class="btn-salvar">Gravar Dados</button>
        </form>
    </div>
</div>

    <footer id="contato" class="footer-container-jactech">
        
        <div class="footer-ecommerce-body">
            <div class="ecommerce-wrapper">
                
                <div class="ecom-col">
                    <h4>Pague com</h4>
                    <hr class="title-line">
                    <div class="payment-brands">
                        <i class="fa-brands fa-cc-visa" title="Visa"></i>
                        <i class="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                        <i class="fa-brands fa-cc-diners-club" title="Diners"></i>
                        <i class="fa-brands fa-cc-amex" title="Amex"></i>
                        <i class="fa-solid fa-pix" title="Pix"></i>
                    </div>
                    <div class="boleto-box-clean">
                        <i class="fa-solid fa-barcode"></i>
                        <span>Boleto Bancário</span>
                    </div>
                </div>

                <div class="ecom-col">
                    <h4>Selos</h4>
                    <hr class="title-line">
                    <div class="security-flex-row">
                        <div class="badge-item ssl">
                            <i class="fa-solid fa-shield-halved"></i>
                            <div>
                                <strong>Site Protegido</strong>
                                <span>Certificado SSL</span>
                            </div>
                        </div>
                        <div class="badge-item google">
                            <i class="fa-brands fa-google"></i>
                            <div>
                                <strong>Safe Browsing</strong>
                                <span>Google</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ecom-col">
                    <h4>Atendimento</h4>
                    <hr class="title-line">
                    <ul class="info-list">
                        <li><i class="fa-regular fa-clock"></i> Segunda a Sexta das 9h as 18h</li>
                        <li><i class="fa-solid fa-phone"></i> (12) 98171-14147</li>
                        <li><i class="fa-regular fa-envelope"></i> ABJmodainfantil@gmail.com</li>
                        <li><i class="fa-solid fa-location-dot"></i> Av. Ficticia, 123</li>
                    </ul>
                </div>

            </div>
        </div>

        <div class="footer-dark-bar">
            <div class="dark-bar-wrapper">
                <p>&copy; <?php echo date('Y'); ?> <a href="#">ABJ MODA INFANTIL</a>. Todos os Direitos Reservados.</p>
                <p class="dev-by">Desenvolvido por <strong>Anna Lívia Rodrigues | Bryan Oliveira | J. Pedro Dario | J. Pedro Felix</strong></p>
            </div>
        </div>

    </footer>


<script src="funcionarios.js"></script>
</body>
</html>