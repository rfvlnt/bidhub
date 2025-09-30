document.addEventListener('DOMContentLoaded', () => {
    // Lógica da Sidebar
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('appSidebar');
    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = (localStorage.getItem('bidhubUserName') || 'Usuário').split(' ')[0];

    // Lógica para alternar entre calculadoras (Venda vs. Aluguel)
    const strategyBtns = document.querySelectorAll('.strategy-btn');
    const calculatorWrappers = document.querySelectorAll('.calculator-wrapper');
    strategyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            strategyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetId = `calculator-${btn.dataset.calculator}`;
            calculatorWrappers.forEach(w => w.id === targetId ? w.classList.add('active') : w.classList.remove('active'));
        });
    });
    
    // --- Funções Auxiliares ---
    const parseValue = (value) => parseFloat(String(value).replace(/[^0-9,]+/g, "").replace(/\./g, '').replace(",", ".")) || 0;
    const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // --- LÓGICA DA CALCULADORA DE VENDA ---
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
        outCustoTotal: document.getElementById('v_out_custo_total'),
        outLucro: document.getElementById('v_out_lucro'),
        outRoi: document.getElementById('v_out_roi')
    };
    
    // Funções de Cálculo (Agora definidas antes de serem usadas)
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

        const leiloeiro = arrematacao * pLeiloeiro;
        const itbi = arrematacao * pItbi;
        const holdingCosts = prazo * custoMensal;
        const custoEntrada = arrematacao + leiloeiro + itbi + cartorio + reforma + holdingCosts;
        const comissaoCorretor = venda * pCorretor;
        const lucroBruto = venda - (arrematacao + cartorio + reforma + holdingCosts) - comissaoCorretor;
        const impostoRenda = lucroBruto > 0 ? lucroBruto * pIR : 0;
        const custoTotal = custoEntrada + comissaoCorretor + impostoRenda;
        const lucroLiquido = venda - custoTotal;
        const roi = custoTotal > 0 ? (lucroLiquido / custoTotal) * 100 : 0;
        
        saleInputs.leiloeiroValor.value = formatCurrency(leiloeiro);
        saleInputs.itbiValor.value = formatCurrency(itbi);
        saleInputs.corretorValor.value = formatCurrency(comissaoCorretor);
        saleInputs.irValor.value = formatCurrency(impostoRenda);
        saleInputs.outCustoTotal.textContent = formatCurrency(custoTotal);
        saleInputs.outLucro.textContent = formatCurrency(lucroLiquido);
        saleInputs.outRoi.textContent = roi.toFixed(2) + '%';
    };

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

        if(roiDesejado <= -1) {
            saleInputs.arrematacao.value = "ROI inválido";
            return;
        }

        const comissaoCorretor = venda * pCorretor;
        const holdingCosts = prazo * custoMensal;
        // Subtrai IR do lucro desejado (simplificação)
        const lucroDesejadoLiquido = (venda * roiDesejado) / (1 + roiDesejado);
        const lucroBrutoNecessario = lucroDesejadoLiquido / (1-pIR);

        const custosFixos = cartorio + reforma + holdingCosts + comissaoCorretor;
        const custosTotaisSemArremate = custosFixos + lucroBrutoNecessario;
        
        // Fórmula simplificada para encontrar o lance máximo
        const lanceMaximo = (venda - custosTotaisSemArremate) / (1 + pLeiloeiro + pItbi);

        saleInputs.arrematacao.value = formatCurrency(lanceMaximo > 0 ? lanceMaximo : 0);
        calculateSale(); // Roda o cálculo normal para atualizar todos os outros campos
    };

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
                groupRoiDesejado.style.display = 'grid'; // Usa 'grid' para consistência
            }
            runSaleCalculation();
        });
    });

    // Adiciona os listeners a todos os campos de input da calculadora de venda
    const allSaleInputs = Object.values(saleInputs);
    allSaleInputs.forEach(input => {
        if (input && !input.id.startsWith('v_out')) {
            input.addEventListener('input', runSaleCalculation);
        }
    });

    // Inicia o cálculo
    runSaleCalculation();
    
    // (A sua lógica da calculadora de aluguel pode ser adicionada aqui)
});