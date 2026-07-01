import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined, RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTranslationsStore } from '@/stores/translationsStore'
import './Login.css'

export default function Login() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const { settings } = useSettingsStore()
  const { translations } = useTranslationsStore()
  const [focused, setFocused] = useState<string | null>(null)

  const handleLogin = async (values: { email: string; password: string }) => {
    const response = await login(values)
    if (response.success) {
      message.success('Â¡Bienvenido!')
      navigate('/dashboard')
    } else {
      message.error(response.error || 'Error en login')
    }
  }

  const handleDemoLogin = async () => {
    const response = await login({
      email: 'admin@clinic.com',
      password: 'password',
    })
    if (response.success) {
      message.success('Â¡SesiÃ³n de demostraciÃ³n iniciada!')
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="login-container"
      style={{
        background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`
      }}
    >
      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                'ðŸ¦·'
              )}
            </div>
            <h1 style={{
              background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {translations.loginTitle}
            </h1>
            <p>{translations.loginSubtitle}</p>
          </div>

          {/* Form */}
          <Form
            form={form}
            onFinish={handleLogin}
            layout="vertical"
            className="login-form"
            autoComplete="off"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingrese su email' },
                { type: 'email', message: 'Email invÃ¡lido' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={translations.loginEmailPlaceholder}
                disabled={isLoading}
                size="large"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className={focused === 'email' ? 'focused' : ''}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingrese su contraseÃ±a',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={translations.loginPasswordPlaceholder}
                disabled={isLoading}
                size="large"
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                className={focused === 'password' ? 'focused' : ''}
              />
            </Form.Item>

            {/* Login Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                icon={<LoginOutlined />}
                className="login-button"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
                  borderColor: 'transparent',
                  boxShadow: `0 8px 20px ${settings.primaryColor}4d`
                }}
              >
                {translations.loginButton}
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <div className="divider">
            <span>{translations.loginDivider}</span>
          </div>

          {/* Demo Button */}
          <Button
            onClick={handleDemoLogin}
            loading={isLoading}
            block
            size="large"
            icon={<RocketOutlined />}
            className="demo-button"
            style={{
              borderColor: settings.primaryColor,
              color: settings.primaryColor,
            }}
          >
            {translations.loginDemoButton}
          </Button>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <div className="credential-item">
              <span className="label">Email:</span>
              <span className="value">{translations.loginDemoEmail}</span>
            </div>
            <div className="credential-item">
              <span className="label">ContraseÃ±a:</span>
              <span className="value">{translations.loginDemoPassword}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

