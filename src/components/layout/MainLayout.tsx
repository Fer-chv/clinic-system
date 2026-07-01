import React, { useState, useEffect } from 'react'
import { Layout, Menu, Button, Space, Drawer, ConfigProvider } from 'antd'
import { useThemeColors } from '@/hooks/useThemeColors'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  SettingOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTranslationsStore } from '@/stores/translationsStore'
import UserProfile from './UserProfile'
import { initTheme } from '@/config/themeConfig'
import './MainLayout.css'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  useThemeColors()

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { settings } = useSettingsStore()
  const { translations } = useTranslationsStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    initTheme()
  }, [])

  const iconMap: Record<string, React.JSX.Element> = {
    '📊': <DashboardOutlined style={{ fontSize: '18px' }} />,
    '👥': <UserOutlined style={{ fontSize: '18px' }} />,
    '👨‍⚕️': <TeamOutlined style={{ fontSize: '18px' }} />,
    '📅': <CalendarOutlined style={{ fontSize: '18px' }} />,
    '📋': <FileTextOutlined style={{ fontSize: '18px' }} />,
    '🦷': <FileTextOutlined style={{ fontSize: '18px' }} />,
    '📦': <ShoppingCartOutlined style={{ fontSize: '18px' }} />,
    '🧾': <DollarOutlined style={{ fontSize: '18px' }} />,
    '💰': <DollarOutlined style={{ fontSize: '18px' }} />,
    '📈': <LineChartOutlined style={{ fontSize: '18px' }} />,
  }

  const moduleNameMap: Record<string, string> = {
    'dashboard': translations.moduleDashboard,
    'patients': translations.modulePatients,
    'doctors': translations.moduleDoctors,
    'appointments': translations.moduleAppointments,
    'clinical': translations.moduleClinical,
    'evaluation': translations.moduleEvaluation,
    'inventory': translations.moduleInventory,
    'invoices': translations.moduleInvoices,
    'reports': translations.moduleReports,
  }

  const visibleModules = settings.modules
    .filter(m => m.visible)
    .sort((a, b) => a.order - b.order)

  const menuItems = [
    ...visibleModules.map(module => ({
      key: module.path,
      icon: iconMap[module.icon] || <DashboardOutlined />,
      label: moduleNameMap[module.id] || module.name,
      onClick: () => {
        navigate(module.path)
        setMobileMenuOpen(false)
      },
    })),
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Admin',
      onClick: () => {
        navigate('/settings')
        setMobileMenuOpen(false)
      },
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getSelectedKey = () => {
    const path = location.pathname
    if (path.includes('appointments') || path.includes('clinical')) {
      return '/appointments'
    }
    return path
  }

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Desktop Sidebar - Solo visible en desktop */}
      <Sider
        width={200}
        style={{
          background: '#0f172a',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          borderRight: '1px solid rgba(75, 85, 99, 0.3)',
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={0}
        className="desktop-sider"
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
          background: '#0f172a',
          color: 'white',
          fontSize: '15px',
          fontWeight: 600,
          padding: '0 12px',
          gap: '8px',
        }}>
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" style={{ height: 40, width: 40, objectFit: 'contain' }} />
          ) : (
            '🦷'
          )}
          {!collapsed && settings.clinicName}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ borderRight: 'none' }}
        />
      </Sider>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menú"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-drawer"
      >
        <Menu
          mode="vertical"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ borderRight: 'none' }}
        />
      </Drawer>

      {/* Layout Principal */}
      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '18px', color: '#3b82f6' }} />}
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-menu-btn"
              style={{
                transition: 'all 0.2s',
              }}
            />
            <Button
              type="text"
              icon={mobileMenuOpen ? <CloseOutlined style={{ fontSize: '18px', color: '#3b82f6' }} /> : <MenuOutlined style={{ fontSize: '18px', color: '#3b82f6' }} />}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
            />
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.3px',
            }}>
              🦷 {translations.headerTitle}
            </h1>
          </div>
          <Space size="middle">
            <div style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: '#f0f9ff',
              color: '#3b82f6',
              fontSize: '11px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              minWidth: '60px',
              textAlign: 'center',
            }}>
              {translations.headerVersion}
            </div>
            <UserProfile
              userName={user?.name || 'Administrador'}
              userEmail={user?.email || 'admin@clinica.com'}
              userImage={user?.photo || undefined}
            />
          </Space>
        </Header>

        {/* Content */}
        <Content style={{
          minHeight: 'calc(100vh - 64px)',
          background: '#fafbfc',
          padding: '24px',
          overflowY: 'auto',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
