// --- LÓGICA DE FAVORITOS ---

function atualizarListaFavoritos() {
    const lista = document.getElementById('lista-favoritos');
    if (!lista) return;

    // Puxando os itens do seu banco de dados (LocalStorage)
    let favs = JSON.parse(localStorage.getItem('meusFavoritos')) || [
        { nome: 'Conjunto Woody', preco: '79.99', img: 'img/fant_wood.webp' }
    ];

    if (favs.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Sua lista está vazia.</p>';
        return;
    }

    lista.innerHTML = '';
    favs.forEach((p, index) => {
        lista.innerHTML += `
            <div class="fav-item-single" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 15px; padding-right: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="fav-checkbox">
                    <img src="${p.img}" style="width:50px; border-radius:8px;">
                    <div class="fav-item-info">
                        <h4 class="fav-name">${p.nome}</h4>
                        <p class="fav-price">R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
               
                <i class="fa-solid fa-trash-can"
                   onclick="removerDosFavoritos(${index})"
                   style="cursor:pointer; color:#ff6b6b; font-size: 1.1rem;"
                   title="Remover"></i>
            </div>
        `;
    });
}

// NOVA FUNÇÃO PARA EXCLUIR O ITEM
function removerDosFavoritos(index) {
    let favs = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
   
    // Remove o item da lista pelo índice
    favs.splice(index, 1);
   
    // Salva a lista atualizada no banco
    localStorage.setItem('meusFavoritos', JSON.stringify(favs));
   
    // Recarrega a tela para mostrar que saiu
    atualizarListaFavoritos();
}

function adicionarFavoritosAoCarrinho() {
    const selecionados = document.querySelectorAll('#lista-favoritos input[type="checkbox"]:checked');

    if (selecionados.length === 0) {
        alert("Selecione um item primeiro! 😊");
        return;
    }

    selecionados.forEach(checkbox => {
        const container = checkbox.closest('.fav-item-single');
        const nome = container.querySelector('.fav-name').innerText;
        const precoTxt = container.querySelector('.fav-price').innerText;
        const precoNum = parseFloat(precoTxt.replace('R$', '').replace('.', '').replace(',', '.').trim());

        adicionarAoCarrinho(nome, precoNum);
    });

    fecharTudo();
    const cart = document.getElementById('side-cart');
    if (cart) cart.classList.add('open');
    document.getElementById('overlay')?.classList.add('active');
}

// Carrega a lista assim que abrir a página
document.addEventListener('DOMContentLoaded', atualizarListaFavoritos);