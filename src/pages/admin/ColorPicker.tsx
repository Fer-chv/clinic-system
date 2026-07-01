import React, { useState } from 'react';
import { Popover } from 'antd';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const [hexInput, setHexInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleHexChange = (newHex: string) => {
    setHexInput(newHex);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(newHex)) {
      onChange(newHex);
    }
  };

  const handleInputColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onChange(newColor);
    setHexInput(newColor);
  };

  const commonColors = [
    '#3b82f6', '#1e40af', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#0f172a', '#fafbfc', '#e2e8f0', '#64748b', '#131e4e', '#0f1638',
    '#06b6d4', '#d97706', '#7c3aed', '#ec4899', '#14b8a6', '#f43f5e'
  ];

  const pickerContent = (
    <div style={{ width: '300px' }}>
      {/* Nativo Color Picker */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>
          SELECTOR
        </label>
        <input
          type="color"
          value={value}
          onChange={handleInputColorChange}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            height: '50px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Colores Frecuentes */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>
          PRESETS
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
          {commonColors.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange(color);
                setHexInput(color);
              }}
              style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: color,
                border: value === color ? '3px solid #0f172a' : '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Input Hex Manual */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>
          INGRESE HEX
        </label>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="#000000"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: '600',
          }}
          maxLength={7}
        />
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0 0' }}>
          Ej: #3b82f6
        </p>
      </div>
    </div>
  );

  return (
    <Popover
      content={pickerContent}
      title={null}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomLeft"
      overlayStyle={{ padding: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', cursor: 'pointer' }}>
        {/* Color Display */}
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: value,
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            transition: 'all 0.2s',
            boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
          }}
        />

        {/* Text Input */}
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: '600',
          }}
          maxLength={7}
        />
      </div>
    </Popover>
  );
};

export default ColorPicker;
