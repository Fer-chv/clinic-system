import { useState } from 'react'
import { Card, Row, Col, Input, InputNumber, Button, Space, Upload, Tabs, notification, Divider, Empty, Tooltip } from 'antd'
import { UploadOutlined, ReloadOutlined, SaveOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore, ModuleConfig } from '@/stores/settingsStore'
import { useTranslationsStore, Translations } from '@/stores/translationsStore'
import './Settings.css'

export default function Settings() {
  const navigate = useNavigate()
  const { settings, updateClinicName, updateLogo, updateColors, updateModuleOrder, toggleModuleVisibility, updateMonthlyRevenueGoal, resetToDefaults } = useSettingsStore()
  const { translations, updateTranslation, resetToDefaults: resetTranslations } = useTranslationsStore()
  const [modules, setModules] = useState<ModuleConfig[]>(settings.modules)
  const [draggedItem, setDraggedItem] = useState<ModuleConfig | null>(null)

  const handleClinicNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateClinicName(e.target.value)
  }

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    if (colorType === 'primary') {
      updateColors(value, settings.secondaryColor, settings.accentColor)
    } else if (colorType === 'secondary') {
      updateColors(settings.primaryColor, value, settings.accentColor)
    } else {
      updateColors(settings.primaryColor, settings.secondaryColor, value)
    }
  }

  const handleLogoUpload = (info: any) => {
    const file = info.file.originFileObj || info.file
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateLogo(e.target?.result as string)
        notification.success({
          message: 'Ã‰xito',
          description: 'Logo actualizado correctamente',
          placement: 'topRight',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleModuleReorder = (sourceIndex: number, targetIndex: number) => {
    const newModules = [...modules]
    const [movedItem] = newModules.splice(sourceIndex, 1)
    newModules.splice(targetIndex, 0, movedItem)

    const reorderedModules = newModules.map((m, idx) => ({ ...m, order: idx }))
    setModules(reorderedModules)
    updateModuleOrder(reorderedModules)
  }

  const handleDragStart = (module: ModuleConfig) => {
    setDraggedItem(module)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetModule: ModuleConfig) => {
    if (!draggedItem) return

    const sourceIndex = modules.findIndex(m => m.id === draggedItem.id)
    const targetIndex = modules.findIndex(m => m.id === targetModule.id)

    if (sourceIndex !== targetIndex) {
      handleModuleReorder(sourceIndex, targetIndex)
    }
    setDraggedItem(null)
  }

  const handleReset = () => {
    if (window.confirm('Â¿EstÃ¡ seguro de que desea restaurar la configuraciÃ³n predeterminada?')) {
      resetToDefaults()
      setModules(settings.modules)
      notification.success({
        message: 'Ã‰xito',
        description: 'ConfiguraciÃ³n restaurada',
        placement: 'topRight',
      })
    }
  }

  const handleResetTranslations = () => {
    if (window.confirm('Â¿EstÃ¡ seguro de que desea restaurar todas las leyendas predeterminadas?')) {
      resetTranslations()
      notification.success({
        message: 'Ã‰xito',
        description: 'Leyendas restauradas',
        placement: 'topRight',
      })
    }
  }

  const translationGroups: Record<string, (keyof Translations)[]> = {
    'Login': ['loginTitle', 'loginSubtitle', 'loginEmailPlaceholder', 'loginPasswordPlaceholder', 'loginButton', 'loginDemoButton', 'loginDemoEmail', 'loginDemoPassword', 'loginDivider'],
    'Header': ['headerTitle', 'headerVersion', 'headerLogout', 'headerProfile'],
    'Dashboard': ['dashboardWelcome', 'dashboardSubtitle', 'dashboardNewAppointment', 'dashboardNewPatient', 'dashboardRevenueToday', 'dashboardRevenueMonth', 'dashboardAppointmentsToday', 'dashboardTotalPatients', 'dashboardRevenueByDoctor', 'dashboardRevenueHistory', 'dashboardTreatmentDistribution', 'dashboardAppointmentsSummary', 'dashboardGeneralActivity', 'dashboardNewPatientsMonth', 'dashboardPendingAppointments', 'dashboardAverageIncome'],
    'MÃ³dulos': ['moduleDashboard', 'modulePatients', 'moduleDoctors', 'moduleAppointments', 'moduleClinical', 'moduleInventory', 'moduleInvoices', 'moduleReports', 'moduleAdministration'],
    'ComÃºn': ['save', 'cancel', 'delete', 'edit', 'add', 'search', 'loading', 'success', 'error', 'warning', 'info'],
  }

  const getLabelForKey = (key: string): string => {
    const labels: Record<string, string> = {
      'loginTitle': 'TÃ­tulo del Login',
      'loginSubtitle': 'SubtÃ­tulo del Login',
      'loginEmailPlaceholder': 'Placeholder Email',
      'loginPasswordPlaceholder': 'Placeholder ContraseÃ±a',
      'loginButton': 'BotÃ³n Iniciar SesiÃ³n',
      'loginDemoButton': 'BotÃ³n Demo',
      'loginDemoEmail': 'Email Demo',
      'loginDemoPassword': 'ContraseÃ±a Demo',
      'loginDivider': 'Divisor',
      'headerTitle': 'TÃ­tulo del Header',
      'headerVersion': 'VersiÃ³n',
      'headerLogout': 'Logout',
      'headerProfile': 'Perfil',
      'dashboardWelcome': 'Bienvenida',
      'dashboardSubtitle': 'SubtÃ­tulo',
      'dashboardNewAppointment': 'Nueva Cita',
      'dashboardNewPatient': 'Nuevo Paciente',
      'dashboardRevenueToday': 'Ingresos Hoy',
      'dashboardRevenueMonth': 'Ingresos Mes',
      'dashboardAppointmentsToday': 'Citas Hoy',
      'dashboardTotalPatients': 'Total Pacientes',
      'dashboardRevenueByDoctor': 'Ingresos por Doctor',
      'dashboardRevenueHistory': 'HistÃ³rico de Ingresos',
      'dashboardTreatmentDistribution': 'DistribuciÃ³n de Tratamientos',
      'dashboardAppointmentsSummary': 'Resumen de Citas',
      'dashboardGeneralActivity': 'Actividad General',
      'dashboardNewPatientsMonth': 'Nuevos Pacientes',
      'dashboardPendingAppointments': 'Citas Pendientes',
      'dashboardAverageIncome': 'Promedio Ingreso',
      'moduleDashboard': 'Dashboard',
      'modulePatients': 'Pacientes',
      'moduleDoctors': 'Doctores',
      'moduleAppointments': 'Citas',
      'moduleClinical': 'Expedientes',
      'moduleInventory': 'Inventario',
      'moduleInvoices': 'FacturaciÃ³n',
      'moduleReports': 'Reportes',
      'moduleAdministration': 'AdministraciÃ³n',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'delete': 'Eliminar',
      'edit': 'Editar',
      'add': 'Agregar',
      'search': 'Buscar',
      'loading': 'Cargando',
      'success': 'Ã‰xito',
      'error': 'Error',
      'warning': 'Advertencia',
      'info': 'InformaciÃ³n',
    }
    return labels[key] || key
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>âš™ï¸ AdministraciÃ³n del Sistema</h1>
            <p>Personaliza tu clÃ­nica odontolÃ³gica</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<UserOutlined />}
            onClick={() => navigate('/users')}
            style={{
              background: '#131e4e',
              border: 'none',
              height: '48px',
              borderRadius: '10px',
            }}
          >
            ðŸ‘¥ Gestionar Usuarios
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="general"
        items={[
          {
            key: 'general',
            label: 'ðŸ¥ General',
            children: (
              <Row gutter={[20, 20]}>
                <Col xs={24} lg={12}>
                  <Card className="settings-card">
                    <h3>InformaciÃ³n de la ClÃ­nica</h3>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <label className="settings-label">Nombre de la ClÃ­nica</label>
                        <Input
                          size="large"
                          value={settings.clinicName}
                          onChange={handleClinicNameChange}
                          placeholder="Ingrese el nombre de su clÃ­nica"
                          className="settings-input"
                        />
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#6b7280',
                        }}>
                          <strong>Vista previa en el sidebar:</strong><br/>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                            ðŸ¦· {settings.clinicName}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="settings-label">Meta de Ingresos Mensuales</label>
                        <InputNumber
                          size="large"
                          value={settings.monthlyRevenueGoal}
                          onChange={(value) => updateMonthlyRevenueGoal(value || 50000)}
                          placeholder="Ingrese la meta de ingresos"
                          className="settings-input"
                          min={0}
                          precision={0}
                          formatter={(value) => `L ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => parseFloat(value!.replace(/L\s?|(,*)/g, ''))}
                          style={{ width: '100%' }}
                        />
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#6b7280',
                        }}>
                          <strong>Meta actual:</strong> L {settings.monthlyRevenueGoal.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <label className="settings-label">Logo</label>
                        <div className="logo-preview">
                          {settings.logo ? (
                            <img src={settings.logo} alt="Logo" className="logo-image" />
                          ) : (
                            <div className="logo-placeholder">Sin logo</div>
                          )}
                        </div>
                        <Upload
                          maxCount={1}
                          accept="image/*"
                          onChange={handleLogoUpload}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} block size="large" className="upload-btn">
                            Cambiar Logo
                          </Button>
                        </Upload>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card className="settings-card">
                    <h3>Colores del Sistema</h3>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <label className="settings-label">Color Primario</label>
                        <div className="color-picker-wrapper">
                          <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="color-picker"
                          />
                          <span className="color-value">{settings.primaryColor}</span>
                        </div>
                      </div>

                      <div>
                        <label className="settings-label">Color Secundario</label>
                        <div className="color-picker-wrapper">
                          <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="color-picker"
                          />
                          <span className="color-value">{settings.secondaryColor}</span>
                        </div>
                      </div>

                      <div>
                        <label className="settings-label">Color de Acento</label>
                        <div className="color-picker-wrapper">
                          <input
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                            className="color-picker"
                          />
                          <span className="color-value">{settings.accentColor}</span>
                        </div>
                      </div>

                      <div className="color-preview">
                        <div className="preview-box" style={{ background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)` }}>
                          <span>Vista Previa</span>
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'modules',
            label: 'ðŸ“¦ MÃ³dulos',
            children: (
              <Card className="settings-card">
                <div className="modules-header">
                  <h3>GestiÃ³n de MÃ³dulos</h3>
                  <p className="modules-hint">Arrastra los mÃ³dulos para reordenarlos â€¢ Usa el toggle para mostrar/ocultar</p>
                </div>

                <Divider />

                <div className="modules-list">
                  {modules.length === 0 ? (
                    <Empty description="No hay mÃ³dulos disponibles" />
                  ) : (
                    modules.map((module, index) => (
                      <div
                        key={module.id}
                        draggable
                        onDragStart={() => handleDragStart(module)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(module)}
                        className={`module-item ${draggedItem?.id === module.id ? 'dragging' : ''}`}
                      >
                        <div className="module-handle">â˜°</div>
                        <div className="module-info">
                          <span className="module-icon">{module.icon}</span>
                          <div className="module-details">
                            <p className="module-name">{module.name}</p>
                            <p className="module-path">{module.path}</p>
                          </div>
                        </div>
                        <div className="module-controls">
                          <Tooltip title={module.visible ? 'Ocultar' : 'Mostrar'}>
                            <Button
                              type="text"
                              icon={module.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              onClick={() => toggleModuleVisibility(module.id)}
                              className={module.visible ? 'visible-btn' : 'hidden-btn'}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            ),
          },
          {
            key: 'translations',
            label: 'ðŸŒ Leyendas',
            children: (
              <Card className="settings-card">
                <div className="translations-header">
                  <h3>PersonalizaciÃ³n de Leyendas</h3>
                  <p className="translations-hint">Modifica todos los textos que aparecen en el sistema</p>
                </div>

                <Divider />

                <div className="translations-container">
                  {Object.entries(translationGroups).map(([group, keys]) => (
                    <div key={group} className="translation-group">
                      <h4 className="translation-group-title">{group}</h4>
                      <div className="translation-items">
                        {keys.map((key) => (
                          <div key={key} className="translation-item">
                            <label className="translation-label">{getLabelForKey(key)}</label>
                            <Input
                              value={translations[key as keyof Translations]}
                              onChange={(e) => updateTranslation(key as keyof Translations, e.target.value)}
                              placeholder={`Ingrese ${getLabelForKey(key).toLowerCase()}`}
                              className="translation-input"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />

                <Button
                  danger
                  onClick={handleResetTranslations}
                  style={{ marginTop: '16px' }}
                >
                  Restaurar Leyendas Predeterminadas
                </Button>
              </Card>
            ),
          },
        ]}
      />

      <Row gutter={[12, 12]} style={{ marginTop: '32px' }}>
        <Col xs={24} sm={12}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            block
            className="settings-btn-save"
            onClick={() => {
              notification.success({
              message: 'Ã‰xito',
              description: 'Cambios guardados correctamente',
              placement: 'topRight',
            })
            }}
          >
            Guardar Cambios
          </Button>
        </Col>
        <Col xs={24} sm={12}>
          <Button
            danger
            size="large"
            icon={<ReloadOutlined />}
            block
            onClick={handleReset}
          >
            Restaurar Predeterminados
          </Button>
        </Col>
      </Row>
    </div>
  )
}

