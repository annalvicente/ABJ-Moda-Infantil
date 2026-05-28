<?php
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

</head>

<body>  

    <header>
        <div class="nav-container">
            <nav class="menu-links">
                <a href="#meninas" class="menu-links-meninas">meninas</a>
                <a href="#" class="menu-links-meninos">meninos</a>
                <a href="#" class="menu-links-bebes">bebês</a>
            </nav>

            <a href="index.php" class="logo">
                <img src="img/logoabj.webp" alt="Balão Logo">
            </a>

            <div class="user-actions">
                <a href="javascript:void(0)" onclick="openModal('login')" title="Entrar ou Cadastrar">
                    <i class="fa-regular fa-user"></i>
                </a>

            <a href="javascript:void(0);" onclick="toggleCart()">
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

    <div class="search-container">
        <form class="search-box" id="searchForm">
            <i class="fa-solid fa-magnifying-glass" onclick="executarBusca()"></i>
            <input type="text" id="searchInput" placeholder="O que você procura?">
            <i class="fa-solid fa-xmark" onclick="limparBusca()"></i>
        </form>
    </div>

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
                <div class="card"><img src="img/duaskids.webp" alt="Destaque"></div>
                <div class="card"><img src="img/pij-duaskids.webp" alt="Pijamas"></div>
                <div class="card"><img src="img/fant_duaskid.webp" alt="Fantasias"></div>
                <div class="card"><img src="img/fant_batman.webp" alt="Acessórios"></div>
                <div class="card"><img src="img/fant_wood.webp" alt="Kids"></div>
            </div>
            <button class="nav-arrow next" onclick="moverCarrossel(1)"><i class="fa-solid fa-arrow-right"></i></button>
        </section>

        <section class="vitrine-meninas">
            <div class="vitrine-container">

    <?php foreach ($vitrines as $id_cat => $info): 
        // Busca apenas 4 produtos com estoque disponível da categoria atual
        $sql = "SELECT nome, preco, imagem, imagem_corpo FROM produtos 
                WHERE id_categoria = $id_cat AND quantidade_estoque > 0 
                LIMIT 4";
        $resultado = $conn->query($sql);
    ?>
        
        <?php if ($resultado && $resultado->num_rows > 0): ?>
            <section class="vitrine-secao <?php echo $info['classe']; ?>">
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
                                <button class="btn-adicionar" onclick="adicionarAoCarrinho()"><i class="fa-solid fa-cart-shopping"></i> Adicionar</button>
                            </div>
                        </div>

                    <?php endwhile; ?>
                </div>
            </section>
        <?php endif; ?>

    <?php endforeach; ?>

</div>
        </section>
    </main>

    <footer id="contato" class="footer-custom">
        <div class="footer-container-custom">
            <div class="footer-section">
                <div class="footer-brand">
                    <i class="fa-regular fa-comments chat-icon"></i>
                    <div class="brand-info">
                        <h3>ABJ Moda infantil</h3>
                        <p>Telefone: 12 981714147</p>
                        <p>Email: ABJmodainfantil@gmail.com</p>
                    </div>
                </div>
            </div>
            <div class="footer-section">
                <div class="footer-links-social">
                    <div class="social-item"><i class="fa-brands fa-instagram"></i><span>@ABJ_modainfantil</span></div>
                    <div class="social-item"><i class="fa-solid fa-location-dot"></i><span>Av. Exemplo, 123</span></div>
                    <a href="#" class="faq-link">FAQ</a>
                </div>
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
                <button type="submit" class="btn-submit btn-cliente-color" id="btn-submit-cadastro">CADASTRAR
                    CLIENTE</button>
            </form>
        </div>
    </div>

    <!-- ========================================================
         MODAL DE FEEDBACK (Sucesso / Erro)
    ========================================================= -->
<div id="feedbackModal">
    <div class="feedback-box" id="feedback-box">
        <span class="feedback-icone" id="feedback-icone"></span>
        <h3 id="feedback-titulo"></h3>
        <p id="feedback-msg"></p>
        <button class="btn-feedback-ok" id="btn-feedback-ok" onclick="fecharFeedback()">OK</button>
    </div>
</div>

    <!-- Carrinho Lateral -->
    <div id="x" class="cart-container">
        <div class="cart-header">
            <h3>Meu Carrinho</h3>
            <button onclick="fecharTudo()" class="close-btn">&times;</button>
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
            <button class="close-btn" onclick="fecharTudo()">&times;</button>
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

    <script src="Carrinho.js"></script>
    <script src="favoritos.js"></script>
    <script src="loja.js"></script>
    <script src="login.js"></script>

    <style>
        /* Estilo de emergência para o Modal de Feedback */
        #feedbackModal {
            display: none; /* Começa escondido, o JS ativa */
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.8) !important;
            z-index: 999999 !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* Quando o JS colocar a classe 'aberto' */
        #feedbackModal.aberto {
            display: flex !important;
        }

        .feedback-box {
            background: white !important;
            padding: 30px !important;
            border-radius: 20px !important;
            text-align: center !important;
            max-width: 350px !important;
            width: 90% !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
            font-family: 'Quicksand', sans-serif !important;
        }

        .feedback-icone {
            font-size: 50px !important;
            display: block !important;
            margin-bottom: 15px !important;
        }

        #feedback-titulo {
            color: #333 !important;
            margin-bottom: 10px !important;
        }

        .btn-feedback-ok {
            background: #ff6b6b !important;
            color: white !important;
            border: none !important;
            padding: 10px 40px !important;
            border-radius: 10px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            margin-top: 15px !important;
        }

        /* Garante que o modal de Login também funcione */
        .modal-overlay {
            display: none;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.8) !important;
            z-index: 999998 !important;
            justify-content: center !important;
            align-items: center !important;
        }
    </style>

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


</body>

</html>