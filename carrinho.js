// =========================================================================
// 1. INTERCEPTADOR DE ALERTA GLOBAL
// =========================================================================
window.alert = function(mensagem, callback) {
    let tipo = 'sucesso'; 
    let titulo = 'Sucesso!';

    if (mensagem.toLowerCase().includes('erro') || mensagem.toLowerCase().includes('falhe') || mensagem.toLowerCase().includes('ops')) {
        tipo = 'erro';
        titulo = 'Erro no Sistema';
    } else if (mensagem.toLowerCase().includes('atenção') || mensagem.toLowerCase().includes('precisa estar logado') || mensagem.toLowerCase().includes('logado')) {
        tipo = 'erro';
        titulo = 'Atenção!';
    } else if (mensagem.toLowerCase().includes('adicionado')) {
        tipo = 'sucesso';
        titulo = 'Adicionado!';
    }

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

document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinhoDoBanco();

    const btnCarrinho = document.querySelector('.fa-cart-shopping')?.parentElement || document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.onclick = function(e) {
            e.preventDefault();
            interacaoCart();
        };
    }

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', fecharAll);
    }
});

async function carregarCarrinhoDoBanco() {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return;

    try {
        const response = await fetch('acoesfav.php?acao=listar_carrinho');
        if (response.status === 401) return;

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

    if (lista) lista.appendChild(itemDiv);
    
    totalCarrinho += precoNum;
    quantidadeItens++;
    atualizarInterface();
}

async function adicionarAoCarrinho(idProduto, nome, preco, imagem = '', exibeAlerta = true) {
    const lista = document.getElementById('cart-items-list');
    if (!lista) return false;

    const formData = new FormData();
    formData.append('produto_id', idProduto);

    try {
        const response = await fetch('acoesfav.php?acao=adicionar_carrinho', {
            method: 'POST',
            body: formData
        });

        if (response.status === 401) {
            fecharAll();
            alert("Você precisa estar logado para adicionar itens ao carrinho!", function() {
                if (typeof openModal === 'function') openModal('login');
            });
            return false;
        }
        
        const dados = await response.json();

        if (dados.status !== 'sucesso') {
            const msgErro = dados.mensagem || "Você precisa estar logado para adicionar itens ao carrinho.";
            alert(msgErro, function() {
                if (typeof openModal === 'function') openModal('login');
            });
            return false;
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Você precisa estar logado para adicionar itens ao carrinho.", function() {
            if (typeof openModal === 'function') openModal('login');
        });
        return false; 
    }

    desenharItemNaTela(idProduto, nome, preco, imagem);

    if (exibeAlerta) {
        alert(`O produto "${nome}" foi adicionado com sucesso!`, function() {
            abrirCarrinhoEfetivo();
        });
    } else {
        abrirCarrinhoEfetivo();
    }

    return true;
}

let itemParaRemoverElemento = null;
let itemParaRemoverPreco = 0;
let itemParaRemoverId = null;

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

async function confirmarRemocaoCarrinho() {
    if (!itemParaRemoverElemento) return;

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

// =========================================================================
// 3. CONTROLE DA GAVETA LATERAL DO CARRINHO (SEM TRAVAMENTO)
// =========================================================================
function travarScrollFundo() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function destravarScrollFundo() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

function abrirCarrinhoEfetivo() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const overlay = document.getElementById('overlay') || document.querySelector('.carrinho-overlay');
    const favoritos = document.getElementById('favoritos-container');

    if (favoritos) {
        favoritos.classList.remove('open', 'active');
        favoritos.style.right = '-100%';
    }

    const modalLogin = document.getElementById('authModal');
    if (modalLogin) {
        modalLogin.style.display = 'none';
        modalLogin.classList.remove('aberto');
    }

    if (carrinho) {
        carrinho.classList.add('open', 'active');
        carrinho.style.right = '0px';
        if (overlay) {
            overlay.classList.add('active');
            overlay.style.display = 'block';
        }
        travarScrollFundo();
    }
}

function fecharAll() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay') || document.querySelector('.carrinho-overlay');
    const overlayFav = document.getElementById('overlay-favoritos');

    if (carrinho) {
        carrinho.classList.remove('open', 'active', 'aberto');
        carrinho.style.right = '-100%';
    }
    if (favoritos) {
        favoritos.classList.remove('open', 'active');
        favoritos.style.right = '-100%';
    }
    if (overlay) {
        overlay.classList.remove('active', 'open', 'aberto');
        overlay.style.display = 'none';
    }
    if (overlayFav) {
        overlayFav.classList.remove('active');
        overlayFav.style.display = 'none';
    }
    
    destravarScrollFundo();
}

function interacaoCart() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const lista = document.getElementById('cart-items-list');

    if (!carrinho) return;

    const estaAberto = carrinho.classList.contains('open') || carrinho.style.right === '0px';

    if (estaAberto) {
        fecharAll();
        return;
    }

    fetch('acoesfav.php?acao=listar_carrinho')
        .then(response => {
            if (response.status === 401) {
                if (lista) {
                    lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
                    totalCarrinho = 0;
                    quantidadeItens = 0;
                    atualizarInterface();
                }
                return null;
            }
            return response.text();
        })
        .then(texto => {
            if (texto !== null) {
                try {
                    const dados = JSON.parse(texto);
                    if (dados.status === 'sucesso' && Array.isArray(dados.itens) && lista) {
                        lista.innerHTML = '';
                        totalCarrinho = 0;
                        quantidadeItens = 0;

                        if (dados.itens.length === 0) {
                            lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
                            atualizarInterface();
                        } else {
                            dados.itens.forEach(item => {
                                const qtd = item.quantidade ? parseInt(item.quantidade) : 1;
                                for (let i = 0; i < qtd; i++) {
                                    desenharItemNaTela(item.id_produto, item.nome, item.preco, item.imagem);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.warn("Resposta não-JSON de acoesfav.php, abrindo gaveta:", texto);
                }
            }
            abrirCarrinhoEfetivo();
        })
        .catch(err => {
            console.error("Erro ao verificar carrinho:", err);
            abrirCarrinhoEfetivo();
        });
}