import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  notification,
  Card,
  Row,
  Col,
  Select,
  Upload,
  Tabs,
  Empty,
  Timeline,
  Avatar,
  Badge,
} from 'antd'
import { EditOutlined, DeleteOutlined, UploadOutlined, FormOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { ClinicalRecord, Patient, User, Appointment } from '@/types'
import dayjs from 'dayjs'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './ClinicalRecords.css'

export default function ClinicalRecords() {
  useThemeColors()
  const [records, setRecords] = useState<ClinicalRecord[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ClinicalRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRecords, setFilteredRecords] = useState<ClinicalRecord[]>([])
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos, setAfterPhotos] = useState<string[]>([])
  const [treatmentForm] = Form.useForm()
  const [treatments, setTreatments] = useState<any[]>([])
  const [showAddTreatment, setShowAddTreatment] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm])

  const loadData = async () => {
    setLoading(true)
    try {
      const allPatients = databaseService.getAllPatients() || []
      const allUsers = databaseService.getAllUsers() || []
      const allAppointments = databaseService.getAllAppointments() || []
      const allRecords = databaseService.getAllClinicalRecords() || []

      setPatients(allPatients)
      setDoctors(allUsers.filter((u: User) => u.role === 'doctor'))
      setAppointments(allAppointments)
      setRecords(allRecords)
    } catch (error) {
      notification.error({ message: 'Error', description: 'Error al cargar datos', placement: 'topRight' })
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    if (!searchTerm) {
      setFilteredRecords(records)
      return
    }

    const filtered = records.filter(r => {
      const patient = patients.find(p => p.id === r.patientId)
      const patientName = patient ? `${patient.firstName} ${patient.lastName}` : ''
      return patientName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredRecords(filtered)
  }

  const handleViewRecord = (record: ClinicalRecord) => {
    setSelectedRecord(record)
    setBeforePhotos(record.beforePhotos || [])
    setAfterPhotos(record.afterPhotos || [])

    // Cargar tratamientos guardados o crear desde citas completadas
    const savedTreatments = record.treatments && record.treatments.length > 0 ? record.treatments : []

    // Si no hay tratamientos guardados, crearlos automÃ¡ticamente de las citas completadas
    if (savedTreatments.length === 0) {
      const completedAppointments = appointments.filter(
        a => a.patientId === record.patientId && a.status === 'completed'
      )

      const autoTreatments = completedAppointments.map(apt => ({
        id: `treat_${apt.id}`,
        type: apt.treatmentType,
        date: apt.scheduledDate,
        doctor: apt.doctorId,
        notes: apt.notes || `Tratamiento completado en cita programada`,
      }))

      setTreatments(autoTreatments)
    } else {
      setTreatments(savedTreatments)
    }

    form.resetFields()
    treatmentForm.resetFields()
    setIsModalVisible(true)
  }

  const handleBeforePhotoUpload = (info: any) => {
    const file = info.file.originFileObj || info.file
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBeforePhotos([...beforePhotos, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAfterPhotoUpload = (info: any) => {
    const file = info.file.originFileObj || info.file
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAfterPhotos([...afterPhotos, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBeforePhoto = (index: number) => {
    setBeforePhotos(beforePhotos.filter((_, i) => i !== index))
  }

  const handleRemoveAfterPhoto = (index: number) => {
    setAfterPhotos(afterPhotos.filter((_, i) => i !== index))
  }

  const handleSaveRecord = async () => {
    try {
      if (selectedRecord) {
        const updated = {
          ...selectedRecord,
          beforePhotos,
          afterPhotos,
          treatments,
          updatedAt: new Date().toISOString(),
        }
        databaseService.updateClinicalRecord(selectedRecord.id, updated)
        setRecords(records.map(r => (r.id === selectedRecord.id ? updated : r)))
        notification.success({ message: 'Éxito', description: 'Expediente actualizado', placement: 'topRight' })
        setIsModalVisible(false)
        setSelectedRecord(null)
        setBeforePhotos([])
        setAfterPhotos([])
        setTreatments([])
      }
    } catch (error) {
      notification.error({ message: 'Error', description: 'Error al guardar expediente', placement: 'topRight' })
    }
  }

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'
  }

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(a => a.patientId === patientId)
  }

  const handleAddTreatment = async () => {
    try {
      const values = await treatmentForm.validateFields()
      const newTreatment = {
        id: `treat_${Date.now()}`,
        type: values.treatmentType,
        date: values.treatmentDate.toDate(),
        doctor: values.doctorId,
        notes: values.notes,
      }

      if (selectedRecord) {
        const newTreatments = [...treatments, newTreatment]
        setTreatments(newTreatments)
        treatmentForm.resetFields()
        setShowAddTreatment(false)
        notification.success({ message: 'Éxito', description: 'Tratamiento agregado', placement: 'topRight' })
      }
    } catch (error) {
      notification.error({ message: 'Error', description: 'Error al agregar tratamiento', placement: 'topRight' })
    }
  }

  const handleRemoveTreatment = (id: string) => {
    setTreatments(treatments.filter(t => t.id !== id))
    notification.success({ message: 'Éxito', description: 'Tratamiento eliminado', placement: 'topRight' })
  }

  const handleCompleteAppointment = (apt: Appointment) => {
    if (!selectedRecord) return

    // Marcar cita como completada
    const updatedApt = { ...apt, status: 'completed' as const }
    databaseService.updateAppointment(apt.id, updatedApt)
    setAppointments(appointments.map(a => (a.id === apt.id ? updatedApt : a)))

    // Crear automÃ¡ticamente un tratamiento basado en la cita
    const newTreatment = {
      id: `treat_${Date.now()}`,
      type: apt.treatmentType,
      date: apt.scheduledDate,
      doctor: apt.doctorId,
      notes: apt.notes || `Tratamiento completado en cita programada`,
    }

    // Actualizar tratamientos en memoria
    const newTreatments = [...treatments, newTreatment]
    setTreatments(newTreatments)

    // Guardar automÃ¡ticamente en el expediente
    const updated = {
      ...selectedRecord,
      treatments: newTreatments,
      beforePhotos,
      afterPhotos,
      updatedAt: new Date().toISOString(),
    }
    databaseService.updateClinicalRecord(selectedRecord.id, updated)
    setRecords(records.map(r => (r.id === selectedRecord.id ? updated : r)))

    notification.success({ message: 'Éxito', description: 'Cita completada y tratamiento registrado automÃ¡ticamente', placement: 'topRight' })
  }

  const getDoctorName = (id: string) => {
    const doctor = doctors.find(d => d.id === id)
    return doctor ? doctor.name : 'N/A'
  }

  const getGenderLabel = (gender?: string) => {
    const genderMap: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Femenino',
      'other': 'Otro',
      'masculino': 'Masculino',
      'femenino': 'Femenino',
    }
    return genderMap[gender?.toLowerCase() || ''] || gender || 'No especificado'
  }

  const getDentalEvaluations = (patientId: string) => {
    try {
      const evaluations = JSON.parse(localStorage.getItem('dentalEvaluations') || '[]')
      return evaluations.filter((e: any) => e.patientId === patientId)
    } catch (error) {
      return []
    }
  }

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (id: string) => getPatientName(id),
    },
    {
      title: 'Citas Completadas',
      dataIndex: 'patientId',
      key: 'appointments',
      render: (patientId: string) => {
        const patientAppointments = getPatientAppointments(patientId)
        return <Badge count={patientAppointments.length} color="#131e4e" />
      },
    },
    {
      title: 'Fotos',
      dataIndex: 'beforePhotos',
      key: 'photos',
      render: (photos: string[], record: ClinicalRecord) => {
        const before = record.beforePhotos?.length || 0
        const after = record.afterPhotos?.length || 0
        return (
          <Space>
            <Badge count={before} color="#3b82f6" />
            <Badge count={after} color="#10b981" />
          </Space>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_: any, record: ClinicalRecord) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleViewRecord(record)}
            title="Ver expediente"
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="clinical-records-container">
      <ModuleHeader
        title="Expedientes ClÃ­nicos"
        icon={<FormOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona los historiales de tus pacientes"
        searchPlaceholder="Buscar paciente..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Card className="clinical-records-card">
        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} expedientes`,
          }}
        />
      </Card>

      {/* Modal de Expediente */}
      <Modal
        title={selectedRecord ? `ðŸ“‹ Expediente de ${getPatientName(selectedRecord.patientId)}` : ''}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setSelectedRecord(null)
          setBeforePhotos([])
          setAfterPhotos([])
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
        maskClosable={false}
      >
        {selectedRecord && (
          <Tabs
            defaultActiveKey="personal"
            items={[
              {
                key: 'personal',
                label: 'ðŸ‘¤ Datos Personales',
                children: (
                  <div>
                    {patients.find(p => p.id === selectedRecord.patientId) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                          <div className="modal-section">
                            <div className="modal-section-header">ðŸ“‹ InformaciÃ³n General</div>
                            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Nombre Completo</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600' }}>
                                  {getPatientName(selectedRecord.patientId)}
                                </p>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Edad</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.age} aÃ±os
                                </p>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>GÃ©nero</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {getGenderLabel(patients.find(p => p.id === selectedRecord.patientId)?.gender)}
                                </p>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Fecha de Registro</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {dayjs(selectedRecord.createdAt).format('DD/MM/YYYY')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="modal-section">
                            <div className="modal-section-header">ðŸ“ž InformaciÃ³n de Contacto</div>
                            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>TelÃ©fono</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.phone}
                                </p>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Email</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.email}
                                </p>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>DirecciÃ³n</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.address}
                                </p>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Ciudad</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.city}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="modal-section" style={{ marginTop: '16px' }}>
                            <div className="modal-section-header">âš ï¸ InformaciÃ³n MÃ©dica</div>
                            <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px' }}>
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase' }}>Alergias</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#7f1d1d' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.allergies?.join(', ') || 'Ninguna'}
                                </p>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase' }}>Condiciones MÃ©dicas</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#7f1d1d' }}>
                                  {patients.find(p => p.id === selectedRecord.patientId)?.medicalConditions?.join(', ') || 'Ninguna'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'citas',
                label: 'ðŸ“… Citas Programadas',
                children: (
                  <div>
                    {getPatientAppointments(selectedRecord.patientId).length > 0 ? (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {getPatientAppointments(selectedRecord.patientId).map((apt) => (
                          <div
                            key={apt.id}
                            style={{
                              padding: '16px',
                              background: apt.status === 'completed' ? '#f0fdf4' : '#f0f9ff',
                              borderRadius: '8px',
                              borderLeft: `4px solid ${apt.status === 'completed' ? '#10b981' : '#0284c7'}`,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Estado</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {apt.status === 'scheduled' ? 'ðŸ“‹ Programada' : apt.status === 'completed' ? 'âœ… Completada' : 'âŒ Cancelada'}
                                  </p>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Fecha y Hora</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {dayjs(apt.scheduledDate).format('DD/MM/YYYY HH:mm')}
                                  </p>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Doctor</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {getDoctorName(apt.doctorId)}
                                  </p>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>DuraciÃ³n</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {apt.duration} minutos
                                  </p>
                                </div>
                                {apt.notes && (
                                  <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Notas</label>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                      {apt.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {apt.status === 'scheduled' && (
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => handleCompleteAppointment(apt)}
                                  style={{
                                    background: '#10b981',
                                    border: 'none',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  Completar
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty description="Sin citas programadas" />
                    )}
                  </div>
                ),
              },
              {
                key: 'fotos',
                label: 'ðŸ“¸ Fotos Antes/DespuÃ©s',
                children: (
                  <div className="modal-section">
                    {/* Fotos Antes */}
                    <div className="photo-section">
                      <div className="modal-section-header">ðŸ“· Antes del Tratamiento</div>
                      <div style={{ marginBottom: '16px' }}>
                        <Upload
                          maxCount={1}
                          accept="image/*"
                          onChange={handleBeforePhotoUpload}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} block>
                            Subir Foto Antes
                          </Button>
                        </Upload>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                        {beforePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#f3f4f6',
                            }}
                          >
                            <img
                              src={photo}
                              alt={`Antes ${idx}`}
                              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <Button
                              danger
                              size="small"
                              onClick={() => handleRemoveBeforePhoto(idx)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                              }}
                            >
                              âœ•
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fotos DespuÃ©s */}
                    <div className="photo-section">
                      <div className="modal-section-header">âœ¨ DespuÃ©s del Tratamiento</div>
                      <div style={{ marginBottom: '16px' }}>
                        <Upload
                          maxCount={1}
                          accept="image/*"
                          onChange={handleAfterPhotoUpload}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} block>
                            Subir Foto DespuÃ©s
                          </Button>
                        </Upload>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                        {afterPhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#f3f4f6',
                            }}
                          >
                            <img
                              src={photo}
                              alt={`DespuÃ©s ${idx}`}
                              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <Button
                              danger
                              size="small"
                              onClick={() => handleRemoveAfterPhoto(idx)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                              }}
                            >
                              âœ•
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'tratamientos',
                label: 'ðŸ’Š Tratamientos',
                children: (
                  <div className="modal-section">
                    <div className="modal-section-header">ðŸ“‹ Historial de Tratamientos</div>

                    {treatments.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        {treatments.map((treatment, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '16px',
                              background: '#f9fafb',
                              borderRadius: '8px',
                              marginBottom: '12px',
                              borderLeft: '4px solid #10b981',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Tratamiento</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600' }}>
                                    {treatment.type}
                                  </p>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Fecha</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {dayjs(treatment.date).format('DD/MM/YYYY')}
                                  </p>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Doctor</label>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                    {getDoctorName(treatment.doctor)}
                                  </p>
                                </div>
                                {treatment.notes && (
                                  <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Notas</label>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                      {treatment.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              danger
                              size="small"
                              onClick={() => handleRemoveTreatment(treatment.id)}
                              style={{ marginLeft: '12px' }}
                            >
                              âœ•
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {!showAddTreatment && (
                      <Button
                        type="primary"
                        block
                        onClick={() => setShowAddTreatment(true)}
                        style={{
                          background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)',
                          border: 'none',
                          marginBottom: '16px',
                        }}
                      >
                        + Agregar Tratamiento
                      </Button>
                    )}

                    {showAddTreatment && (
                      <Form
                        form={treatmentForm}
                        layout="vertical"
                        style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}
                      >
                        <Form.Item
                          name="treatmentType"
                          label="Tipo de Tratamiento"
                          rules={[{ required: true, message: 'Requerido' }]}
                          style={{ marginBottom: '12px' }}
                        >
                          <Select
                            placeholder="Seleccione"
                            options={[
                              { label: 'Limpieza', value: 'Limpieza' },
                              { label: 'Caries', value: 'Caries' },
                              { label: 'Endodoncia', value: 'Endodoncia' },
                              { label: 'ExtracciÃ³n', value: 'ExtracciÃ³n' },
                              { label: 'Ortodoncia', value: 'Ortodoncia' },
                              { label: 'Blanqueamiento', value: 'Blanqueamiento' },
                              { label: 'Implante', value: 'Implante' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          name="treatmentDate"
                          label="Fecha del Tratamiento"
                          rules={[{ required: true, message: 'Requerido' }]}
                          style={{ marginBottom: '12px' }}
                        >
                          <Input type="date" />
                        </Form.Item>

                        <Form.Item
                          name="doctorId"
                          label="Doctor"
                          rules={[{ required: true, message: 'Requerido' }]}
                          style={{ marginBottom: '12px' }}
                        >
                          <Select
                            placeholder="Seleccione doctor"
                            options={doctors.map(d => ({
                              label: d.name,
                              value: d.id,
                            }))}
                          />
                        </Form.Item>

                        <Form.Item
                          name="notes"
                          label="Notas"
                          style={{ marginBottom: '12px' }}
                        >
                          <Input.TextArea placeholder="Notas adicionales..." rows={2} />
                        </Form.Item>

                        <Space style={{ width: '100%', gap: '8px' }}>
                          <Button
                            type="primary"
                            onClick={handleAddTreatment}
                            style={{
                              background: '#10b981',
                              border: 'none',
                              flex: 1,
                            }}
                          >
                            Guardar
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddTreatment(false)
                              treatmentForm.resetFields()
                            }}
                            style={{ flex: 1 }}
                          >
                            Cancelar
                          </Button>
                        </Space>
                      </Form>
                    )}

                    {treatments.length === 0 && !showAddTreatment && (
                      <Empty description="Sin tratamientos registrados" />
                    )}
                  </div>
                ),
              },
              {
                key: 'evaluaciones',
                label: 'ðŸ¦· Evaluaciones Dentales',
                children: (
                  <div className="modal-section">
                    <div className="modal-section-header">ðŸ¦· Evaluaciones Dentales</div>
                    {getDentalEvaluations(selectedRecord.patientId).length > 0 ? (
                      <div style={{ marginBottom: '24px' }}>
                        {getDentalEvaluations(selectedRecord.patientId).map((evaluation: any) => (
                          <div
                            key={evaluation.id}
                            style={{
                              padding: '16px',
                              background: '#f9fafb',
                              borderRadius: '8px',
                              marginBottom: '12px',
                              borderLeft: '4px solid #131e4e',
                            }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Fecha</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {dayjs(evaluation.evaluationDate).format('DD/MM/YYYY')}
                                </p>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Tipo de Paciente</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                  {evaluation.patientType === 'adult' ? 'Adulto' : 'NiÃ±o'}
                                </p>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total (L)</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                                  L {evaluation.totalPrice}
                                </p>
                              </div>
                            </div>

                            {Object.values(evaluation.teeth).filter((t: any) => t).length > 0 && (
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Dientes Afectados</label>
                                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {Object.entries(evaluation.teeth).map(([tooth, condition]: [string, any]) => (
                                    condition && (
                                      <div
                                        key={tooth}
                                        style={{
                                          padding: '4px 8px',
                                          background: condition.color,
                                          color: 'white',
                                          borderRadius: '4px',
                                          fontSize: '12px',
                                          fontWeight: '600',
                                        }}
                                      >
                                        Pieza {tooth}: {condition.conditionName}
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}

                            {evaluation.notes && (
                              <div>
                                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Notas</label>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', background: '#ffffff', padding: '8px', borderRadius: '4px' }}>
                                  {evaluation.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty description="Sin evaluaciones dentales registradas" />
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleSaveRecord}
            style={{
              background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)',
              border: 'none',
            }}
          >
            Guardar Cambios
          </Button>
          <Button
            onClick={() => {
              setIsModalVisible(false)
              setSelectedRecord(null)
              setBeforePhotos([])
              setAfterPhotos([])
              setTreatments([])
              treatmentForm.resetFields()
              setShowAddTreatment(false)
            }}
            block
            size="large"
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}


