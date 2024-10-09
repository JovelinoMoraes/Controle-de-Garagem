const salvarData = document.querySelector('#btnSalvarData');
const dataHoje = document.querySelector('#dataHoje');
const dataEscolhida = document.querySelector('#data');
const cadastrar = document.querySelector('#cadastrar');
const resultado = document.querySelector('.resultado');
const btnLimpar = document.querySelector('#limpar');
const btnImprimir = document.querySelector('#btnImprimir');

let listaCarros = JSON.parse(localStorage.getItem('listaCarros')) || [];

// Função para cadastrar os carros
function cadastrarCarro() {
    const placa = document.querySelector('#placa');
    const quarto = document.querySelector('#quarto');
    const situ = document.querySelector('#situ');

    // Validação para garantir que os campos estejam preenchidos
    if (!placa.value || !quarto.value || !situ.value) {
        alert("Preencha todos os campos antes de cadastrar.");
        return;
    }

    const carro = {
        quarto: quarto.value,
        placa: placa.value.toUpperCase(),
        situ: situ.value.toUpperCase()
    };
    listaCarros.push(carro);

    // Limpa os campos após o cadastro
    placa.value = '';
    quarto.value = '';
    situ.value = '';

    // Atualiza a exibição dos carros e salva no localStorage
    exibirCarros();
    salvarNoLocalStorage();
}

// Função para exibir os carros
function exibirCarros() {
    resultado.innerHTML = '';

    const listaOrdenada = [...listaCarros].sort((a, b) => a.quarto.localeCompare(b.quarto));

    listaOrdenada.forEach((carro) => {
        const divCarro = document.createElement('div');
        divCarro.classList.add('cadastrado');

        // Adiciona classes com base na situação
        if (carro.situ === 'E') {
            divCarro.classList.add('estacionado');
        } else if (carro.situ === 'FC') {
            divCarro.classList.add('fc');
        }

        divCarro.innerHTML = `Quarto: ${carro.quarto}, Placa: ${carro.placa}, Situação: ${carro.situ} <input class="apagar" type="button" value="X">`;

        const btnApagar = divCarro.querySelector('.apagar');
        btnApagar.addEventListener('click', () => {
            resultado.removeChild(divCarro);
            listaCarros = listaCarros.filter(c => c.placa !== carro.placa); // Filtra o carro removido
            salvarNoLocalStorage(); // Atualiza o localStorage
        });

        resultado.appendChild(divCarro);
    });
}

// Função para salvar a lista de carros no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('listaCarros', JSON.stringify(listaCarros));
}

salvarData.addEventListener('click', () => {
    const dataSelecionada = new Date(dataEscolhida.value);
    dataSelecionada.setDate(dataSelecionada.getDate() + 1); // Adiciona um dia
    const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR'); // Formato dia/mês/ano
    dataHoje.innerHTML = dataFormatada;
    localStorage.setItem('dataHoje', dataFormatada); // Salva a data formatada no localStorage
});

// Ao carregar, defina o valor de dataHoje se houver uma data salva
function carregarDataHoje() {
    const dataSalva = localStorage.getItem('dataHoje');
    if (dataSalva) {
        dataHoje.innerHTML = dataSalva;
    }
}

// Carregar os carros do localStorage ao iniciar
function carregarDoLocalStorage() {
    const carrosSalvos = JSON.parse(localStorage.getItem('listaCarros'));
    if (carrosSalvos) {
        listaCarros = carrosSalvos;
        exibirCarros();
    }
}

// Evento do botão de cadastrar
cadastrar.addEventListener('click', cadastrarCarro);

// Evento do botão limpar
btnLimpar.addEventListener('click', () => {
    if (confirm('Você tem certeza que deseja limpar a lista de carros?')) {
        listaCarros.length = 0; // Limpa a lista
        salvarNoLocalStorage(); // Atualiza o localStorage
        exibirCarros(); // Atualiza a exibição
    }
});

// Função de impressão
btnImprimir.addEventListener('click', () => {
    // Clona o conteúdo e remove os botões "X"
    const conteudoOriginal = resultado.cloneNode(true);
    const botoesApagar = conteudoOriginal.querySelectorAll('.apagar');
    botoesApagar.forEach(btn => btn.remove()); // Remove todos os botões "X"

    const conteudo = conteudoOriginal.innerHTML; // Captura o conteúdo da caixa de resultado
    const dataHojeFormatada = dataHoje.innerHTML; // Obtém a data de hoje
    const janelaImpressao = window.open('', '', 'width=800,height=600');
    janelaImpressao.document.write(`
        <html>
            <head>
                <title>Imprimir Resultados</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { font-size: 24px; } /* Tamanho do cabeçalho */
                    h2 { font-size: 18px; margin: 0; } /* Tamanho da data */
                    .cadastrado { margin: 10px 0; font-size: 16px; } /* Tamanho do conteúdo */
                </style>
            </head>
            <body onload="window.print(); window.close();">
                <h1>Controle de Garagem</h1>
                <h2>Hotel Westphal - Data: ${dataHojeFormatada}</h2>
                ${conteudo}
            </body>
        </html>
    `);
    janelaImpressao.document.close();
});

// Carregar os dados ao iniciar a página
carregarDoLocalStorage();
exibirCarros();
carregarDataHoje();
