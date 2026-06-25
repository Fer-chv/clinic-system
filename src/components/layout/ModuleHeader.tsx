import { Input, Button, Space } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'

interface ModuleHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onAddClick?: () => void
  addButtonText?: string
}

export default function ModuleHeader({
  title,
  subtitle,
  icon,
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  onAddClick,
  addButtonText = 'Nuevo',
}: ModuleHeaderProps) {
  return (
    <div className="module-header">
      <div className="module-header-left">
        <div className="module-header-content">
          <h1 className="module-title">
            {icon && <span className="module-icon">{icon}</span>}
            <span>{title}</span>
          </h1>
          {subtitle && <p className="module-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="module-header-right">
        <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
          {onSearchChange && (
            <Input
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="module-search"
              style={{ width: '280px' }}
            />
          )}

          {onAddClick && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddClick}
              size="large"
              className="module-add-btn"
            >
              {addButtonText}
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}
