import React, { useState } from 'react';
import { Dropdown, Avatar, Space, Button } from 'antd';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import './UserProfile.css';

interface UserProfileProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName = 'Administrador',
  userEmail = 'admin@clinica.com',
  userImage
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('authToken');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const items = [
    {
      key: 'profile',
      label: (
        <div className="menu-item-profile">
          <div className="menu-avatar">
            <Avatar src={userImage} size={40} icon={<UserOutlined />} />
          </div>
          <div className="menu-info">
            <div className="menu-name">{userName}</div>
            <div className="menu-email">{userEmail}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: 'Configuración',
      icon: <SettingOutlined />,
      onClick: () => window.location.href = '/admin',
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="user-profile-container">
      <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
        <Button
          type="text"
          className="profile-button"
          icon={<Avatar src={userImage} size={36} icon={<UserOutlined />} />}
        />
      </Dropdown>
    </div>
  );
};

export default UserProfile;
