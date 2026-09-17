// // =========================================================================
// // 1. INTERCEPTADOR DE ALERTA GLOBAL (COM SUPORTE A CALLBACK)
// // =========================================================================
// window.alert = function(mensagem, callback) {
//     // Remove algum alerta antigo que tenha ficado aberto
//     const alertaAntigo = document.getElementById('custom-alert-modal');
//     if (alertaAntigo) alertaAntigo.remove();

//     // Cria a estrutura do modal
//     const overlay = document.createElement('div');
//     overlay.id = 'custom-alert-modal';
//     overlay.className = 'custom-alert-overlay';
    
//     // Identifica o tipo de mensagem para aplicar as cores do CSS
//     let tipo = 'sucesso'; 
//     let icone = '✓';
//     let titulo = 'Sucesso!';

//     if (mensagem.toLowerCase().includes('erro') || mensagem.toLowerCase().includes('falhe')) {
//         tipo = 'erro';
//         icone = '✕';
//         titulo = 'Erro no Sistema';
//     } else if (mensagem.toLowerCase().includes('atenção') || mensagem.toLowerCase().includes('precisa estar logado') || mensagem.toLowerCase().includes('ops')) {
//         tipo = 'aviso';
//         icone = '!';
//         titulo = 'Atenção!';
//     } else if (mensagem.toLowerCase().includes('adicionado')) {
//         tipo = 'sucesso';
//         icone = '✓';
//         titulo = 'Adicionado!';
//     }

//     overlay.innerHTML = `
//         <div class="custom-alert-box ${tipo}">
//             <div class="custom-alert-icon">${icone}</div>
//             <h2 class="custom-alert-title">${titulo}</h2>
//             <p class="custom-alert-message">${mensagem}</p>
//             <button class="custom-alert-btn">OK</button>
//         </div>
//     `;

//     document.body.appendChild(overlay);
    
//     // Delay para disparar a animação de entrada do CSS
//     setTimeout(() => overlay.classList.add('active'), 10);

//     // Fecha o modal ao clicar em OK
//     overlay.querySelector('.custom-alert-btn').addEventListener('click', () => {
//         overlay.classList.remove('active');
//         setTimeout(() => {
//             overlay.remove();
//             if (typeof callback === 'function') {
//                 callback();
//             }
//         }, 300);
//     });
// };

// // =========================================================================
// // 2. CONTROLE DE ESTADO E FUNÇÕES DO CARRINHO
// // =========================================================================
// let totalCarrinho = 0;
// let quantidadeItens = 0;

// /**
//  * Adiciona um produto ao carrinho no Banco de Dados e atualiza a interface de usuário
//  * @param {number} idProduto - ID do produto vindo do banco
//  * @param {string} nome - Nome do produto
//  * @param {number|string} preco - Preço do produto
//  * @param {string} imagem - Nome ou caminho da imagem do produto (opcional)
//  * @param {boolean} exibeAlerta - Se true, exibe a janela de alerta
//  */
// async function adicionarAoCarrinho(idProduto, nome, preco, imagem = '', exibeAlerta = true) {
//     const lista = document.getElementById('cart-items-list');
//     if (!lista) return false;

//     let imagemDoBanco = imagem;

//     // 1. ENVIAR PARA O BANCO DE DADOS (Via PHP)
//     const formData = new FormData();
//     formData.append('produto_id', idProduto);

//     try {
//         const response = await fetch('acoesfav.php?acao=adicionar_carrinho', {
//             method: 'POST',
//             body: formData
//         });

//         if (response.status === 401) {
//             alert("Atenção: Você precisa estar logado para adicionar itens ao carrinho!", function() {
//                 if (typeof openModal === 'function') {
//                     openModal('login');
//                 }
//             });
//             return false;
//         }
        
//         const dados = await response.json();

//         if (dados.status !== 'sucesso') {
//             const msgErro = dados.mensagem || "Erro ao adicionar produto ao carrinho no banco de dados.";
//             alert("Erro no Banco: " + msgErro);
//             return false; 
//         }

//         // Se o PHP retornar os dados do produto, atualiza o caminho da imagem
//         if (dados.produto && dados.produto.imagem) {
//             imagemDoBanco = dados.produto.imagem;
//         }
//     } catch (erro) {
//         console.error("Erro na requisição:", erro);
//         alert("Ops! Certifique-se de estar logado para adicionar itens ao carrinho.");
//         return false; 
//     }

//     // 2. ATUALIZAR A INTERFACE VISUAL
//     const msgVazio = document.getElementById('empty-msg');
//     if (msgVazio) msgVazio.remove();

//     const itemDiv = document.createElement('div');
//     itemDiv.className = 'cart-item-single';
//     const precoNum = parseFloat(preco);
    
//     // Trata o caminho da imagem
//     let srcImagem = '';
//     if (imagemDoBanco && imagemDoBanco.trim() !== '') {
//         srcImagem = (imagemDoBanco.startsWith('http') || imagemDoBanco.startsWith('img/')) 
//             ? imagemDoBanco 
//             : `img/${imagemDoBanco}`;
//     }

//     // Gera a tag de imagem com tratamento caso o arquivo não seja encontrado na pasta
//     const imgHtml = srcImagem 
//         ? `<img src="${srcImagem}" alt="${nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; margin-right: 12px; flex-shrink: 0;" onerror="this.onerror=null; this.parentNode.innerHTML='<div style=\\'width: 60px; height: 60px; background: #eee; border-radius: 10px; margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;\\'>Sem Foto</div>';">` 
//         : `<div style="width: 60px; height: 60px; background: #eee; border-radius: 10px; margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">Sem Foto</div>`;

//     // Estilização única e limpa para evitar bordas/linhas duplas na lista
//     itemDiv.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;";

//     itemDiv.innerHTML = `
//         <div style="display: flex; align-items: center; gap: 8px;">
//             ${imgHtml}
//             <div>
//                 <span style="display: block; font-weight: 700; font-size: 0.95rem; line-height: 1.2; color: #333; margin-bottom: 4px;">${nome}</span>
//                 <small style="color: #00a896; font-weight: 700; font-size: 0.9rem;">R$ ${precoNum.toFixed(2).replace('.', ',')}</small>
//             </div>
//         </div>
//         <i class="fa-solid fa-trash-can" onclick="removerItem(this, ${precoNum})" style="cursor: pointer; color: #ff6b81; font-size: 1.1rem; margin-left: 10px;"></i>
//     `;

//     lista.appendChild(itemDiv);
    
//     totalCarrinho += precoNum;
//     quantidadeItens++;
//     atualizarInterface();

//     if (exibeAlerta) {
//         alert(`O produto "${nome}" foi adicionado com sucesso!`);
//         const carrinho = document.getElementById('x');
//         if (carrinho && carrinho.style.right !== '0px') {
//             interacaoCart();
//         }
//     }

//     return true;
// }

// function removerItem(elemento, preco) {
//     elemento.closest('.cart-item-single').remove();
//     totalCarrinho -= parseFloat(preco);
//     quantidadeItens--;
    
//     if (quantidadeItens <= 0) {
//         totalCarrinho = 0;
//         const lista = document.getElementById('cart-items-list');
//         if (lista) lista.innerHTML = '<p id="empty-msg" style="text-align:center; margin-top:50px; color:#888;">Seu carrinho está vazio.</p>';
//     }
//     atualizarInterface();
// }

// function atualizarInterface() {
//     const totalElemento = document.getElementById('cart-total-value');
//     if (totalElemento) totalElemento.innerText = `R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;
    
//     const badge = document.getElementById('cart-count');
//     if (badge) {
//         badge.innerText = quantidadeItens;
//         badge.style.display = quantidadeItens > 0 ? 'block' : 'none';
//     }
// }

// // --- FUNÇÃO PARA ABRIR / FECHAR O CARRINHO ---
// function interacaoCart() {
//     const carrinho = document.getElementById('x'); 
//     const favoritos = document.getElementById('favoritos-container');
//     const overlay = document.getElementById('overlay');
    
//     if (!carrinho) return;

//     if (carrinho.style.right === '0px' || carrinho.classList.contains('open')) {
//         fecharAll();
//     } else {
//         if (favoritos) {
//             favoritos.style.right = '-450px';
//             favoritos.classList.remove('open');
//         }

//         carrinho.style.right = '0px'; 
//         carrinho.classList.add('open');
//         if (overlay) overlay.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     }
// }

// // --- FUNÇÃO PARA FECHAR TUDO ---
// function fecharAll(event) {
//     if (event && event.preventDefault) {
//         event.preventDefault();
//     }

//     const carrinho = document.getElementById('x');
//     const favoritos = document.getElementById('favoritos-container');
//     const overlay = document.getElementById('overlay');

//     if (carrinho) {
//         carrinho.style.right = '-450px';
//         carrinho.classList.remove('open');
//     }
//     if (favoritos) {
//         favoritos.style.right = '-450px';
//         favoritos.classList.remove('open');
//     }

//     document.body.style.overflow = '';

//     if (overlay) {
//         setTimeout(() => {
//             const cartAberto = carrinho && (carrinho.style.right === '0px' || carrinho.classList.contains('open'));
//             const favAberto = favoritos && (favoritos.style.right === '0px' || favoritos.classList.contains('open'));
            
//             if (!cartAberto && !favAberto) {
//                 overlay.classList.remove('active');
//             }
//         }, 300);
//     }
// }

// =========================================================================
// 1. INTERCEPTADOR DE ALERTA GLOBAL (COM SUPORTE A CALLBACK)
// =========================================================================
window.alert = function(mensagem, callback) {
    const alertaAntigo = document.getElementById('custom-alert-modal');
    if (alertaAntigo) alertaAntigo.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-modal';
    overlay.className = 'custom-alert-overlay';
    
    let tipo = 'sucesso'; 
    let icone = '✓';
    let titulo = 'Sucesso!';

    if (mensagem.toLowerCase().includes('erro') || mensagem.toLowerCase().includes('falhe')) {
        tipo = 'erro';
        icone = '✕';
        titulo = 'Erro no Sistema';
    } else if (mensagem.toLowerCase().includes('atenção') || mensagem.toLowerCase().includes('precisa estar logado') || mensagem.toLowerCase().includes('ops')) {
        tipo = 'aviso';
        icone = '!';
        titulo = 'Atenção!';
    } else if (mensagem.toLowerCase().includes('adicionado')) {
        tipo = 'sucesso';
        icone = '✓';
        titulo = 'Adicionado!';
    }

    overlay.innerHTML = `
        <div class="custom-alert-box ${tipo}">
            <div class="custom-alert-icon">${icone}</div>
            <h2 class="custom-alert-title">${titulo}</h2>
            <p class="custom-alert-message">${mensagem}</p>
            <button class="custom-alert-btn">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    overlay.querySelector('.custom-alert-btn').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            if (typeof callback === 'function') callback();
        }, 300);
    });
};

// =========================================================================
// 2. CONTROLE DE ESTADO E FUNÇÕES DO CARRINHO
// =========================================================================
let totalCarrinho = 0;
let quantidadeItens = 0;

// CARREGA OS ITENS DO BANCO DE DADOS SEMPRE QUE A PÁGINA É RECARREGADA (Ctrl + F5)
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
                // Desenha cada item que já estava salvo no Banco de Dados
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
            alert("Atenção: Você precisa estar logado para adicionar itens ao carrinho!", function() {
                if (typeof openModal === 'function') openModal('login');
            });
            return false;
        }
        
        const dados = await response.json();

        if (dados.status !== 'sucesso') {
            const msgErro = dados.mensagem || "Erro ao adicionar produto ao carrinho no banco de dados.";
            alert("Erro no Banco: " + msgErro);
            return false; 
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Ops! Certifique-se de estar logado para adicionar itens ao carrinho.");
        return false; 
    }

    // 2. DESENHAR NA TELA
    desenharItemNaTela(idProduto, nome, preco, imagem);

    if (exibeAlerta) {
        alert(`O produto "${nome}" foi adicionado com sucesso!`);
        const carrinho = document.getElementById('x');
        if (carrinho && carrinho.style.right !== '0px') {
            interacaoCart();
        }
    }

    return true;
}

async function removerItem(elemento, preco, idProduto) {
    // 1. REMOVER DO BANCO DE DADOS
    if (idProduto) {
        const formData = new FormData();
        formData.append('produto_id', idProduto);
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