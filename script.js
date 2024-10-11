document.addEventListener('DOMContentLoaded', function() {
    const savePdfBtn = document.getElementById('savePdfBtn');
    savePdfBtn.addEventListener('click', saveChecklistAsPDF);
    
    // Mostrar campo de motivo se "Não Conforme" for selecionado
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', function() {
            const motivoField = document.getElementById(`motivoNaoConforme${this.id.replace('naoConforme', '')}`);
            if (this.value === 'Não Conforme') {
                motivoField.style.display = 'inline-block';
            } else {
                motivoField.style.display = 'none';
                motivoField.value = ''; // Limpa o campo ao selecionar "Conforme"
            }
        });
    });
});

function saveChecklistAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'pt', 'a4'); // Define a orientação como paisagem e tamanho A4

    // Adiciona logotipo (substitua a string abaixo pela sua string base64)
    const logoBase64 = './assets/urla1.jpeg'; // Exemplo de string base64
    doc.addImage(logoBase64, 'PNG', 10, 10, 50, 50); // Ajuste a posição e o tamanho conforme necessário

    // Adiciona informações do header
    let yPosition = 70;
    
    doc.text(`${document.getElementById('Codigo').value}`, 10, yPosition);
    doc.text(`Revisao: ${document.getElementById('Revisao').value}`, 10, yPosition += 20);
    doc.text(`Classificacao: ${document.getElementById('Classificacao').value}`, 10, yPosition += 20);
    doc.text(`Origem: ${document.getElementById('origem').value}`, 10, yPosition += 20);
    doc.text(`Destino: ${document.getElementById('destino').value}`, 10, yPosition += 20);
    doc.text(`KM de Saída: ${document.getElementById('kmSaida').value}`, 10, yPosition += 20);
    doc.text(`Hora de Saída: ${document.getElementById('horaSaida').value}`, 10, yPosition += 20);
    doc.text(`Data: ${document.getElementById('data').value}`, 10, yPosition += 20);
    doc.text(`Motorista: ${document.getElementById('nMotorista').value}`, 10, yPosition += 20);
    doc.text(`Matrícula do Motorista: ${document.getElementById('motorista').value}`, 10, yPosition += 20);
    doc.text(`Reboque 1: ${document.getElementById('reboque1').value}`, 10, yPosition += 20);
    doc.text(`Reboque 2: ${document.getElementById('reboque2').value}`, 10, yPosition += 20);

    doc.text('', 10, yPosition += 20);
    const inspectionItems = document.querySelectorAll('.inspection-item');
    // Captura as informações do motorista
    const nMotorista = document.getElementById('nMotorista').value;

    inspectionItems.forEach((item, index) => {
        const label = item.querySelector('label').innerText;

        // Captura o botão de rádio para "Conforme" e "Não Conforme"
        const conforme = item.querySelector('input[type="radio"][value="Conforme"]');
        const naoConforme = item.querySelector('input[type="radio"][value="Não Conforme"]');

        // Verifica se os botões de rádio estão definidos
        if (conforme && naoConforme) {
            let result = conforme.checked ? 'Conforme' : 'Não Conforme';
            if (naoConforme.checked) {
                const motivoField = item.querySelector('.motivo-nao-conforme');
                const motivo = motivoField ? motivoField.value : '';
                result += ` (Motivo: ${motivo})`;
            }
            // Checa se a posição Y ultrapassa a altura da página
            if (yPosition >= doc.internal.pageSize.height - 30) {
                doc.addPage(); // Adiciona uma nova página
                yPosition = 30; // Reseta a posição Y
            }
            doc.text(`${index + 1}. ${label}: ${result}`, 30, yPosition);
            yPosition += 30; // Aumenta a posição Y para a próxima linha
        }
    });

    // Adiciona observações e informações finais
    if (yPosition >= doc.internal.pageSize.height - 30) {
        doc.addPage(); // Adiciona uma nova página se necessário
        yPosition = 30; // Reseta a posição Y
    }
    doc.text(`Descrição problemas Mecanicos: ${document.getElementById('observacoesGerais').value}`, 30, yPosition);
    yPosition += 30;

    if (yPosition >= doc.internal.pageSize.height - 20) {
        doc.addPage(); // Adiciona uma nova página se necessário
        yPosition = 20; // Reseta a posição Y
    }
    doc.text(`Assinatura: ${document.getElementById('assinaturaResponsavel').value}`, 30, yPosition);
    yPosition += 30;

    if (yPosition >= doc.internal.pageSize.height - 20) {
        doc.addPage(); // Adiciona uma nova página se necessário
        yPosition = 10; // Reseta a posição Y
    }
    

    doc.save(`Checklist ${nMotorista}.pdf`);
}
