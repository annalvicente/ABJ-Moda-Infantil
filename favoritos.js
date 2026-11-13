// ============================================================
// 1. CARREGAMENTO AUTOMÁTICO E EVENTOS INICIAIS
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lista-favoritos")) {
        carregarFavoritos();
    }
});

// ============================================================
// 2. CONTROLE DE ABERTURA E FECHAMENTO DA GAVETA
// ============================================================
function toggleFavoritos() {
    const favoritos = document.getElementById("favoritos-container");
    if (!favoritos) return;

    const estaAberto = favoritos.classList.contains("open") || favoritos.style.right === "0px";
    if (estaAberto) {
        if (typeof fecharAll === 'function') fecharAll();
        else fecharFavoritosEFundo();
        return;
    }

    // Abre a gaveta imediatamente (mesmo sem login, igual ao carrinho)
    abrirFavoritosEfetivo();
    carregarFavoritos();
}

function abrirFavoritos() {
    toggleFavoritos();
}

function abrirFavoritosEfetivo() {
    const favoritos = document.getElementById("favoritos-container");
    const carrinho = document.getElementById('x') || document.querySelector('.cart-container');
    const overlay = document.getElementById("overlay") || document.querySelector('.carrinho-overlay');

    // Fecha o carrinho se estiver aberto, sem apagar o overlay
    if (carrinho) {
        carrinho.classList.remove('open', 'active', 'aberto');
        carrinho.style.right = '-100%';
    }

    if (favoritos) {
        favoritos.style.right = "0px";
        favoritos.classList.add("open", "active");
    }

    if (overlay) {
        overlay.classList.add("active");
        overlay.style.display = 'block';
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function dispararAvisoLoginFavoritos() {
    if (typeof fecharAll === 'function') fecharAll();
    if (typeof mostrarFeedback === 'function') {
        mostrarFeedback('erro', 'Atenção!', 'Você precisa fazer login para salvar ou comprar favoritos.', null);
        setTimeout(() => { 
            if (typeof openModal === 'function') openModal('login'); 
        }, 1200);
    } else {
        alert('Você precisa fazer login para continuar!');
        if (typeof openModal === 'function') openModal('login');
    }
}

function fecharFavoritosEFundo() {
    if (typeof fecharAll === 'function') {
        fecharAll();
        return;
    }
    const favoritos = document.getElementById("favoritos-container");
    const overlay = document.getElementById("overlay") || document.querySelector('.carrinho-overlay');

    if (favoritos) {
        favoritos.style.right = "-100%";
        favoritos.classList.remove("open", "active");
    }
    if (overlay) {
        overlay.classList.remove("active", "open");
        overlay.style.display = 'none';
    }
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// ============================================================
// 3. ADICIONAR E CARREGAR FAVORITOS
// ============================================================
async function adicionarAoFavorito(idProduto) {
    const formData = new FormData();
    formData.append("id_produto", idProduto);

    try {
        const resposta = await fetch("acoesfav.php?acao=adicionar", {
            method: "POST",
            body: formData
        });
        
        if (resposta.status === 401) {
            dispararAvisoLoginFavoritos();
            return;
        }

        const resultado = await resposta.json();
        
        if (!resultado.sucesso) {
            if (resultado.status === 'deslogado' || resultado.erro === 'nao_logado') {
                dispararAvisoLoginFavoritos();
                return;
            }
            if (typeof mostrarFeedback === 'function') {
                mostrarFeedback('erro', 'Ops!', resultado.mensagem || 'Não foi possível favoritar o produto.');
            }
            return;
        }

        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('sucesso', 'Favoritado!', resultado.mensagem || 'Produto adicionado aos favoritos!');
        }

        await carregarFavoritos();
        abrirFavoritosEfetivo(); // Garante que abre APENAS favoritos

    } catch (erro) {
        console.error("Erro ao favoritar:", erro);
        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('erro', 'Ops!', 'Erro de conexão com o servidor.');
        }
    }
}

async function carregarFavoritos() {
    const lista = document.getElementById("lista-favoritos");
    if (!lista) return;

    lista.innerHTML = `
        <div class="gaveta-vazia" style="text-align: center; padding: 40px 10px; color: #888;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Carregando favoritos...</p>
        </div>`;

    try {
        const resposta = await fetch("acoesfav.php?acao=listar");
        
        if (resposta.status === 401) {
            lista.innerHTML = `
                <div class="gaveta-vazia" style="text-align: center; padding: 40px 15px; color: #888;">
                    <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: #ff6b81; margin-bottom: 12px;"></i>
                    <p style="margin-bottom: 15px;">Sua lista de favoritos está vazia.<br><small>Faça login para salvar suas peças preferidas!</small></p>
                </div>`;
            return;
        }

        const dados = await resposta.json();
        lista.innerHTML = "";

        if (dados.status === 'deslogado' || dados.erro === 'nao_logado') {
            lista.innerHTML = `
                <div class="gaveta-vazia" style="text-align: center; padding: 40px 15px; color: #888;">
                    <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: #ff6b81; margin-bottom: 12px;"></i>
                    <p>Sua lista de favoritos está vazia.<br><small>Faça login para salvar suas peças preferidas!</small></p>
                </div>`;
            return;
        }

        if (!dados.sucesso || !dados.itens || dados.itens.length === 0) {
            lista.innerHTML = `
                <div class="gaveta-vazia" style="text-align: center; padding: 40px 10px; color: #888;">
                    <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: #ff6b81; margin-bottom: 10px;"></i>
                    <p>Sua lista de favoritos está vazia.</p>
                </div>`;
            return;
        }

        dados.itens.forEach((p) => {
            const div = document.createElement("div");
            div.className = "fav-item-single";
            div.innerHTML = `
                <div class="fav-item-info">
                    <input type="checkbox" class="fav-checkbox" value="${p.id_favorito}" data-id="${p.id_produto}" data-nome="${p.nome}" data-preco="${p.preco}" data-imagem="${p.imagem}">
                    <img src="img/${p.imagem}" alt="${p.nome}" onerror="this.src='img/sem-foto.png'">
                    <div>
                        <h4>${p.nome}</h4>
                        <p>R$ ${parseFloat(p.preco).toFixed(2).replace(".", ",")}</p>
                    </div>
                </div>
                <i class="fa-solid fa-trash-can btn-remover"
                   onclick="removerFavorito(${p.id_favorito})"
                   title="Remover favorito"></i>
            `;
            lista.appendChild(div);
        });

    } catch (error) {
        lista.innerHTML = `
            <div class="gaveta-vazia" style="text-align: center; padding: 40px 10px; color: #888;">
                <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: #ff6b81; margin-bottom: 10px;"></i>
                <p>Sua lista de favoritos está vazia.</p>
            </div>`;
    }
}

// ============================================================
// 4. REMOÇÃO DE FAVORITO
// ============================================================
let favoritoParaRemoverId = null;

function removerFavorito(idFavorito) {
    favoritoParaRemoverId = idFavorito;
    const modal = document.getElementById('modalRemoverFavorito');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        if (confirm("Deseja remover este item dos seus favoritos?")) {
            confirmarRemocaoFavorito();
        }
    }
}

function fecharModalRemoverFavorito() {
    const modal = document.getElementById('modalRemoverFavorito');
    if (modal) {
        modal.style.display = 'none';
    }
    favoritoParaRemoverId = null;
}

async function confirmarRemocaoFavorito() {
    if (!favoritoParaRemoverId) return;

    const formData = new FormData();
    formData.append("id_favorito", favoritoParaRemoverId);

    try {
        await fetch("acoesfav.php?acao=remover", { 
            method: "POST", 
            body: formData 
        });

        fecharModalRemoverFavorito();
        
        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('sucesso', 'Removido!', 'O item foi removido dos favoritos.');
        }

        carregarFavoritos();
    } catch (e) {
        console.error("Erro ao remover favorito:", e);
        fecharModalRemoverFavorito();
    }
}

// ============================================================
// 5. MOVER FAVORITOS SELECIONADOS PARA O CARRINHO (EXIGE LOGIN)
// ============================================================
async function adicionarFavoritosAoCarrinho() {
    const selecionados = document.querySelectorAll(".fav-checkbox:checked");

    if (selecionados.length === 0) {
        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('erro', 'Atenção!', 'Selecione pelo menos um item para adicionar ao carrinho!');
        }
        return;
    }

    let adicionouAlgum = false;

    for (let checkbox of selecionados) {
        const idProduto = checkbox.getAttribute("data-id");
        const nome = checkbox.getAttribute("data-nome");
        const preco = checkbox.getAttribute("data-preco");
        const imagem = checkbox.getAttribute("data-imagem");
        
        if (typeof adicionarAoCarrinho === "function") {
            const sucesso = await adicionarAoCarrinho(idProduto, nome, preco, imagem, false);
            if (sucesso !== false) adicionouAlgum = true;
        }
    }

    if (adicionouAlgum) {
        fecharFavoritosEFundo();

        if (typeof abrirCarrinhoEfetivo === "function") {
            abrirCarrinhoEfetivo();
        }

        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('sucesso', 'Sucesso!', 'Item(ns) adicionado(s) ao carrinho com sucesso!');
        }
    }
}