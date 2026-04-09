document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input[required]');
    const mensagem = document.getElementById('msg-validacao');

    // Função que verifica se todos os campos 'required' estão cheios
    function verificarCampos() {
        let todosPreenchidos = true;
        
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                todosPreenchidos = false;
            }
        });

        // Se todos estiverem cheios e a mensagem ainda não apareceu
        if (todosPreenchidos && mensagem.style.display !== 'block') {
            exibirESumirMensagem();
        }
    }

    function exibirESumirMensagem() {
        mensagem.style.display = 'block'; // Mostra
        
        // Timer para sumir após 3 segundos (3000ms)
        setTimeout(() => {
            mensagem.style.opacity = '0';
            mensagem.style.transition = 'opacity 1s';
            
            setTimeout(() => {
                mensagem.style.display = 'none';
                mensagem.style.opacity = '1'; // Reseta para a próxima vez
            }, 1000);
        }, 3000);
    }

    // Adiciona o evento de "escuta" em cada campo de entrada
    inputs.forEach(input => {
        input.addEventListener('input', verificarCampos);
    });
});