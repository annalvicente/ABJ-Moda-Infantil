// --- SISTEMA DE USUÁRIOS E LOGIN ---
        let usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios_abj_lista')) || [];

        function checarLoginSalvo() {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado_atual'));
            const painel = document.getElementById('painel-admin');
            const statusDiv = document.getElementById('status-usuario');

            if (usuarioLogado) {
                statusDiv.innerHTML = `
                    <p>Olá, <strong>${usuarioLogado.nome}</strong> (${usuarioLogado.tipo}) | 
                    <button onclick="logout()" style="color:red; cursor:pointer; background:none; border:none; text-decoration:underline; font-family:'Quicksand';">Sair</button></p>
                `;
                // Se for vendedor, mostra o painel
                if (usuarioLogado.tipo === 'vendedor') {
                    painel.style.display = "block";
                } else {
                    painel.style.display = "none";
                }
            } else {
                statusDiv.innerHTML = `<p><a href="login.html" style="color: #e94d76; text-decoration: none;">Entrar ou Cadastrar</a></p>`;
                painel.style.display = "none";
            }
        }

        function logout() {
            localStorage.removeItem('usuario_logado_atual');
            location.reload();
        }

        // --- LÓGICA DO ESTOQUE ---
        let produtosLoja = JSON.parse(localStorage.getItem('meusProdutos')) || [
            { id: 1, nome: 'Conjunto Woody', preco: '79.99', img: 'destaque.jpg', estoque: 10, p: '50cm', m: '60cm', g: '70cm' },
            { id: 2, nome: 'Pijama Confort', preco: '65.00', img: 'roupa1.webp.jpeg', estoque: 5, p: '45cm', m: '55cm', g: '65cm' }
        ];

        function salvarEAtualizar() {
            localStorage.setItem('meusProdutos', JSON.stringify(produtosLoja));
            renderizarLoja();
            renderizarEstoqueAdm();
        }

        function renderizarLoja() {
            const vitrine = document.getElementById('vitrine-produtos');
            if(!vitrine) return;
            vitrine.innerHTML = '';
            produtosLoja.forEach(p => {
                vitrine.innerHTML += `
                    <div class="product-card" onclick="abrirDetalhes('${p.nome}', '${p.preco}', '${p.img}', '${p.p}', '${p.m}', '${p.g}')">
                        <img src="${p.img}" alt="${p.nome}" style="width: 100%; border-radius: 15px; margin-bottom: 15px;">
                        <h3 style="font-family: 'Quicksand'; font-size: 1.1rem;">${p.nome}</h3>
                        <p style="color: #ff69b4; font-weight: 700; font-size: 1.2rem; margin-bottom: 5px;">R$ ${p.preco}</p>
                        <p style="font-size: 0.8rem; color: #888; margin-bottom: 10px;">Estoque: ${p.estoque} un</p>
                        <button class="btn-adicionar" onclick="event.stopPropagation(); comprar(${p.id})">
                            ${p.estoque > 0 ? '<i class="fa-solid fa-cart-shopping"></i> Adicionar' : 'Esgotado'}
                        </button>
                    </div>
                `;
            });
        }

        function renderizarEstoqueAdm() {
            const tabela = document.getElementById('lista-estoque-adm');
            if(!tabela) return;
            tabela.innerHTML = '';
            produtosLoja.forEach(p => {
                tabela.innerHTML += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${p.nome}</td>
                        <td><input type="number" value="${p.estoque}" onchange="editarEstoque(${p.id}, this.value)" style="width: 50px;"></td>
                        <td>R$ ${p.preco}</td>
                        <td><button onclick="removerProduto(${p.id})" style="color: red; border:none; background:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
                    </tr>
                `;
            });
        }

        document.getElementById('form-cadastro').addEventListener('submit', (e) => {
            e.preventDefault();
            const novo = {
                id: Date.now(),
                nome: document.getElementById('adm-nome').value,
                preco: document.getElementById('adm-preco').value,
                img: document.getElementById('adm-img').value,
                estoque: parseInt(document.getElementById('adm-estoque').value),
                p: document.getElementById('adm-p').value || 'N/A',
                m: document.getElementById('adm-m').value || 'N/A',
                g: document.getElementById('adm-g').value || 'N/A'
            };
            produtosLoja.push(novo);
            salvarEAtualizar();
            e.target.reset();
        });

        function comprar(id) {
            const p = produtosLoja.find(i => i.id === id);
            if (p && p.estoque > 0) {
                p.estoque--;
                if(typeof adicionarAoCarrinho === "function") adicionarAoCarrinho(p.nome, parseFloat(p.preco));
                salvarEAtualizar();
            } else { alert("Produto esgotado!"); }
        }

        function abrirDetalhes(nome, preco, img, p, m, g) {
            document.getElementById('modal-nome').innerText = nome;
            document.getElementById('modal-preco').innerText = 'R$ ' + preco;
            document.getElementById('modal-img').src = img;
            document.getElementById('med-p').innerText = p;
            document.getElementById('med-m').innerText = m;
            document.getElementById('med-g').innerText = g;
            document.getElementById('modal-produto').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function fecharTudo() {
            document.getElementById('modal-produto').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        function editarEstoque(id, valor) {
            const p = produtosLoja.find(i => i.id === id);
            if(p) p.estoque = parseInt(valor);
            salvarEAtualizar();
        }

        function removerProduto(id) {
            produtosLoja = produtosLoja.filter(i => i.id !== id);
            salvarEAtualizar();
        }

        // Inicialização ao carregar a página
        window.onload = function() {
            checarLoginSalvo();
            renderizarLoja();
            renderizarEstoqueAdm();
        };

        async function carregarProdutosDoBanco() {
            try {
                const resposta = await fetch('listar_produtos.php');
                const produtos = await resposta.json();
                
                const container = document.getElementById('lista-produtos');
                container.innerHTML = ''; 

                produtos.forEach(p => {
                    container.innerHTML += `
                        <div class="product-card">
                            <img src="${p.imagem}" alt="${p.nome}">
                            <h3>${p.nome}</h3>
                            <p class="price">R$ ${p.preco}</p>
                            <button onclick="adicionarAoCarrinho(${p.id})">Comprar</button>
                        </div>
                    `;
                });
            } catch (erro) {
                console.error("Erro ao carregar produtos:", erro);
            }
        }

        // Inicia a carga assim que a página abre
        document.addEventListener('DOMContentLoaded', carregarProdutosDoBanco);