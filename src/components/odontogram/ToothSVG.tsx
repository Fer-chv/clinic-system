import React from 'react'

interface ToothSVGProps {
  toothNumber: number
  isSelected: boolean
  bgColor: string
  borderColor: string
  quadrant: 'UD' | 'UI' | 'LI' | 'LD'
  onClick: () => void
  onContextMenu: (e: React.MouseEvent) => void
  title?: string
}

export default function ToothSVG({
  toothNumber,
  isSelected,
  bgColor,
  borderColor,
  quadrant,
  onClick,
  onContextMenu,
  title,
}: ToothSVGProps) {
  // Determinar la orientación del diente según cuadrante
  const isUpper = quadrant === 'UD' || quadrant === 'UI'
  const isRight = quadrant === 'UD' || quadrant === 'LD'

  // Invertir para cuadrantes izquierdos
  const transform = isRight ? '' : 'scaleX(-1)'

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-block',
        margin: '4px',
        userSelect: 'none',
      }}
      title={title}
    >
      <svg
        width="50"
        height="70"
        viewBox="0 0 50 70"
        style={{
          filter: isSelected ? `drop-shadow(0 0 8px ${borderColor})` : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <g transform={transform}>
          {/* Corona (parte visible) */}
          <path
            d="M 15 10 Q 20 5 25 5 Q 30 5 35 10 L 38 30 Q 38 35 35 38 L 25 40 L 15 38 Q 12 35 12 30 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.5"
          />

          {/* Raíz */}
          <path
            d="M 15 38 Q 14 45 13 55 Q 12 62 25 65 Q 38 62 37 55 Q 36 45 35 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.5"
          />

          {/* Línea central (surco natural del diente) */}
          <line
            x1="25"
            y1="10"
            x2="25"
            y2="38"
            stroke={borderColor}
            strokeWidth="0.8"
            opacity="0.3"
          />

          {/* Checkmark si está seleccionado */}
          {isSelected && (
            <g>
              <circle cx="25" cy="20" r="12" fill={borderColor} opacity="0.2" />
              <text
                x="25"
                y="26"
                textAnchor="middle"
                fill={borderColor}
                fontSize="16"
                fontWeight="bold"
              >
                ✓
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Número del diente */}
      <div
        style={{
          position: 'absolute',
          top: isUpper ? '45px' : '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#666',
          whiteSpace: 'nowrap',
        }}
      >
        {toothNumber}
      </div>
    </div>
  )
}
