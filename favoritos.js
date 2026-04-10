// Função para carregar os dados do banco assim que a página abre
async function carregarFavoritos() {
    const lista = document.getElementById('lista-favoritos');

    try {
        // Busca os dados do arquivo PHP centralizador
        const response = await fetch('acoesfav.php?acao=listar');
        const favoritos = await response.json();

        lista.innerHTML = '';

        if (favoritos.length === 0) {
            lista.innerHTML = '<p>Você ainda não favoritou nada.</p>';
            return;
        }

        favoritos.forEach(p => {
            lista.innerHTML += `
                <div class="fav-item" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px;">
                    <div class="fav-info" style="display: flex; align-items: center; gap: 15px;">
                        <input type="checkbox" class="fav-checkbox" value="${p.id_produto}">
                        <img src="${p.imagem}" alt="${p.nome}" style="width: 80px; border-radius: 8px;">
                        <div>
                            <h3 style="margin:0;">${p.nome}</h3>
                            <p style="color: #ff69b4; font-weight: bold;">R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                    <div class="fav-actions">
                        <i class="fa-solid fa-trash-can btn-remover" 
                           onclick="removerFavorito(${p.id_favorito})" 
                           style="cursor:pointer; color:#ff6b6b; font-size: 1.2rem;"></i>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        lista.innerHTML = '<p>Erro ao carregar dados do servidor.</p>';
        console.error("Erro:", error);
    }
}

// Função para remover um item do banco
async function removerFavorito(idFavorito) {
    if (!confirm("Deseja remover este item dos favoritos?")) return;

    const formData = new FormData();
    formData.append('id_favorito', idFavorito);

    await fetch('acoesfav.php?acao=remover', {
        method: 'POST',
        body: formData
    });

    carregarFavoritos(); // Atualiza a tela após remover
}

// Função para enviar os selecionados para a tabela carrinho no banco
async function adicionarFavoritosAoCarrinho() {
    const selecionados = document.querySelectorAll('.fav-checkbox:checked');

    if (selecionados.length === 0) {
        alert("Selecione pelo menos um item!");
        return;
    }

    for (let checkbox of selecionados) {
        const formData = new FormData();
        formData.append('produto_id', checkbox.value);

        await fetch('acoesfav.php?acao=adicionar_carrinho', {
            method: 'POST',
            body: formData
        });
    }

    alert("Itens adicionados ao carrinho!");
    window.location.href = 'index.html';
}

// Inicializa a lista
document.addEventListener('DOMContentLoaded', carregarFavoritos);