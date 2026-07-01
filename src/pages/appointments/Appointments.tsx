import { useState, useEffect } from 'react'
import {
  Card,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  notification,
  Row,
  Col,
  TimePicker,
  Tag,
} from 'antd'
import { PlusOutlined, DeleteOutlined, CheckOutlined, LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import { Appointment, Patient, User } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import ModuleHeader from '@/components/layout/ModuleHeader'
import '@/components/layout/ModuleHeader.css'
import { useThemeColors } from '@/hooks/useThemeColors'
import './Appointments.css'

dayjs.locale('es')

const DAYS_OF_WEEK = ['DOM', 'LUN', 'MAR', 'MIÃ‰', 'JUE', 'VIE', 'SÃB']

export default function Appointments() {
  useThemeColors()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs())
  const [selectedDoctor, setSelectedDoctor] = useState<string | string[]>('')
  const [selectedDateForModal, setSelectedDateForModal] = useState<dayjs.Dayjs | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      setPatients(databaseService.getAllPatients() || [])
      const allUsers = databaseService.getAllUsers() || []
      const doctorsList = allUsers.filter((u: User) => u.role === 'doctor')
      setDoctors(doctorsList)
      if (doctorsList.length > 0) {
        setSelectedDoctor(doctorsList[0].id)
      }
      setAppointments(databaseService.getAllAppointments() || [])
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al cargar datos', placement: 'topRight' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = (date: dayjs.Dayjs) => {
    setSelectedDateForModal(date)
    form.resetFields()
    form.setFieldsValue({
      doctorId: selectedDoctor,
    })
    setIsModalVisible(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (!selectedDateForModal) {
        message.error({ message: 'Error', description: 'Seleccione una fecha', placement: 'topRight' })
        return
      }

      const appointmentDate = new Date(
        selectedDateForModal.format('YYYY-MM-DD') + 'T' + values.time.format('HH:mm')
      )

      const doctorIds = values.doctorId || selectedDoctor
      const doctorIdString = Array.isArray(doctorIds) ? doctorIds.join(',') : doctorIds

      const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        patientId: values.patientId,
        doctorId: doctorIdString,
        scheduledDate: appointmentDate,
        treatmentType: values.treatmentType,
        duration: values.duration,
        notes: values.notes,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      databaseService.createAppointment(newAppointment)
      setAppointments([...appointments, newAppointment])
      message.success({ message: 'Éxito', description: 'Cita programada', placement: 'topRight' })
      setIsModalVisible(false)
      form.resetFields()
      setSelectedDateForModal(null)
    } catch (error) {
      message.error({ message: 'Error', description: 'Error al guardar cita', placement: 'topRight' })
    }
  }

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'
  }

  const getDoctorName = (id: string) => {
    const doctor = doctors.find(d => d.id === id)
    return doctor ? doctor.name : 'N/A'
  }

  const handleViewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailModalVisible(true)
  }

  const handleDeleteAppointment = (id: string) => {
    databaseService.deleteAppointment(id)
    setAppointments(appointments.filter(apt => apt.id !== id))
    setIsDetailModalVisible(false)
    message.success({ message: 'Éxito', description: 'Cita eliminada', placement: 'topRight' })
  }

  const handleCompleteAppointment = (id: string) => {
    const apt = appointments.find(a => a.id === id)
    if (apt) {
      const updated = { ...apt, status: 'completed' as const }
      databaseService.updateAppointment(id, updated)
      setAppointments(appointments.map(a => a.id === id ? updated : a))
      setSelectedAppointment(updated)
      message.success({ message: 'Éxito', description: 'Cita marcada como completada', placement: 'topRight' })
    }
  }

  const getAppointmentsForDate = (date: dayjs.Dayjs) => {
    return appointments.filter(apt => {
      const aptDate = dayjs(apt.scheduledDate)
      return (
        aptDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
        apt.doctorId === selectedDoctor
      )
    })
  }

  const getDaysInMonth = () => {
    const firstDay = currentDate.startOf('month')
    const lastDay = currentDate.endOf('month')
    const daysInMonth: (dayjs.Dayjs | null)[] = []

    // Agregar espacios en blanco para el primer dÃ­a
    for (let i = 0; i < firstDay.day(); i++) {
      daysInMonth.push(null)
    }

    // Agregar todos los dÃ­as del mes
    for (let i = 1; i <= lastDay.date(); i++) {
      daysInMonth.push(currentDate.date(i))
    }

    return daysInMonth
  }

  const daysInMonth = getDaysInMonth()
  const today = dayjs()

  return (
    <div className="appointments-container">
      <ModuleHeader
        title="Calendario de Citas"
        icon={<CalendarOutlined style={{ fontSize: '24px' }} />}
        subtitle="Gestiona las citas de tus pacientes"
        onAddClick={() => setIsModalVisible(true)}
        addButtonText="Nueva Cita"
      />

      <Row gutter={[20, 20]} style={{ marginBottom: '28px' }}>
        {/* Selector de Doctores */}
        <Col xs={24} lg={6}>
          <Card className="appointments-card">
            <h3>Doctores</h3>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={selectedDoctor ? (Array.isArray(selectedDoctor) ? selectedDoctor : [selectedDoctor]) : []}
              onChange={setSelectedDoctor}
              options={doctors.map(d => ({
                label: d.name,
                value: d.id,
              }))}
              size="large"
              placeholder="Selecciona doctores"
            />
          </Card>
        </Col>

        {/* Calendario */}
        <Col xs={24} lg={18}>
          <Card className="calendar-card">
            {/* Calendar Header */}
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>
                <LeftOutlined />
              </button>
              <div className="calendar-title">
                <h2>{currentDate.format('MMMM').charAt(0).toUpperCase() + currentDate.format('MMMM').slice(1)}</h2>
                <p>{currentDate.year()}</p>
              </div>
              <button className="calendar-nav-btn" onClick={() => setCurrentDate(today)}>
                Hoy
              </button>
              <button className="calendar-nav-btn" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>
                <RightOutlined />
              </button>
            </div>

            {/* Days of Week */}
            <div className="calendar-weekdays">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div key={idx} className={`weekday ${day === 'DOM' || day === 'SÃB' ? 'weekend' : ''}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="calendar-grid">
              {daysInMonth.map((date, idx) => {
                const isToday = date?.isSame(today, 'day') || false
                const isCurrentMonth = date?.month() === currentDate.month()
                const dayAppointments = date ? getAppointmentsForDate(date) : []

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                  >
                    {date && (
                      <>
                        <div className="day-number">{date.date()}</div>
                        <div className="day-content">
                          {dayAppointments.map(apt => (
                            <div
                              key={apt.id}
                              className="appointment-event"
                              title={`Haz clic para ver detalles`}
                              onClick={() => handleViewAppointmentDetails(apt)}
                              style={{ cursor: 'pointer' }}
                            >
                              {dayjs(apt.scheduledDate).format('HH:mm')} {getPatientName(apt.patientId).split(' ')[0].toUpperCase()}
                            </div>
                          ))}
                          {isCurrentMonth && (
                            <button
                              className="add-appointment-btn"
                              onClick={() => handleAddAppointment(date)}
                              title="Agregar cita"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal para nueva cita */}
      <Modal
        title={selectedDateForModal ? `Nueva Cita - ${selectedDateForModal.format('DD MMMM YYYY')}` : 'Nueva Cita'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setSelectedDateForModal(null)
        }}
        footer={null}
        width={600}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          style={{ marginBottom: 0 }}
        >
          {/* SECCIÃ“N: Paciente */}
          <div className="modal-section">
            <div className="modal-section-header">ðŸ‘¤ Paciente</div>
            <Form.Item
              name="patientId"
              rules={[{ required: true, message: 'Seleccione paciente' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Seleccione paciente"
                options={patients.map(p => ({
                  label: `${p.firstName} ${p.lastName} (${p.phone})`,
                  value: p.id,
                }))}
              />
            </Form.Item>
          </div>

          {/* SECCIÃ“N: Detalles de la Cita */}
          <div className="modal-section">
            <div className="modal-section-header">â° Detalles de la Cita</div>

            <Form.Item
              name="time"
              label="Hora"
              rules={[{ required: true, message: 'Ingrese hora' }]}
              style={{ marginBottom: '12px' }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="treatmentType"
              label="Tipo de Tratamiento (mÃºltiples)"
              rules={[{ required: true, message: 'Ingrese al menos un tratamiento' }]}
              style={{ marginBottom: '12px' }}
            >
              <Select
                mode="tags"
                placeholder="Selecciona o escribe tratamientos"
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
              name="duration"
              label="DuraciÃ³n (minutos)"
              rules={[
                { required: true, message: 'Ingrese duraciÃ³n' },
                { pattern: /^\d+$/, message: 'Solo nÃºmeros' }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                type="number"
                placeholder="Ej: 30, 45, 60, 90..."
                min={1}
                max={999}
              />
            </Form.Item>
          </div>

          {/* SECCIÃ“N: Notas */}
          <div className="modal-section">
            <div className="modal-section-header">ðŸ“ Notas</div>
            <Form.Item name="notes" style={{ marginBottom: 0 }}>
              <Input.TextArea placeholder="Notas adicionales..." rows={2} />
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
                background: 'linear-gradient(135deg, #131e4e 0%, #0f1638 100%)',
                border: 'none',
              }}
            >
              Programar Cita
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false)
                form.resetFields()
                setSelectedDateForModal(null)
              }}
              block
              size="large"
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal de Detalles de Cita */}
      <Modal
        title={selectedAppointment ? `ðŸ“… Detalles de la Cita` : ''}
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedAppointment(null)
        }}
        footer={null}
        width={600}
        maskClosable={false}
      >
        {selectedAppointment && (
          <div style={{ marginBottom: 0 }}>
            {/* InformaciÃ³n del Paciente */}
            <div className="modal-section">
              <div className="modal-section-header">ðŸ‘¤ Paciente</div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: '600' }}>
                  {getPatientName(selectedAppointment.patientId)}
                </p>
              </div>
            </div>

            {/* InformaciÃ³n de Doctores */}
            <div className="modal-section">
              <div className="modal-section-header">ðŸ‘¨â€âš•ï¸ Doctores</div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedAppointment.doctorId.includes(',') ? (
                  selectedAppointment.doctorId.split(',').map((doctorId: string, idx: number) => (
                    <Tag key={idx} color="#131e4e" style={{ color: 'white', marginTop: '4px' }}>
                      {getDoctorName(doctorId.trim())}
                    </Tag>
                  ))
                ) : (
                  <Tag color="#131e4e" style={{ color: 'white', marginTop: '4px' }}>
                    {getDoctorName(selectedAppointment.doctorId)}
                  </Tag>
                )}
              </div>
            </div>

            {/* Detalles de la Cita */}
            <div className="modal-section">
              <div className="modal-section-header">â° Detalles</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Fecha</label>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    {dayjs(selectedAppointment.scheduledDate).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Hora</label>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    {dayjs(selectedAppointment.scheduledDate).format('HH:mm')}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Tratamientos</label>
                  <div style={{ margin: '4px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Array.isArray(selectedAppointment.treatmentType) ? (
                      selectedAppointment.treatmentType.map((t: string, idx: number) => (
                        <Tag key={idx} color="#131e4e" style={{ color: 'white', marginTop: '4px' }}>
                          {t}
                        </Tag>
                      ))
                    ) : (
                      <Tag color="#131e4e" style={{ color: 'white', marginTop: '4px' }}>
                        {selectedAppointment.treatmentType}
                      </Tag>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>DuraciÃ³n</label>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    {selectedAppointment.duration} min
                  </p>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="modal-section">
              <div className="modal-section-header">ðŸ“Š Estado</div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <Tag
                  color={
                    selectedAppointment.status === 'completed'
                      ? 'green'
                      : selectedAppointment.status === 'cancelled'
                      ? 'red'
                      : 'blue'
                  }
                >
                  {selectedAppointment.status === 'scheduled'
                    ? 'Programada'
                    : selectedAppointment.status === 'completed'
                    ? 'Completada'
                    : 'Cancelada'}
                </Tag>
              </div>
            </div>

            {/* Notas */}
            {selectedAppointment.notes && (
              <div className="modal-section">
                <div className="modal-section-header">ðŸ“ Notas</div>
                <div
                  style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  {selectedAppointment.notes}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {selectedAppointment.status === 'scheduled' && (
                <Button
                  type="primary"
                  onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                  block
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                  }}
                >
                  Marcar como Completada
                </Button>
              )}
              <Button
                danger
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                block
              >
                Eliminar Cita
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}


