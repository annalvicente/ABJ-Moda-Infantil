// --- BANCO DE DADOS (LOCALSTORAGE) ---
var produtosLoja = JSON.parse(localStorage.getItem('meusProdutos')) || [
    { id: 1, nome: 'Conjunto Woody', preco: '79.99', img: 'img/fant_wood.webp', estoque: 10 },
    { id: 2, nome: 'Pijama Confort', preco: '65.00', img: 'img/pij-duaskids.webp', estoque: 5 }
];

let totalCarrinho = 0;
let quantidadeItens = 0;

// --- FUNÇÕES DO CARRINHO ---
function adicionarAoCarrinho(nome, preco) {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return;

    const msgVazio = document.getElementById('empty-msg');
    if (msgVazio) msgVazio.remove();

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item-single';
    const precoNum = parseFloat(preco);
    
    // ESTRUTURA IGUAL AO FAVORITOS:
    // O segredo está no display:flex e justify-content: space-between DIRETO no HTML
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.width = "100%";

    itemDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; text-align: left;">
            <h4 style="margin:0; font-size: 16px; color: #4a3b32; font-weight: 700;">${nome}</h4>
            <p style="margin:0; color: #ff69b4; font-size: 14px;">R$ ${precoNum.toFixed(2).replace('.', ',')}</p>
        </div>
        
        <i class="fa-solid fa-trash-can" 
           onclick="removerItem(this, ${precoNum})" 
           style="cursor:pointer; color:#ff4d4d; font-size: 1.2rem; padding: 10px;" 
           title="Remover"></i>
    `;
    
    lista.appendChild(itemDiv);
    totalCarrinho += precoNum;
    quantidadeItens++;
    atualizarInterface();
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

function atualizarInterface() {
    const totalElemento = document.getElementById('cart-total-value');
    if (totalElemento) totalElemento.innerText = `R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;
    
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = quantidadeItens;
        badge.style.display = quantidadeItens > 0 ? 'block' : 'none';
    }
}