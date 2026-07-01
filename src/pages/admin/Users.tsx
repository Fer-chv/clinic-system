import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Table, Button, Modal, Form, Input, Upload, Space, notification, Tag, Avatar, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, LockOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { User } from '@/types'
import { getValidationRules } from '@/services/validation'
import { useThemeColors } from '@/hooks/useThemeColors'
import './Users.css'

export default function Users() {
  useThemeColors()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>(databaseService.getAllUsers() || [])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Recepcionista', value: 'receptionist' },
  ]

  const loadUsers = () => {
    const allUsers = databaseService.getAllUsers() || []
    setUsers(allUsers)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setPhotoPreview(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setPhotoPreview(user.photo || null)
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (userId: string) => {
    databaseService.deleteUser(userId)
    notification.success({
      message: 'Ã‰xito',
      description: 'Usuario eliminado correctamente',
      placement: 'topRight',
    })
    loadUsers()
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

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      if (editingUser) {
        const updatedUser: User = {
          ...editingUser,
          name: values.name,
          email: values.email,
          username: values.username,
          role: values.role,
          photo: photoPreview,
          updatedAt: new Date().toISOString(),
        }
        databaseService.updateUser(editingUser.id, updatedUser)
        notification.success({
        message: 'Ã‰xito',
        description: 'Usuario actualizado correctamente',
        placement: 'topRight',
      })
      } else {
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: values.name,
          email: values.email,
          username: values.username,
          password: values.password,
          role: values.role,
          photo: photoPreview,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        databaseService.createUser(newUser)
        notification.success({
        message: 'Ã‰xito',
        description: 'Usuario creado correctamente',
        placement: 'topRight',
      })
      }
      setIsModalVisible(false)
      form.resetFields()
      setPhotoPreview(null)
      loadUsers()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al guardar el usuario',
        placement: 'topRight',
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Foto',
      dataIndex: 'photo',
      key: 'photo',
      width: 60,
      render: (photo: string | undefined, record: User) => (
        <Avatar
          src={photo}
          icon={!photo ? <UserOutlined /> : undefined}
          size="large"
          style={{ background: '#131e4e' }}
        />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = {
          admin: 'red',
          doctor: 'blue',
          receptionist: 'green',
        }
        const labels: Record<string, string> = {
          admin: 'Administrador',
          doctor: 'Doctor',
          receptionist: 'Recepcionista',
        }
        return <Tag color={colors[role]}>{labels[role]}</Tag>
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Eliminar usuario"
            description="Â¿EstÃ¡ seguro de que desea eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="SÃ­"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="users-container">
      <div className="users-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/settings')}
          className="back-button"
        >
          AtrÃ¡s
        </Button>
        <h1>ðŸ‘¥ AdministraciÃ³n de Usuarios</h1>
        <p>Gestiona los usuarios del sistema</p>
      </div>

      <Card className="users-card">
        <div className="users-toolbar">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="add-user-btn"
          >
            Agregar Usuario
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="users-table"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingUser ? 'âœï¸ Editar Usuario' : 'âž• Nuevo Usuario'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setPhotoPreview(null)
        }}
        footer={null}
        width={580}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginBottom: 0 }}
        >
          {/* SECCIÃ“N: Foto de Perfil */}
          <div className="modal-section">
            <div className="modal-section-header">ðŸ“· Foto de Perfil</div>

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
                  background: '#131e4e',
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
                        background: '#131e4e',
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
                  JPG, PNG o GIF Â· MÃ¡ximo 2MB
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÃ“N: InformaciÃ³n del Usuario */}
          <div className="modal-section">
            <div className="modal-section-header">ðŸ‘¤ InformaciÃ³n del Usuario</div>

            <Form.Item
              label="Nombre Completo"
              name="name"
              rules={getValidationRules('name')}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="Juan GarcÃ­a" />
            </Form.Item>

            <Form.Item
              label="Nombre de Usuario"
              name="username"
              rules={getValidationRules('name')}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="juangarcia" />
            </Form.Item>

            <Form.Item
              label="Correo ElectrÃ³nico"
              name="email"
              rules={getValidationRules('email')}
              style={{ marginBottom: 0 }}
            >
              <Input
                type="email"
                placeholder="juan@clinic.com"
              />
            </Form.Item>
          </div>

          {/* SECCIÃ“N: Seguridad */}
          <div className="modal-section">
            <div className="modal-section-header">ðŸ” Seguridad</div>

            {!editingUser && (
              <Form.Item
                label="ContraseÃ±a"
                name="password"
                rules={getValidationRules('password')}
                style={{ marginBottom: '12px' }}
              >
                <Input.Password placeholder="Ingrese una contraseÃ±a segura" />
              </Form.Item>
            )}

            {editingUser && (
              <Form.Item
                label="Nueva ContraseÃ±a"
                name="password"
                style={{ marginBottom: '12px' }}
                extra="Dejar vacÃ­o para mantener la actual"
              >
                <Input.Password placeholder="Dejar vacÃ­o si no desea cambiar" />
              </Form.Item>
            )}

            <Form.Item
              label="Rol"
              name="role"
              rules={[{ required: true, message: 'Rol requerido' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Seleccione un rol"
                options={roles}
              />
            </Form.Item>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)',
                border: 'none'
              }}
            >
              {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false)
                form.resetFields()
                setPhotoPreview(null)
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

