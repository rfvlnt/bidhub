document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DA SIDEBAR LATERAL FLUTUANTE ---
    const sidebarNav = document.getElementById('sidebarNav');
    const menuToggle = document.getElementById('menuToggle');
    if (sidebarNav && menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('collapsed');
        });
    }

    // --- LÓGICA DO CRONÓMETRO ---
    const countdownTimer = document.getElementById('countdown-timer');
    if (countdownTimer) {
        const endTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 dias a partir de agora
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            if (distance < 0) {
                clearInterval(interval);
                countdownTimer.innerHTML = "EXPIRADO";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            countdownTimer.innerHTML = `${days}d ${hours}h ${minutes}m`;
        }, 1000);
    }

    // --- CÁLCULO SIMPLES DO DESÁGIO ---
    const avaliacaoEl = document.getElementById('staticAvaliacaoMercado');
    const desagioEl = document.getElementById('staticDesagio');
    if (avaliacaoEl && desagioEl) {
        const lanceInicial = 1200000;
        const avaliacaoMercado = parseFloat(avaliacaoEl.textContent.replace(/[^0-9,-]+/g, "").replace(".", "").replace(",", "."));
        if (avaliacaoMercado > 0) {
            const desagio = (avaliacaoMercado - lanceInicial) / avaliacaoMercado;
            desagioEl.textContent = (desagio * 100).toFixed(2) + '%';
        }
    }

    // ======================================================================
    //     NOVA LÓGICA PARA O DESCONTO DO LEILÃO (AGORA NO SÍTIO CORRETO)
    // ======================================================================
    const auctionItems = document.querySelectorAll('.auction-history li[data-value]');
    const discountDisplay = document.getElementById('auction-discount-display');

    if (auctionItems.length >= 2 && discountDisplay) {
        const valorPrimeiraPraca = parseFloat(auctionItems[0].dataset.value);
        const valorSegundaPraca = parseFloat(auctionItems[1].dataset.value);

        if (valorPrimeiraPraca > 0 && valorSegundaPraca > 0) {
            const desconto = ((valorPrimeiraPraca - valorSegundaPraca) / valorPrimeiraPraca) * 100;
            
            discountDisplay.innerHTML = `
                <span class="material-icons">arrow_downward</span>
                Desconto de ${desconto.toFixed(2).replace('.',',')}%
            `;
        }
    }
});