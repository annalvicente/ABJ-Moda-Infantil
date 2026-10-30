// =========================================================================
// 1. INTERCEPTADOR DE ALERTA GLOBAL (INTEGRADO AO EXIBIRFEEDBACK / MOSTRARFEEDBACK)
// =========================================================================
window.alert = function(mensagem, callback) {
    let tipo = 'sucesso'; 
    let titulo = 'Sucesso!';

    if (mensagem.toLowerCase().includes('erro') || mensagem.toLowerCase().includes('falhe') || mensagem.toLowerCase().includes('ops')) {
        tipo = 'erro';
        titulo = 'Erro no Sistema';
    } else if (mensagem.toLowerCase().includes('atenção') || mensagem.toLowerCase().includes('precisa estar logado')) {
        tipo = 'erro';
        titulo = 'Atenção!';
    } else if (mensagem.toLowerCase().includes('adicionado')) {
        tipo = 'sucesso';
        titulo = 'Adicionado!';
    }

    // Chama o modal padronizado do projeto
    if (typeof mostrarFeedback === 'function') {
        mostrarFeedback(tipo, titulo, mensagem);
        const btnOk = document.getElementById('btn-feedback-ok');
        if (btnOk && typeof callback === 'function') {
            const originalOnClick = btnOk.onclick;
            btnOk.onclick = function() {
                if (typeof originalOnClick === 'function') originalOnClick();
                callback();
            };
        }
    } else if (typeof exibirFeedback === 'function') {
        exibirFeedback(titulo, mensagem, tipo, callback);
    } else {
        console.log(`[${titulo}] ${mensagem}`);
    }
};

// =========================================================================
// 2. CONTROLE DE ESTADO E FUNÇÕES DO CARRINHO
// =========================================================================
let totalCarrinho = 0;
let quantidadeItens = 0;

// CARREGA OS ITENS DO BANCO DE DADOS SEMPRE QUE A PÁGINA É RECARREGADA
document.addEventListener('DOMContentLoaded', carregarCarrinhoDoBanco);

async function carregarCarrinhoDoBanco() {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return;

    try {
        const response = await fetch('acoesfav.php?acao=listar_carrinho');
        if (response.status === 401) return; // Usuário não está logado

        const dados = await response.json();

        if (dados.status === 'sucesso' && Array.isArray(dados.itens)) {
            lista.innerHTML = '';
            totalCarrinho = 0;
            quantidadeItens = 0;

            if (dados.itens.length === 0) {
                lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
                atualizarInterface();
                return;
            }

            dados.itens.forEach(item => {
                const qtd = item.quantidade ? parseInt(item.quantidade) : 1;
                for (let i = 0; i < qtd; i++) {
                    desenharItemNaTela(item.id_produto, item.nome, item.preco, item.imagem);
                }
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar carrinho do banco de dados:", erro);
    }
}

function desenharItemNaTela(idProduto, nome, preco, imagem) {
    const lista = document.getElementById('cart-items-list');
    const msgVazio = document.getElementById('empty-msg');
    if (msgVazio) msgVazio.remove();

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item-single';
    const precoNum = parseFloat(preco);
    
    let srcImagem = '';
    if (imagem && imagem.trim() !== '') {
        srcImagem = (imagem.startsWith('http') || imagem.startsWith('img/')) 
            ? imagem 
            : `img/${imagem}`;
    }

    const imgHtml = srcImagem 
        ? `<img src="${srcImagem}" alt="${nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; margin-right: 12px; flex-shrink: 0;" onerror="this.onerror=null; this.parentNode.innerHTML='<div style=\\'width: 60px; height: 60px; background: #eee; border-radius: 10px; margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;\\'>Sem Foto</div>';">` 
        : `<div style="width: 60px; height: 60px; background: #eee; border-radius: 10px; margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">Sem Foto</div>`;

    itemDiv.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;";

    itemDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            ${imgHtml}
            <div>
                <span style="display: block; font-weight: 700; font-size: 0.95rem; line-height: 1.2; color: #333; margin-bottom: 4px;">${nome}</span>
                <small style="color: #00a896; font-weight: 700; font-size: 0.9rem;">R$ ${precoNum.toFixed(2).replace('.', ',')}</small>
            </div>
        </div>
        <i class="fa-solid fa-trash-can" onclick="removerItem(this, ${precoNum}, ${idProduto})" style="cursor: pointer; color: #ff6b81; font-size: 1.1rem; margin-left: 10px;"></i>
    `;

    lista.appendChild(itemDiv);
    
    totalCarrinho += precoNum;
    quantidadeItens++;
    atualizarInterface();
}

async function adicionarAoCarrinho(idProduto, nome, preco, imagem = '', exibeAlerta = true) {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return false;

    // 1. ENVIAR PARA O BANCO DE DADOS (Via PHP)
    const formData = new FormData();
    formData.append('produto_id', idProduto);

    try {
        const response = await fetch('acoesfav.php?acao=adicionar_carrinho', {
            method: 'POST',
            body: formData
        });

        if (response.status === 401) {
            alert("Você precisa estar logado para adicionar itens ao carrinho!", function() {
                if (typeof openModal === 'function') openModal('login');
            });
            return false;
        }
        
        const dados = await response.json();

        if (dados.status !== 'sucesso') {
            const msgErro = dados.mensagem || "Erro ao adicionar produto ao carrinho no banco de dados.";
            alert("Erro: " + msgErro);
            return false; 
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Certifique-se de estar logado para adicionar itens ao carrinho.");
        return false; 
    }

    // 2. DESENHAR NA TELA
    desenharItemNaTela(idProduto, nome, preco, imagem);

    if (exibeAlerta) {
        alert(`O produto "${nome}" foi adicionado com sucesso!`);
    }

    return true;
}

// Variáveis para guardar a referência do item que será removido
let itemParaRemoverElemento = null;
let itemParaRemoverPreco = 0;
let itemParaRemoverId = null;

// Função chamada ao clicar na lixeira do carrinho
function removerItem(elemento, preco, idProduto) {
    itemParaRemoverElemento = elemento;
    itemParaRemoverPreco = preco;
    itemParaRemoverId = idProduto;

    const modal = document.getElementById('modalRemoverCarrinho');
    const btnConfirmar = document.getElementById('btnConfirmarRemoverCarrinho');

    if (btnConfirmar) {
        btnConfirmar.onclick = confirmarRemocaoCarrinho;
    }

    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModalRemoverCarrinho() {
    const modal = document.getElementById('modalRemoverCarrinho');
    if (modal) {
        modal.style.display = 'none';
    }
    itemParaRemoverElemento = null;
    itemParaRemoverPreco = 0;
    itemParaRemoverId = null;
}

// Executa a remoção real após clicar em "Sim, remover"
async function confirmarRemocaoCarrinho() {
    if (!itemParaRemoverElemento) return;

    // 1. REMOVER DO BANCO DE DADOS
    if (itemParaRemoverId) {
        const formData = new FormData();
        formData.append('produto_id', itemParaRemoverId);
        try {
            await fetch('acoesfav.php?acao=remover_carrinho', {
                method: 'POST',
                body: formData
            });
        } catch (e) {
            console.error("Erro ao remover do banco:", e);
        }
    }

    // 2. REMOVER DA TELA
    const itemCard = itemParaRemoverElemento.closest('.cart-item-single');
    if (itemCard) itemCard.remove();

    totalCarrinho -= parseFloat(itemParaRemoverPreco);
    quantidadeItens--;
    
    if (quantidadeItens <= 0) {
        totalCarrinho = 0;
        const lista = document.getElementById('cart-items-list');
        if (lista) lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
    }

    atualizarInterface();
    fecharModalRemoverCarrinho();
}

// Garante o fechamento ao clicar fora do card
window.addEventListener('click', function(event) {
    const modalRemover = document.getElementById('modalRemoverCarrinho');
    if (event.target === modalRemover) {
        fecharModalRemoverCarrinho();
    }
});

function atualizarInterface() {
    const totalElemento = document.getElementById('cart-total-value');
    if (totalElemento) totalElemento.innerText = `R$ ${Math.max(0, totalCarrinho).toFixed(2).replace('.', ',')}`;
    
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = quantidadeItens;
        badge.style.display = quantidadeItens > 0 ? 'block' : 'none';
    }
}

function interacaoCart() {
    const carrinho = document.getElementById('x'); 
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');
    
    if (!carrinho) return;

    if (carrinho.style.right === '0px' || carrinho.classList.contains('open')) {
        fecharAll();
    } else {
        if (favoritos) {
            favoritos.style.right = '-450px';
            favoritos.classList.remove('open');
        }

        carrinho.style.right = '0px'; 
        carrinho.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function fecharAll(event) {
    if (event && event.preventDefault) event.preventDefault();

    const carrinho = document.getElementById('x');
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');

    if (carrinho) {
        carrinho.style.right = '-450px';
        carrinho.classList.remove('open');
    }
    if (favoritos) {
        favoritos.style.right = '-450px';
        favoritos.classList.remove('open');
    }

    document.body.style.overflow = '';

    if (overlay) {
        setTimeout(() => {
            const cartAberto = carrinho && (carrinho.style.right === '0px' || carrinho.classList.contains('open'));
            const favAberto = favoritos && (favoritos.style.right === '0px' || favoritos.classList.contains('open'));
            
            if (!cartAberto && !favAberto) overlay.classList.remove('active');
        }, 300);
    }
}