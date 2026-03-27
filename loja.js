// --- CONTROLE DA VITRINE ---

function renderizarLoja() {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return;
    vitrine.innerHTML = '';

    // Usa produtosLoja que vem do Carrinho.js
    produtosLoja.forEach(p => {
        vitrine.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.nome}" style="width:100%">
                <h3>${p.nome}</h3>
                <p>R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
                <button onclick="comprar(${p.id})">Adicionar</button>
            </div>`;
    });
}

function comprar(id) {
    const p = produtosLoja.find(i => i.id === id);
    if (p && p.estoque > 0) {
        p.estoque--;
        adicionarAoCarrinho(p.nome, p.preco);
        localStorage.setItem('meusProdutos', JSON.stringify(produtosLoja));
        renderizarLoja();
    } else {
        alert("Produto esgotado!");
    }
}

// --- CONTROLE DE ABRIR/FECHAR (PAINÉIS) ---

function toggleCart() {
    const cart = document.getElementById('side-cart');
    const overlay = document.getElementById('overlay');
    
    // Se já estiver aberto, fecha tudo. Se não, abre o carrinho.
    if (cart && cart.classList.contains('open')) {
        fecharTudo();
    } else {
        fecharTudo(); // Limpa outros painéis abertos primeiro
        cart?.classList.add('open');
        overlay?.classList.add('active');
    }
}

function toggleFavoritos() {
    const fav = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');
    
    if (fav && fav.classList.contains('open')) {
        fecharTudo();
    } else {
        fecharTudo();
        fav?.classList.add('open');
        overlay?.classList.add('active');
    }
}

function toggleLogin() {
    const login = document.getElementById('side-login');
    const overlay = document.getElementById('overlay');
    
    // Verifica se o painel de login está visível (right: 0)
    if (login && (login.style.right === '0px' || login.style.right === '0')) {
        fecharTudo();
    } else {
        fecharTudo();
        if (login) login.style.right = '0';
        overlay?.classList.add('active');
    }
}

function fecharTudo() {
    // Fecha Carrinho e Favoritos (via classes CSS)
    document.getElementById('side-cart')?.classList.remove('open');
    document.getElementById('favoritos-container')?.classList.remove('open');
    
    // Fecha Login (via estilo inline conforme suas imagens)
    const login = document.getElementById('side-login');
    if (login) login.style.right = '-100%';
    
    // Remove o fundo escuro (Overlay)
    document.getElementById('overlay')?.classList.remove('active');
}

window.onload = renderizarLoja;