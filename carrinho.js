// --- CONTROLE DE ESTADO DO CARRINHO (MEMÓRIA LOCAL DA INTERFACE) ---
let totalCarrinho = 0;
let quantidadeItens = 0;

// --- FUNÇÕES DO CARRINHO ---

/**
 * Adiciona um produto ao carrinho no Banco de Dados e atualiza a interface de usuário
 * @param {number} idProduto - ID do produto vindo do banco
 * @param {string} nome - Nome do produto
 * @param {number|string} preco - Preço do produto
 */
async function adicionarAoCarrinho(idProduto, nome, preco) {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return;

    // 1. ENVIAR PARA O BANCO DE DADOS (Via PHP)
    const formData = new FormData();
    formData.append('produto_id', idProduto);

    try {
        const response = await fetch('acoesfav.php?acao=adicionar_carrinho', {
            method: 'POST',
            body: formData
        });
        
        const dados = await response.json();

        if (dados.status !== 'sucesso') {
            alert("Erro ao adicionar produto ao carrinho no banco de dados.");
            return; // Interrompe a execução caso o banco retorne erro
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Ops! Certifique-se de estar logado para adicionar itens ao carrinho.");
        return; // Interrompe a execução caso a requisição falhe (ex: sem sessão)
    }

    // 2. ATUALIZAR A INTERFACE VISUAL (Caso tenha inserido no banco com sucesso)
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

    // Abre a barra lateral do carrinho automaticamente para dar feedback ao usuário
    const carrinho = document.getElementById('x');
    if (carrinho && carrinho.style.right !== '0px') {
        toggleCart();
    }
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

// --- FUNÇÃO PARA ABRIR / FECHAR O CARRINHO ---
function toggleCart() {
    const carrinho = document.getElementById('x'); 
    const overlay = document.getElementById('overlay');
    
    if (carrinho) {
        // Verifica se o carrinho já está aberto na tela (right igual a 0px)
        if (carrinho.style.right === '0px') {
            carrinho.style.right = '-450px'; // Esconde de volta
        } else {
            carrinho.style.right = '0px';    // Puxa para a tela!
        }
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// --- FUNÇÃO PARA FECHAR TUDO ---
function fecharTudo() {
    const carrinho = document.getElementById('x');
    const overlay = document.getElementById('overlay');
    const favoritos = document.getElementById('favoritos-container');

    if (carrinho) {
        carrinho.style.right = '-450px'; // Esconde o carrinho
    }
    if (favoritos) {
        favoritos.style.right = '-450px'; // Esconde os favoritos lateral se estiver aberto
    }
    if (overlay) {
        overlay.classList.remove('active'); // Desativa o fundo escuro
    }
}