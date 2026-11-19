// ============================================================
// 1. ABERTURA E FECHAMENTO DO MODAL DE PRODUTO (CADASTRO / EDIÇÃO)
// ============================================================
function abrirModal(id = '', nome = '', categoria = '', descricao = '', preco = '', tamanho = '', cor = '', qtd = '', img1 = '', img2 = '') {
    const modal = document.getElementById('modalProduto');
    if (modal) {
        modal.style.display = 'block';
    }

    // Preenchimento dos campos de texto e números
    document.getElementById('prod_id').value = id;
    document.getElementById('prod_nome').value = nome;
    document.getElementById('prod_categoria').value = categoria;
    document.getElementById('prod_desc').value = descricao;
    
    // Garante a busca correta do ID do preço
    const campoPreco = document.getElementById('prod_preco') || document.getElementById('preco');
    if (campoPreco) campoPreco.value = preco;

    document.getElementById('prod_tamanho').value = tamanho;
    document.getElementById('prod_cor').value = cor;
    document.getElementById('prod_qtd').value = qtd;
    
    if(document.getElementById('prod_imagem_atual')) {
        document.getElementById('prod_imagem_atual').value = img1;
    }
    if(document.getElementById('prod_imagem_corpo_atual')) {
        document.getElementById('prod_imagem_corpo_atual').value = img2;
    }

    // Muda o título conforme a ação
    document.getElementById('modalTitulo').innerText = id ? "Editar Roupa" : "Adicionar Nova Roupa";
}

function fecharModal() {
    document.getElementById('modalProduto').style.display = 'none';
}

function fecharModalConfirmacao() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) modal.style.display = 'none';
}


// ============================================================
// 2. CONTROLE DO MODAL DE EXCLUSÃO
// ============================================================
function confirmarExclusao(urlExcluir) {
    const modal = document.getElementById('modalExcluir');
    const btnConfirmar = document.getElementById('btnConfirmarExclusao');
    
    if (btnConfirmar) {
        btnConfirmar.href = urlExcluir;
    }
    
    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModalExcluir() {
    const modal = document.getElementById('modalExcluir');
    if (modal) {
        modal.style.display = 'none';
    }
}

function fecharModalSucesso() {
    document.getElementById('modalSucesso').style.display = 'none';
    // Limpa a URL removendo o parâmetro ?sucesso sem recarregar a página
    window.history.replaceState({}, document.title, window.location.pathname);
}


// ============================================================
// 3. INICIALIZAÇÃO DE EVENTOS (DOM LOADED)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // A) Valida campos obrigatórios e intercepta envio para pedir confirmação se for EDIÇÃO
const formProduto = document.querySelector('#modalProduto form');
if (formProduto) {
    formProduto.addEventListener('submit', function(e) {
        // Verifica se algum campo obrigatório foi preenchido apenas com espaços em branco
        const camposObrigatorios = ['prod_nome', 'prod_categoria', 'prod_tamanho', 'prod_cor', 'preco', 'prod_qtd', 'prod_desc'];
        for (const campoId of camposObrigatorios) {
            const el = document.getElementById(campoId);
            if (el && el.value.trim() === '') {
                e.preventDefault();
                el.focus();
                alert('Por favor, preencha todos os campos obrigatórios antes de salvar.');
                return;
            }
        }

        const id = document.getElementById('prod_id').value;

        // Se for alteração (id preenchido), exige confirmação
        if (id && id.trim() !== '') {
            e.preventDefault();

            const modalConf = document.getElementById('modalConfirmacao');
            if (modalConf) modalConf.style.display = 'flex';

            document.getElementById('btnConfirmarAlteracao').onclick = function() {
                fecharModalConfirmacao();
                formProduto.submit();
            };
        }
    });
}

    // B) Captura parâmetro de SUCESSO na URL (?sucesso=1, 2 ou 3) e exibe o aviso
    const urlParams = new URLSearchParams(window.location.search);
    const sucesso = urlParams.get('sucesso');

    if (sucesso) {
        const modal = document.getElementById('modalSucesso');
        const titulo = document.getElementById('tituloSucesso');
        const mensagem = document.getElementById('mensagemSucesso');

        if (sucesso === '1') {
            titulo.innerText = "Sucesso!";
            mensagem.innerText = "Produto adicionado ao estoque!";
        } else if (sucesso === '2') {
            titulo.innerText = "Sucesso!";
            mensagem.innerText = "Produto alterado com sucesso!";
        } else if (sucesso === '3') {
            titulo.innerText = "Excluído!";
            mensagem.innerText = "Produto removido do estoque com sucesso!";
        }

        if (modal) {
            modal.style.display = 'flex';
        }
    }
});


// ============================================================
// 4. EVENTOS DE CLIQUE FORA E SCROLL DO HEADER
// ============================================================
// Fecha qualquer modal aberto caso clique fora da caixa branca
window.onclick = function(event) {
    let modalProd = document.getElementById('modalProduto');
    let modalConf = document.getElementById('modalConfirmacao');
    let modalExcl = document.getElementById('modalExcluir');
    
    if (event.target == modalProd) fecharModal();
    if (event.target == modalConf) fecharModalConfirmacao();
    if (event.target == modalExcl) fecharModalExcluir();
};

// Efeito de fixar e achatar o Header ao rolar a página
window.addEventListener('scroll', function() {
    const header = document.getElementById('headerAdmin');
    if (header) {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});