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
    const overlay = document.getElementById("overlay") || document.querySelector('.carrinho-overlay');

    if (!favoritos) return;

    const estaAberto = favoritos.style.right === "0px" || favoritos.classList.contains("open");
    if (estaAberto) {
        fecharFavoritosEFundo();
        return;
    }

    // 1. Verifica no PHP se o utilizador está logado antes de abrir
    fetch('acoesfav.php?acao=listar')
        .then(async response => {
            if (response.status === 401) {
                dispararAvisoLoginFavoritos();
                return null;
            }
            const texto = await response.text();
            try {
                return JSON.parse(texto);
            } catch (e) {
                console.warn("Resposta não-JSON de acoesfav.php:", texto);
                return { sucesso: true };
            }
        })
        .then(dados => {
            if (!dados) return;

            if (dados.sucesso === false || dados.status === 'deslogado' || dados.erro === 'nao_logado') {
                dispararAvisoLoginFavoritos();
                return;
            }

            // 2. Fecha o carrinho se estiver aberto e abre os favoritos
            if (typeof fecharAll === 'function') fecharAll();

            favoritos.style.right = "0px";
            favoritos.classList.add("open", "active");
            if (overlay) {
                overlay.classList.add("active");
                overlay.style.display = 'block';
            }
            document.body.style.overflow = "hidden";

            carregarFavoritos();
        })
        .catch(err => {
            console.error("Erro ao verificar favoritos:", err);
            dispararAvisoLoginFavoritos();
        });
}

function abrirFavoritos() {
    toggleFavoritos();
}

function dispararAvisoLoginFavoritos() {
    if (typeof mostrarFeedback === 'function') {
        mostrarFeedback('erro', 'Atenção!', 'Você precisa fazer login para acessar seus favoritos.', null);
        setTimeout(() => { 
            if (typeof openModal === 'function') openModal('login'); 
        }, 1200);
    } else {
        alert('Você precisa fazer login para acessar seus favoritos!');
        if (typeof openModal === 'function') openModal('login');
    }
}

function fecharFavoritosEFundo() {
    const favoritos = document.getElementById("favoritos-container");
    const overlay = document.getElementById("overlay") || document.querySelector('.carrinho-overlay');
    const conteudo = document.querySelector(".conteudo-principal");

    if (favoritos) {
        favoritos.style.right = "-450px";
        favoritos.classList.remove("open", "active");
    }
    if (overlay) {
        overlay.classList.remove("active", "open");
        overlay.style.display = 'none';
    }
    if (conteudo) {
        conteudo.classList.remove("blur-active");
    }
    
    document.body.style.overflow = 'auto';
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
            if (typeof mostrarFeedback === 'function') {
                mostrarFeedback('erro', 'Ops!', resultado.mensagem || 'Não foi possível favoritar o produto.');
            }
            return;
        }

        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('sucesso', 'Favoritado!', resultado.mensagem || 'Produto adicionado aos favoritos!');
        }

        carregarFavoritos();
        abrirFavoritosEfetivo(); // <-- Abre a gaveta de favoritos em vez do carrinho

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
                <div class="gaveta-vazia" style="text-align: center; padding: 40px 10px; color: #888;">
                    <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: #ff6b81; margin-bottom: 10px;"></i>
                    <p>Faça login para ver seus favoritos.</p>
                </div>`;
            return;
        }

        const dados = await resposta.json();
        lista.innerHTML = "";

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
// 5. MOVER FAVORITOS SELECIONADOS PARA O CARRINHO
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

        if (typeof interacaoCart === "function") {
            interacaoCart();
        }

        if (typeof mostrarFeedback === 'function') {
            mostrarFeedback('sucesso', 'Sucesso!', 'Item(ns) adicionado(s) ao carrinho com sucesso!');
        }
    }
}

function abrirFavoritosEfetivo() {
    const favoritos = document.getElementById("favoritos-container");
    const overlay = document.getElementById("overlay") || document.querySelector('.carrinho-overlay');

    if (typeof fecharAll === 'function') fecharAll();

    if (favoritos) {
        favoritos.style.right = "0px";
        favoritos.classList.add("open", "active");
    }
    if (overlay) {
        overlay.classList.add("active");
        overlay.style.display = 'block';
    }
    document.body.style.overflow = "hidden";
}