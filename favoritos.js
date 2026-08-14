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
    
    // 1. SE NÃO ESTIVER LOGADO (OU DEU ERRO) -> Exibe o Modal Amarelo de Atenção!
    if (!resultado.sucesso) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: resultado.mensagem || 'Você precisa estar logado para favoritar produtos!',
        confirmButtonColor: '#f8c255',
        borderRadius: '15px'
      });
      return;
    }

    // 2. SE ESTIVER LOGADO E ADICIONOU -> Exibe o Modal Verde de Sucesso!
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: resultado.mensagem || 'Produto adicionado aos favoritos!',
      confirmButtonColor: '#2ecc71',
      timer: 2000,
      borderRadius: '15px'
    });

    carregarFavoritos();

  } catch (erro) {
    console.error("Erro ao favoritar:", erro);
    Swal.fire({
      icon: 'error',
      title: 'Ops!',
      text: 'Erro ao conectar com o servidor.',
      confirmButtonColor: '#ff6b81',
      borderRadius: '15px'
    });
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

// ---- REMOVER FAVORITO COM ALERTA ESTILIZADO ----
async function removerFavorito(idFavorito) {
  const confirmacao = await Swal.fire({
    title: 'Remover favorito?',
    text: "Este item será retirado da sua lista de favoritos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff6b81',
    cancelButtonColor: '#ccc',
    confirmButtonText: 'Sim, remover!',
    cancelButtonText: 'Cancelar',
    borderRadius: '20px',
    customClass: {
      popup: 'modal-fofo'
    }
  });

  if (confirmacao.isConfirmed) {
    const formData = new FormData();
    formData.append("id_favorito", idFavorito);

    await fetch("acoesfav.php?acao=remover", { method: "POST", body: formData });
    
    Swal.fire({
      title: 'Removido!',
      text: 'O item foi removido dos favoritos.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      borderRadius: '15px'
    });

    carregarFavoritos();
  }
}

// ---- MOVER SELECIONADOS PARA O CARRINHO ----
async function adicionarFavoritosAoCarrinho() {
  const selecionados = document.querySelectorAll(".fav-checkbox:checked");

  if (selecionados.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Selecione pelo menos um item para adicionar ao carrinho!',
      confirmButtonColor: '#f8c255',
      borderRadius: '15px'
    });
    return;
  }

  for (let checkbox of selecionados) {
    const nome = checkbox.getAttribute("data-nome");
    const preco = checkbox.getAttribute("data-preco");
    
    if (typeof adicionarAoCarrinho === "function") {
      adicionarAoCarrinho(nome, preco);
    }
  }

  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Itens selecionados foram para o carrinho!',
    confirmButtonColor: '#2ecc71',
    timer: 2000,
    borderRadius: '15px'
  });

  fecharFavoritosEFundo();
}