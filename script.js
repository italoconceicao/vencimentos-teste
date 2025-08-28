let etiquetaBipada
const vencimentosEncontrados = []
const vencimentosNaoEncontrados = []
const remessasEncontradas = []
let jsonLength = 0

document.getElementById('fileInput').addEventListener('change', function (e) {

    // if {
    //     //se o arquivo não for de uma extensão aceita, mostrar mensagem de erro
    //     return;
    // } 

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'


    const containerBusca = document.getElementById('containerBusca')
    document.getElementById('secaoBusca').style.display = "none";
    containerBusca.style.display = 'block';
    const botoesVencimentos = document.getElementById('botoesVencimentos').style.display = 'flex';

    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const h3 = document.getElementById('vencimentosh3')


        document.getElementById('buscaEtiqueta').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                pesquisa();
            }
        })
        document.getElementById('btnBusca').addEventListener('click', pesquisa);

        jsonLength = jsonData.length;

        function pesquisa() {
            etiquetaBipada = document.getElementById('buscaEtiqueta').value;
            mensagemVencimentoEncontrado = document.getElementById('mensagemVencimentoEncontrado');

            const filtroEtiquetaBipada = jsonData.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);

            if (filtroEtiquetaBipada.length < 1) {
                window.alert("Esta remessa não é um vencimento!");
            }

            for (remessa of filtroEtiquetaBipada) {

                const filtroRemessasEncontradas = remessasEncontradas.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);

                if (remessasEncontradas.includes(remessa)) {
                    window.alert("Esta remessa já foi adicionada!");

                } else {
                    remessasEncontradas.push(remessa);
                    jsonLength = --jsonData.length;


                    vencimentosEncontrados.push(`✅ ${remessa["Rota"]} - ${remessa["Nome Pessoa Visita"]} -  ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]} [${remessa["Nome Cliente"]}]`)

                    // const indiceRemessa = jsonData.findIndex((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);
                    // const removerIndiceEncontrado = jsonData.splice(indiceRemessa, 1);

                    h3.textContent = `${remessasEncontradas.length} vencimentos encontrado(s)`;
                    const outputEncontrado = document.getElementById('outputEncontrado');
                    const outputEncontrado2 = document.getElementById('outputEncontrado2');

                    outputEncontrado.textContent = `${remessa["Rota"]}`
                    outputEncontrado2.textContent = `${remessa["Nome Pessoa Visita"]} | ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]} | ${remessa["Nome Cliente"]}`

                    setTimeout(() => {
                        mensagemVencimentoEncontrado.style.display = "flex";
                        setTimeout(() => {
                            mensagemVencimentoEncontrado.style.opacity = "1";
                            mensagemVencimentoEncontrado.style.transform = "translateY(0)";
                        }, 10);
                    }, 1000);
                    setTimeout(() => {
                        mensagemVencimentoEncontrado.style.opacity = "0";
                        mensagemVencimentoEncontrado.style.transform = "translateY(-20px)";
                        setTimeout(() => {
                            mensagemVencimentoEncontrado.style.display = "none";
                        }, 500);
                    }, 4000);

                }

                const outputVencimentos = document.getElementById('outputVencimentos');

                if (vencimentosEncontrados.length > 0) {

                    vencimentosEncontrados.sort((a, b) => {
                        const rotaA = a.split(' - ')[0];
                        const rotaB = b.split(' - ')[0];

                        return rotaA.localeCompare(rotaB);
                    });

                    outputVencimentos.textContent = vencimentosEncontrados.join('\n');

                } else {
                    alert('Nenhum vencimento encontrado para esta etiqueta.');
                }
            }

        };
        // Opcional: fazer download do JSON
        // createDownloadLink(jsonData, file.name);      <====     [CORRIGIR]

        document.getElementById('naoEncontrados').addEventListener('click', function (e) {
            document.getElementById('encontrados').style.border = "outset";
            document.getElementById('naoEncontrados').style.border = "inset";

            for (remessa of jsonData) {
                vencimentosNaoEncontrados.push(`❌ ${remessa["Rota"]} - ${remessa["Nome Pessoa Visita"]} -  ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]} [${remessa["Nome Cliente"]}]`)
            }

            h3.textContent = `${jsonLength} vencimento(s) não encontrado(s)`;

            vencimentosNaoEncontrados.sort((a, b) => {
                const rotaA = a.split(' - ')[0];
                const rotaB = b.split(' - ')[0];

                return rotaA.localeCompare(rotaB);
            });

            outputVencimentos.textContent = vencimentosNaoEncontrados.join('\n');


        });

        document.getElementById('encontrados').addEventListener('click', function (e) {
            document.getElementById('naoEncontrados').style.border = "outset";
            document.getElementById('encontrados').style.border = "inset";

            h3.textContent = `${remessasEncontradas.length} vencimentos encontrado(s)`;

            outputVencimentos.textContent = vencimentosEncontrados.join('\n');

        });

    };

    reader.readAsArrayBuffer(file);
});

// FAZER:

//CORRIGIR:
// - botões não mudam ao encontrar vencimento
// - cores de mensagem de vencimento encontrado
// - download da lista









// Função opcional para criar link de download
function createDownloadLink(data, originalFilename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = originalFilename.replace('.xlsx', '.json');
    a.textContent = 'Baixar lista';
    a.style.display = 'block';
    a.style.marginTop = '10px';

    document.body.appendChild(a);
}
