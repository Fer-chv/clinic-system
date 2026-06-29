import React, { useState } from 'react'
import { Layout, Menu, Button, Dropdown, Space, Drawer, ConfigProvider } from 'antd'
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

  const userMenu = [
    {
      key: 'profile',
      label: `${user?.name}`,
      disabled: true,
    },
    {
      key: 'logout',
      label: translations.headerLogout,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

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
          background: '#fff',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          borderRight: '1px solid #f0f0f0',
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
          borderBottom: '1px solid #f0f0f0',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
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
          background: 'linear-gradient(90deg, #ffffff 0%, #f9fafb 100%)',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-menu-btn"
              style={{
                transition: 'all 0.3s',
              }}
            />
            <Button
              type="text"
              icon={mobileMenuOpen ? <CloseOutlined style={{ fontSize: '18px', color: '#667eea' }} /> : <MenuOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
            />
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              🦷 {translations.headerTitle}
            </h1>
          </div>
          <Space size="large">
            <div style={{
              padding: '4px 12px',
              borderRadius: '8px',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              {translations.headerVersion}
            </div>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <Button
                type="text"
                icon={<UserOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
                style={{
                  color: '#1f2937',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                }}
              >
                {user?.name}
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{
          minHeight: 'calc(100vh - 64px)',
          background: '#f5f5f5',
          padding: '24px',
          overflowY: 'auto',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
