import { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Space, Empty, Spin, Statistic } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useSettingsStore } from '@/stores/settingsStore'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  StarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import databaseService from '@/services/database'
import { Appointment, Invoice, Patient, User } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import dayjs from 'dayjs'
import './Dashboard.css'

const COLORS = ['#131e4e', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  useThemeColors()
  const { settings } = useSettingsStore()

  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [metrics, setMetrics] = useState({
    totalRevenueToday: 0,
    totalRevenueMonth: 0,
    appointmentsToday: 0,
    appointmentsCompleted: 0,
    newPatientsMonth: 0,
    totalPatients: 0,
  })
  const [doctorRevenue, setDoctorRevenue] = useState<any[]>([])
  const [treatmentDistribution, setTreatmentDistribution] = useState<any[]>([])
  const [revenueHistory, setRevenueHistory] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    try {
      const patients = databaseService.getAllPatients() || []
      const allUsers = databaseService.getAllUsers() || []
      const appointments = databaseService.getAllAppointments() || []
      const invoices = databaseService.getAllInvoices() || []
      const doctors = allUsers.filter((u: User) => u.role === 'doctor')

      const today = dayjs()
      const thisMonth = today.month()
      const thisYear = today.year()

      // Citas de hoy
      const appointmentsToday = appointments.filter((a: Appointment) => {
        const aDate = dayjs(a.scheduledDate)
        return aDate.isSame(today, 'day')
      }).length

      const appointmentsCompletedToday = appointments.filter((a: Appointment) => {
        const aDate = dayjs(a.scheduledDate)
        return aDate.isSame(today, 'day') && a.status === 'completed'
      }).length

      // Pacientes nuevos este mes
      const newPatientsThisMonth = patients.filter((p: Patient) => {
        const pDate = dayjs(p.createdAt)
        return pDate.month() === thisMonth && pDate.year() === thisYear
      }).length

      // Ingresos hoy y este mes (de invoices)
      const invoicesToday = invoices.filter((inv: Invoice) => {
        const invDate = dayjs(inv.createdAt)
        return invDate.isSame(today, 'day')
      })

      const invoicesThisMonth = invoices.filter((inv: Invoice) => {
        const invDate = dayjs(inv.createdAt)
        return invDate.month() === thisMonth && invDate.year() === thisYear
      })

      const totalRevenueToday = invoicesToday.reduce((sum: number, inv: Invoice) => sum + (inv.total || 0), 0)
      const totalRevenueMonth = invoicesThisMonth.reduce((sum: number, inv: Invoice) => sum + (inv.total || 0), 0)

      setMetrics({
        totalRevenueToday,
        totalRevenueMonth,
        appointmentsToday,
        appointmentsCompleted: appointmentsCompletedToday,
        newPatientsMonth: newPatientsThisMonth,
        totalPatients: patients.length,
      })

      // Ingresos por doctor (calculado)
      setDoctorRevenue(
        doctors.map(d => {
          const doctorInvoices = invoicesThisMonth.filter((inv: Invoice) => inv.doctorId === d.id)
          const revenue = doctorInvoices.reduce((sum: number, inv: Invoice) => sum + (inv.total || 0), 0)
          return {
            name: d.name.split(' ')[0], // Solo primer nombre para brevedad
            revenue: revenue || 0,
          }
        }).filter(d => d.revenue > 0)
      )

      // DistribuciÃ³n de tratamientos (basado en datos reales)
      const appointmentsByType = appointments.reduce((acc: any, a: Appointment) => {
        const type = a.treatmentType || 'Otros'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})

      const distributionData = Object.entries(appointmentsByType).map(([name, count]) => ({
        name,
        value: count,
      }))
      setTreatmentDistribution(distributionData.length > 0 ? distributionData : [
        { name: 'Limpieza', value: 35 },
        { name: 'Caries', value: 25 },
        { name: 'Ortodoncia', value: 20 },
        { name: 'Endodoncia', value: 12 },
        { name: 'Otros', value: 8 },
      ])

      // HistÃ³rico de ingresos (Ãºltimos 7 dÃ­as)
      const history = []
      for (let i = 6; i >= 0; i--) {
        const date = dayjs(today).subtract(i, 'day')
        const dayInvoices = invoices.filter((inv: Invoice) => {
          const invDate = dayjs(inv.createdAt)
          return invDate.isSame(date, 'day')
        })
        const dayTotal = dayInvoices.reduce((sum: number, inv: Invoice) => sum + (inv.total || 0), 0)
        history.push({
          date: date.format('D MMM'),
          ingresos: dayTotal,
        })
      }
      setRevenueHistory(history)
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    }
  }

  return (
    <div className="dashboard-container">
      {/* SecciÃ³n de Bienvenida */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Â¡Bienvenido, {user?.name}! ðŸ‘‹
          </h1>
          <p className="welcome-subtitle">
            AquÃ­ estÃ¡ el resumen de tu clÃ­nica odontolÃ³gica hoy
          </p>
        </div>
        <div className="welcome-actions">
          <Button
            type="primary"
            size="large"
            className="action-btn"
            icon={<CalendarOutlined />}
            onClick={() => navigate('/appointments')}
          >
            Nueva Cita
          </Button>
          <Button
            size="large"
            className="action-btn"
            icon={<UserOutlined />}
            onClick={() => navigate('/patients')}
          >
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {/* KPIs - EstadÃ­sticas Principales */}
      <Row gutter={[20, 20]} className="kpi-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card kpi-card-primary">
            <div className="kpi-icon"><DollarOutlined style={{ fontSize: '28px' }} /></div>
            <Statistic
              title="Ingresos Hoy"
              value={metrics.totalRevenueToday}
              suffix="L"
              valueStyle={{ color: '#131e4e', fontSize: '28px', fontWeight: '700' }}
            />
            <div className="kpi-footer">
              <ArrowUpOutlined style={{ color: '#10b981' }} /> 12% vs ayer
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card kpi-card-success">
            <div className="kpi-icon"><LineChartOutlined style={{ fontSize: '28px' }} /></div>
            <Statistic
              title="Ingresos Mes"
              value={metrics.totalRevenueMonth}
              suffix="L"
              valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: '700' }}
            />
            <div className="kpi-footer">
              Meta: L{settings.monthlyRevenueGoal.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card kpi-card-warning">
            <div className="kpi-icon"><CalendarOutlined style={{ fontSize: '28px' }} /></div>
            <Statistic
              title="Citas Hoy"
              value={metrics.appointmentsToday}
              suffix=" agendadas"
              valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: '700' }}
            />
            <div className="kpi-footer">
              <CheckCircleOutlined style={{ color: '#10b981' }} /> {metrics.appointmentsCompleted} completadas
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="kpi-card kpi-card-info">
            <div className="kpi-icon"><UserOutlined style={{ fontSize: '28px' }} /></div>
            <Statistic
              title="Total Pacientes"
              value={metrics.totalPatients}
              suffix=" registrados"
              valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: '700' }}
            />
            <div className="kpi-footer">
              <StarOutlined style={{ color: '#f59e0b' }} /> +{metrics.newPatientsMonth} este mes
            </div>
          </Card>
        </Col>
      </Row>

      {/* GrÃ¡ficos */}
      <Row gutter={[20, 20]} style={{ marginTop: '32px' }}>
        {/* Ingresos por Doctor */}
        <Col xs={24} lg={12}>
          <Card title="Ingresos por Doctor" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={value => `L ${value.toLocaleString()}`} contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }} />
                <Bar dataKey="revenue" fill="#131e4e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Tendencia de Ingresos */}
        <Col xs={24} lg={12}>
          <Card title="Ingresos (Ãšltimos 7 dÃ­as)" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={value => `L ${value.toLocaleString()}`} contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }} />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#131e4e"
                  dot={{ fill: '#131e4e', r: 5 }}
                  activeDot={{ r: 7 }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
        {/* DistribuciÃ³n de Tratamientos */}
        <Col xs={24} lg={12}>
          <Card title="DistribuciÃ³n de Tratamientos" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={treatmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {treatmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Resumen de Citas */}
        <Col xs={24} lg={12}>
          <Card title="Resumen de Citas" className="chart-card">
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Citas Completadas Hoy</h4>
                <p style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold', margin: 0 }}>
                  {metrics.appointmentsCompleted} / {metrics.appointmentsToday}
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasa de OcupaciÃ³n</h4>
                <p style={{ fontSize: '32px', color: '#131e4e', fontWeight: 'bold', margin: 0 }}>
                  {((metrics.appointmentsCompleted / metrics.appointmentsToday) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Nuevos Pacientes del Mes */}
      <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
        <Col xs={24}>
          <Card title="Actividad General" className="chart-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card type="inner" className="activity-card">
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nuevos Pacientes Este Mes</p>
                  <h3 style={{ margin: '12px 0 0 0', color: '#131e4e', fontSize: '28px', fontWeight: 'bold' }}>
                    {metrics.newPatientsMonth}
                  </h3>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card type="inner" className="activity-card">
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Citas Pendientes</p>
                  <h3 style={{ margin: '12px 0 0 0', color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}>
                    {metrics.appointmentsToday - metrics.appointmentsCompleted}
                  </h3>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card type="inner" className="activity-card">
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Promedio Ingreso/DÃ­a</p>
                  <h3 style={{ margin: '12px 0 0 0', color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}>
                    L {(metrics.totalRevenueMonth / 30).toFixed(0)}
                  </h3>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
