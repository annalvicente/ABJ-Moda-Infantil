// ============================================================
//  ESTADO DO MODAL E VARIÁVEIS GLOBAIS
// ============================================================
let currentType = 'cliente';
let currentMode = 'login';
let pendingRedirect = null;

// ============================================================
//  ABRIR / FECHAR MODAL DE AUTH (LOGIN/CADASTRO)
// ============================================================
function openModal(mode = 'login') {
    // Fecha outros elementos abertos (carrinho, favoritos)
    fecharTudo();
    
    const modal = document.getElementById('authModal');
    if (modal) {
        // Força o posicionamento e exibição
        modal.style.display = 'flex';
        
        // Trava o scroll do site ao fundo para o usuário não se perder
        document.body.style.overflow = 'hidden';
        
        // Define se abre em Login ou Cadastro
        switchAuthMode(mode);
    }
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        // Devolve o scroll ao site
        document.body.style.overflow = 'auto';
        limparErrosCampos();
    }
}

// Fechar modal ao clicar na área escura (overlay)
window.addEventListener('click', function (event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeModal();
    }
});

// ============================================================
//  TROCAR ABA LOGIN / CADASTRO
// ============================================================
function switchAuthMode(mode) {
    currentMode = mode;
    const isLogin = mode === 'login';
    
    const tabLogin = document.getElementById('tab-login');
    const tabCad = document.getElementById('tab-cadastro');
    const formLogin = document.getElementById('form-login');
    const formCad = document.getElementById('form-cadastro');

    if (tabLogin) tabLogin.classList.toggle('active', isLogin);
    if (tabCad) tabCad.classList.toggle('active', !isLogin);
    
    if (formLogin) formLogin.style.display = isLogin ? 'block' : 'none';
    if (formCad) formCad.style.display = isLogin ? 'none' : 'block';
}

// Configura se é Cliente ou Vendedor (ajustando cores e inputs hidden)
function setUserType(type) {
    currentType = type;
    const isCliente = type === 'cliente';

    // Ajusta botões de seleção de tipo
    document.getElementById('btn-tipo-cliente')?.classList.toggle('active', isCliente);
    document.getElementById('btn-tipo-vendedor')?.classList.toggle('active', !isCliente);

    // Atualiza os inputs hidden nos formulários
    document.querySelectorAll('.input-tipo-usuario').forEach(input => {
        input.value = type;
    });

    // Ajusta visual dos botões de submit
    const btnLogin = document.getElementById('btn-submit-login');
    const btnCad = document.getElementById('btn-submit-cadastro');

    if (isCliente) {
        btnLogin?.classList.replace('btn-vendedor-color', 'btn-cliente-color');
        btnCad?.classList.replace('btn-vendedor-color', 'btn-cliente-color');
        if (btnLogin) btnLogin.innerText = "ENTRAR COMO CLIENTE";
        if (btnCad) btnCad.innerText = "CADASTRAR CLIENTE";
    } else {
        btnLogin?.classList.replace('btn-cliente-color', 'btn-vendedor-color');
        btnCad?.classList.replace('btn-cliente-color', 'btn-vendedor-color');
        if (btnLogin) btnLogin.innerText = "ENTRAR COMO VENDEDOR";
        if (btnCad) btnCad.innerText = "CADASTRAR VENDEDOR";
    }
}

// ============================================================
//  FEEDBACK CENTRALIZADO (SUCESSO / ERRO)
// ============================================================
function mostrarFeedback(tipo, titulo, mensagem, redirectUrl = null) {
    const modal = document.getElementById('feedbackModal');
    const box = document.getElementById('feedback-box');
    const icone = document.getElementById('feedback-icone');
    const tituloEl = document.getElementById('feedback-titulo');
    const mensagemEl = document.getElementById('feedback-msg');
    const btnOk = document.getElementById('btn-feedback-ok');

    if (!modal || !tituloEl || !mensagemEl) return;

    tituloEl.innerText = titulo;
    mensagemEl.innerText = mensagem;
    pendingRedirect = redirectUrl;

    // Ajusta cores do alerta
    box.className = 'feedback-box ' + tipo;
    if (btnOk) btnOk.className = 'btn-feedback-ok ' + tipo;

    if (icone) {
        icone.innerHTML = tipo === 'sucesso'
            ? '<i class="fa-solid fa-circle-check" style="color: #27ae60;"></i>'
            : '<i class="fa-solid fa-circle-xmark" style="color: #e74c3c;"></i>';
    }

    // Exibe o modal de feedback
    modal.style.display = 'flex';
    modal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

function fecharFeedback() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('aberto');
        if (!pendingRedirect) document.body.style.overflow = 'auto';
    }

    if (pendingRedirect) {
        window.location.href = pendingRedirect;
    }
}

// ============================================================
//  LÓGICA DE ENVIO (AJAX)
// ============================================================
async function enviarLogin(event) {
    event.preventDefault(); 

    const form = document.getElementById('form-login');
    const formData = new FormData(form);
    const btn = form.querySelector('button[type="submit"]');

    if (btn) {
        btn.innerText = "Validando...";
        btn.disabled = true;
    }

    try {
        const res = await fetch('login.php', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.status === 'sucesso') {
            closeModal();
            mostrarFeedback('sucesso', 'Bem-vindo(a)! 🎉', data.mensagem, data.redirect || 'index.php');
        } else {
            mostrarFeedback('erro', 'Ops!', data.mensagem);
        }
    } catch (err) {
        mostrarFeedback('erro', 'Erro de conexão', 'Não foi possível falar com o servidor.');
    } finally {
        if (btn) {
            btn.innerText = currentType === 'cliente' ? "ENTRAR COMO CLIENTE" : "ENTRAR COMO VENDEDOR";
            btn.disabled = false;
        }
    }
}

async function enviarCadastro(event) {
    event.preventDefault();

    const form = document.getElementById('form-cadastro');
    const formData = new FormData(form);
    const btn = document.getElementById('btn-submit-cadastro');

    if (btn) {
        btn.innerText = "Processando...";
        btn.disabled = true;
    }

    try {
        const res = await fetch('cadastro.php', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.status === 'sucesso') {
            closeModal();
            mostrarFeedback('sucesso', 'Conta Criada! 🎉', data.mensagem, 'index.php');
        } else {
            mostrarFeedback('erro', 'Erro no Cadastro', data.mensagem);
        }
    } catch (err) {
        mostrarFeedback('erro', 'Erro de conexão', 'Falha ao processar seus dados.');
    } finally {
        if (btn) {
            btn.innerText = currentType === 'cliente' ? "CADASTRAR CLIENTE" : "CADASTRAR VENDEDOR";
            btn.disabled = false;
        }
    }
}

// ============================================================
//  AUXILIARES
// ============================================================
function limparErrosCampos() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.style.borderColor = '');
}

function fecharTudo() {
    // Fecha menus laterais se existirem
    document.getElementById('x')?.classList.remove('open', 'active');
    document.getElementById('favoritos-container')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
    document.getElementById('overlay')?.style.setProperty('display', 'none');
}