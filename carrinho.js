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

// CARREGA OS ITENS DO BANCO DE DADOS E CONFIGURA EVENTOS QUANDO A PÁGINA RECARREGA
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinhoDoBanco();

    // Vincula o evento de clique ao botão do carrinho no header (se houver no HTML)
    const btnCarrinho = document.querySelector('.fa-cart-shopping')?.parentElement || document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.onclick = function(e) {
            e.preventDefault();
            interacaoCart();
        };
    }
});

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

    if (lista) lista.appendChild(itemDiv);
    
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

    // 2. DESENHAR NA TELA E ABRIR O CARRINHO
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

// =========================================================================
// 3. CONTROLE DA GAVETA LATERAL DO CARRINHO
// =========================================================================
function abrirCarrinhoEfetivo() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const overlay = document.getElementById('overlay') || document.querySelector('.carrinho-overlay');
    const favoritos = document.getElementById('favoritos-container');

    // Fecha favoritos se estiver aberto
    if (favoritos) {
        favoritos.classList.remove('open', 'active');
        favoritos.style.right = '-450px';
    }

    // Fecha o modal de login se estiver aberto
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
        document.body.style.overflow = 'hidden';
    }
}

function interacaoCart() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const overlay = document.getElementById('overlay') || document.querySelector('.carrinho-overlay');

    if (!carrinho) {
        console.error("Elemento do carrinho (#x ou .cart-container) não encontrado no HTML!");
        return;
    }

    const estaAberto = carrinho.classList.contains('open') || carrinho.style.right === '0px';

    // Se já estiver aberto, apenas fecha
    if (estaAberto) {
        fecharAll();
        return;
    }

    // Verifica no PHP se o usuário está logado
    fetch('acoesfav.php?acao=listar_carrinho')
        .then(response => {
            if (response.status === 401) {
                if (typeof mostrarFeedback === 'function') {
                    mostrarFeedback('erro', 'Atenção!', 'Você precisa fazer login para acessar seu carrinho.', null);
                    setTimeout(() => {
                        if (typeof openModal === 'function') openModal('login');
                    }, 1500);
                } else {
                    alert('Você precisa fazer login para acessar seu carrinho!');
                    if (typeof openModal === 'function') openModal('login');
                }
                return null;
            }
            return response.text(); // Lê como texto primeiro para evitar quebra se houver warning do PHP
        })
        .then(texto => {
            if (texto === null) return;

            try {
                const dados = JSON.parse(texto);
                // Atualiza os itens do carrinho antes de abrir
                if (dados.status === 'sucesso' && Array.isArray(dados.itens)) {
                    const lista = document.getElementById('cart-items-list');
                    if (lista) {
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
                }
            } catch (e) {
                console.warn("Resposta não-JSON de acoesfav.php, abrindo gaveta mesmo assim:", texto);
            }

            abrirCarrinhoEfetivo();
        })
        .catch(err => {
            console.error("Erro ao verificar carrinho:", err);
            abrirCarrinhoEfetivo();
        });
}

function fecharAll() {
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');

    if (carrinho) {
        carrinho.classList.remove('open', 'active');
        carrinho.style.right = '-450px';
    }
    if (favoritos) {
        favoritos.classList.remove('open', 'active');
        favoritos.style.right = '-450px';
    }
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

// Fecha o carrinho ao clicar no fundo escuro (overlay)
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', fecharAll);
    }
});