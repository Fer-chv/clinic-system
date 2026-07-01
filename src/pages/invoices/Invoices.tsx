import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Card,
  Row,
  Col,
  Select,
  Tag,
  DatePicker,
  Divider,
} from 'antd'
import { EditOutlined, DeleteOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { Invoice, Patient, User } from '@/types'
import dayjs from 'dayjs'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useSettingsStore } from '@/stores/settingsStore'
import InvoicePreview from '@/components/invoices/InvoicePreview'
import '@/components/layout/ModuleHeader.css'
import './Invoices.css'

export default function Invoices() {
  useThemeColors()
  const { settings } = useSettingsStore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [formValues, setFormValues] = useState({
    patientId: '',
    doctorId: '',
    issueDate: dayjs(),
    dueDate: dayjs().add(30, 'days'),
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, searchTerm])

  const loadData = async () => {
    setLoading(true)
    try {
      setPatients(databaseService.getAllPatients() || [])
      const allUsers = databaseService.getAllUsers() || []
      setDoctors(allUsers.filter((u: User) => u.role === 'doctor'))
      setInvoices(databaseService.getAllInvoices() || [])
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al cargar datos', placement: 'topRight' })
    } finally {
      setLoading(false)
    }
  }

  const filterInvoices = () => {
    if (!searchTerm) {
      setFilteredInvoices(invoices)
      return
    }

    const filtered = invoices.filter(
      i =>
        getPatientName(i.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.includes(searchTerm)
    )
    setFilteredInvoices(filtered)
  }

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'
  }

  const getDoctorName = (id: string) => {
    const doctor = doctors.find(d => d.id === id)
    return doctor ? doctor.name : 'N/A'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      paid: 'green',
      overdue: 'red',
    }
    return colors[status] || 'default'
  }

  const handleAddInvoice = () => {
    setEditingInvoice(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleDeleteInvoice = (id: string) => {
    databaseService.deleteInvoice(id)
    setInvoices(invoices.filter(i => i.id !== id))
    message.success({ message: 'Éxito', description: 'Factura eliminada', placement: 'topRight' })
  }

  const handlePrint = (invoice: Invoice) => {
    setPreviewInvoice(invoice)
    setIsPreviewVisible(true)
  }

  const handleChangeStatus = (id: string, status: string) => {
    const invoice = invoices.find(i => i.id === id)
    if (invoice) {
      const updated = {
        ...invoice,
        status: status as any,
        updatedAt: new Date().toISOString(),
      }
      databaseService.updateInvoice(id, updated)
      setInvoices(
        invoices.map(i =>
          i.id === id ? updated : i
        )
      )
      message.success({ message: 'Éxito', description: 'Estado actualizado', placement: 'topRight' })
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      const newInvoice: Invoice = {
        id: 'INV-' + Date.now(),
        patientId: values.patientId,
        doctorId: values.doctorId,
        appointmentId: values.appointmentId || '',
        issueDate: values.issueDate.toDate(),
        dueDate: values.dueDate.toDate(),
        subtotal: values.subtotal || 0,
        discount: values.discount || 0,
        tax: values.tax || 0,
        total: values.total || 0,
        items: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      databaseService.createInvoice(newInvoice)
      setInvoices([...invoices, newInvoice])
      message.success({ message: 'Éxito', description: 'Factura creada', placement: 'topRight' })
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al guardar factura', placement: 'topRight' })
    }
  }

  const columns = [
    {
      title: 'Factura',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Paciente',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (id: string) => getPatientName(id),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (id: string) => getDoctorName(id),
    },
    {
      title: 'Monto',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (total: number) => `L${total.toFixed(2)}`,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Fecha',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      render: (_: any, record: Invoice) => (
        <Space size="small">
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            title="Imprimir"
          />
          <Select
            style={{ width: '80px' }}
            value={record.status}
            onChange={(value) => handleChangeStatus(record.id, value)}
            options={[
              { label: 'Pendiente', value: 'pending' },
              { label: 'Pagada', value: 'paid' },
              { label: 'Vencida', value: 'overdue' },
            ]}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteInvoice(record.id)}
          />
        </Space>
      ),
    },
  ]

  const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0)
  const paidAmount = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0)
  const pendingAmount = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="invoices-container">
      <ModuleHeader
        title="FacturaciÃ³n"
        icon={<FileTextOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona todas tus facturas e ingresos"
        searchPlaceholder="Buscar factura o paciente..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddInvoice}
        addButtonText="Nueva Factura"
      />

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Total Facturado</h3>
              <h2 style={{ margin: 0, color: '#1890ff' }}>L{totalRevenue.toFixed(2)}</h2>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Pagado</h3>
              <h2 style={{ margin: 0, color: '#52c41a' }}>L{paidAmount.toFixed(2)}</h2>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Pendiente</h3>
              <h2 style={{ margin: 0, color: '#ff7875' }}>L{pendingAmount.toFixed(2)}</h2>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Total Facturas</h3>
              <h2 style={{ margin: 0, color: '#faad14' }}>{invoices.length}</h2>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="invoices-card">
        <Table
          columns={columns}
          dataSource={filteredInvoices}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} facturas`,
          }}
        />
      </Card>

      <Modal
        title="Nueva Factura - Vista Previa en Tiempo Real"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width="90vw"
        style={{ maxWidth: '1400px' }}
        maskClosable={false}
        bodyStyle={{ maxHeight: '90vh', overflowY: 'auto' }}
        wrapClassName="invoice-modal-mobile"
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={(_, allValues) => {
                setFormValues({
                  patientId: allValues.patientId || '',
                  doctorId: allValues.doctorId || '',
                  issueDate: allValues.issueDate || dayjs(),
                  dueDate: allValues.dueDate || dayjs().add(30, 'days'),
                  subtotal: allValues.subtotal || 0,
                  discount: allValues.discount || 0,
                  tax: allValues.tax || 0,
                  total: allValues.total || 0,
                  notes: allValues.notes || '',
                })
              }}
            >
          <Form.Item
            name="patientId"
            label="Paciente"
            rules={[{ required: true, message: 'Seleccione paciente' }]}
          >
            <Select
              placeholder="Seleccione paciente"
              options={patients.map(p => ({
                label: `${p.firstName} ${p.lastName}`,
                value: p.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="doctorId"
            label="Doctor"
            rules={[{ required: true, message: 'Seleccione doctor' }]}
          >
            <Select
              placeholder="Seleccione doctor"
              options={doctors.map(d => ({
                label: d.name,
                value: d.id,
              }))}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="issueDate"
                label="Fecha EmisiÃ³n"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dueDate"
                label="Fecha Vencimiento"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Montos</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="subtotal"
                label="Subtotal"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={0.01} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="discount" label="Descuento">
                <InputNumber min={0} step={0.01} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="tax" label="Impuesto">
                <InputNumber min={0} step={0.01} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="total"
                label="Total"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={0.01} />
              </Form.Item>
            </Col>
          </Row>

              <Form.Item name="notes" label="Notas">
                <Input.TextArea placeholder="Notas..." rows={2} />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} lg={12} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>ðŸ“„ Vista Previa en Tiempo Real</h3>
                <Space size="small">
                  <Button
                    type="primary"
                    size="small"
                    icon={<PrinterOutlined />}
                    onClick={() => {
                      const tempInvoice = {
                        id: 'INV-' + Date.now(),
                        patientId: formValues.patientId,
                        doctorId: formValues.doctorId,
                        appointmentId: '',
                        issueDate: formValues.issueDate.toDate(),
                        dueDate: formValues.dueDate.toDate(),
                        subtotal: formValues.subtotal,
                        discount: formValues.discount,
                        tax: formValues.tax,
                        total: formValues.total,
                        items: [],
                        notes: formValues.notes,
                        status: 'pending' as const,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }
                      setPreviewInvoice(tempInvoice)
                      setIsPreviewVisible(true)
                    }}
                  >
                    Imprimir
                  </Button>
                </Space>
              </div>
              <InvoicePreview
                invoice={{
                  id: 'INV-' + Date.now(),
                  patientId: formValues.patientId,
                  doctorId: formValues.doctorId,
                  appointmentId: '',
                  issueDate: formValues.issueDate.toDate(),
                  dueDate: formValues.dueDate.toDate(),
                  subtotal: formValues.subtotal,
                  discount: formValues.discount,
                  tax: formValues.tax,
                  total: formValues.total,
                  items: [],
                  notes: formValues.notes,
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }}
                patient={patients.find(p => p.id === formValues.patientId)}
                doctor={doctors.find(d => d.id === formValues.doctorId)}
                clinicName={settings.clinicName}
                isPreview={true}
              />
            </div>
          </Col>
        </Row>
      </Modal>

      {/* Modal de Vista Previa de Factura */}
      <Modal
        title="Vista Previa de Factura"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width="100%"
        style={{ top: 0 }}
        bodyStyle={{ height: 'calc(100vh - 110px)', overflow: 'auto' }}
        footer={null}
      >
        {previewInvoice && (
          <InvoicePreview
            invoice={previewInvoice}
            patient={patients.find(p => p.id === previewInvoice.patientId)}
            doctor={doctors.find(d => d.id === previewInvoice.doctorId)}
            clinicName={settings.clinicName}
          />
        )}
      </Modal>
    </div>
  )
}


