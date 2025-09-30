(function() {
    // Aplica o tema e outras preferências salvas imediatamente para evitar "flash" de conteúdo
    const savedTheme = localStorage.getItem('bidhubTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedFontSize = localStorage.getItem('bidhubFontSize') || 'medium';
    document.body.classList.add(`font-size-${savedFontSize}`);

    const motionPref = localStorage.getItem('bidhubReduceMotion');
    if (motionPref === 'true') {
        document.body.classList.add('reduce-motion');
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMUM DA SIDEBAR E USUÁRIO ---
    // ... (toda a lógica da sidebar e do usuário que já existia aqui permanece igual) ...
    const menuToggle = document.getElementById('menuToggle');
    const sidebarNav = document.getElementById('appSidebar'); 
    if (menuToggle && sidebarNav) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('collapsed');
        });
    }
    const userNameEl = document.getElementById('userName');
    const fullNameInput = document.getElementById('fullName');
    const savedName = localStorage.getItem('bidhubUserName') || 'Marcelo';
    if (userNameEl) {
        userNameEl.textContent = savedName.split(' ')[0];
    }
    if (fullNameInput) {
        fullNameInput.value = savedName;
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear(); // Limpa todas as configurações ao sair
            window.location.href = 'login.html';
        });
    }

    // --- LÓGICA DOS FORMULÁRIOS DE PERFIL E SENHA ---
    // ... (a lógica dos formulários de perfil e senha que já existia aqui permanece igual) ...
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = fullNameInput.value.trim();
            const submitButton = profileForm.querySelector('button[type="submit"]');
            if (newName) {
                localStorage.setItem('bidhubUserName', newName);
                userNameEl.textContent = newName.split(' ')[0];
                submitButton.textContent = 'Perfil Salvo!';
                submitButton.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    submitButton.textContent = 'Salvar Perfil Completo';
                    submitButton.style.backgroundColor = '';
                }, 2000);
            } else {
                alert('O nome não pode ficar em branco.');
            }
        });
    }
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newPassword.length < 6) {
                alert('A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('A nova senha e a confirmação não correspondem.');
                return;
            }
            alert('Senha alterada com sucesso!');
            passwordForm.reset();
        });
    }

    // --- LÓGICA DAS PREFERÊNCIAS DA PLATAFORMA ---
    const themeButtons = document.querySelectorAll('.theme-btn');
    const fontButtons = document.querySelectorAll('.font-btn');
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');

    // Função para definir o tema
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bidhubTheme', theme);
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    // Função para definir o tamanho da fonte
    function setFontSize(size) {
        document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
        document.body.classList.add(`font-size-${size}`);
        localStorage.setItem('bidhubFontSize', size);
        fontButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
    }
    
    // Função para definir preferência de movimento
    function setMotion(enabled) {
         if (enabled) {
            document.body.classList.remove('reduce-motion');
            localStorage.setItem('bidhubReduceMotion', 'false');
            reduceMotionToggle.nextElementSibling.nextElementSibling.textContent = 'Animações Ativadas';
        } else {
            document.body.classList.add('reduce-motion');
            localStorage.setItem('bidhubReduceMotion', 'true');
            reduceMotionToggle.nextElementSibling.nextElementSibling.textContent = 'Animações Reduzidas';
        }
    }


    // Adiciona os eventos de clique
    themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    fontButtons.forEach(btn => btn.addEventListener('click', () => setFontSize(btn.dataset.size)));
    reduceMotionToggle.addEventListener('change', (e) => setMotion(e.target.checked));


    // Sincroniza os controlos com os valores do localStorage no carregamento
    const currentTheme = localStorage.getItem('bidhubTheme') || 'light';
    themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === currentTheme));

    const currentSize = localStorage.getItem('bidhubFontSize') || 'medium';
    fontButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.size === currentSize));

    const motionPrefSaved = localStorage.getItem('bidhubReduceMotion') === 'true';
    reduceMotionToggle.checked = !motionPrefSaved;
    setMotion(!motionPrefSaved);
});