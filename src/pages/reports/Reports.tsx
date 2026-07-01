import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Tabs,
  DatePicker,
  Select,
  Space,
  message,
  Table,
  Statistic,
} from 'antd'
import { DownloadOutlined, PrinterOutlined, BarChartOutlined } from '@ant-design/icons'
import databaseService from '@/services/database'
import dayjs from 'dayjs'
import ModuleHeader from '@/components/layout/ModuleHeader'
import '@/components/layout/ModuleHeader.css'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './Reports.css'

export default function Reports() {
  const [startDate, setStartDate] = useState(dayjs().startOf('month'))
  const [endDate, setEndDate] = useState(dayjs())
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all')
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    const users = databaseService.getAllUsers() || []
    const doctorsList = users.filter((u: any) => u.role === 'doctor')
    setDoctors(doctorsList)
  }, [])

  const handleExportPDF = () => {
    message.success('Reporte exportado a PDF')
  }

  const handlePrint = () => {
    window.print()
  }

  // Mock data para reportes
  const doctorEarnings = [
    { name: 'Dr. GarcÃ­a', total: 5000, percentage: 30, earned: 1500 },
    { name: 'Dra. LÃ³pez', total: 4500, percentage: 30, earned: 1350 },
    { name: 'Dr. MartÃ­nez', total: 3800, percentage: 35, earned: 1330 },
  ]

  const inventoryReport = [
    { name: 'Resina Compuesta', category: 'Materiales', stock: 45, minStock: 20, total: 450 },
    { name: 'Amalgama', category: 'Materiales', stock: 12, minStock: 30, total: 180 },
    { name: 'AntibiÃ³ticos', category: 'Medicinas', stock: 8, minStock: 15, total: 160 },
  ]

  const patientDemographics = [
    { range: '0-18 aÃ±os', count: 15, percentage: 12 },
    { range: '18-30 aÃ±os', count: 32, percentage: 26 },
    { range: '30-45 aÃ±os', count: 38, percentage: 31 },
    { range: '45-60 aÃ±os', count: 28, percentage: 23 },
    { range: '60+ aÃ±os', count: 9, percentage: 8 },
  ]

  const occupancyData = [
    { doctor: 'Dr. GarcÃ­a', occupancy: 85 },
    { doctor: 'Dra. LÃ³pez', occupancy: 92 },
    { doctor: 'Dr. MartÃ­nez', occupancy: 78 },
  ]

  const doctorEarningsColumns = [
    { title: 'Doctor', dataIndex: 'name', key: 'name' },
    { title: 'Ingresos Totales', dataIndex: 'total', key: 'total', render: (v: number) => `L ${v}` },
    { title: 'Porcentaje %', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%` },
    { title: 'Ganancia', dataIndex: 'earned', key: 'earned', render: (v: number) => `L ${v}` },
  ]

  const inventoryColumns = [
    { title: 'Producto', dataIndex: 'name', key: 'name' },
    { title: 'CategorÃ­a', dataIndex: 'category', key: 'category' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'MÃ­nimo', dataIndex: 'minStock', key: 'minStock' },
    { title: 'Total Valor', dataIndex: 'total', key: 'total', render: (v: number) => `L ${v}` },
  ]

  const patientColumns = [
    { title: 'Rango Edad', dataIndex: 'range', key: 'range' },
    { title: 'Cantidad', dataIndex: 'count', key: 'count' },
    { title: 'Porcentaje', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%` },
  ]

  return (
    <div className="reports-container">
      <ModuleHeader
        title="ReporterÃ­a"
        icon={<BarChartOutlined style={{ fontSize: '24px' }} />}
        subtitle="AnÃ¡lisis detallado del desempeÃ±o de tu clÃ­nica"
      />

      <Card className="reports-filters-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
              Desde
            </label>
            <DatePicker
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col xs={24} md={6}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
              Hasta
            </label>
            <DatePicker
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col xs={24} md={6}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
              Doctor
            </label>
            <Select
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              style={{ width: '100%' }}
              size="large"
              options={[
                { label: 'Todos los Doctores', value: 'all' },
                ...doctors.map(d => ({ label: d.name, value: d.id })),
              ]}
            />
          </Col>
          <Col xs={24} md={6} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <Button icon={<PrinterOutlined />} onClick={handlePrint} size="large">
              Imprimir
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportPDF} size="large">
              Exportar PDF
            </Button>
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Ingresos por Doctor',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card>
                    <Table
                      columns={doctorEarningsColumns}
                      dataSource={doctorEarnings}
                      rowKey="name"
                      pagination={false}
                    />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Comparativa de Ingresos">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={doctorEarnings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={value => `L ${value}`} />
                        <Legend />
                        <Bar dataKey="total" fill="#131e4e" name="Total Ingresos" />
                        <Bar dataKey="earned" fill="#10b981" name="Ganancias" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            label: 'Inventario',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Total Productos"
                      value={inventoryReport.length}
                      valueStyle={{ color: '#131e4e' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Valor Total Inventario"
                      value={inventoryReport.reduce((sum, p) => sum + p.total, 0)}
                      prefix="L "
                      valueStyle={{ color: '#10b981' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Productos Bajo Stock"
                      value={inventoryReport.filter(p => p.stock <= p.minStock).length}
                      valueStyle={{ color: '#ef4444' }}
                    />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Detalle de Inventario">
                    <Table
                      columns={inventoryColumns}
                      dataSource={inventoryReport}
                      rowKey="name"
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            label: 'Pacientes',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card title="DistribuciÃ³n por Edad">
                    <Table
                      columns={patientColumns}
                      dataSource={patientDemographics}
                      rowKey="range"
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '4',
            label: 'OcupaciÃ³n',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card title="Tasa de OcupaciÃ³n por Doctor">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={occupancyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="doctor" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={value => `${value}%`} />
                        <Bar dataKey="occupancy" fill="#131e4e" name="OcupaciÃ³n %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  )
}


