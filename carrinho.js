let totalCarrinho = 0;
let quantidadeItens = 0;

// Assim que a página abre, busca o que já está salvo no banco
document.addEventListener("DOMContentLoaded", function() {
    carregarCarrinho();
});

// --- 1. BUSCAR ITENS DO BANCO DE DADOS ---
async function carregarCarrinho() {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return;

    try {
        const response = await fetch('acoescart.php?acao=listar');
        const itens = await response.json();

        lista.innerHTML = '';
        totalCarrinho = 0;
        quantidadeItens = 0;

        if (!itens || itens.length === 0) {
            lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
            atualizarInterface();
            return;
        }

        itens.forEach(item => {
            const precoNum = parseFloat(item.preco);
            const qtd = parseInt(item.quantidade);
            const subtotal = precoNum * qtd;

            totalCarrinho += subtotal;
            quantidadeItens += qtd;

            lista.innerHTML += `
                <div class="cart-item-single" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="img/${item.imagem}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                        <div>
                            <span style="display:block; font-weight:700; color:#444;">${item.nome}</span>
                            <small style="color: #ff69b4;">${qtd}x R$ ${precoNum.toFixed(2).replace('.', ',')}</small>
                        </div>
                    </div>
                    <i class="fa-solid fa-trash-can" onclick="removerDoCarrinho(${item.id_carrinho})" style="cursor:pointer; color:red; margin-left: 15px;"></i>
                </div>
            `;
        });

        atualizarInterface();

    } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
    }
}

// --- 2. SALVAR NO BANCO DE DADOS ---
async function adicionarAoCarrinho(produtoId) {
    if (!produtoId) return;

    const formData = new FormData();
    formData.append('produto_id', produtoId);

    try {
        // Envia pro banco de dados via PHP
        await fetch('acoescart.php?acao=adicionar', {
            method: 'POST',
            body: formData
        });

        // Recarrega a lista trazendo do banco atualizado
        await carregarCarrinho();

        // ABRE A BARRA LATERAL DO CARRINHO (IGUAL OS FAVORITOS FAZEM)
        toggleCart();

    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
    }
}

// --- 3. DELETAR DO BANCO DE DADOS ---
async function removerDoCarrinho(idCarrinho) {
    const formData = new FormData();
    formData.append('id_carrinho', idCarrinho);

    try {
        await fetch('acoescart.php?acao=remover', {
            method: 'POST',
            body: formData
        });
        carregarCarrinho();
    } catch (error) {
        console.error("Erro ao remover produto:", error);
    }
}

// --- 4. ATUALIZAR INTERFACE (TOTAL E BADGE) ---
function atualizarInterface() {
    const totalElemento = document.getElementById('cart-total-value');
    if (totalElemento) totalElemento.innerText = `R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;
    
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = quantidadeItens;
        badge.style.display = quantidadeItens > 0 ? 'block' : 'none';
    }
}

// --- 5. LÓGICA DE ABRIR E FECHAR ---
function toggleCart() {
    const carrinho = document.getElementById('x'); 
    const overlay = document.getElementById('overlay');
    const favoritos = document.getElementById('favoritos-container');
    
    if (favoritos) favoritos.classList.remove('open');

    if (carrinho) {
        carrinho.classList.toggle('open');
    }
    
    if (overlay) {
        if (carrinho && carrinho.classList.contains('open')) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

function fecharTudo() {
    const carrinho = document.getElementById('x');
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');

    if (carrinho) carrinho.classList.remove('open');
    if (favoritos) favorites.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}