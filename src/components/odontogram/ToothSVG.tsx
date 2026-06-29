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
  const isUpper = quadrant === 'UD' || quadrant === 'UI'
  const isRight = quadrant === 'UD' || quadrant === 'LD'
  const transform = isRight ? '' : 'scaleX(-1)'

  // Obtener tipo de diente según número
  const getToothType = (num: number) => {
    const digit = num % 10
    // digit 1-2: incisivos, 3: canino, 4-5: premolares/molares temporales, 6-8: molares
    return digit
  }

  const toothType = getToothType(toothNumber)
  const isLower = quadrant === 'LI' || quadrant === 'LD'

  // Renderizar diente según tipo
  const renderToothShape = () => {
    // Incisivos (1, 2)
    if (toothType === 1 || toothType === 2) {
      return (
        <g>
          {/* Corona rectangular plana */}
          <path
            d="M 14 8 L 36 8 L 36 32 Q 35 36 25 38 Q 15 36 14 32 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.5"
          />
          {/* Surco central */}
          <line x1="25" y1="8" x2="25" y2="32" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
        </g>
      )
    }

    // Canino (3)
    if (toothType === 3) {
      return (
        <g>
          {/* Corona puntiaguda */}
          <path
            d="M 16 10 L 25 5 L 34 10 L 34 28 Q 33 34 25 38 Q 17 34 16 28 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.5"
          />
          {/* Surco left */}
          <line x1="20" y1="10" x2="23" y2="35" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
          {/* Surco right */}
          <line x1="30" y1="10" x2="27" y2="35" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
        </g>
      )
    }

    // Premolares (4, 5)
    if (toothType === 4 || toothType === 5) {
      return (
        <g>
          {/* Corona con dos cúspides */}
          <path
            d="M 13 12 L 19 6 L 25 10 L 31 6 L 37 12 L 37 30 Q 36 35 25 38 Q 14 35 13 30 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.5"
          />
          {/* Surcos */}
          <line x1="19" y1="6" x2="22" y2="35" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
          <line x1="31" y1="6" x2="28" y2="35" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
          <line x1="25" y1="10" x2="25" y2="32" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
        </g>
      )
    }

    // Molares (6, 7, 8)
    if (toothType === 6 || toothType === 7 || toothType === 8) {
      return (
        <g>
          {/* Corona ancha con múltiples cúspides */}
          <path
            d="M 10 14 L 15 8 L 21 10 L 25 6 L 29 10 L 35 8 L 40 14 L 40 32 Q 39 36 25 38 Q 11 36 10 32 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.5"
          />
          {/* Surcos H */}
          <line x1="25" y1="6" x2="25" y2="35" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
          <line x1="15" y1="12" x2="35" y2="12" stroke={borderColor} strokeWidth="0.8" opacity="0.3" />
          {/* Surcos adicionales */}
          <line x1="18" y1="8" x2="20" y2="35" stroke={borderColor} strokeWidth="0.7" opacity="0.2" />
          <line x1="32" y1="8" x2="30" y2="35" stroke={borderColor} strokeWidth="0.7" opacity="0.2" />
        </g>
      )
    }

    return null
  }

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
          {/* Renderizar forma del diente */}
          {renderToothShape()}

          {/* Raíz */}
          <path
            d="M 15 38 Q 14 45 13 55 Q 12 62 25 65 Q 38 62 37 55 Q 36 45 35 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.5"
          />

          {/* Checkmark si está seleccionado */}
          {isSelected && (
            <g>
              <circle cx="25" cy="18" r="10" fill={borderColor} opacity="0.2" />
              <text
                x="25"
                y="24"
                textAnchor="middle"
                fill={borderColor}
                fontSize="14"
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
