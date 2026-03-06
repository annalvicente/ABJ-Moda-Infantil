// --- CONFIGURAÇÕES INICIAIS ---
let totalCarrinho = 0;
let quantidadeItens = 0;
let produtosLoja = JSON.parse(localStorage.getItem('meusProdutos')) || [];
let idProdutoEmEdicao = null;

document.addEventListener('DOMContentLoaded', () => {
    renderizarLoja();
    renderizarEstoqueAdm();
    checarLoginSalvo();
});

// --- BUSCA ---
function executarBusca() {
    const termo = document.getElementById('searchInput').value.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    if (!termo) {
        renderizarLoja(); // Se vazio, mostra tudo
        return;
    }

    let encontrados = 0;
    cards.forEach(card => {
        const nome = card.querySelector('h3').innerText.toLowerCase();
        if (nome.includes(termo)) {
            card.style.display = 'block';
            encontrados++;
        } else {
            card.style.display = 'none';
        }
    });

    mostrarToast(encontrados > 0 ? `Encontrado ${encontrados} produto(s) 🔍` : "Nenhum produto encontrado ❌");
}

function limparBusca() {
    document.getElementById('searchInput').value = '';
    renderizarLoja();
}

// --- LÓGICA DO CARRINHO ---
function toggleCart() {
    document.getElementById('side-cart').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function fecharTudo() {
    document.getElementById('side-cart')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
    document.getElementById('modal-produto')?.classList.remove('active');
}

function atualizarInterface() {
    const totalElemento = document.getElementById('cart-total-value');
    if (totalElemento) totalElemento.innerText = `R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;
    
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = quantidadeItens;
        badge.style.display = quantidadeItens > 0 ? 'block' : 'none';
    }
}

// --- VITRINE E MODAL ---
function renderizarLoja() {
    const grid = document.getElementById('vitrine-produtos');
    if (!grid) return;
    grid.innerHTML = ''; 

    produtosLoja.forEach(p => {
        const precoFormatado = parseFloat(p.preco).toFixed(2).replace('.', ',');
        grid.innerHTML += `
            <div class="product-card" onclick="abrirDetalhes(${p.id})">
                <img src="${p.img}" alt="${p.nome}" style="width: 100%; border-radius: 15px; margin-bottom: 15px;">
                <h3 style="font-family: 'Quicksand'; font-size: 1.1rem;">${p.nome}</h3>
                <p style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">Estoque: ${p.estoque} un</p>
                <p style="color: #ff69b4; font-weight: 700; font-size: 1.2rem; margin-bottom: 10px;">R$ ${precoFormatado}</p>
                <button class="btn-adicionar" onclick="event.stopPropagation(); venderProduto(${p.id})">
                    ${p.estoque > 0 ? '<i class="fa-solid fa-cart-shopping"></i> Adicionar' : 'Esgotado'}
                </button>
            </div>
        `;
    });
}

function abrirDetalhes(id) {
    const p = produtosLoja.find(item => item.id === id);
    if (!p) return;

    document.getElementById('modal-nome').innerText = p.nome;
    document.getElementById('modal-preco').innerText = `R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-img').src = p.img;
    document.getElementById('med-p').innerText = p.medidas?.p || '-';
    document.getElementById('med-m').innerText = p.medidas?.m || '-';
    document.getElementById('med-g').innerText = p.medidas?.g || '-';

    const btnModal = document.getElementById('btn-modal-comprar');
    btnModal.onclick = () => { venderProduto(p.id); fecharTudo(); };

    document.getElementById('modal-produto').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function venderProduto(id) {
    const p = produtosLoja.find(item => item.id === id);
    if (p && p.estoque > 0) {
        p.estoque--;
        adicionarAoCarrinho(p.nome, p.preco);
        salvarEAtualizar();
    } else {
        mostrarToast("Produto esgotado! ❌");
    }
}

function adicionarAoCarrinho(nome, preco) {
    const lista = document.getElementById('cart-items-list');
    const msgVazio = document.getElementById('empty-msg');
    if (msgVazio) msgVazio.remove();

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item-single';
    const precoNum = parseFloat(preco);
    
    itemDiv.innerHTML = `
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="display:block; font-weight:700;">${nome}</span>
                <small style="color: #ff69b4;">R$ ${precoNum.toFixed(2).replace('.', ',')}</small>
            </div>
            <i class="fa-solid fa-trash-can" onclick="removerItem(this, ${precoNum})" style="cursor:pointer; color:red;"></i>
        </div>
    `;
    lista.appendChild(itemDiv);
    totalCarrinho += precoNum;
    quantidadeItens++;
    atualizarInterface();
    mostrarToast(`${nome} no carrinho! 🛍️`);
}

function removerItem(elemento, preco) {
    elemento.closest('.cart-item-single').remove();
    totalCarrinho -= parseFloat(preco);
    quantidadeItens--;
    
    if (quantidadeItens <= 0) {
        totalCarrinho = 0;
        const lista = document.getElementById('cart-items-list');
        if (lista) lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
    }
    atualizarInterface();
}

// --- ADMIN E STORAGE ---
function salvarEAtualizar() {
    localStorage.setItem('meusProdutos', JSON.stringify(produtosLoja));
    renderizarLoja();
    renderizarEstoqueAdm();
}

function renderizarEstoqueAdm() {
    const tabela = document.getElementById('lista-estoque-adm');
    if (!tabela) return;
    tabela.innerHTML = '';
    
    produtosLoja.forEach(p => {
        tabela.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding:10px">${p.nome}</td>
                <td>
                    <input type="number" value="${p.estoque}" 
                           onchange="editarEstoqueRapido(${p.id}, this.value)" 
                           style="width:55px; border:1px solid #ddd; padding:2px; border-radius:4px; text-align:center;">
                </td>
                <td>
                    R$ <input type="number" step="0.01" value="${p.preco}" 
                              onchange="editarPrecoRapido(${p.id}, this.value)" 
                              style="width:75px; border:1px solid #ddd; padding:2px; border-radius:4px;">
                </td>
                <td>
                    <button onclick="prepararEdicao(${p.id})" style="color:blue; border:none; background:none; cursor:pointer; margin-right:8px;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="removerProduto(${p.id})" style="color:red; border:none; background:none; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function editarEstoqueRapido(id, valor) {
    const p = produtosLoja.find(i => i.id === id);
    if(p) {
        p.estoque = parseInt(valor) || 0;
        salvarEAtualizar();
        mostrarToast(`Estoque de "${p.nome}" alterado!`);
    }
}

function editarPrecoRapido(id, valor) {
    const p = produtosLoja.find(i => i.id === id);
    if(p) {
        p.preco = parseFloat(valor).toFixed(2);
        salvarEAtualizar();
        mostrarToast(`Preço de "${p.nome}" alterado!`);
    }
}

function prepararEdicao(id) {
    const p = produtosLoja.find(item => item.id === id);
    if (!p) return;
    idProdutoEmEdicao = id;
    
    document.getElementById('adm-nome').value = p.nome;
    document.getElementById('adm-preco').value = p.preco;
    document.getElementById('adm-img').value = p.img;
    document.getElementById('adm-estoque').value = p.estoque;
    document.getElementById('adm-p').value = p.medidas?.p || '';
    document.getElementById('adm-m').value = p.medidas?.m || '';
    document.getElementById('adm-g').value = p.medidas?.g || '';
    
    const formCadastro = document.getElementById('form-cadastro');
    const btn = formCadastro.querySelector('button');
    btn.innerText = "Salvar Alterações";
    btn.style.background = "#2980b9";
    
    // Rola até o formulário de cadastro para o usuário ver a edição
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('form-cadastro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const dados = {
        nome: document.getElementById('adm-nome').value,
        preco: parseFloat(document.getElementById('adm-preco').value).toFixed(2),
        img: document.getElementById('adm-img').value,
        estoque: parseInt(document.getElementById('adm-estoque').value),
        medidas: {
            p: document.getElementById('adm-p').value,
            m: document.getElementById('adm-m').value,
            g: document.getElementById('adm-g').value
        }
    };

    if (idProdutoEmEdicao) {
        const index = produtosLoja.findIndex(p => p.id === idProdutoEmEdicao);
        if (index !== -1) {
            produtosLoja[index] = { id: idProdutoEmEdicao, ...dados };
            idProdutoEmEdicao = null;
        }
    } else {
        produtosLoja.push({ id: Date.now(), ...dados });
    }

    this.reset();
    const btn = this.querySelector('button');
    btn.innerText = "Cadastrar e Atualizar Loja";
    btn.style.background = "#27ae60";
    salvarEAtualizar();
});

function removerProduto(id) {
    if(confirm("Excluir produto definitivamente?")) {
        produtosLoja = produtosLoja.filter(p => p.id !== id);
        salvarEAtualizar();
    }
}

function mostrarToast(msg) {
    let t = document.querySelector('.toast-notificacao') || document.createElement('div');
    t.className = 'toast-notificacao';
    if (!document.querySelector('.toast-notificacao')) document.body.appendChild(t);
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function logout() { 
    localStorage.removeItem('usuario_logado_atual'); 
    location.reload(); 
}

function checarLoginSalvo() {
    const user = JSON.parse(localStorage.getItem('usuario_logado_atual'));
    if (user) {
        const status = document.getElementById('status-usuario');
        if (status) status.innerHTML = `Olá, ${user.nome} | <button onclick="logout()" style="background:none; border:none; color:red; cursor:pointer; text-decoration:underline;">Sair</button>`;
        if(user.tipo === 'vendedor') {
            const painel = document.getElementById('painel-admin');
            if (painel) painel.style.display = 'block';
        }
    }
}

function toggleFavoritos() {
    const container = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay-favoritos');
    
    container.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Exemplo de como renderizar um item (você pode adaptar para sua lista real)
function atualizarListaFavoritos() {
    const lista = document.getElementById('lista-favoritos');
    // Se você tiver um array de favoritos, faça um loop aqui. 
    // Exemplo estático para testar o visual:
    lista.innerHTML = `
        <div class="fav-item-single">
            <input type="checkbox">
            <img src="roupa1.webp.jpeg" class="fav-item-img">
            <div class="fav-item-info">
                <h4>Vestido Jeans Feminino</h4>
                <p>Tam: 12</p>
            </div>
            <div class="fav-item-price">R$ 85,00</div>
        </div>
    `;
}

// Chame a renderização ao carregar a página ou ao adicionar um favorito
atualizarListaFavoritos();