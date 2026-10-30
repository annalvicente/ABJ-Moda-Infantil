// SENHA PARA VENDEDORES: VENDEDOR-SISTEMA

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
        modal.style.display = 'flex';
        modal.classList.add('aberto'); 
        
        // Trava o scroll do site
        document.body.style.overflow = 'hidden';
        
        // Define se abre em Login ou Cadastro
        switchAuthMode(mode);
    }
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('aberto');
        
        // Devolve o scroll ao site
        document.body.style.overflow = 'auto';
        limparErrosCampos();
    }
}

// Fechar modal ao clicar na área escura (overlay)
window.addEventListener('click', function (event) {
    const authModal = document.getElementById('authModal');
    const feedbackModal = document.getElementById('feedbackModal');
    
    if (event.target === authModal) {
        closeModal();
    }
    if (event.target === feedbackModal) {
        fecharFeedback();
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

// Configura se é Cliente ou Vendedor
function setUserType(type) {
    currentType = type;
    const isCliente = type === 'cliente';

    document.getElementById('btn-tipo-cliente')?.classList.toggle('active', isCliente);
    document.getElementById('btn-tipo-vendedor')?.classList.toggle('active', !isCliente);

    document.querySelectorAll('.input-tipo-usuario').forEach(input => {
        input.value = type;
    });

    // EXIBIÇÃO DINÂMICA DA CHAVE DE ACESSO DA LOJA
    const grpChave = document.getElementById('grp-cad-chave');
    const inputChave = document.getElementById('cad-chave');

    if (grpChave) {
        if (!isCliente) {
            grpChave.style.display = 'block'; // Mostra o campo se for vendedor
            if (inputChave) inputChave.required = true;
        } else {
            grpChave.style.display = 'none';  // Oculta se for cliente
            if (inputChave) {
                inputChave.required = false;
                inputChave.value = '';        // Limpa o valor digitado
            }
        }
    }

    const btnLogin = document.getElementById('btn-submit-login');
    const btnCad = document.getElementById('btn-submit-cadastro');

    if (isCliente) {
        if (btnLogin) {
            btnLogin.classList.replace('btn-vendedor-color', 'btn-cliente-color');
            btnLogin.innerText = "ENTRAR COMO CLIENTE";
        }
        if (btnCad) {
            btnCad.classList.replace('btn-vendedor-color', 'btn-cliente-color');
            btnCad.innerText = "CADASTRAR CLIENTE";
        }
    } else {
        if (btnLogin) {
            btnLogin.classList.replace('btn-cliente-color', 'btn-vendedor-color');
            btnLogin.innerText = "ENTRAR COMO VENDEDOR";
        }
        if (btnCad) {
            btnCad.classList.replace('btn-cliente-color', 'btn-vendedor-color');
            btnCad.innerText = "CADASTRAR VENDEDOR";
        }
    }
}

// ============================================================
//  FEEDBACK CENTRALIZADO (SUCESSO / ERRO) - PADRÃO MODELO 1
// ============================================================
function mostrarFeedback(tipo, titulo, mensagem, redirectUrl = null) {
    const modal = document.getElementById('feedbackModal');
    const containerIcone = document.getElementById('feedback-icone-container');
    const icone = document.getElementById('feedback-icone');
    const tituloEl = document.getElementById('feedback-titulo');
    const mensagemEl = document.getElementById('feedback-msg');
    const btnOk = document.getElementById('btn-feedback-ok');

    if (!modal || !tituloEl || !mensagemEl) return;

    tituloEl.innerText = titulo;
    mensagemEl.innerText = mensagem;
    pendingRedirect = redirectUrl;

    // Configura ícone circular e cores conforme o tipo (Sucesso / Erro)
    if (tipo === 'erro') {
        if (containerIcone) containerIcone.className = 'icone-circulo-sucesso icone-circulo-erro';
        if (icone) icone.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        if (btnOk) btnOk.className = 'btn-feedback-ok erro';
    } else {
        if (containerIcone) containerIcone.className = 'icone-circulo-sucesso';
        if (icone) icone.innerHTML = '<i class="fa-solid fa-check"></i>';
        if (btnOk) btnOk.className = 'btn-feedback-ok';
    }

    // Exibe o modal centralizado via Flexbox
    modal.style.display = 'flex';
    modal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

function fecharFeedback() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('aberto');
        
        if (!pendingRedirect) {
            document.body.style.overflow = 'auto';
        } else {
            window.location.href = pendingRedirect;
        }
    }
}

// ============================================================
//  LÓGICA DE ENVIO (AJAX)
// ============================================================
async function enviarLogin(event) {
    event.preventDefault(); 

    const form = document.getElementById('form-login');
    const formData = new FormData(form);
    const btn = document.getElementById('btn-submit-login');

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
            mostrarFeedback('sucesso', 'Bem-vindo(a)!', data.mensagem, data.redirect || 'index.php');
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
            mostrarFeedback('sucesso', 'Conta Criada!', data.mensagem, 'index.php');
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
    // Fecha menus laterais, carrinhos, etc.
    document.getElementById('x')?.classList.remove('open', 'active');
    document.getElementById('favoritos-container')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
    
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'none';
}

// ---- GERENCIAMENTO DE COOKIES LGPD ----
function setCookie(nome, valor, dias) {
    let expires = "";
    if (dias) {
        const date = new Date();
        date.setTime(date.getTime() + (dias * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = nome + "=" + (encodeURIComponent(valor) || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(nome) {
    const nameEQ = nome + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    const statusCookie = getCookie('lgpd_aceite');
    const banner = document.getElementById('cookie-banner');

    // Se a pessoa ainda não escolheu, exibe o aviso flutuante
    if (!statusCookie && banner) {
        banner.style.display = 'block';
    }
});

function aceitarCookies(escolha) {
    // Guarda a resposta durante 365 dias
    setCookie('lgpd_aceite', escolha, 365);
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// ---- MUDAR VISIBILIDADE DA SENHA (OLHINHO) ----
function toggleMostrarSenha(inputId, btn) {
    const inputSenha = document.getElementById(inputId);
    if (!inputSenha) return;

    const estaOculto = inputSenha.type === 'password';
    
    // Alterna o tipo do campo
    inputSenha.type = estaOculto ? 'text' : 'password';
    
    // Altera o estilo do ícone
    btn.classList.toggle('active', estaOculto);
    btn.setAttribute('aria-label', estaOculto ? 'Ocultar senha' : 'Mostrar senha');
}