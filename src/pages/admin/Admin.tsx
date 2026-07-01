import React from 'react';
import { Tabs, Card } from 'antd';
import { BgColorsOutlined, SettingOutlined } from '@ant-design/icons';
import ThemeSettings from './ThemeSettings';
import './Admin.css';

const Admin: React.FC = () => {
  const items = [
    {
      key: '1',
      label: (
        <span>
          <BgColorsOutlined />
          ConfiguraciÃ³n de Tema
        </span>
      ),
      children: <ThemeSettings />,
    },
    {
      key: '2',
      label: (
        <span>
          <SettingOutlined />
          ConfiguraciÃ³n General
        </span>
      ),
      children: (
        <Card>
          <p>MÃ¡s configuraciones prÃ³ximamente...</p>
        </Card>
      ),
    },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de AdministraciÃ³n</h1>
        <p>Configura y personaliza tu sistema</p>
      </div>
      <Tabs items={items} />
    </div>
  );
};

export default Admin;
