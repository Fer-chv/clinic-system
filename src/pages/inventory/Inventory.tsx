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
  Popconfirm,
  Tabs,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, WarningOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { InventoryProduct } from '@/types'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './Inventory.css'

interface Product extends InventoryProduct {
  type?: 'product' | 'service'
}

export default function Inventory() {
  useThemeColors()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products')

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, activeTab])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = databaseService.getAllProducts() || []
      setItems(data as Product[])
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al cargar productos y servicios', placement: 'topRight' })
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items.filter(item => {
      const type = item.type || 'product'
      const matchesTab = activeTab === 'products' ? type === 'product' : type === 'service'
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTab && matchesSearch
    })
    setFilteredItems(filtered)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditItem = (item: Product) => {
    setEditingItem(item)
    form.setFieldsValue(item)
    setIsModalVisible(true)
  }

  const handleDeleteItem = (id: string) => {
    databaseService.deleteProduct(id)
    setItems(items.filter(p => p.id !== id))
    message.success({ message: '�xito', description: 'Elemento eliminado', placement: 'topRight' })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const type = activeTab === 'products' ? 'product' : 'service'

      if (editingItem) {
        const updated = {
          ...editingItem,
          ...values,
          type,
          updatedAt: new Date().toISOString(),
        }
        databaseService.updateProduct(editingItem.id, updated)
        setItems(items.map(p => (p.id === editingItem.id ? updated : p)))
        message.success({ message: '�xito', description: 'Elemento actualizado', placement: 'topRight' })
      } else {
        const newItem: Product = {
          id: `item_${Date.now()}`,
          ...values,
          type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        databaseService.createProduct(newItem)
        setItems([...items, newItem])
        message.success({ message: '�xito', description: 'Elemento creado', placement: 'topRight' })
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al guardar', placement: 'topRight' })
    }
  }

  const productColumns = [
    {
      title: 'Producto',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <div>
          <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{text}</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
            {record.category}
          </p>
        </div>
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (qty: number, record: Product) => (
        <Tag color={qty <= (record.minStock || 0) ? 'red' : 'green'}>
          {qty}
        </Tag>
      ),
    },
    {
      title: 'Mínimo',
      dataIndex: 'minStock',
      key: 'minStock',
      width: 80,
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `L ${price.toLocaleString()}`,
    },
    {
      title: 'Total',
      key: 'total',
      width: 110,
      render: (_: any, record: Product) => {
        const total = (record.quantity || 0) * (record.unitPrice || 0)
        return `L ${total.toLocaleString()}`
      },
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditItem(record)}
            size="small"
          />
          <Popconfirm
            title="¿Eliminar?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const serviceColumns = [
    {
      title: 'Servicio',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <div>
          <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{text}</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
            {record.description || 'Sin descripción'}
          </p>
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Precio',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (price: number) => <span style={{ fontWeight: '600', color: '#10b981' }}>L {price.toLocaleString()}</span>,
    },
    {
      title: 'Duración',
      dataIndex: 'quantity',
      key: 'duration',
      width: 100,
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditItem(record)}
            size="small"
          />
          <Popconfirm
            title="¿Eliminar?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const getTotalValue = () => {
    return filteredItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0)
  }

  const getLowStockCount = () => {
    return filteredItems.filter(item => (item.quantity || 0) <= (item.minStock || 0)).length
  }

  return (
    <div className="inventory-container">
      <ModuleHeader
        title="Inventario"
        icon={<ShoppingCartOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona productos y servicios de tu clínica"
        searchPlaceholder="Buscar producto o servicio..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'products' | 'services')}
        items={[
          {
            key: 'products',
            label: '🛍️ Productos',
            children: (
              <>
                <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={12}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                          Total de Productos
                        </p>
                        <p style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#131e4e' }}>
                          {filteredItems.length}
                        </p>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                          Valor Total
                        </p>
                        <p style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                          L {getTotalValue().toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  </Col>
                  {getLowStockCount() > 0 && (
                    <Col xs={24} sm={12}>
                      <Card style={{ background: '#fef2f2' }}>
                        <div style={{ textAlign: 'center' }}>
                          <WarningOutlined style={{ fontSize: '20px', color: '#ef4444', marginRight: '8px' }} />
                          <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                            {getLowStockCount()} productos con bajo stock
                          </p>
                        </div>
                      </Card>
                    </Col>
                  )}
                </Row>

                <Card>
                  <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12}>
                      <Input
                        placeholder="Buscar producto..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddItem}
                        size="large"
                        style={{ background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)', border: 'none' }}
                      >
                        Nuevo Producto
                      </Button>
                    </Col>
                  </Row>

                  <Table
                    columns={productColumns}
                    dataSource={filteredItems}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'services',
            label: '💆 Servicios',
            children: (
              <>
                <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={12}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                          Total de Servicios
                        </p>
                        <p style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#131e4e' }}>
                          {filteredItems.length}
                        </p>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card>
                  <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12}>
                      <Input
                        placeholder="Buscar servicio..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddItem}
                        size="large"
                        style={{ background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)', border: 'none' }}
                      >
                        Nuevo Servicio
                      </Button>
                    </Col>
                  </Row>

                  <Table
                    columns={serviceColumns}
                    dataSource={filteredItems}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </>
            ),
          },
        ]}
      />

      {/* Modal */}
      <Modal
        title={editingItem ? `✏️ Editar ${activeTab === 'products' ? 'Producto' : 'Servicio'}` : `➕ Nuevo ${activeTab === 'products' ? 'Producto' : 'Servicio'}`}
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
          {/* SECCIÓN: Información Básica */}
          <div className="modal-section">
            <div className="modal-section-header">ℹ️ Información Básica</div>

            <Form.Item
              name="name"
              label="Nombre"
              rules={[{ required: true, message: 'Requerido' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={activeTab === 'products' ? 'Resina dental' : 'Limpieza'} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Categoría"
              rules={[{ required: true, message: 'Requerido' }]}
              style={{ marginBottom: '12px' }}
            >
              <Select
                placeholder="Seleccione categoría"
                options={[
                  { label: 'Materiales', value: 'Materiales' },
                  { label: 'Medicinas', value: 'Medicinas' },
                  { label: 'Equipos', value: 'Equipos' },
                  { label: 'Tratamientos', value: 'Tratamientos' },
                  { label: 'Higiene', value: 'Higiene' },
                ]}
              />
            </Form.Item>

            {activeTab === 'products' && (
              <Form.Item
                name="description"
                label="Descripción"
                style={{ marginBottom: 0 }}
              >
                <Input.TextArea placeholder="Descripción del producto" rows={2} />
              </Form.Item>
            )}

            {activeTab === 'services' && (
              <Form.Item
                name="description"
                label="Descripción"
                style={{ marginBottom: 0 }}
              >
                <Input.TextArea placeholder="Descripción del servicio" rows={2} />
              </Form.Item>
            )}
          </div>

          {/* SECCIÓN: Precio */}
          <div className="modal-section">
            <div className="modal-section-header">💰 Precio</div>

            <Form.Item
              name="unitPrice"
              label="Precio (L)"
              rules={[{ required: true, message: 'Requerido' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                min={0}
                placeholder="0.00"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          {/* SECCIÓN: Específica por tipo */}
          {activeTab === 'products' && (
            <div className="modal-section">
              <div className="modal-section-header">📦 Información de Producto</div>

              <Form.Item
                name="quantity"
                label="Cantidad en Stock"
                rules={[{ required: true, message: 'Requerido' }]}
                style={{ marginBottom: '12px' }}
              >
                <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="minStock"
                label="Stock Mínimo"
                rules={[{ required: true, message: 'Requerido' }]}
                style={{ marginBottom: '12px' }}
              >
                <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="supplier"
                label="Proveedor"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Nombre del proveedor" />
              </Form.Item>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="modal-section">
              <div className="modal-section-header">⏱️ Duración</div>

              <Form.Item
                name="quantity"
                label="Duración (minutos)"
                rules={[{ required: true, message: 'Requerido' }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber min={0} placeholder="30" style={{ width: '100%' }} />
              </Form.Item>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)',
                border: 'none',
              }}
            >
              {editingItem ? 'Actualizar' : 'Crear'}
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


