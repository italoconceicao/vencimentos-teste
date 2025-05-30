let etiquetaBipada

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

        const vencimentosEncontrados = []
        const vencimentosNaoEncontrados = []
        const remessasEncontradas = []
        const jsonRemessasNaoEncontradas = []
        const h3 = document.getElementById('vencimentosh3')



        document.getElementById('buscaEtiqueta').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                pesquisa();
            }
        })
        document.getElementById('btnBusca').addEventListener('click', pesquisa);

        function pesquisa() {
            etiquetaBipada = document.getElementById('buscaEtiqueta').value;

            const filtroEtiquetaBipada = jsonData.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);
            const filtroRemessasEncontradas = remessasEncontradas.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);

            for (remessa of filtroEtiquetaBipada) {

                const arrayParaFiltroRemessas = filtroRemessasEncontradas.filter((remessa) => remessa["Nro. Etiqueta"] == etiquetaBipada)


                jsonRemessasNaoEncontradas.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);



                //CHECAR
                // POR QUE
                // ALERT
                // PAROU
                // DE
                // FUNCIONAR







                if (arrayParaFiltroRemessas.length > 0) {
                    alert("Remessa já adicionada.")
                } else {
                    remessasEncontradas.push(remessa);

                    vencimentosEncontrados.push(`✅ ${remessa["Rota"]} - ${remessa["Nome Pessoa Visita"]} -  ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]}`)

                    const indiceRemessa = jsonData.findIndex((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);

                    const removerIndiceEncontrado = jsonData.splice(indiceRemessa, 1);
                    console.log(removerIndiceEncontrado)

                    h3.textContent = `${remessasEncontradas.length} vencimentos encontrado(s)`;


                }

                const outputVencimentos = document.getElementById('outputVencimentos');

                // outputVencimentos.textContent = JSON.stringify(vencimentosEncontrados, null, 2);

                if (vencimentosEncontrados.length > 0) {
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
                vencimentosNaoEncontrados.push(`❌ ${remessa["Rota"]} - ${remessa["Nome Pessoa Visita"]} -  ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]}`)

                // jsonRemessasNaoEncontradas.push(remessa);
            }

            h3.textContent = `${jsonData.length} vencimento(s) não encontrado(s)`;

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




// Função opcional para criar link de download
function createDownloadLink(data, originalFilename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    // a.download = originalFilename.replace('.xlsx', '.json');
    a.textContent = 'Baixar lista';
    a.style.display = 'block';
    a.style.marginTop = '10px';

    document.body.appendChild(a);
}
