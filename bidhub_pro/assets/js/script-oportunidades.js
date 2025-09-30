document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA SIDEBAR RETRÁTIL ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebarNav = document.getElementById('appSidebar'); 
    if (menuToggle && sidebarNav) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('collapsed');
        });
    }

    // --- LÓGICA DE LOGIN E USUÁRIO ---
    const userNameEl = document.getElementById('userName');
    const user = { name: "Marcelo" };
    if (userNameEl && user && user.name) {
        userNameEl.textContent = user.name.split(' ')[0];
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedIn');
            window.location.href = 'login.html';
        });
    }

    // --- LÓGICA DE FILTROS E CARDS ---
    const propertyGrid = document.getElementById('propertyGrid');
    const allFilters = document.querySelectorAll('#searchInput, #filterTipoImovel, #filterEstado, #filterTipoLeilao, #filterValorMin, #filterValorMax');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const resultsCountEl = document.getElementById('resultsCount');

    // Dados de exemplo que viriam de uma API
const allProperties = [
    // Expira em 2 dias - OK
    { id: 1, title: 'Apartamento em Copacabana', type: 'Apartamento', state: 'RJ', auctionType: 'Judicial', price: 350000, location: 'Rio de Janeiro, RJ', image: 'https://images.unsplash.com/photo-1598300188943-9614051b14a6?w=400', encerramento: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), incremento: 5000 },
    // Expira em 12 horas - Atenção
    { id: 2, title: 'Casa em Interlagos', type: 'Casa', state: 'SP', auctionType: 'Extrajudicial', price: 580000, location: 'São Paulo, SP', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400', encerramento: new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toISOString(), incremento: 10000 },
    // Expira em 30 minutos - Urgente
    { id: 3, title: 'Loja no Centro', type: 'Comercial', state: 'MG', auctionType: 'Judicial', price: 210000, location: 'Belo Horizonte, MG', image: 'https://images.unsplash.com/photo-1579222867851-353d3f23a8e7?w=400', encerramento: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(), incremento: 2000 },
    // Já expirado
    { id: 4, title: 'Terreno em Alphaville', type: 'Terreno', state: 'SP', auctionType: 'Extrajudicial', price: 750000, location: 'Barueri, SP', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400', encerramento: new Date(new Date().getTime() - 60 * 60 * 1000).toISOString(), incremento: 15000 },
    { id: 5, title: 'Apartamento na Pampulha', type: 'Apartamento', state: 'MG', auctionType: 'Judicial', price: 290000, location: 'Belo Horizonte, MG', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', encerramento: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), incremento: 5000 },
    { id: 6, title: 'Casa de Praia em Búzios', type: 'Casa', state: 'RJ', auctionType: 'Extrajudicial', price: 950000, location: 'Búzios, RJ', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400', encerramento: new Date(new Date().getTime() + 20 * 60 * 1000).toISOString(), incremento: 20000 }
];

    function parseValue(value) {
        if (typeof value !== 'string') value = String(value);
        return parseFloat(value.replace(/[^0-9,]+/g, "").replace(/\./g, '').replace(",", ".")) || 0;
    }

    function applyFilters() {
        const filters = {
            search: document.getElementById('searchInput').value.toLowerCase(),
            type: document.getElementById('filterTipoImovel').value,
            state: document.getElementById('filterEstado').value,
            auctionType: document.getElementById('filterTipoLeilao').value,
            minPrice: parseValue(document.getElementById('filterValorMin').value) || 0,
            maxPrice: parseValue(document.getElementById('filterValorMax').value) || Infinity
        };

        const filteredProperties = allProperties.filter(prop => {
            const searchMatch = prop.title.toLowerCase().includes(filters.search) || prop.location.toLowerCase().includes(filters.search);
            const typeMatch = filters.type ? prop.type === filters.type : true;
            const stateMatch = filters.state ? prop.state === filters.state : true;
            const auctionTypeMatch = filters.auctionType ? prop.auctionType === filters.auctionType : true;
            const priceMatch = prop.price >= filters.minPrice && prop.price <= filters.maxPrice;
            return searchMatch && typeMatch && stateMatch && auctionTypeMatch && priceMatch;
        });

        renderProperties(filteredProperties);
    }

    function renderProperties(properties) {
    propertyGrid.innerHTML = '';
    resultsCountEl.textContent = properties.length;
    if (properties.length > 0) {
        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${prop.image}" alt="${prop.title}">
                    <div class="property-id">ID: ${prop.id}</div>
                    <div id="countdown-card-${prop.id}" class="auction-timer"></div>
                </div>
                <div class="card-content">
                    <h4>${prop.title}</h4>
                    <p class="card-location"><span class="material-icons">location_on</span>${prop.location}</p>
                    <div class="card-footer">
                        <div class="card-value">
                            <p>Lance Inicial</p>
                            <span>${prop.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div class="increment-value">
                            <p>Incremento</p>
                            <span>+ ${prop.incremento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => { window.location.href = `detalhes.html?id=${prop.id}`; });
            propertyGrid.appendChild(card);
        });
    } else {
        propertyGrid.innerHTML = '<p class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">Nenhuma oportunidade encontrada com os filtros selecionados.</p>';
    }
    // Inicia os contadores para os cards recém-renderizados
    updateCardCountdowns();
}
    
// --- LÓGICA DOS BOTÕES DE FILTRO ---
const applyFiltersBtn = document.getElementById('applyFiltersBtn');

if(applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
}

clearFiltersBtn.addEventListener('click', () => {
    allFilters.forEach(input => {
        if(input.tagName === 'SELECT') {
            input.value = '';
        } else {
            input.value = '';
        }
    });
    // Após limpar, aplicamos os filtros para mostrar a lista completa novamente
    applyFilters();
});

    clearFiltersBtn.addEventListener('click', () => {
        allFilters.forEach(input => {
            if(input.tagName === 'SELECT') {
                input.value = '';
            } else {
                input.value = '';
            }
        });
        applyFilters();
    });

    // Carga inicial
    applyFilters();
    // --- LÓGICA DO CONTADOR REGRESSIVO PARA OS CARDS ---
    function updateCardCountdowns() {
    const activeTimers = document.querySelectorAll('.auction-timer');
    if (activeTimers.length === 0) return;

    allProperties.forEach(prop => {
        const timerEl = document.getElementById(`countdown-card-${prop.id}`);
        if (!timerEl) return;

        const endTime = new Date(prop.encerramento).getTime();
        const now = new Date().getTime();
        const distance = endTime - now;

        // Lógica de Cores (permanece a mesma)
        timerEl.classList.remove('timer-ok', 'timer-warning', 'timer-urgent', 'timer-expired');
        
        if (distance < 0) {
            timerEl.innerHTML = `<span class="material-icons">timer_off</span> Expirado`;
            timerEl.classList.add('timer-expired');
        } else {
            // Cálculos do tempo
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // *** ESTA É A PARTE QUE MUDOU ***
            // Agora exibimos todos os valores de uma vez, formatados com 2 dígitos.
            timerEl.innerHTML = `
                <span class="material-icons">timer</span>
                ${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s
            `;

            // A lógica para definir a cor de fundo continua baseada no tempo geral
            if (days > 0) {
                timerEl.classList.add('timer-ok');
            } else if (hours > 0) {
                timerEl.classList.add('timer-warning');
            } else {
                timerEl.classList.add('timer-urgent');
            }
        }
    });
}

    // Inicia a atualização contínua dos contadores
    setInterval(updateCardCountdowns, 1000);
});