document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DA SIDEBAR LATERAL FLUTUANTE ---
    const sidebarNav = document.getElementById('sidebarNav');
    const menuToggle = document.getElementById('menuToggle');
    if (sidebarNav && menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('collapsed');
        });
    }

    // --- LÓGICA DA CALCULADORA DE VIABILIDADE (VENDA) ---
    
    // Funções auxiliares para manipulação de valores
    const parseValue = (value) => parseFloat(String(value).replace(/[^0-9,]+/g, "").replace(/\./g, '').replace(",", ".")) || 0;
    const formatCurrency = (value) => isNaN(value) ? "Inválido" : value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatPercentage = (value) => isNaN(value) ? "Inválido" : (value * 100).toFixed(2) + '%';

    // Mapeamento de todos os elementos da calculadora
    const saleInputs = {
        arrematacao: document.getElementById('v_arrematacao'),
        leiloeiroPerc: document.getElementById('v_leiloeiro_perc'),
        leiloeiroValor: document.getElementById('v_leiloeiro_valor'),
        itbiPerc: document.getElementById('v_itbi_perc'),
        itbiValor: document.getElementById('v_itbi_valor'),
        cartorio: document.getElementById('v_cartorio'),
        reforma: document.getElementById('v_reforma'),
        prazo: document.getElementById('v_prazo'),
        custoMensal: document.getElementById('v_custo_mensal'),
        venda: document.getElementById('v_venda'),
        corretorPerc: document.getElementById('v_corretor_perc'),
        corretorValor: document.getElementById('v_corretor_valor'),
        irPerc: document.getElementById('v_ir_perc'),
        irValor: document.getElementById('v_ir_valor'),
        roiDesejado: document.getElementById('v_roi_desejado'),
        // Elementos de resultado
        outCustoTotal: document.getElementById('v_out_custo_total'),
        outLucro: document.getElementById('v_out_lucro'),
        outRoi: document.getElementById('v_out_roi'),
        // Métricas no cabeçalho para sincronização
        staticDesagio: document.getElementById('staticDesagio'),
        staticAvaliacao: document.getElementById('staticAvaliacaoMercado')
    };

    // Função para calcular o Lucro e ROI (Modo 1)
    const calculateSale = () => {
        const arrematacao = parseValue(saleInputs.arrematacao.value);
        const pLeiloeiro = parseValue(saleInputs.leiloeiroPerc.value) / 100;
        const pItbi = parseValue(saleInputs.itbiPerc.value) / 100;
        const cartorio = parseValue(saleInputs.cartorio.value);
        const reforma = parseValue(saleInputs.reforma.value);
        const prazo = parseValue(saleInputs.prazo.value);
        const custoMensal = parseValue(saleInputs.custoMensal.value);
        const venda = parseValue(saleInputs.venda.value);
        const pCorretor = parseValue(saleInputs.corretorPerc.value) / 100;
        const pIR = parseValue(saleInputs.irPerc.value) / 100;
        const avaliacao = parseValue(saleInputs.staticAvaliacao.textContent);

        const leiloeiro = arrematacao * pLeiloeiro;
        const itbi = arrematacao * pItbi;
        const holdingCosts = prazo * custoMensal;
        const custoEntrada = arrematacao + leiloeiro + itbi + cartorio + reforma + holdingCosts;
        const comissaoCorretor = venda * pCorretor;
        const lucroBruto = venda - (custoEntrada - leiloeiro - itbi) - comissaoCorretor;
        const impostoRenda = lucroBruto > 0 ? lucroBruto * pIR : 0;
        const custoTotal = custoEntrada + comissaoCorretor + impostoRenda;
        const lucroLiquido = venda - custoTotal;
        const roi = custoTotal > 0 ? (lucroLiquido / custoTotal) : 0;
        const desagio = avaliacao > 0 ? (avaliacao - arrematacao) / avaliacao : 0;

        saleInputs.leiloeiroValor.value = formatCurrency(leiloeiro);
        saleInputs.itbiValor.value = formatCurrency(itbi);
        saleInputs.corretorValor.value = formatCurrency(comissaoCorretor);
        saleInputs.irValor.value = formatCurrency(impostoRenda);
        saleInputs.outCustoTotal.textContent = formatCurrency(custoTotal);
        saleInputs.outLucro.textContent = formatCurrency(lucroLiquido);
        saleInputs.outRoi.textContent = formatPercentage(roi);
        saleInputs.staticDesagio.textContent = formatPercentage(desagio); // Sincroniza o cabeçalho
    };

    // Função para calcular o Lance Máximo (Modo 2)
    const calculateMaxBid = () => {
        const pLeiloeiro = parseValue(saleInputs.leiloeiroPerc.value) / 100;
        const pItbi = parseValue(saleInputs.itbiPerc.value) / 100;
        const cartorio = parseValue(saleInputs.cartorio.value);
        const reforma = parseValue(saleInputs.reforma.value);
        const prazo = parseValue(saleInputs.prazo.value);
        const custoMensal = parseValue(saleInputs.custoMensal.value);
        const venda = parseValue(saleInputs.venda.value);
        const pCorretor = parseValue(saleInputs.corretorPerc.value) / 100;
        const pIR = parseValue(saleInputs.irPerc.value) / 100;
        const roiDesejado = parseValue(saleInputs.roiDesejado.value) / 100;

        if (roiDesejado <= -1) {
            saleInputs.arrematacao.value = "ROI Inválido";
            return;
        }

        const comissaoCorretor = venda * pCorretor;
        const holdingCosts = prazo * custoMensal;
        const custosFixos = cartorio + reforma + holdingCosts + comissaoCorretor;
        
        let lanceMaximo = (venda * (1 - pIR) - custosFixos * (1 - pIR)) / ((1 + roiDesejado) * (1 + pLeiloeiro + pItbi) - pIR * (venda - custosFixos));
        lanceMaximo = (venda - custosFixos - (lucroBrutoNecessario)) / (1 + pLeiloeiro + pItbi);
        
        // Fórmula simplificada para maior estabilidade
        const custoTotalDesejado = venda / (1 + roiDesejado);
        const lucroDesejado = venda - custoTotalDesejado;
        const lucroBrutoEstimado = lucroDesejado / (1 - pIR);
        const custosFixosTotais = cartorio + reforma + holdingCosts + comissaoCorretor;
        
        lanceMaximo = (venda - custosFixosTotais - lucroBrutoEstimado) / (1 + pLeiloeiro + pItbi);

        saleInputs.arrematacao.value = formatCurrency(lanceMaximo > 0 ? lanceMaximo : 0);
        calculateSale(); // Roda o cálculo normal para atualizar todos os outros campos
    };

    // Função principal que decide qual cálculo executar
    const runSaleCalculation = () => {
        const modo = document.querySelector('input[name="venda-modo"]:checked').value;
        if (modo === 'lucro') {
            calculateSale();
        } else {
            calculateMaxBid();
        }
    };
    
    // Lógica para alternar os modos
    const modoRadios = document.querySelectorAll('input[name="venda-modo"]');
    const groupArrematacao = document.getElementById('group_v_arrematacao');
    const groupRoiDesejado = document.getElementById('group_v_roi_desejado');

    modoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const modo = radio.value;
            if (modo === 'lucro') {
                saleInputs.arrematacao.disabled = false;
                groupArrematacao.classList.remove('is-output');
                groupRoiDesejado.style.display = 'none';
            } else {
                saleInputs.arrematacao.disabled = true;
                groupArrematacao.classList.add('is-output');
                groupRoiDesejado.style.display = 'grid';
            }
            runSaleCalculation();
        });
    });

    // Adiciona os listeners a todos os campos de input da calculadora de venda
    const allSaleInputs = Object.values(saleInputs);
    allSaleInputs.forEach(input => {
        if (input && input.tagName === 'INPUT') {
            input.addEventListener('input', runSaleCalculation);
        }
    });

    // Inicia o cálculo ao carregar a página
    runSaleCalculation();
});