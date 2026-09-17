// Adicionei img1 e img2 no final da lista de parâmetros
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
    document.getElementById('prod_preco').value = preco;
    document.getElementById('prod_tamanho').value = tamanho;
    document.getElementById('prod_cor').value = cor;
    document.getElementById('prod_qtd').value = qtd;
    
    // --- NOVIDADE AQUI: Preenche os campos ocultos com os nomes das imagens atuais ---
    // Isso garante que o PHP saiba qual imagem manter se você não subir uma nova
    if(document.getElementById('prod_imagem_atual')) {
        document.getElementById('prod_imagem_atual').value = img1;
    }
    if(document.getElementById('prod_imagem_corpo_atual')) {
        document.getElementById('prod_imagem_corpo_atual').value = img2;
    }

    // Muda o título
    document.getElementById('modalTitulo').innerText = id ? "Editar Roupa" : "Adicionar Nova Roupa";
}

function fecharModal() {
    document.getElementById('modalProduto').style.display = 'none';
}

// Fecha o modal se clicar fora da caixa branca
window.onclick = function(event) {
    let modal = document.getElementById('modalProduto');
    if (event.target == modal) {
        fecharModal();
    }
}