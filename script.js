let etiquetaBipada

document.getElementById('fileInput').addEventListener('change', function (e) {

    const containerBusca = document.getElementById('containerBusca')
    document.getElementById('secaoBusca').style.display = "none";
    containerBusca.style.display = 'block';

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

        const resultado = []
        const remessasEncontradas = []

        // console.log(remessasEncontradas)

        document.getElementById('btnBusca').addEventListener('click', function (e) {
            etiquetaBipada = document.getElementById('buscaEtiqueta').value;


            const filtroEtiquetaBipada = jsonData.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);
            const filtroRemessasEncontradas = remessasEncontradas.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);

            for (remessa of filtroEtiquetaBipada) {

                const jaEsta = filtroRemessasEncontradas.filter((remessa) => remessa["Nro. Etiqueta"] == etiquetaBipada)

                if (jaEsta.length > 0) {
                    alert("Remessa já adicioda.")
                } else {
                    remessasEncontradas.push(remessa);

                    resultado.push(`✅ ${remessa["Rota"]} - ${remessa["Nome Pessoa Visita"]} -  ${remessa["Logradouro Pessoa Visita"]}, ${remessa["Numero Endereço Pessoa Visita"]}`)
                }

            }

            const resultDiv = document.getElementById('result');
            const jsonOutput = document.getElementById('jsonOutput');

            // jsonOutput.textContent = JSON.stringify(resultado, null, 2);

            if (resultado.length > 0) {
                jsonOutput.textContent = resultado.join('\n');
            } else {
                alert('Nenhum vencimento encontrado para esta etiqueta.');
            }
            resultDiv.style.display = 'block';


            // Opcional: fazer download do JSON
            // createDownloadLink(jsonData, file.name);
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
    a.download = originalFilename.replace('.xlsx', '.json');
    a.textContent = 'Download JSON';
    a.style.display = 'block';
    a.style.marginTop = '10px';

    document.body.appendChild(a);
}
