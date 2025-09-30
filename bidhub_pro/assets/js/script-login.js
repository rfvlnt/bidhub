document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // 1. Impede o envio padrão do formulário, que apenas recarregaria a página.
            event.preventDefault();

            // 2. Simulação de Login:
            // Em um site real, aqui você enviaria os dados para um servidor.
            // Para nosso exemplo, vamos assumir que o login foi bem-sucedido.
            
            // 3. Guarda o status de "logado" na memória do navegador (sessionStorage).
            // Isso dura apenas enquanto a aba do navegador estiver aberta.
            sessionStorage.setItem('loggedIn', 'true');

            // 4. Redireciona o usuário para o dashboard.
            window.location.href = 'dashboard.html';
        });
    }
});