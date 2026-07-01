import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Space, notification } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { ThemeConfig, getThemeConfig, setThemeConfig, defaultTheme } from '../../config/themeConfig';
import ColorPicker from './ColorPicker';
import './ThemeSettings.css';

const ThemeSettings: React.FC = () => {
  const [config, setConfig] = useState<ThemeConfig>(defaultTheme);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedConfig = getThemeConfig();
    setConfig(savedConfig);
  }, []);

  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setThemeConfig(newConfig);
  };

  const handleReset = () => {
    setConfig(defaultTheme);
    setThemeConfig(defaultTheme);
    notification.success({
      message: 'Éxito',
      description: 'Tema restaurado a valores por defecto',
      placement: 'topRight',
    });
  };

  const ColorGroup = ({ title, colors }: { title: string; colors: Array<{ key: keyof ThemeConfig; label: string }> }) => (
    <Card style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {colors.map(({ key, label }) => (
          <div key={key} style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
              {label}
            </p>
            <ColorPicker
              value={config[key]}
              onChange={(color) => handleColorChange(key, color)}
              label={label}
            />
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="theme-settings-container">
      <Row gutter={[24, 24]}>
        {/* Controles */}
        <Col xs={24} lg={14}>
          <div>
            <ColorGroup
              title="🎨 Colores Principales"
              colors={[
                { key: 'primary', label: 'Primario' },
                { key: 'secondary', label: 'Secundario' },
              ]}
            />

            <ColorGroup
              title="📊 Colores de Estado"
              colors={[
                { key: 'success', label: 'Éxito (Verde)' },
                { key: 'warning', label: 'Advertencia (Ámbar)' },
                { key: 'danger', label: 'Peligro (Rojo)' },
              ]}
            />

            <ColorGroup
              title="📝 Colores de Texto"
              colors={[
                { key: 'textPrimary', label: 'Texto Principal' },
                { key: 'textSecondary', label: 'Texto Secundario' },
              ]}
            />

            <ColorGroup
              title="🖼️ Colores de Fondo"
              colors={[
                { key: 'bgLight', label: 'Fondo Claro' },
                { key: 'border', label: 'Bordes' },
              ]}
            />

            <ColorGroup
              title="⚙️ Navegación"
              colors={[
                { key: 'sidebarBg', label: 'Sidebar - Fondo' },
                { key: 'sidebarText', label: 'Sidebar - Texto' },
              ]}
            />

            <ColorGroup
              title="📈 Gráficas"
              colors={[
                { key: 'chartBar1', label: 'Barras Primarias' },
                { key: 'chartBar2', label: 'Barras Secundarias' },
              ]}
            />

            <ColorGroup
              title="🔘 Botones"
              colors={[
                { key: 'buttonPrimary', label: 'Botón Primario' },
                { key: 'buttonSecondary', label: 'Botón Secundario' },
              ]}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => {
                  notification.success({
                  message: 'Éxito',
                  description: 'Cambios guardados correctamente',
                  placement: 'topRight',
                });
                }}
              >
                Guardar
              </Button>
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Restaurar
              </Button>
            </div>
          </div>
        </Col>

        {/* Vista Previa */}
        <Col xs={24} lg={10}>
          <Card title="👁️ Vista Previa" className="preview-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Botones */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  BOTONES
                </p>
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: config.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Botón Primario
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: config.secondary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Botón Secundario
                </button>
              </div>

              {/* Estados */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  ESTADOS
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: config.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Éxito
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: config.warning,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Alerta
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: config.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Error
                  </button>
                </div>
              </div>

              {/* Texto */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  TEXTO
                </p>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: config.bgLight,
                    border: `1px solid ${config.border}`,
                    borderRadius: '6px',
                  }}
                >
                  <p style={{ margin: '0 0 4px 0', color: config.textPrimary, fontWeight: '600' }}>
                    Texto Principal
                  </p>
                  <p style={{ margin: '0', color: config.textSecondary, fontSize: '12px' }}>
                    Texto Secundario
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  SIDEBAR
                </p>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: config.sidebarBg,
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ color: config.sidebarText, fontWeight: '600', marginBottom: '4px' }}>
                    Menú Principal
                  </div>
                  <div style={{ color: config.sidebarText, opacity: 0.7, fontSize: '11px' }}>
                    Opción 1
                  </div>
                </div>
              </div>

              {/* Gráficas */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  GRÁFICAS
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '60px' }}>
                  <div
                    style={{
                      flex: 1,
                      height: '80%',
                      backgroundColor: config.chartBar1,
                      borderRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: '50%',
                      backgroundColor: config.chartBar2,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThemeSettings;
