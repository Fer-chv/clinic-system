// Servicio para exportación a PDF (usando html2canvas y jsPDF)
// npm install html2canvas jspdf

export const generatePDFFromTable = (
  tableElement: HTMLElement,
  filename: string = 'reporte.pdf'
): void => {
  // Nota: Esto requiere html2canvas y jsPDF
  // Para implementación simple, usamos window.print()
  window.print()
}

export const generateInvoicePDF = (invoiceData: any): void => {
  // Esto es un placeholder para generación de PDF
  // En producción, usar html2canvas + jsPDF
  const printWindow = window.open('', '', 'width=800,height=600')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Factura #${invoiceData.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header { margin-bottom: 30px; text-align: center; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .details { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Factura</div>
            <p>#${invoiceData.id}</p>
          </div>

          <div class="details">
            <div class="row">
              <span>Paciente:</span>
              <span>${invoiceData.patientName}</span>
            </div>
            <div class="row">
              <span>Doctor:</span>
              <span>${invoiceData.doctorName}</span>
            </div>
            <div class="row">
              <span>Fecha:</span>
              <span>${new Date().toLocaleDateString('es-HN')}</span>
            </div>
            <div class="row">
              <span>Monto:</span>
              <span>L ${invoiceData.amount?.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Estado:</span>
              <span>${invoiceData.status}</span>
            </div>
          </div>

          <div class="total">
            <div class="row">
              <span>Total a Pagar:</span>
              <span>L ${invoiceData.amount?.toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

export const generateReportPDF = (
  reportTitle: string,
  reportContent: string,
  filename: string = 'reporte.pdf'
): void => {
  const printWindow = window.open('', '', 'width=800,height=600')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
            }
            .date {
              font-size: 12px;
              color: #999;
              margin-top: 10px;
            }
            .content {
              margin-top: 20px;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #667eea;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${reportTitle}</div>
            <div class="date">Generado: ${new Date().toLocaleDateString('es-HN')} ${new Date().toLocaleTimeString('es-HN')}</div>
          </div>
          <div class="content">
            ${reportContent}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

// Exportar datos a CSV
export const exportToCSV = (
  data: any[],
  filename: string,
  columns: string[]
): void => {
  const headers = columns.join(',')
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col]
      // Escapar comillas dobles
      return typeof value === 'string' && value.includes(',')
        ? `"${value.replace(/"/g, '""')}`
        : value
    }).join(',')
  )

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
