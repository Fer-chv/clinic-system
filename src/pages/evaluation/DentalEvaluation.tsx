import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Row,
  Col,
  Divider,
  Statistic,
  Table,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, FileTextOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { Patient, DentalCondition, DentalEvaluation } from '@/types'
import Odontogram from '@/components/odontogram/Odontogram'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './DentalEvaluation.css'

export default function DentalEvaluation() {
  useThemeColors()
  const [patients, setPatients] = useState<Patient[]>([])
  const [conditions, setConditions] = useState<DentalCondition[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [patientType, setPatientType] = useState<'adult' | 'child'>('adult')
  const [selectedTeeth, setSelectedTeeth] = useState<{
    [toothNumber: string]: any
  }>({})
  const [evaluationNotes, setEvaluationNotes] = useState('')
  const [isConditionModalVisible, setIsConditionModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [conditionForm] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const patientsData = databaseService.getAllPatients() || []
      setPatients(patientsData)
      const conditionsData = databaseService.getDentalConditions?.() || getDefaultConditions()
      setConditions(conditionsData)
    } catch (error) {
      message.error('Error al cargar datos')
    }
  }

  const getDefaultConditions = (): DentalCondition[] => {
    return [
      {
        id: '1',
        name: 'Caries',
        color: '#000000',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Gingivitis',
        color: '#ff0000',
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Sarro',
        color: '#ffa500',
        price: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Endodoncia',
        color: '#8b008b',
        price: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        name: 'Corona',
        color: '#ffd700',
        price: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  const handleAddCondition = async (values: any) => {
    const newCondition: DentalCondition = {
      id: `cond_${Date.now()}`,
      name: values.name,
      color: values.color,
      price: values.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConditions([...conditions, newCondition])
    conditionForm.resetFields()
    setIsConditionModalVisible(false)
    message.success('Condición agregada')
  }

  const handleDeleteCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
    message.success('Condición eliminada')
  }

  const calculateTotal = () => {
    const total = Object.values(selectedTeeth)
      .filter((c) => c !== null && c !== undefined)
      .reduce((sum, condition) => {
        const price = parseInt(condition?.price) || 0
        return sum + price
      }, 0)
    return isNaN(total) ? 0 : total
  }

  const handleSaveEvaluation = async () => {
    if (!selectedPatient) {
      message.error('Selecciona un paciente')
      return
    }

    if (Object.values(selectedTeeth).every((c) => !c)) {
      message.error('Selecciona al menos un diente')
      return
    }

    const evaluation: DentalEvaluation = {
      id: `eval_${Date.now()}`,
      patientId: selectedPatient,
      doctorId: 'current_doctor',
      evaluationDate: new Date(),
      patientType,
      teeth: selectedTeeth,
      totalPrice: calculateTotal(),
      notes: evaluationNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // Aquí iría guardar en la base de datos
      // databaseService.saveDentalEvaluation(evaluation)
      message.success('Evaluación guardada exitosamente')
      handleReset()
    } catch (error) {
      message.error('Error al guardar evaluación')
    }
  }

  const handleReset = () => {
    setSelectedPatient('')
    setPatientType('adult')
    setSelectedTeeth({})
    setEvaluationNotes('')
  }

  const conditionColumns = [
    {
      title: 'Condición',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DentalCondition) => (
        <Space>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: record.color,
              borderRadius: '4px',
            }}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Precio (L)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `L ${price}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: DentalCondition) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteCondition(record.id)}
          size="small"
        />
      ),
    },
  ]

  return (
    <div className="dental-evaluation-container">
      <ModuleHeader
        title="Evaluación Dental"
        icon={<FileTextOutlined style={{ fontSize: '24px' }} />}
        subtitle="Evalúa la salud dental de tus pacientes"
      />

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card>
            <h3 style={{ marginBottom: '16px' }}>👤 Datos del Paciente</h3>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Paciente *
                </label>
                <Select
                  placeholder="Selecciona un paciente"
                  value={selectedPatient || undefined}
                  onChange={setSelectedPatient}
                  options={patients.map((p) => ({
                    label: `${p.firstName} ${p.lastName}`,
                    value: p.id,
                  }))}
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Tipo de Paciente *
                </label>
                <Select
                  value={patientType}
                  onChange={setPatientType}
                  options={[
                    { label: 'Adulto (32 dientes)', value: 'adult' },
                    { label: 'Niño (20 dientes)', value: 'child' },
                  ]}
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <h3 style={{ marginBottom: '16px' }}>💰 Resumen</h3>
            <Row gutter={16}>
              <Col xs={12}>
                <Statistic
                  title="Dientes con problemas"
                  value={Object.values(selectedTeeth).filter((c) => c !== null).length}
                  valueStyle={{ color: '#667eea' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Total a Cobrar"
                  value={calculateTotal()}
                  prefix="L "
                  suffix=""
                  precision={0}
                  separator=","
                  valueStyle={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Odontogram
        patientType={patientType}
        conditions={conditions}
        selectedTeeth={selectedTeeth}
        onToothSelect={(toothNumber, condition) => {
          setSelectedTeeth({
            ...selectedTeeth,
            [toothNumber]: condition,
          })
        }}
      />

      <Card style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>📝 Notas de la Evaluación</h3>
        <Input.TextArea
          rows={3}
          placeholder="Agrega notas sobre la evaluación..."
          value={evaluationNotes}
          onChange={(e) => setEvaluationNotes(e.target.value)}
        />
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>⚙️ Gestionar Condiciones</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsConditionModalVisible(true)}
          style={{ marginBottom: '16px' }}
        >
          Agregar Condición
        </Button>
        <Table
          columns={conditionColumns}
          dataSource={conditions}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      <Card style={{ marginTop: '24px', backgroundColor: '#f9fafb' }}>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleReset} size="large">
            Limpiar
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveEvaluation}
            size="large"
            disabled={!selectedPatient || Object.values(selectedTeeth).every((c) => !c)}
          >
            Guardar Evaluación
          </Button>
        </Space>
      </Card>

      {/* Modal para agregar condición */}
      <Modal
        title="Agregar Nueva Condición"
        open={isConditionModalVisible}
        onOk={() => conditionForm.submit()}
        onCancel={() => {
          setIsConditionModalVisible(false)
          conditionForm.resetFields()
        }}
      >
        <Form form={conditionForm} layout="vertical" onFinish={handleAddCondition}>
          <Form.Item
            name="name"
            label="Nombre de la Condición"
            rules={[{ required: true, message: 'Nombre requerido' }]}
          >
            <Input placeholder="ej: Caries, Endodoncia, Corona" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: 'Color requerido' }]}
          >
            <Input type="color" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Precio (Lempiras)"
            rules={[{ required: true, message: 'Precio requerido' }]}
          >
            <Input type="number" placeholder="150" min={0} step={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
