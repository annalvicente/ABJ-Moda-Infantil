<?php
session_start();
include 'conexao.php';

// 1. Verifica se está logado E se é vendedor. Se não for, expulsa para o login!
if (!isset($_SESSION['tipo']) || $_SESSION['tipo'] !== 'vendedor') {
    header("Location: index.php?login=1");
    exit();
}

// 2. Pega o ID real do vendedor que está logado na sessão (no lugar do "= 1" fixo)
$id_vendedor_logado = $_SESSION['cliente_id'];  

// Pega o termo digitado na busca (se houver)
$busca = isset($_GET['busca']) ? $conn->real_escape_string($_GET['busca']) : '';

// 2. Buscar os produtos filtrando pelo termo da busca
$sql = "SELECT p.*, c.nome AS nome_categoria 
        FROM produtos p 
        LEFT JOIN categoria c ON p.id_categoria = c.id";

if (!empty($busca)) {
    $sql .= " WHERE p.nome LIKE '%$busca%' 
               OR p.descricao LIKE '%$busca%' 
               OR c.nome LIKE '%$busca%' 
               OR p.cor LIKE '%$busca%'";
}

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
    <link rel="icon" href="img/logoabj.webp">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="funcionario.css">   
</head>

<body>

    <!-- Botão Voltar ao Topo -->
    <button id="topoBtn" title="Voltar ao Topo">↑</button>

<header class="header-admin" id="headerAdmin">
    <div class="header-left"></div>
    
    <!-- Clicar na logo recarrega o painel / vai para a página inicial do painel -->
    <a href="tfuncionarios.php" class="logo" title="Início do Painel">
        <img src="img/logoabj.webp" alt="Balão Logo" class="logo-normal">
        <img src="img/logo-deitada.webp" alt="Logo deitada" class="logo-deitada"> 
    </a>

    <div class="header-right">
        <!-- Clicar no botão vai para o site/loja dos clientes -->
        <a href="index.php" class="btn-visualizar">
            <i class="fa-solid fa-shop"></i> Ver loja
        </a>
    </div>
</header>

    <script>        //BOTÃO DE VOLTAR AO INICIO
             // Mostra o botão quando rolar 200px
    window.onscroll = function() {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        topoBtn.style.display = "block";
    } else {
        topoBtn.style.display = "none";
     }
  };

// Quando clicar, faz rolar para o topo
    topoBtn.addEventListener("click", () => {
      window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
        </script>

<main class="container">
    <div class="header-tabela">
        <h1 class="h1-tabela"> Controle de Estoque</h1>

        <form method="GET" action="" class="form-busca">
            <input 
                type="text" 
                name="busca" 
                placeholder="Pesquisar por roupa ou categoria." 
                value="<?php echo isset($_GET['busca']) ? htmlspecialchars($_GET['busca']) : ''; ?>"
            >
            <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
            <?php if (!empty($busca)) { ?>
                <a href="tfuncionarios.php" class="btn-limpar-busca" title="Limpar busca"><i class="fa-solid fa-xmark"></i></a>
            <?php } ?>
        </form>

        <button onclick="abrirModal()" class="btn-adicionar">
            <i class="fa-solid fa-plus"></i> Novo Produto
        </button>
    </div>
        
    <div class="tabela-wrapper">
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
            <td data-label="Produto"><?php echo htmlspecialchars($dados['nome']); ?></td>
            <td data-label="Categoria"><?php echo htmlspecialchars($dados['nome_categoria'] ?? 'Sem Categoria'); ?></td>
            <td data-label="Descrição"><?php echo htmlspecialchars($dados['descricao']); ?></td>
            <td data-label="Preço">R$ <?php echo number_format($dados['preco'], 2, ',', '.'); ?></td>
            <td data-label="Tamanho"><?php echo htmlspecialchars($dados['tamanho']); ?></td>
            <td data-label="Cor"><?php echo htmlspecialchars($dados['cor']); ?></td>
            <td data-label="Estoque"><?php echo $dados['quantidade_estoque']; ?> un.</td>
            
            <td data-label="Fotos">
                <div class="fotos-grid">
                    <img src="img/<?php echo basename($dados['imagem']); ?>" title="Foto da Peça">
                    <img src="img/<?php echo basename($dados['imagem_corpo']); ?>" title="Foto no Corpo">
                </div>
            </td>

            <td data-label="Status">
                <?php 
                    if($dados['quantidade_estoque'] > 10) {
                        echo "<span class='badge-ok'>Em estoque</span>";
                    } else {
                        echo "<span class='badge-alerta'>Repor!</span>";
                    }
                ?>
            </td>
            <td data-label="Ações" class="td-acoes">
    <a class="alterar" href="javascript:void(0)" title="Editar produto"
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
    
    <a class="excluir" href="javascript:void(0)" title="Excluir produto"
       onclick="confirmarExclusao('excluir.php?id=<?php echo $dados['id']; ?>')">
        <i class="fa-solid fa-trash"></i>
    </a>
</td>   
        </tr>
    <?php } ?>
</tbody>
        </table>
    </div>
</main>

<div id="modalProduto" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="h2-modal" id="modalTitulo">Adicionar Nova Roupa</h2>
            <span class="close" onclick="fecharModal()">&times;</span>
        </div>

        <form action="produtos.php" method="POST" enctype="multipart/form-data" class="modal-body" id="formProdutoModal">
    <input type="hidden" name="id" id="prod_id">
    <input type="hidden" name="id_vendedor" value="<?php echo $id_vendedor_logado; ?>">
    <input type="hidden" name="imagem_atual" id="prod_imagem_atual">
    <input type="hidden" name="imagem_corpo_atual" id="prod_imagem_corpo_atual">

    <div class="form-group full-width">
        <label><i class="fa-solid fa-tag"></i> Nome da Peça:</label>
        <input type="text" name="nome" id="prod_nome" placeholder="Ex: Conjunto Jardineira Dinossauro" required>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label><i class="fa-solid fa-layer-group"></i> Categoria:</label>
            <select name="id_categoria" id="prod_categoria" required>
                <option value="">Selecione</option>
                <?php foreach($categorias as $cat) { ?>
                    <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['nome']); ?></option>
                <?php } ?>
            </select>
        </div>
        <div class="form-group">
            <label><i class="fa-solid fa-ruler-combined"></i> Tamanho:</label>
            <input type="text" name="tamanho" id="prod_tamanho" placeholder="Ex: M, 2, 4" required>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label><i class="fa-solid fa-palette"></i> Cor:</label>
            <input type="text" name="cor" id="prod_cor" placeholder="Ex: Verde/Branco" required>
        </div>
        <div class="form-group">
            <label><i class="fa-solid fa-dollar-sign"></i> Preço (R$):</label>
            <input type="number" step="0.01" min="0.01" name="preco" id="preco" placeholder="0.00" required>
        </div>
    </div>

    <div class="form-group full-width">
        <label><i class="fa-solid fa-boxes-stacked"></i> Quantidade em Estoque:</label>
        <input type="number" min="0" name="quantidade_estoque" id="prod_qtd" placeholder="Ex: 15" required>
    </div>

    <div class="form-group full-width">
        <label><i class="fa-solid fa-align-left"></i> Descrição do Produto:</label>
        <textarea name="descricao" id="prod_desc" rows="2" placeholder="Detalhes do tecido, estampa, etc..." required></textarea>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label><i class="fa-solid fa-image"></i> Foto Peça (.webp):</label>
            <input type="file" name="imagem" accept="image/*" class="file-input">
        </div>
        <div class="form-group">
            <label><i class="fa-solid fa-camera"></i> Foto Corpo (.webp):</label>
            <input type="file" name="imagem_corpo" accept="image/*" class="file-input">
        </div>
    </div>

    <button type="submit" class="btn-salvar">
        <i class="fa-solid fa-floppy-disk"></i> Salvar Produto
    </button>
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


    <!-- MODAL DE SUCEESSO (ESTILO IMAGEM 1) -->
<div id="modalSucesso" class="modal-aviso">
    <div class="modal-aviso-content">
        <div class="icon-circle-success">
            <i class="fa-solid fa-check"></i>
        </div>
        
        <h2 id="tituloSucesso">Sucesso!</h2>
        
        <p id="mensagemSucesso">
            <?php 
                if (isset($_GET['sucesso'])) {
                    if ($_GET['sucesso'] == 'cadastrado') { echo "Produto cadastrado com sucesso!"; } elseif ($_GET['sucesso'] == 'editado') {
                        echo "Produto alterado com sucesso!";
                    }
                }
            ?>
        </p>

        <button onclick="fecharModalSucesso()" class="btn-modal-ok">OK</button>
    </div>
</div>

<!-- MODAL DE CONFIRMAÇÃO DE ALTERAÇÃO -->
<div id="modalConfirmacao" class="modal-aviso">
    <div class="modal-aviso-card">
        <div class="icone-circulo-pergunta">
            <i class="fa-solid fa-pen"></i>
        </div>
        <h2>Confirmar Alteração</h2>
        <p>Deseja mesmo alterar as informações deste produto?</p>
        
        <div class="modal-botoes-row">
            <button type="button" class="btn-cancelar-confirma" onclick="fecharModalConfirmacao()">Cancelar</button>
            <button type="button" class="btn-confirmar-confirma" id="btnConfirmarAlteracao">Sim, alterar</button>
        </div>
    </div>
</div>

<!-- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO -->
<div id="modalExcluir" class="modal-aviso">
    <div class="modal-aviso-card">
        <div class="icone-circulo-excluir">
            <i class="fa-solid fa-trash-can"></i>
        </div>
        <h2>Excluir Produto</h2>
        <p>Tem certeza que deseja excluir esta peça do estoque? Essa ação não pode ser desfeita.</p>
        
        <div class="modal-botoes-row">
            <button type="button" class="btn-cancelar-confirma" onclick="fecharModalExcluir()">Cancelar</button>
            <a id="btnConfirmarExclusao" href="#" class="btn-confirmar-excluir">Sim, excluir</a>
        </div>
    </div>
</div>

<script src="funcionarios.js"></script>

</body>
</html>