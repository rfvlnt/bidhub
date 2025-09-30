document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA SIDEBAR ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('appSidebar');
    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = (localStorage.getItem('bidhubUserName') || 'Usuário').split(' ')[0];


    // --- DADOS E RENDERIZAÇÃO DA TABELA DE FAVORITOS ---
    const tbody = document.getElementById('favorite-auctions-body');
    const favoriteAuctions = [
        { id: 1, imovel: 'Apartamento em Copacabana', localizacao: 'Rio de Janeiro, RJ', lanceAtual: 'R$ 1.250.000', status: 'Aberto', encerramento: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toISOString(), meuLance: 1260000 },
        { id: 2, imovel: 'Casa em Interlagos', localizacao: 'São Paulo, SP', lanceAtual: 'R$ 400.000', status: 'Aberto', encerramento: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5).toISOString(), meuLance: 0 },
        { id: 3, imovel: 'Cobertura Duplex', localizacao: 'Porto Alegre, RS', lanceAtual: 'R$ 980.000', status: 'Fechado', encerramento: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1).toISOString(), meuLance: 950000 }
    ];

    function renderFavoriteAuctions() {
        if (!tbody) return;
        tbody.innerHTML = ''; 
        favoriteAuctions.forEach(auction => {
            const tr = document.createElement('tr');
            tr.className = 'auction-row';
            tr.addEventListener('click', () => { window.location.href = `detalhes.html?id=${auction.id}`; });
            const meuLanceFormatado = auction.meuLance > 0 ? auction.meuLance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
            const statusBadgeClass = auction.status.toLowerCase() === 'aberto' ? 'pending' : 'closed';
            tr.innerHTML = `<td>${auction.imovel}</td><td>${auction.localizacao}</td><td>${auction.lanceAtual}</td><td id="countdown-${auction.id}"></td><td style="text-align: right; font-weight: 500;">${meuLanceFormatado}</td><td><span class="status-badge ${statusBadgeClass}">${auction.status}</span></td>`;
            tbody.appendChild(tr);
        });
    }

    function updateCountdowns() {
        favoriteAuctions.forEach(auction => {
            const el = document.getElementById(`countdown-${auction.id}`);
            if (!el) return;
            const distance = new Date(auction.encerramento).getTime() - new Date().getTime();
            if (distance < 0) { el.innerHTML = "Encerrado"; return; }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            el.innerHTML = `${days} dia(s)`;
        });
    }

    if (tbody) {
        renderFavoriteAuctions();
        updateCountdowns();
        setInterval(updateCountdowns, 60000);
    }
    
    // --- LÓGICA DO CALENDÁRIO ---
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const currentMonthYearEl = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');

    if (calendarDaysGrid) {
        let currentDate = new Date();
        const renderCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    currentMonthYearEl.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
    calendarDaysGrid.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    // Preenche os dias do mês anterior
    for (let i = firstDayOfMonth; i > 0; i--) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.innerHTML = `<span>${lastDateOfPrevMonth - i + 1}</span>`;
        calendarDaysGrid.appendChild(dayEl);
    }

    // Preenche os dias do mês atual
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerHTML = `<span class="day-number">${i}</span>`;
        
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('current-day');
        }

        // NOVA LÓGICA: Em vez de criar um elemento de texto, apenas adiciona uma classe e um título.
        const auctionsOnThisDay = favoriteAuctions.filter(auction => {
            const auctionDate = new Date(auction.encerramento);
            return auctionDate.getDate() === i && auctionDate.getMonth() === month && auctionDate.getFullYear() === year;
        });

        if (auctionsOnThisDay.length > 0) {
            dayEl.classList.add('has-event');
            // Cria uma lista de títulos para o tooltip
            const titles = auctionsOnThisDay.map(a => a.imovel).join(', ');
            dayEl.setAttribute('title', titles);
            
            // Adiciona o clique para levar ao primeiro leilão do dia
            dayEl.addEventListener('click', () => {
                window.location.href = `detalhes.html?id=${auctionsOnThisDay[0].id}`;
            });
        }

        calendarDaysGrid.appendChild(dayEl);
    }
};
        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); });
        renderCalendar(currentDate);
    }

    // --- LÓGICA PARA ROLAGEM SUAVE ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
// --- LÓGICA PARA ORDENAÇÃO DA TABELA DE FAVORITOS ---
let currentSortColumn = null;
let currentSortDirection = 'asc';

const sortableHeaders = document.querySelectorAll('th.sortable');

sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const sortKey = header.dataset.sort;

        // Se clicar na mesma coluna, inverte a direção. Senão, define como ascendente.
        if (currentSortColumn === sortKey) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = sortKey;
            currentSortDirection = 'asc';
        }

        // Ordena o array de dados
        favoriteAuctions.sort((a, b) => {
            let valA, valB;

            // Define como obter os valores para cada tipo de coluna
            switch (sortKey) {
                case 'encerramento':
                    valA = new Date(a.encerramento).getTime();
                    valB = new Date(b.encerramento).getTime();
                    break;
                case 'meuLance':
                    valA = a.meuLance;
                    valB = b.meuLance;
                    break;
                default: // 'imovel' e outros casos de texto
                    valA = a[sortKey].toLowerCase();
                    valB = b[sortKey].toLowerCase();
                    return currentSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            return currentSortDirection === 'asc' ? valA - valB : valB - valA;
        });

        // Re-renderiza a tabela com os dados ordenados
        renderFavoriteAuctions();
        updateHeaderIcons();
    });
});

function updateHeaderIcons() {
    sortableHeaders.forEach(header => {
        const sortKey = header.dataset.sort;
        header.classList.remove('sort-asc', 'sort-desc');
        
        if (sortKey === currentSortColumn) {
            header.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });
}
});