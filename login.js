 // ============================================================
        //  ESTADO DO MODAL
        // ============================================================
        let currentType = 'cliente';
        let currentMode = 'login';
        // Guarda redirect após login bem-sucedido
        let pendingRedirect = null;

        // ============================================================
        //  ABRIR / FECHAR MODAL DE AUTH
        // ============================================================
        function openModal(mode = 'login') {
            fecharTudo();
            document.getElementById('authModal').style.display = 'flex';
            switchAuthMode(mode);
        }

        function closeModal() {
            document.getElementById('authModal').style.display = 'none';
            limparErrosCampos();
        }

        window.addEventListener('click', function (event) {
            const modal = document.getElementById('authModal');
            if (event.target == modal) closeModal();
        });

        // ============================================================
        //  TROCAR ABA LOGIN / CADASTRO
        // ============================================================
        function switchAuthMode(mode) {
            currentMode = mode;
            const isLogin = mode === 'login';
            document.getElementById('tab-login').classList.toggle('active', isLogin);
            document.getElementById('tab-cadastro').classList.toggle('active', !isLogin);
            document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
            document.getElementById('form-cadastro').style.display = isLogin ? 'none' : 'block';
            limparErrosCampos();
            updateVisuals();
        }

        // ============================================================
        //  TROCAR TIPO: CLIENTE / VENDEDOR
        // ============================================================
        function setUserType(type) {
            currentType = type;
            document.getElementById('btn-tipo-cliente').classList.toggle('active', type === 'cliente');
            document.getElementById('btn-tipo-vendedor').classList.toggle('active', type === 'vendedor');
            document.querySelectorAll('.input-tipo-usuario').forEach(input => input.value = type);
            updateVisuals();
        }

        function updateVisuals() {
            const label = currentType === 'cliente' ? 'CLIENTE' : 'VENDEDOR';
            const isVendedor = currentType === 'vendedor';

            const loginBtn = document.getElementById('btn-submit-login');
            const cadastroBtn = document.getElementById('btn-submit-cadastro');
            loginBtn.innerText = `ENTRAR COMO ${label}`;
            cadastroBtn.innerText = `CADASTRAR ${label}`;

            const cls = isVendedor ? 'btn-vendedor-color' : 'btn-cliente-color';
            const rem = isVendedor ? 'btn-cliente-color' : 'btn-vendedor-color';
            loginBtn.classList.replace(rem, cls) || loginBtn.classList.add(cls);
            cadastroBtn.classList.replace(rem, cls) || cadastroBtn.classList.add(cls);
        }

        // ============================================================
        //  MÁSCARAS DE CPF E TELEFONE
        // ============================================================
        document.addEventListener('DOMContentLoaded', () => {
            const cpfInput = document.getElementById('cad-cpf');
            const telInput = document.getElementById('cad-tel');

            cpfInput.addEventListener('input', function () {
                let v = this.value.replace(/\D/g, '').slice(0, 11);
                if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                this.value = v;
            });

            telInput.addEventListener('input', function () {
                let v = this.value.replace(/\D/g, '').slice(0, 11);
                if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
                else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
                this.value = v;
            });
        });

        // ============================================================
        //  VALIDAÇÃO INLINE
        // ============================================================
        function validarCampo(id, grupoId, condicao) {
            const grp = document.getElementById(grupoId);
            if (!grp) return true;
            const ok = condicao(document.getElementById(id)?.value ?? '');
            grp.classList.toggle('invalido', !ok);
            return ok;
        }

        function limparErrosCampos() {
            document.querySelectorAll('.input-group.invalido').forEach(el => el.classList.remove('invalido'));
        }

        // ============================================================
        //  MODAL DE FEEDBACK (SUCESSO / ERRO)
        // ============================================================
        function mostrarFeedback(tipo, titulo, mensagem, redirectUrl) {
            const modal = document.getElementById('feedbackModal');
            const box = document.getElementById('feedback-box');
            const icone = document.getElementById('feedback-icone');
            const tit = document.getElementById('feedback-titulo');
            const msg = document.getElementById('feedback-msg');
            const btn = document.getElementById('btn-feedback-ok');

            // Remove classes anteriores
            box.classList.remove('sucesso', 'erro');
            btn.classList.remove('sucesso', 'erro');

            box.classList.add(tipo);
            btn.classList.add(tipo);

            icone.innerHTML = tipo === 'sucesso'
                ? '<i class="fa-solid fa-circle-check"></i>'
                : '<i class="fa-solid fa-circle-xmark"></i>';
            tit.innerText = titulo;
            msg.innerText = mensagem;

            pendingRedirect = redirectUrl || null;
            modal.classList.add('aberto');
        }

        function fecharFeedback() {
            document.getElementById('feedbackModal').classList.remove('aberto');
            if (pendingRedirect) {
                window.location.href = pendingRedirect;
                pendingRedirect = null;
            }
        }

        // ============================================================
        //  ENVIO DO LOGIN VIA FETCH
        // ============================================================
        async function enviarLogin(e) {
            e.preventDefault();

            // Validação client-side
            const emailOk = validarCampo('login-email', 'grp-login-email', v => v.includes('@') && v.length > 4);
            const senhaOk = validarCampo('login-senha', 'grp-login-senha', v => v.length >= 1);
            if (!emailOk || !senhaOk) return;

            const btn = document.getElementById('btn-submit-login');
            btn.classList.add('carregando');

            const form = document.getElementById('form-login');
            const formData = new FormData(form);

            try {
                const res = await fetch('login.php', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.status === 'sucesso') {
                    closeModal();
                    mostrarFeedback('sucesso', 'Bem-vindo(a)! 🎉', data.mensagem, data.redirect);
                } else {
                    mostrarFeedback('erro', 'Ops! Algo deu errado', data.mensagem);
                }
            } catch (err) {
                mostrarFeedback('erro', 'Erro de conexão', 'Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                btn.classList.remove('carregando');
            }
        }

        // ============================================================
        //  ENVIO DO CADASTRO VIA FETCH
        // ============================================================
        async function enviarCadastro(e) {
            e.preventDefault();

            // Validações client-side
            const nomeOk = validarCampo('cad-nome', 'grp-cad-nome', v => v.trim().length >= 2);
            const emailOk = validarCampo('cad-email', 'grp-cad-email', v => v.includes('@') && v.length > 4);
            const cpfOk = validarCampo('cad-cpf', 'grp-cad-cpf', v => v === '' || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v));
            const telOk = validarCampo('cad-tel', 'grp-cad-tel', v => v === '' || v.replace(/\D/g, '').length >= 10);
            const senhaOk = validarCampo('cad-senha', 'grp-cad-senha', v => v.length >= 6);

            if (!nomeOk || !emailOk || !cpfOk || !telOk || !senhaOk) return;

            const btn = document.getElementById('btn-submit-cadastro');
            btn.classList.add('carregando');

            const form = document.getElementById('form-cadastro');
            const formData = new FormData(form);

            try {
                const res = await fetch('cadastro.php', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.status === 'sucesso') {
                    closeModal();
                    mostrarFeedback('sucesso', 'Cadastro realizado! 🎉', data.mensagem);
                } else {
                    mostrarFeedback('erro', 'Não foi possível cadastrar', data.mensagem);
                }
            } catch (err) {
                mostrarFeedback('erro', 'Erro de conexão', 'Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                btn.classList.remove('carregando');
            }
        }

        // ============================================================
        //  FECHAR PAINÉIS LATERAIS
        // ============================================================
        function fecharTudo() {
            document.getElementById('side-cart')?.classList.remove('open');
            document.getElementById('favoritos-container')?.classList.remove('open');
            document.getElementById('overlay')?.classList.remove('active');
        }