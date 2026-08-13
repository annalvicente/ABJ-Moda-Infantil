// ============================================================
// FAVORITOS — favoritos.js
// ============================================================

// ---- CARREGAR AUTOMATICAMENTE AO ABRIR A PÁGINA ----
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("lista-favoritos")) {
    carregarFavoritos();
  }
});

// ---- TOGGLE FAVORITOS ----
function toggleFavoritos() {
  const favoritos = document.getElementById("favoritos-container");
  if (!favoritos) return;

  const estaAberto = favoritos.style.right === "0px" || favoritos.classList.contains("open");
  if (estaAberto) {
    fecharFavoritosEFundo();
  } else {
    abrirFavoritos();
  }
}

// ---- ABRIR FAVORITOS ----
function abrirFavoritos() {
  const favoritos = document.getElementById("favoritos-container");
  const overlay = document.getElementById("overlay");
  const conteudo = document.querySelector(".conteudo-principal");

  if (!favoritos) return;

  const carrinho = document.getElementById("x");
  if (carrinho) {
    carrinho.style.right = "-450px";
    carrinho.classList.remove("open");
  }

  favoritos.style.right = "0px";
  favoritos.classList.add("open");
  if (overlay) overlay.classList.add("active");
  if (conteudo) conteudo.classList.add("blur-active");

  carregarFavoritos();
}

// ---- FECHAR FAVORITOS E LIMPAR OVERLAY ----
function fecharFavoritosEFundo() {
  const favoritos = document.getElementById("favoritos-container");
  const overlay = document.getElementById("overlay");
  const conteudo = document.querySelector(".conteudo-principal");

  if (favoritos) {
    favoritos.style.right = "-450px";
    favoritos.classList.remove("open");
  }
  if (overlay) {
    overlay.classList.remove("active");
  }
  if (conteudo) {
    conteudo.classList.remove("blur-active");
  }
}

// ---- ADICIONAR UM PRODUTO AOS FAVORITOS (VIA BANCO) ----
async function adicionarAoFavorito(idProduto) {
  const formData = new FormData();
  formData.append("id_produto", idProduto);

  try {
    const resposta = await fetch("acoesfav.php?acao=adicionar", {
      method: "POST",
      body: formData
    });
    
    const resultado = await resposta.json();
    
    if (resultado.sucesso) {
      alert("Produto adicionado aos favoritos!");
      carregarFavoritos();
    } else {
      alert(resultado.mensagem || "Faça login para favoritar produtos!");
    }
  } catch (erro) {
    console.error("Erro ao favoritar:", erro);
    alert("Erro ao salvar nos favoritos.");
  }
}

// ---- CARREGAR FAVORITOS DO SERVIDOR ----
async function carregarFavoritos() {
  const lista = document.getElementById("lista-favoritos");
  if (!lista) return;

  lista.innerHTML = `
    <div class="gaveta-vazia">
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <p>Carregando favoritos...</p>
    </div>`;

  try {
    const resposta = await fetch("acoesfav.php?acao=listar");
    if (!resposta.ok) throw new Error("Erro na requisição");

    const dados = await resposta.json();
    lista.innerHTML = "";

    if (!dados.sucesso || !dados.itens || dados.itens.length === 0) {
      lista.innerHTML = `
        <div class="gaveta-vazia">
          <i class="fa-regular fa-heart"></i>
          <p>Sua lista de favoritos está vazia.</p>
        </div>`;
      return;
    }

    dados.itens.forEach((p) => {
      const div = document.createElement("div");
      div.className = "fav-item-single";
      div.innerHTML = `
        <div class="fav-item-info">
          <input type="checkbox" class="fav-checkbox" value="${p.id_favorito}" data-nome="${p.nome}" data-preco="${p.preco}">
          <img src="img/${p.imagem}" alt="${p.nome}">
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
      <div class="gaveta-vazia">
        <i class="fa-regular fa-heart"></i>
        <p>Faça login para ver seus favoritos.</p>
      </div>`;
    console.warn("Favoritos:", error.message);
  }
}

// ---- REMOVER FAVORITO ----
async function removerFavorito(idFavorito) {
  if (!confirm("Deseja remover este item dos favoritos?")) return;

  const formData = new FormData();
  formData.append("id_favorito", idFavorito);

  await fetch("acoesfav.php?acao=remover", { method: "POST", body: formData });
  carregarFavoritos();
}

// ---- MOVER SELECIONADOS PARA O CARRINHO ----
async function adicionarFavoritosAoCarrinho() {
  const selecionados = document.querySelectorAll(".fav-checkbox:checked");

  if (selecionados.length === 0) {
    alert("Selecione pelo menos um item!");
    return;
  }

  for (let checkbox of selecionados) {
    const nome = checkbox.getAttribute("data-nome");
    const preco = checkbox.getAttribute("data-preco");
    
    if (typeof adicionarAoCarrinho === "function") {
      adicionarAoCarrinho(nome, preco);
    }
  }

  alert("Itens selecionados adicionados ao carrinho!");
  fecharFavoritosEFundo();
}