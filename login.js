// ============================================================
//  ESTADO DO MODAL
// ============================================================
let currentType = 'cliente';
let currentMode = 'login';
// Guarda redirect após login bem-sucedido
let pendingRedirect = null;

// ============================================================
//  ABRIR / FECHAR MODAL DE AUTH (LOGIN/CADASTRO)
// ============================================================
function openModal(mode = 'login') {
    fecharTudo();
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.position = 'fixed'; // <--- OBRIGATÓRIO
        modal.style.display = 'flex';   // <--- OBRIGATÓRIO
        switchAuthMode(mode);
    }
}

function mostrarFeedback(tipo, titulo, mensagem, redirectUrl = null) {
    const modal = document.getElementById('feedbackModal');
    if (!modal) return;

    // ... (resto do teu código de preencher textos) ...

    modal.style.position = 'fixed'; // <--- OBRIGATÓRIO
    modal.style.display = 'flex';   // <--- OBRIGATÓRIO
    modal.classList.add('aberto');
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        limparErrosCampos();
    }
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', function (event) {
    const modal = document.getElementById('authModal');
    if (event.target == modal) {
        closeModal();
    }
});

// ============================================================
//  TROCAR ABA LOGIN / CADASTRO
// ============================================================
function switchAuthMode(mode) {
    currentMode = mode;
    const isLogin = mode === 'login';
    
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-cadastro').classList.toggle('active', !isLogin);
    
    // Ajustado para os IDs reais do seu HTML:
    document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
    document.getElementById('form-cadastro').style.display = isLogin ? 'none' : 'block';
}

// ============================================================
//  FEEDBACK CENTRALIZADO
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

    box.classList.remove('sucesso', 'erro');
    box.classList.add(tipo);
    if(btnOk) {
        btnOk.classList.remove('sucesso', 'erro');
        btnOk.classList.add(tipo);
    }

    if(icone) {
        icone.innerHTML = tipo === 'sucesso'
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-xmark"></i>';
    }

    // Garante que o feedback também apareça por cima de tudo
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000000';
    modal.classList.add('aberto');
}

function fecharFeedback() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.remove('aberto');
    }

    if (pendingRedirect) {
        window.location.href = pendingRedirect;
    }
}

// ============================================================
//  LÓGICA DE LOGIN
// ============================================================
async function enviarLogin(event) {
    event.preventDefault(); 

    const form = document.getElementById('form-login');
    const formData = new FormData(form);
    const btn = form.querySelector('.btn-login') || form.querySelector('button[type="submit"]');

    if(btn) {
        btn.innerText = "Entrando...";
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
            mostrarFeedback('sucesso', 'Sucesso! 🎉', data.mensagem, data.redirect || 'index.php');
        } else {
            mostrarFeedback('erro', 'Erro no Login', data.mensagem);
        }
    } catch (err) {
        mostrarFeedback('erro', 'Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
        if(btn) {
            btn.innerText = "Entrar";
            btn.disabled = false;
        }
    }
}

// ============================================================
//  LÓGICA DE CADASTRO
// ============================================================
async function enviarCadastro(event) {
    event.preventDefault();

    const form = document.getElementById('form-cadastro');
    const formData = new FormData(form);
    const btn = document.getElementById('btn-submit-cadastro');

    if(btn) btn.classList.add('carregando');

    try {
        const res = await fetch('cadastro.php', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.status === 'sucesso') {
            closeModal();
            mostrarFeedback('sucesso', 'Cadastro realizado! 🎉', data.mensagem, 'index.php');
        } else {
            mostrarFeedback('erro', 'Não foi possível cadastrar', data.mensagem);
        }
    } catch (err) {
        mostrarFeedback('erro', 'Erro de conexão', 'Falha ao processar cadastro.');
    } finally {
        if(btn) btn.classList.remove('carregando');
    }
}

// ============================================================
//  AUXILIARES E LIMPEZA
// ============================================================
function limparErrosCampos() {
    const inputs = document.querySelectorAll('.login-input, input');
    inputs.forEach(input => input.style.borderColor = '');
}

function fecharTudo() {
    document.getElementById('x')?.classList.remove('open');
    document.getElementById('favoritos-container')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
}