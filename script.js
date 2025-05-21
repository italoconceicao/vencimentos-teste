
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Converter a primeira planilha para JSON
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Exibir o resultado
        const resultDiv = document.getElementById('result');
        const jsonOutput = document.getElementById('jsonOutput');

        //Filtro                   <==
        // const filtroEtiquetaBipada = jsonData.filter((produto) => produto["Nro. Etiqueta"] == etiquetaBipada);
        const filtroEtiquetaBipada = jsonData.filter((produto) => produto["Bairro Pessoa Visita"] == "CANUDOS");
        if (filtroEtiquetaBipada.length > 0) {
            console.log("deu")
        } else { console.log("Ué?!") }

        const resultado = []

        for (remessa of filtroEtiquetaBipada) {
            resultado.push(
                {
                    "Etiqueta": remessa["Nro. Etiqueta"],
                    "Status": remessa["Status"],
                    "Nome do Cliente": remessa["Nome Pessoa Visita"]
                }
            )
        }

        console.log(resultado)
        jsonOutput.textContent = JSON.stringify(resultado, null, 2);
        resultDiv.style.display = 'block';

        // Opcional: fazer download do JSON
        createDownloadLink(jsonData, file.name);
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
