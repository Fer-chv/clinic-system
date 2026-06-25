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
  Select,
} from 'antd'
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { User, UserRole } from '@/types'
import { getValidationRules } from '@/services/validation'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './Doctors.css'

export default function Doctors() {
  useThemeColors()
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([])

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchTerm])

  const loadDoctors = async () => {
    setLoading(true)
    try {
      const data = databaseService.getAllUsers()
      const doctorsOnly = data.filter((u: User) => u.role === 'doctor')
      setDoctors(doctorsOnly || [])
    } catch (error) {
      message.error('Error al cargar doctores')
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    if (!searchTerm) {
      setFilteredDoctors(doctors)
      return
    }

    const filtered = doctors.filter(
      d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone?.includes(searchTerm)
    )
    setFilteredDoctors(filtered)
  }

  const handleAddDoctor = () => {
    setEditingDoctor(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditDoctor = (doctor: User) => {
    setEditingDoctor(doctor)
    form.setFieldsValue(doctor)
    setIsModalVisible(true)
  }

  const handleDeleteDoctor = (id: string) => {
    try {
      databaseService.deleteUser(id)
      setDoctors(doctors.filter(d => d.id !== id))
      message.success('Doctor eliminado')
    } catch (error) {
      message.error('Error al eliminar doctor')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (editingDoctor) {
        const updated = {
          ...editingDoctor,
          ...values,
          updatedAt: new Date().toISOString(),
        }
        databaseService.updateUser(editingDoctor.id, updated)
        setDoctors(
          doctors.map(d => (d.id === editingDoctor.id ? updated : d))
        )
        message.success('Doctor actualizado')
      } else {
        const newDoctor: User = {
          id: `doctor_${Date.now()}`,
          ...values,
          role: 'doctor',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        databaseService.createUser(newDoctor)
        setDoctors([...doctors, newDoctor])
        message.success('Doctor creado')
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('Error al guardar doctor')
    }
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Especialización',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditDoctor(record)}
            title="Editar"
          />
          <Popconfirm
            title="¿Eliminar doctor?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDeleteDoctor(record.id)}
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
    <div className="doctors-container">
      <ModuleHeader
        title="Doctores"
        icon={<TeamOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona el equipo profesional de tu clínica"
        searchPlaceholder="Buscar por nombre, email o teléfono..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddDoctor}
        addButtonText="Nuevo Doctor"
      />

      <Card className="doctors-card">
        <Table
          columns={columns}
          dataSource={filteredDoctors}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredDoctors.length,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} doctores`,
          }}
        />
      </Card>

      <Modal
        title={editingDoctor ? '✏️ Editar Doctor' : '➕ Nuevo Doctor'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={580}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          style={{ marginBottom: 0 }}
        >
          {/* SECCIÓN: Información Personal */}
          <div className="modal-section">
            <div className="modal-section-header">👤 Información Personal</div>

            <Form.Item
              name="name"
              label="Nombre Completo"
              rules={[{ required: true, message: 'Ingrese el nombre' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="Dr. Juan Pérez" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={getValidationRules('email')}
              style={{ marginBottom: '12px' }}
            >
              <Input type="email" placeholder="doctor@clinic.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Teléfono"
              rules={getValidationRules('phone')}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="555-1234" />
            </Form.Item>
          </div>

          {/* SECCIÓN: Profesional */}
          <div className="modal-section">
            <div className="modal-section-header">🏥 Información Profesional</div>

            <Form.Item
              name="specialization"
              label="Especialización"
              rules={[{ required: true, message: 'Ingrese la especialización' }]}
              style={{ marginBottom: '12px' }}
            >
              <Select
                placeholder="Seleccione especialización"
                options={[
                  { label: 'Ortodoncia', value: 'Ortodoncia' },
                  { label: 'Periodoncia', value: 'Periodoncia' },
                  { label: 'Endodoncia', value: 'Endodoncia' },
                  { label: 'Odontología General', value: 'Odontología General' },
                  { label: 'Cirugía Maxilofacial', value: 'Cirugía Maxilofacial' },
                  { label: 'Implantología', value: 'Implantología' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="earningsPercentage"
              label="Porcentaje de Ganancias (%)"
              rules={[{ required: true, message: 'Ingrese el porcentaje' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="40"
              />
            </Form.Item>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              {editingDoctor ? 'Actualizar Doctor' : 'Crear Doctor'}
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false)
                form.resetFields()
              }}
              block
              size="large"
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
