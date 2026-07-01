import { Invoice, Patient, User } from '@/types'
import { Button, Space } from 'antd'
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons'
import './InvoicePreview.css'

interface InvoicePreviewProps {
  invoice: Invoice
  patient?: Patient
  doctor?: User
  clinicName: string
  isPreview?: boolean
}

export default function InvoicePreview({ invoice, patient, doctor, clinicName, isPreview = false }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const element = document.querySelector('.invoice-preview-paper')
    if (!element) return

    const computedStyle = window.getComputedStyle(document.documentElement)
    const primaryColor = computedStyle.getPropertyValue('--color-primary') || '#131e4e'
    const secondaryColor = computedStyle.getPropertyValue('--color-secondary') || '#0f1638'

    printWindow.document.write(`
      <html>
        <head>
          <title>Factura ${invoice.id}</title>
          <style>
            :root {
              --color-primary: ${primaryColor};
              --color-secondary: ${secondaryColor};
              --color-accent: #10b981;
              --color-primary-light: ${primaryColor}20;
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: white; }

            .invoice-preview-container {
              background: white;
              min-height: 100vh;
              padding: 0;
              font-family: 'Segoe UI', Arial, sans-serif;
            }

            .invoice-preview-paper {
              background: white;
              max-width: 900px;
              margin: 0 auto;
              padding: 40px;
              border-radius: 12px;
              line-height: 1.6;
            }

            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              border-bottom: 3px solid var(--color-primary);
              padding-bottom: 20px;
            }

            .clinic-info h1 {
              margin: 0;
              font-size: 28px;
              color: #1f2937;
              font-weight: 700;
            }

            .clinic-contact {
              margin: 8px 0 0 0;
              color: #6b7280;
              font-size: 13px;
            }

            .invoice-title {
              text-align: right;
            }

            .invoice-title h2 {
              margin: 0;
              font-size: 36px;
              color: var(--color-primary);
              font-weight: 700;
            }

            .invoice-number {
              margin: 8px 0 0 0;
              color: #9ca3af;
              font-size: 14px;
            }

            .invoice-dates {
              display: flex;
              gap: 30px;
              margin-bottom: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
              flex-wrap: wrap;
            }

            .date-item {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .date-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
            }

            .date-value {
              font-size: 16px;
              color: #1f2937;
              font-weight: 600;
            }

            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }

            .status-paid {
              background: #dcfce7;
              color: #166534;
            }

            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }

            .status-overdue {
              background: #fee2e2;
              color: #991b1b;
            }

            .invoice-parties {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
              padding-bottom: 30px;
              border-bottom: 1px solid #e5e7eb;
            }

            .party-section h3 {
              margin: 0 0 12px 0;
              font-size: 12px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 700;
              letter-spacing: 0.5px;
            }

            .party-details p {
              margin: 6px 0;
              font-size: 14px;
              color: #374151;
              line-height: 1.5;
            }

            .invoice-table {
              margin-bottom: 30px;
              overflow: hidden;
            }

            .invoice-table table {
              width: 100%;
              border-collapse: collapse;
            }

            .invoice-table thead {
              background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
              color: white;
            }

            .invoice-table th {
              padding: 16px;
              text-align: left;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .invoice-table td {
              padding: 16px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
              color: #374151;
            }

            .invoice-table tbody tr:hover {
              background: #f9fafb;
            }

            .col-description { width: 50%; }
            .col-quantity { width: 15%; text-align: center; }
            .col-price { width: 18%; text-align: right; }
            .col-total { width: 17%; text-align: right; font-weight: 600; color: #1f2937; }

            .invoice-totals {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid var(--color-primary);
            }

            .totals-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              color: #374151;
            }

            .totals-row span:first-child {
              font-weight: 600;
            }

            .totals-row.discount {
              color: #10b981;
              font-weight: 600;
            }

            .totals-row.tax {
              color: #f59e0b;
              font-weight: 600;
            }

            .totals-row.total {
              font-size: 18px;
              font-weight: 700;
              color: var(--color-primary);
              padding-top: 12px;
              border-top: 2px solid #e5e7eb;
            }

            .invoice-notes {
              margin-bottom: 20px;
              padding: 16px;
              background: #eff6ff;
              border-radius: 8px;
              border-left: 4px solid #0284c7;
            }

            .invoice-notes p {
              margin: 0;
              color: #0c4a6e;
              font-size: 13px;
            }

            .invoice-footer {
              text-align: center;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              color: #9ca3af;
              font-size: 12px;
            }

            .invoice-footer p {
              margin: 4px 0;
            }

            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }

              .invoice-preview-container {
                background: white;
                padding: 0;
                min-height: auto;
              }

              .invoice-actions-bar {
                display: none;
              }

              .invoice-preview-paper {
                max-width: 100%;
                padding: 20px;
                margin: 0;
                border-radius: 0;
                box-shadow: none;
                page-break-after: avoid;
              }

              .invoice-header {
                page-break-after: avoid;
              }

              .invoice-table {
                page-break-inside: avoid;
              }

              .invoice-parties {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() { window.close(); }, 250);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const invoiceDate = new Date(invoice.issueDate)
  const dueDate = new Date(invoice.dueDate)

  return (
    <div className="invoice-preview-container" style={isPreview ? { background: 'transparent', padding: 0, minHeight: 'auto' } : {}}>
      {!isPreview && (
        <div className="invoice-actions-bar">
          <Space>
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              type="primary"
              size="large"
            >
              Imprimir
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              size="large"
            >
              Descargar PDF
            </Button>
          </Space>
        </div>
      )}

      <div className="invoice-preview-paper">
        {/* Encabezado */}
        <div className="invoice-header">
          <div className="clinic-info">
            <h1 className="clinic-name">🦷 {clinicName}</h1>
            <p className="clinic-contact">
              Tel: +504 2000-0000 | Email: info@{clinicName.toLowerCase().replace(/\s+/g, '')}.com
            </p>
          </div>
          <div className="invoice-title">
            <h2>FACTURA</h2>
            <p className="invoice-number">#{invoice.id}</p>
          </div>
        </div>

        {/* Información de Fechas */}
        <div className="invoice-dates">
          <div className="date-item">
            <span className="date-label">Fecha de Emisión:</span>
            <span className="date-value">{invoiceDate.toLocaleDateString('es-ES')}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Fecha de Vencimiento:</span>
            <span className="date-value">{dueDate.toLocaleDateString('es-ES')}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Estado:</span>
            <span className={`status-badge status-${invoice.status}`}>
              {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
            </span>
          </div>
        </div>

        {/* Datos del Paciente y Doctor */}
        <div className="invoice-parties">
          <div className="party-section">
            <h3>DATOS DEL PACIENTE</h3>
            <div className="party-details">
              <p>
                <strong>{patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}</strong>
              </p>
              <p>Teléfono: {patient?.phone || 'N/A'}</p>
              <p>Email: {patient?.email || 'N/A'}</p>
              <p>Dirección: {patient?.address || 'N/A'}</p>
            </div>
          </div>

          <div className="party-section">
            <h3>ATENDIDO POR</h3>
            <div className="party-details">
              <p>
                <strong>{doctor?.name || 'N/A'}</strong>
              </p>
              <p>Especialidad: {doctor && 'specialization' in doctor ? (doctor.specialization as any) : 'General'}</p>
            </div>
          </div>
        </div>

        {/* Tabla de Servicios */}
        <div className="invoice-table">
          <table>
            <thead>
              <tr>
                <th className="col-description">Descripción del Servicio</th>
                <th className="col-quantity">Cantidad</th>
                <th className="col-price">Precio Unitario</th>
                <th className="col-total">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-description">Servicio Dental - {invoice.status === 'paid' ? 'Completado' : 'Pendiente'}</td>
                <td className="col-quantity">1</td>
                <td className="col-price">L {invoice.subtotal.toFixed(2)}</td>
                <td className="col-total">L {invoice.subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="invoice-totals">
          <div className="totals-row">
            <span>Subtotal:</span>
            <span>L {invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="totals-row discount">
              <span>Descuento:</span>
              <span>-L {invoice.discount.toFixed(2)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="totals-row tax">
              <span>Impuesto (15%):</span>
              <span>L {invoice.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="totals-row total">
            <span>TOTAL A PAGAR:</span>
            <span>L {invoice.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        {(invoice.notes || 'Gracias por confiar en nuestros servicios. Por favor, realice el pago dentro del plazo especificado.') && (
          <div className="invoice-notes">
            <p>
              <strong>Nota:</strong> {invoice.notes || 'Gracias por confiar en nuestros servicios. Por favor, realice el pago dentro del plazo especificado.'}
            </p>
          </div>
        )}

        {/* Pie de página */}
        <div className="invoice-footer">
          <p>Esta factura es válida con sello y firma digital</p>
          <p>Emitida el {invoiceDate.toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  )
}
