import { useState, useEffect } from 'react'
import { Card, Row, Col, Select, DatePicker, Table, Statistic, Space, Tag, Button, Drawer, Divider, InputNumber, Modal } from 'antd'
import { DollarOutlined, CalendarOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import databaseService from '@/services/database'
import { Appointment, Invoice, User } from '@/types'
import dayjs, { Dayjs } from 'dayjs'
import ModuleHeader from '@/components/layout/ModuleHeader'
import { useThemeColors } from '@/hooks/useThemeColors'
import '@/components/layout/ModuleHeader.css'
import './Earnings.css'

const getThemeColor = (varName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

const COLORS = ['#131e4e', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Earnings() {
  useThemeColors()
  const [doctors, setDoctors] = useState<User[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ])
  const [earningsData, setEarningsData] = useState<any[]>([])
  const [selectedEarning, setSelectedEarning] = useState<any>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doctorPercentages, setDoctorPercentages] = useState<Record<string, number>>({})
  const [calculatorVisible, setCalculatorVisible] = useState(false)
  const [calculatorData, setCalculatorData] = useState<any>(null)
  const [chartColor1, setChartColor1] = useState('#131e4e')
  const [chartColor2, setChartColor2] = useState('#10b981')

  useEffect(() => {
    loadData()
    // Obtener colores del tema
    setChartColor1(getThemeColor('--chart-bar-1'))
    setChartColor2(getThemeColor('--chart-bar-2'))
  }, [])

  useEffect(() => {
    calculateEarnings()
  }, [doctors, appointments, invoices, selectedDoctor, dateRange])

  const loadData = async () => {
    setLoading(true)
    try {
      const allUsers = databaseService.getAllUsers() || []
      const doctorsList = allUsers.filter((u: User) => u.role === 'doctor')
      const allAppointments = databaseService.getAllAppointments() || []
      const allInvoices = databaseService.getAllInvoices() || []

      setDoctors(doctorsList)
      setAppointments(allAppointments)
      setInvoices(allInvoices)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEarnings = () => {
    try {
      const [startDate, endDate] = dateRange

      // Filtrar citas (completadas o programadas) en el rango de fechas
      const relevantAppointments = appointments.filter(apt => {
        const aptDate = dayjs(apt.scheduledDate)
        return (
          (apt.status === 'completed' || apt.status === 'scheduled') &&
          (aptDate.isAfter(startDate) || aptDate.isSame(startDate, 'day')) &&
          (aptDate.isBefore(endDate) || aptDate.isSame(endDate, 'day'))
        )
      })

      // Filtrar facturas (pagadas o pendientes) en el rango de fechas
      const relevantInvoices = invoices.filter(inv => {
        const invDate = dayjs(inv.issueDate)
        return (
          (inv.status === 'paid' || inv.status === 'pending') &&
          (invDate.isAfter(startDate) || invDate.isSame(startDate, 'day')) &&
          (invDate.isBefore(endDate) || invDate.isSame(endDate, 'day'))
        )
      })

      // Calcular ganancias por doctor
      const earningsMap: Record<string, any> = {}

      // Inicializar doctores
      doctors.forEach(doctor => {
        earningsMap[doctor.id] = {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          appointmentsCount: 0,
          appointmentsRevenue: 0,
          invoicesCount: 0,
          invoicesRevenue: 0,
          totalEarnings: 0,
          appointmentsList: [],
          invoicesList: [],
        }
      })

      // Procesar citas (completadas o programadas)
      relevantAppointments.forEach(apt => {
        if (earningsMap[apt.doctorId]) {
          earningsMap[apt.doctorId].appointmentsCount += 1
          // Asignar un valor predeterminado por cita
          const appointmentValue = 500 // L 500 por cita
          earningsMap[apt.doctorId].appointmentsRevenue += appointmentValue
          earningsMap[apt.doctorId].appointmentsList.push({
            id: apt.id,
            type: apt.treatmentType,
            date: apt.scheduledDate,
            revenue: appointmentValue,
          })
        }
      })

      // Procesar facturas (pagadas o pendientes)
      relevantInvoices.forEach(inv => {
        if (earningsMap[inv.doctorId]) {
          earningsMap[inv.doctorId].invoicesCount += 1
          earningsMap[inv.doctorId].invoicesRevenue += inv.total
          earningsMap[inv.doctorId].invoicesList.push({
            id: inv.id,
            date: inv.issueDate,
            amount: inv.total,
          })
        }
      })

      // Calcular total de ganancias
      Object.keys(earningsMap).forEach(doctorId => {
        earningsMap[doctorId].totalEarnings =
          earningsMap[doctorId].appointmentsRevenue + earningsMap[doctorId].invoicesRevenue
      })

      // Convertir a array y filtrar
      let result = Object.values(earningsMap)

      if (selectedDoctor !== 'all') {
        result = result.filter(e => e.id === selectedDoctor)
      }

      setEarningsData(result)
    } catch (error) {
      console.error('Error calculating earnings:', error)
    }
  }

  const getTotalEarnings = () => {
    return earningsData.reduce((sum, earning) => sum + earning.totalEarnings, 0)
  }

  const getAverageEarnings = () => {
    if (earningsData.length === 0) return 0
    return getTotalEarnings() / earningsData.length
  }

  const getEarningsWithPercentage = (earning: any) => {
    const percentage = doctorPercentages[earning.id] || 0
    const totalIncome = earning.appointmentsRevenue + earning.invoicesRevenue
    const doctorEarning = (totalIncome * percentage) / 100
    const clinicEarning = totalIncome - doctorEarning

    return {
      totalIncome,
      percentage,
      doctorEarning,
      clinicEarning,
    }
  }

  const openCalculator = (earning: any) => {
    const calculation = getEarningsWithPercentage(earning)
    setCalculatorData({
      doctorName: earning.name,
      doctorId: earning.id,
      appointmentsRevenue: earning.appointmentsRevenue,
      invoicesRevenue: earning.invoicesRevenue,
      ...calculation,
    })
    setCalculatorVisible(true)
  }

  const updateDoctorPercentage = (doctorId: string, percentage: number) => {
    setDoctorPercentages({
      ...doctorPercentages,
      [doctorId]: Math.min(100, Math.max(0, percentage || 0)),
    })
  }

  const earningsColumns = [
    {
      title: 'Doctor',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: any) => (
        <div>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '13px' }}>{text}</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
            {record.specialization || 'Sin esp.'}
          </p>
        </div>
      ),
    },
    {
      title: 'Citas',
      dataIndex: 'appointmentsCount',
      key: 'appointmentsCount',
      width: 80,
      render: (count: number) => (
        <Tag color="blue" style={{ fontSize: '11px' }}>
          {count}
        </Tag>
      ),
    },
    {
      title: 'Ing. Citas',
      dataIndex: 'appointmentsRevenue',
      key: 'appointmentsRevenue',
      width: 110,
      render: (amount: number) => <span style={{ fontSize: '12px' }}>L {(amount/1000).toFixed(1)}k</span>,
    },
    {
      title: 'Facturas',
      dataIndex: 'invoicesCount',
      key: 'invoicesCount',
      width: 80,
      render: (count: number) => (
        <Tag color="green" style={{ fontSize: '11px' }}>
          {count}
        </Tag>
      ),
    },
    {
      title: 'Ing. Fact.',
      dataIndex: 'invoicesRevenue',
      key: 'invoicesRevenue',
      width: 110,
      render: (amount: number) => <span style={{ fontSize: '12px' }}>L {(amount/1000).toFixed(1)}k</span>,
    },
    {
      title: 'Total',
      dataIndex: 'totalEarnings',
      key: 'totalEarnings',
      width: 120,
      render: (amount: number) => (
        <span style={{ fontWeight: '700', color: '#10b981', fontSize: '13px' }}>
          L {(amount/1000).toFixed(1)}k
        </span>
      ),
    },
    {
      title: '%',
      key: 'percentage',
      width: 80,
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          max={100}
          value={doctorPercentages[record.id] || 0}
          onChange={(value) => updateDoctorPercentage(record.id, value || 0)}
          suffix="%"
          style={{ width: '100%' }}
          size="small"
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => openCalculator(record)}
            style={{ background: '#10b981', border: 'none', fontSize: '11px' }}
          >
            Calcular
          </Button>
          <Button
            size="small"
            onClick={() => {
              setSelectedEarning(record)
              setDrawerVisible(true)
            }}
            style={{ fontSize: '11px' }}
          >
            Ver
          </Button>
        </Space>
      ),
    },
  ]

  const chartData = earningsData.map(e => ({
    name: e.name,
    ganancias: e.totalEarnings,
    citas: e.appointmentsRevenue,
    facturas: e.invoicesRevenue,
  }))

  return (
    <div className="earnings-container">
      <ModuleHeader
        title="Ganancias por Doctor"
        icon={<DollarOutlined style={{ fontSize: '24px' }} />}
        subtitle="AnÃ¡lisis detallado de ingresos y ganancias de cada mÃ©dico"
      />

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }} className="filters-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
              Doctor
            </label>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              size="large"
              options={[
                { label: 'Todos los Doctores', value: 'all' },
                ...doctors.map(d => ({
                  label: d.name,
                  value: d.id,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={16}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
              PerÃ­odo
            </label>
            <DatePicker.RangePicker
              style={{ width: '100%', marginTop: '8px' }}
              value={dateRange}
              onChange={(dates: any) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]])
                }
              }}
              size="large"
            />
          </Col>
        </Row>
      </Card>

      {/* KPIs */}
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card">
            <Statistic
              title="Total de Ganancias"
              value={getTotalEarnings()}
              prefix="L "
              valueStyle={{ color: '#10b981', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card">
            <Statistic
              title="Promedio por Doctor"
              value={getAverageEarnings()}
              prefix="L "
              valueStyle={{ color: '#131e4e', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card">
            <Statistic
              title="Doctores Activos"
              value={earningsData.length}
              suffix={earningsData.length === 1 ? 'doctor' : 'doctores'}
              valueStyle={{ color: '#f59e0b', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card">
            <Statistic
              title="Total de Citas"
              value={earningsData.reduce((sum, e) => sum + e.appointmentsCount, 0)}
              valueStyle={{ color: '#8b5cf6', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* GrÃ¡ficos */}
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Ganancias por Doctor">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `L ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="citas" stackId="a" fill={chartColor1} name="De Citas" />
                <Bar dataKey="facturas" stackId="a" fill={chartColor2} name="De Facturas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="DistribuciÃ³n de Ingresos">
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="ganancias"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `L ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>Sin datos</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Tabla de Detalles */}
      <Card title="Detalles de Ganancias">
        <Table
          columns={earningsColumns}
          dataSource={earningsData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* Drawer de Detalles */}
      <Drawer
        title={selectedEarning ? `Ganancias de ${selectedEarning.name}` : ''}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedEarning && (
          <div>
            {/* Resumen */}
            <div style={{ marginBottom: '24px' }}>
              <h3>Resumen</h3>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Card>
                    <Statistic
                      title="Total de Ganancias"
                      value={selectedEarning.totalEarnings}
                      prefix="L "
                    />
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card>
                    <Statistic
                      title="EspecializaciÃ³n"
                      value={selectedEarning.specialization || 'N/A'}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Citas Completadas */}
            <div style={{ marginBottom: '24px' }}>
              <h3>
                <CheckCircleOutlined style={{ marginRight: '8px', color: '#131e4e' }} />
                Citas Completadas ({selectedEarning.appointmentsCount})
              </h3>
              <p style={{ marginBottom: '12px', fontWeight: '600', color: '#10b981' }}>
                Ingresos: L {selectedEarning.appointmentsRevenue.toLocaleString()}
              </p>
              {selectedEarning.appointmentsList.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedEarning.appointmentsList.map((apt: any) => (
                    <div
                      key={apt.id}
                      style={{
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                        {apt.type}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>
                        {dayjs(apt.date).format('DD/MM/YYYY HH:mm')}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
                        L {apt.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af' }}>Sin citas completadas</p>
              )}
            </div>

            <Divider />

            {/* Facturas Pagadas */}
            <div>
              <h3>
                <FileTextOutlined style={{ marginRight: '8px', color: '#10b981' }} />
                Facturas Pagadas ({selectedEarning.invoicesCount})
              </h3>
              <p style={{ marginBottom: '12px', fontWeight: '600', color: '#10b981' }}>
                Ingresos: L {selectedEarning.invoicesRevenue.toLocaleString()}
              </p>
              {selectedEarning.invoicesList.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedEarning.invoicesList.map((inv: any) => (
                    <div
                      key={inv.id}
                      style={{
                        padding: '12px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                        {inv.id}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>
                        {dayjs(inv.date).format('DD/MM/YYYY')}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
                        L {inv.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af' }}>Sin facturas pagadas</p>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Modal de Calculadora */}
      <Modal
        title={`ðŸ’° Calculadora de Ganancias - ${calculatorData?.doctorName}`}
        open={calculatorVisible}
        onCancel={() => setCalculatorVisible(false)}
        footer={null}
        width={600}
      >
        {calculatorData && (
          <div style={{ marginBottom: 0 }}>
            {/* Desglose de Ingresos */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '12px' }}>ðŸ“Š Desglose de Ingresos</h3>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>
                      Ingresos por Citas
                    </label>
                    <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '600', color: '#131e4e' }}>
                      L {calculatorData.appointmentsRevenue.toLocaleString()}
                    </p>
                  </div>
                </Col>
                <Col xs={12}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>
                      Ingresos por Facturas
                    </label>
                    <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                      L {calculatorData.invoicesRevenue.toLocaleString()}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Total de Ingresos */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '2px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>
                    Total de Ingresos
                  </label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#0284c7' }}>
                    L {calculatorData.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>
                    % Asignado
                  </label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#131e4e' }}>
                    {calculatorData.percentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* DistribuciÃ³n de Ganancias */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>ðŸ’µ DistribuciÃ³n de Ganancias</h3>

              <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '12px', border: '2px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Ganancia del Doctor</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>({calculatorData.percentage}%)</span>
                </div>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                  L {calculatorData.doctorEarning.toLocaleString()}
                </p>
              </div>

              <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '2px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Ganancia de la ClÃ­nica</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>({100 - calculatorData.percentage}%)</span>
                </div>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>
                  L {calculatorData.clinicEarning.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Resumen */}
            <Divider />
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '12px', color: '#1f2937' }}>ðŸ“‹ Resumen</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontWeight: '600' }}>Total de Ingresos</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#0284c7', fontSize: '14px' }}>
                    L {calculatorData.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontWeight: '600' }}>Porcentaje del Doctor</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#131e4e', fontSize: '14px' }}>
                    {calculatorData.percentage}%
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontWeight: '600' }}>Gana el Doctor</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#10b981', fontSize: '14px' }}>
                    L {calculatorData.doctorEarning.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontWeight: '600' }}>Gana la ClÃ­nica</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#ef4444', fontSize: '14px' }}>
                    L {calculatorData.clinicEarning.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
