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
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  Upload,
  Select,
  Avatar,
} from 'antd'
import { EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { Patient } from '@/types'
import { getValidationRules } from '@/services/validation'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './Patients.css'

export default function Patients() {
  useThemeColors()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const data = databaseService.getAllPatients()
      setPatients(data || [])
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al cargar pacientes', placement: 'topRight' })
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter(
      p =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    form.resetFields()
    setPhotoPreview(null)
    setIsModalVisible(true)
  }

  const handlePhotoUpload = (info: any) => {
    const file = info.file.originFileObj || info.file
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setPhotoPreview(patient.photo || null)
    form.setFieldsValue(patient)
    setIsModalVisible(true)
  }

  const handleDeletePatient = (id: string) => {
    try {
      databaseService.deletePatient(id)
      setPatients(patients.filter(p => p.id !== id))
      message.success({ message: '�xito', description: 'Paciente eliminado', placement: 'topRight' })
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al eliminar paciente', placement: 'topRight' })
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const patientData = { ...values, photo: photoPreview }

      if (editingPatient) {
        databaseService.updatePatient(editingPatient.id, patientData)
        setPatients(
          patients.map(p => (p.id === editingPatient.id ? { ...p, ...patientData } : p))
        )
        message.success({ message: '�xito', description: 'Paciente actualizado', placement: 'topRight' })
      } else {
        const newPatient: Patient = {
          ...databaseService.createPatient(patientData),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Patient

        // Crear automáticamente el expediente clínico del paciente
        const newClinicalRecord = {
          id: `rec_${Date.now()}`,
          patientId: newPatient.id,
          treatments: [],
          beforePhotos: [],
          afterPhotos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        databaseService.createClinicalRecord(newClinicalRecord)

        setPatients([...patients, newPatient])
        message.success({ message: '�xito', description: 'Paciente creado con expediente clínico', placement: 'topRight' })
      }

      setIsModalVisible(false)
      form.resetFields()
      setPhotoPreview(null)
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al guardar paciente', placement: 'topRight' })
    }
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string, record: Patient) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Edad',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ciudad',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: any, record: Patient) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPatient(record)}
            title="Editar"
          />
          <Popconfirm
            title="¿Eliminar paciente?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDeletePatient(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Eliminar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="patients-container">
      <ModuleHeader
        title="Pacientes"
        icon={<UserOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona los datos de tus pacientes"
        searchPlaceholder="Buscar por nombre, teléfono o email..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddPatient}
        addButtonText="Nuevo Paciente"
      />

      <Card className="patients-card">
        <Table
          columns={columns}
          dataSource={filteredPatients}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredPatients.length,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} pacientes`,
          }}
        />
      </Card>

      <Modal
        title={editingPatient ? '✏️ Editar Paciente' : '➕ Nuevo Paciente'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setPhotoPreview(null)
        }}
        width={580}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" style={{ marginBottom: 0 }}>
          {/* SECCIÓN: Foto de Perfil */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📷 Foto de Perfil
            </div>

            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <Avatar
                src={photoPreview}
                size={100}
                style={{
                  background: 'var(--color-primary)',
                  flexShrink: 0,
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#1f2937' }}>
                  {photoPreview ? 'Foto cargada correctamente' : 'Sin foto de perfil'}
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <Upload
                    maxCount={1}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    showUploadList={false}
                  >
                    <Button
                      type="primary"
                      size="small"
                      icon={<UploadOutlined />}
                      style={{
                        background: 'var(--color-primary)',
                        border: 'none'
                      }}
                    >
                      Cambiar foto
                    </Button>
                  </Upload>

                  {photoPreview && (
                    <Button
                      danger
                      size="small"
                      onClick={() => setPhotoPreview(null)}
                    >
                      Quitar
                    </Button>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                  JPG, PNG o GIF · Máximo 2MB
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN: Información Personal */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              👤 Información Personal
            </div>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label="Nombre"
                  rules={[{ required: true, message: 'Nombre requerido' }]}
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="Juan" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label="Apellido"
                  rules={[{ required: true, message: 'Apellido requerido' }]}
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="Pérez" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="age"
                  label="Edad"
                  rules={[{ required: true, message: 'Edad requerida' }]}
                  style={{ marginBottom: '12px' }}
                >
                  <InputNumber min={0} max={150} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label="Género"
                  style={{ marginBottom: '12px' }}
                >
                  <Select
                    placeholder="Seleccionar"
                    options={[
                      { label: 'Masculino', value: 'male' },
                      { label: 'Femenino', value: 'female' },
                      { label: 'Otro', value: 'other' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* SECCIÓN: Contacto */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📞 Información de Contacto
            </div>

            <Form.Item
              name="phone"
              label="Teléfono"
              rules={getValidationRules('phone')}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="555-1234" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={getValidationRules('email')}
              style={{ marginBottom: '12px' }}
            >
              <Input type="email" placeholder="correo@ejemplo.com" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Dirección"
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="Calle Principal 123" />
            </Form.Item>

            <Form.Item
              name="city"
              label="Ciudad"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Ciudad" />
            </Form.Item>
          </div>

          {/* SECCIÓN: Información Médica */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🏥 Información Médica
            </div>

            <Form.Item
              name="allergies"
              label="Alergias"
              style={{ marginBottom: '12px' }}
              extra="Separadas por comas"
            >
              <Input placeholder="Penicilina, Latex" />
            </Form.Item>

            <Form.Item
              name="medicalConditions"
              label="Condiciones Médicas"
              style={{ marginBottom: '12px' }}
              extra="Separadas por comas"
            >
              <Input placeholder="Diabetes, Presión alta" />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Notas"
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea placeholder="Notas adicionales del paciente..." rows={2} />
            </Form.Item>
          </div>

          {/* SECCIÓN: Contacto de Emergencia */}
          <div>
            <div style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🚨 Contacto de Emergencia
            </div>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="emergencyContact"
                  label="Nombre"
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="María Pérez" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="emergencyPhone"
                  label="Teléfono"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="555-5678" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  )
}


