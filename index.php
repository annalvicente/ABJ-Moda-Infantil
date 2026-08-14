<?php
session_start();
// 1. Conexão com o banco de dados (Exemplo básico)
include 'conexão.php';

// 2. Definição das categorias que você quer exibir (ID da categoria => Nome para o título)
$vitrines = [
    1 => ['nome' => 'Meninas', 'classe' => 'vitrine-meninas'],
    2 => ['nome' => 'Meninos', 'classe' => 'vitrine-meninos'],
    3 => ['nome' => 'Bebês',   'classe' => 'vitrine-bebes']
];
?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABJ - Moda Infantil</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="index.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</head>

<body>  

    <header>
        <div class="nav-container">
            <nav class="menu-links">
                <a href="#meninas" class="menu-links-meninas">meninas</a>
                <a href="#meninos" class="menu-links-meninos">meninos</a>
                <a href="#bebes" class="menu-links-bebes">bebês</a>
            </nav>

            <a href="index.php" class="logo">
                <img src="img/logoabj.webp" alt="Balão Logo" class="logo-normal">
                <img src="img/logo-deitada.webp" alt="Logo deitada" class="logo-deitada"> 
            </a>

            


            <div class="user-actions">
                <?php if (isset($_SESSION['usuario_nome'])): 
        // Pega a primeira letra do nome e coloca em maiúscula
        $inicial = strtoupper(substr($_SESSION['usuario_nome'], 0, 1)); 
        ?>

        <script>
            function toggleDropdown() {
                const dropdown = document.querySelector('.dropdown-menu');
                if (dropdown) {
                    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
                }
            }
        </script>
        
        <div class="user-dropdown">
            <div class="user-avatar" title="Minha Conta" onclick="toggleDropdown()">
                <?php echo $inicial; ?>
            </div>
            <div class="dropdown-menu">
                <span class="welcome-text">Olá, <?php echo explode(' ', $_SESSION['usuario_nome'])[0]; ?>!</span>
                <span class="user-type-badge <?php echo $_SESSION['tipo']; ?>">
                    <?php echo ($_SESSION['tipo'] === 'vendedor') ? 'Vendedor' : 'Cliente'; ?>
                </span>
                <hr class="dropdown-divider">
                <a href="logout.php" class="logout-link">
                    <i class="fa-solid fa-right-from-bracket"></i> Sair
                </a>
            </div>
        </div>

        <?php else: ?>
        <a href="javascript:void(0)" onclick="openModal('login')" title="Entrar ou Cadastrar">
            <i class="fa-regular fa-user"></i>
        </a>
    <?php endif; ?>
            <!-- <div class="user-actions">
                <a href="javascript:void(0)" onclick="openModal('login')" title="Entrar ou Cadastrar">
                    <i class="fa-regular fa-user"></i>
                </a> -->

            <a href="javascript:void(0);" onclick="interacaoCart()">
                <i class="fa-solid fa-basket-shopping"></i>
            </a>

                <div onclick="toggleFavoritos()" title="Meus Favoritos">
                    <i class="fa-regular fa-heart"></i>
                </div>

                <a href="#contato" title="Chat">
                    <i class="fa-regular fa-comment"></i>
                </a>
            </div>
        </div>
    </header>

    <!-- <div class="search-container">
        <form class="search-box" id="searchForm">
            <i class="fa-solid fa-magnifying-glass" onclick="executarBusca()"></i>
            <input type="text" id="searchInput" placeholder="O que você procura?">
            <i class="fa-solid fa-xmark" onclick="limparBusca()"></i>
        </form>
    </div> -->

    <main>
        <section class="hero-banner">
            <div class="hero-content">
                <div class="hero-image">
                    <img src="img/criancasgeral.webp" alt="Crianças felizes">
                </div>
                <div class="hero-text">
                    <h2>Estilo que abraça,<br>conforto que acompanha.</h2>
                    <p>Peças escolhidas com carinho para cada descoberta do seu pequeno. <strong>Frete grátis
                            incluso!</strong></p>
                    <a href="#" class="btn-banner">Ver Coleção Completa</a>
                </div>
            </div>
        </section>

        <section class="carousel-section">
            <button class="nav-arrow prev" onclick="moverCarrossel(-1)"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="carousel-track" id="track">
                <div class="card"><img src="img/quatrocriancas-geral.webp" alt="Geral"></div>
                <div class="card"><img src="img/duascriancas-pijama.webp" alt="Pijamas"></div>
                <div class="card"><img src="img/duascriancas-fantasia.webp" alt="Fantasias"></div>
                <div class="card"><img src="img/duasmeninas-geral.webp" alt="Meninas"></div>
                <div class="card"><img src="img/doismeninos-geral.webp" alt="Meninos"></div>
                <div class="card"><img src="img/doisbebes-geral.webp" alt="Bebês"></div>
             </div>
            <button class="nav-arrow next" onclick="moverCarrossel(1)"><i class="fa-solid fa-arrow-right"></i></button>
        </section>

        
        <div class="vitrine-container">

            <?php 
            $id_cat = 1; // ID das Meninas no seu banco
            $info = $vitrines[$id_cat];
            $sql = "SELECT id, nome, preco, imagem, imagem_corpo FROM produtos 
                    WHERE id_categoria = $id_cat AND quantidade_estoque > 0 
                    LIMIT 4";
            $resultado = $conn->query($sql);
            
            if ($resultado && $resultado->num_rows > 0): 
            ?>
                <section id="meninas" class="vitrine-meninas <?php echo $info['classe']; ?>">
                    <h2 class="vitrine-titulo"><?php echo $info['nome']; ?></h2>
                    <div class="produtos-grid">
                        <?php while($produto = $resultado->fetch_assoc()): ?>
                            <div class="produto-card">
                                <div class="produto-imagem-box">
                                    <img src="img/<?php echo $produto['imagem_corpo']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-corpo">
                                    <img src="img/<?php echo $produto['imagem']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-peca">
                                </div>
                                <div class="produto-info">
                                    <h3 class="produto-nome"><?php echo $produto['nome']; ?></h3>
                                    <p class="produto-preco">R$ <?php echo number_format($produto['preco'], 2, ',', '.'); ?></p>
    <div class="produto-botoes">
        <button class="btn-adicionar" onclick="adicionarAoCarrinho()">
            <i class="fa-solid fa-cart-shopping"></i> Adicionar
        </button>
        
        <button class="btn-favorito" onclick="adicionarAoFavorito(<?php echo $produto['id']; ?>)">
            <i class="fa-regular fa-heart"></i>
        </button>
    </div>

                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>


                    <div class="ver-mais-container">
        <a href="link-da-sua-categoria.php" class="btn-ver-mais">Ver mais peças</a>
    </div>

                </section>
            <?php endif; ?>


            <section class="pijama-banner">
    <div class="pijama-image">
        <img src="img/banner-pijama.webp" alt="Pijamas Infantis"> 
    </div>
    <div class="pijama-text">
        <h2>Hora de Sonhar Brincando!</h2>
        <p>Pijamas lúdicos e ultra confortáveis para noites cheias de imaginação e um sono tranquilo.</p>
        
        <a href="#" class="btn-banner">Ver pijamas</a>

        <div class="banner-benefits">
            <span>Até 6x sem juros</span>
            <span>Frete grátis em compras acima de <u>R$199,99</u></span>
        </div>
    </div>
</section>


            <?php 
            $id_cat = 2; // ID os Meninos no seu banco
            $info = $vitrines[$id_cat];
            $sql = "SELECT id, nome, preco, imagem, imagem_corpo FROM produtos 
                    WHERE id_categoria = $id_cat AND quantidade_estoque > 0 
                    LIMIT 4";
            $resultado = $conn->query($sql);
            
            if ($resultado && $resultado->num_rows > 0): 
            ?>
                <section id="meninos" class="vitrine-meninos <?php echo $info['classe']; ?>">
                    <h2 class="vitrine-titulo"><?php echo $info['nome']; ?></h2>
                    <div class="produtos-grid">
                        <?php while($produto = $resultado->fetch_assoc()): ?>
                            <div class="produto-card">
                                <div class="produto-imagem-box">
                                    <img src="img/<?php echo $produto['imagem_corpo']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-corpo">
                                    <img src="img/<?php echo $produto['imagem']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-peca">
                                </div>
                                <div class="produto-info">
                                    <h3 class="produto-nome"><?php echo $produto['nome']; ?></h3>
                                    <p class="produto-preco">R$ <?php echo number_format($produto['preco'], 2, ',', '.'); ?></p>
                                    
    <div class="produto-botoes">
        <button class="btn-adicionar" onclick="adicionarAoCarrinho()">
            <i class="fa-solid fa-cart-shopping"></i> Adicionar
        </button>
        
        <button class="btn-favorito" onclick="adicionarAoFavorito(<?php echo $produto['id']; ?>)">
            <i class="fa-regular fa-heart"></i>
        </button>
    </div>

                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>

                    <div class="ver-mais-container">
        <a href="link-da-sua-categoria.php" class="btn-ver-mais">Ver mais peças</a>

                </section>
            <?php endif; ?>


            <section class="fantasia-banner">
    <div class="fantasia-image">
        <img src="img/banner-fantasia.webp" alt="Fantasias Infantis"> 
    </div>
    <div class="fantasia-text">
        <h2>Dê Asas à Imaginação!</h2>
        <p>Fantasias leves e confortáveis para transformar qualquer dia em uma grande aventura.</p>
        
        <a href="#" class="btn-banner">Ver fantasias</a>

        <div class="banner-benefits">
            <span>Até 6x sem juros</span>
            <span>Frete grátis em compras acima de <u>R$199,99</u></span>
        </div>
    </div>
</section>


            <?php 
            $id_cat = 3; // ID dos Bebês no seu banco
            $info = $vitrines[$id_cat];
            $sql = "SELECT id, nome, preco, imagem, imagem_corpo FROM produtos 
                    WHERE id_categoria = $id_cat AND quantidade_estoque > 0 
                    LIMIT 4";
            $resultado = $conn->query($sql);
            
            if ($resultado && $resultado->num_rows > 0): 
            ?>
                <section id="bebes" class="vitrine-bebes <?php echo $info['classe']; ?>">
                    <h2 class="vitrine-titulo"><?php echo $info['nome']; ?></h2>
                    <div class="produtos-grid">
                        <?php while($produto = $resultado->fetch_assoc()): ?>
                            <div class="produto-card">
                                <div class="produto-imagem-box">
                                    <img src="img/<?php echo $produto['imagem_corpo']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-corpo">
                                    <img src="img/<?php echo $produto['imagem']; ?>" alt="<?php echo $produto['nome']; ?>" class="img-peca">
                                </div>
                                <div class="produto-info">
                                    <h3 class="produto-nome"><?php echo $produto['nome']; ?></h3>
                                    <p class="produto-preco">R$ <?php echo number_format($produto['preco'], 2, ',', '.'); ?></p>
    <div class="produto-botoes">
        <button class="btn-adicionar" onclick="adicionarAoCarrinho()">
            <i class="fa-solid fa-cart-shopping"></i> Adicionar
        </button>
        
        <button class="btn-favorito" onclick="adicionarAoFavorito(<?php echo $produto['id']; ?>)">
            <i class="fa-regular fa-heart"></i>
        </button>
    </div>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>

                    <div class="ver-mais-container">
        <a href="link-da-sua-categoria.php" class="btn-ver-mais">Ver mais peças</a>

                </section>
            <?php endif; ?>

        </div>

</div>
        </section>
    </main>

    <footer id="contato" class="footer-container">
        
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
                <p>&copy; <?php echo date('Y'); ?> <a>ABJ MODA INFANTIL</a>. Todos os Direitos Reservados.</p>
                <p class="dev-by">Desenvolvido por <strong>Anna Lívia Rodrigues | Bryan Oliveira | J. Pedro Dario | J. Pedro Felix</strong></p>
            </div>
        </div>

    </footer>

    <!-- ========================================================
         MODAL DE AUTH (Login / Cadastro)
    ========================================================= -->
    <div id="authModal" class="modal-overlay">
        <div class="modal-box">
            <span class="close-modal" onclick="closeModal()">&times;</span>

            <div class="auth-tabs">
                <button id="tab-login" class="tab-btn active" onclick="switchAuthMode('login')">Acessar Conta</button>
                <button id="tab-cadastro" class="tab-btn" onclick="switchAuthMode('cadastro')">Criar Conta</button>
            </div>

            <div class="user-type-toggle">
                <button type="button" class="type-btn active" id="btn-tipo-cliente" onclick="setUserType('cliente')">Sou
                    Cliente</button>
                <button type="button" class="type-btn" id="btn-tipo-vendedor" onclick="setUserType('vendedor')">Sou
                    Vendedor</button>
            </div>

            <!-- FORM DE LOGIN -->
            <form id="form-login" class="auth-form" onsubmit="enviarLogin(event)">
                <input type="hidden" name="tipo_usuario" class="input-tipo-usuario" value="cliente">

                <div class="input-group" id="grp-login-email">
                    <label>E-mail</label>
                    <input type="email" name="email" id="login-email" placeholder="seu@email.com" required>
                    <span class="erro-campo">Informe um e-mail válido.</span>
                </div>
                <div class="input-group" id="grp-login-senha">
                    <label>Senha</label>
                    <input type="password" name="senha" id="login-senha" placeholder="******" required>
                    <span class="erro-campo">A senha é obrigatória.</span>
                </div>
                <button type="submit" class="btn-submit btn-cliente-color" id="btn-submit-login">ENTRAR COMO
                    CLIENTE</button>
            </form>

            <!-- FORM DE CADASTRO -->
            <form id="form-cadastro" class="auth-form" style="display: none;" onsubmit="enviarCadastro(event)">
                <input type="hidden" name="tipo_form" class="input-tipo-usuario" value="cliente">

                <div class="input-group" id="grp-cad-nome">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" id="cad-nome" placeholder="Seu nome completo" required>
                    <span class="erro-campo">Nome é obrigatório.</span>
                </div>
                <div class="input-group" id="grp-cad-email">
                    <label>E-mail</label>
                    <input type="email" name="email" id="cad-email" placeholder="seu@email.com" required>
                    <span class="erro-campo">Informe um e-mail válido.</span>
                </div>
                <div class="input-group" id="grp-cad-cpf">
                    <label>CPF</label>
                    <input type="text" name="cpf" id="cad-cpf" placeholder="000.000.000-00" maxlength="14"
                        inputmode="numeric">
                    <span class="erro-campo">CPF inválido (formato: 000.000.000-00).</span>
                </div>
                <div class="input-group">
                    <label>Data de Nascimento</label>
                    <input type="date" name="data_nascimento" id="cad-nasc">
                </div>
                <div class="input-group" id="grp-cad-tel">
                    <label>Telefone</label>
                    <input type="text" name="telefone" id="cad-tel" placeholder="(00) 00000-0000" maxlength="15"
                        inputmode="numeric">
                    <span class="erro-campo">Telefone inválido.</span>
                </div>
                <div class="input-group" id="grp-cad-senha">
                    <label>Senha</label>
                    <input type="password" name="senha" id="cad-senha" placeholder="Mínimo 6 caracteres" required
                        minlength="6">
                    <span class="erro-campo">A senha deve ter ao menos 6 caracteres.</span>
                </div>
                <div class="input-group" id="grp-cad-chave" style="display: none;">
                    <label>Código de Autorização da Loja</label>
                    <input type="password" name="chave_loja" id="cad-chave" placeholder="Digite a chave da loja">
                    <span class="erro-campo">Código de acesso obrigatório para vendedores.</span>
                </div>
                
                <button type="submit" class="btn-submit btn-cliente-color" id="btn-submit-cadastro">CADASTRAR
                    CLIENTE</button>
            </form>
        </div>
    </div>

    <!-- ========================================================
         MODAL DE FEEDBACK (Sucesso / Erro)
    ========================================================= -->
<div id="authModal" class="modal-overlay">
    <div class="modal-box">
        </div>
</div>

<div id="feedbackModal" class="modal-overlay">
    <div class="feedback-box" id="feedback-box">
        <span id="feedback-icone"></span>
        <h3 id="feedback-titulo"></h3>
        <p id="feedback-msg"></p>
        <button class="btn-feedback-ok" id="btn-feedback-ok" onclick="fecharFeedback()">OK</button>
    </div>
</div>

    <!-- Carrinho Lateral -->
    <div id="x" class="cart-container">
        <div class="cart-header">
            <h3>Meu Carrinho</h3>
            <button onclick="fecharAll()" class="close-btn">&times;</button>
        </div>
        <div class="cart-items" id="cart-items-list"></div>
        <div class="cart-footer">
            <div class="cart-total"><span>Total:</span><span id="cart-total-value">R$ 0,00</span></div>
            <button class="checkout-btn">Finalizar Compra</button>
        </div>
    </div>

    <!-- Favoritos Lateral -->
    <div id="favoritos-container" class="fav-container">
        <div class="fav-header">
            <div class="fav-header-title">
                <h3>Favoritos</h3>
            </div>
           <button class="close-btn" onclick="fecharFavoritosEFundo()">&times;</button>
        </div>
        <div class="fav-content">
            <div id="lista-favoritos" class="fav-items">
                <p>Sua lista está vazia.</p>
            </div>
        </div>
        <div class="fav-footer">
            <button class="btn-fav-carrinho" onclick="adicionarFavoritosAoCarrinho()">
                Adicionar ao carrinho
            </button>
        </div>
    </div>

    <div id="overlay" onclick="fecharTudo()"></div>

    <script src="carrinho.js"></script>
    <script src="loja.js"></script>
    <script src="favoritos.js"></script>
    <script src="login.js"></script>



    <script>
    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('login') || urlParams.has('cadastro')) {
            const modo = urlParams.has('cadastro') ? 'cadastro' : 'login';
            if (typeof openModal === 'function') {
                openModal(modo);
            } else {
                const modal = document.getElementById('authModal');
                if(modal) modal.style.display = 'flex';
            }
        }
    });
    </script>

    <script>
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // Se rolar mais de 20px da tela, fica reto
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
</script>

</body>

</html>