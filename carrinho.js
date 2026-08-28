// =========================================================================
// 1. INTERCEPTADOR DE ALERTA GLOBAL (COM SUPORTE A CALLBACK)
// =========================================================================
window.alert = function(mensagem, callback) {
    // Remove algum alerta antigo que tenha ficado aberto
    const alertaAntigo = document.getElementById('custom-alert-modal');
    if (alertaAntigo) alertaAntigo.remove();

    // Cria a estrutura do modal
    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-modal';
    overlay.className = 'custom-alert-overlay';
    
    // Identifica o tipo de mensagem para aplicar as cores do CSS
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
    
    // Pequeno delay para disparar a animação de entrada do CSS
    setTimeout(() => overlay.classList.add('active'), 10);

    // Fecha o modal ao clicar no botão OK e executa a próxima ação (se houver)
    overlay.querySelector('.custom-alert-btn').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            // Executa o callback (como abrir o login) apenas DEPOIS que o alerta sumir
            if (typeof callback === 'function') {
                callback();
            }
        }, 300); // 300ms é o tempo de transição do CSS
    });
};

// =========================================================================
// 2. CONTROLE DE ESTADO E FUNÇÕES DO CARRINHO
// =========================================================================
let totalCarrinho = 0;
let quantidadeItens = 0;

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

        if (response.status === 401) {
            // Enviamos a abertura do modal de login dentro do callback do alert
            alert("Atenção: Você precisa estar logado para adicionar itens ao carrinho!", function() {
                if (typeof openModal === 'function') {
                    openModal('login');
                }
            });
            return;
        }
        
        const dados = await response.json();

if (dados.status !== 'sucesso') {
    // Exibe a mensagem de erro detalhada do PHP se ela existir
    const msgErro = dados.mensagem || "Erro ao adicionar produto ao carrinho no banco de dados.";
    alert("Erro no Banco: " + msgErro);
    return; 
}
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Ops! Certifique-se de estar logado para adicionar itens ao carrinho.");
        return; 
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

    // Dispara o aviso estilizado de sucesso
    alert(`O produto "${nome}" foi adicionado com sucesso!`);

    const carrinho = document.getElementById('x');
    if (carrinho && carrinho.style.right !== '0px') {
        interacaoCart(); // Abre a barra lateral do carrinho
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
function interacaoCart() {
    const carrinho = document.getElementById('x'); 
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');
    
    if (!carrinho) return;

    // Se o carrinho já estiver aberto, fecha ele com calma
    if (carrinho.style.right === '0px') {
        fecharAll();
    } else {
        // Se o favoritos estiver aberto, fecha ele primeiro
        if (favoritos) favoritos.style.right = '-450px';

        // Abre o carrinho e ativa a transparência do fundo
        carrinho.style.right = '0px'; 
        if (overlay) overlay.classList.add('active');
    }
}

// --- FUNÇÃO PARA FECHAR TUDO (COM CORREÇÃO DE ANIMAÇÃO E SCROLL) ---
function fecharAll(event) {
    // 1. Evita que links com '#' façam a tela pular para o topo
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const carrinho = document.getElementById('x');
    const favoritos = document.getElementById('favoritos-container');
    const overlay = document.getElementById('overlay');

    // 2. Recolhe o Carrinho e os Favoritos primeiro
    if (carrinho) carrinho.style.right = '-450px';
    if (favoritos) favoritos.style.right = '-450px';

    // 3. Espera a animação da gaveta fechar para SÓ ENTÃO remover a transparência
    if (overlay) {
        setTimeout(() => {
            // Garante que só remove o escuro se NENHUMA gaveta tiver sido reaberta nesse meio tempo
            const cartAberto = carrinho && carrinho.style.right === '0px';
            const favAberto = favoritos && favoritos.style.right === '0px';
            
            if (!cartAberto && !favAberto) {
                overlay.classList.remove('active');
            }
        }, 300); // 300ms é o tempo da transição do deslize no CSS
    }
}