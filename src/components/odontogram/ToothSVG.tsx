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

  const getToothType = (num: number) => {
    const digit = num % 10
    return digit
  }

  const toothType = getToothType(toothNumber)

  const renderToothShape = () => {
    // Incisivos centrales (1)
    if (toothType === 1) {
      return (
        <g>
          {/* Corona - incisivo central */}
          <path
            d="M 18 8 L 32 8 L 31 34 Q 30 37 25 38 Q 20 37 19 34 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Surco central profundo */}
          <path
            d="M 25 8 Q 24 15 24 25 Q 24 32 25 38"
            stroke={borderColor}
            strokeWidth="0.7"
            fill="none"
            opacity="0.4"
          />
          {/* Raíz larga y fina */}
          <path
            d="M 19 38 Q 18 48 17 58 Q 16.5 65 25 67 Q 33.5 65 33 58 Q 32 48 31 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.2"
          />
        </g>
      )
    }

    // Incisivos laterales (2)
    if (toothType === 2) {
      return (
        <g>
          {/* Corona - incisivo lateral (más pequeño) */}
          <path
            d="M 19 9 L 31 9 L 30 34 Q 29 37 25 38 Q 21 37 20 34 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Surco central */}
          <path
            d="M 25 9 Q 24.5 16 24 26 Q 24 32 25 38"
            stroke={borderColor}
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
          {/* Raíz larga y fina */}
          <path
            d="M 20 38 Q 19 48 18 58 Q 17.5 65 25 67 Q 32.5 65 32 58 Q 31 48 30 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.2"
          />
        </g>
      )
    }

    // Canino (3)
    if (toothType === 3) {
      return (
        <g>
          {/* Corona - canino puntiagudo */}
          <path
            d="M 17 12 L 25 5 L 33 12 L 32 32 Q 31 36 25 38 Q 19 36 18 32 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Surcos laterales */}
          <path
            d="M 20 12 Q 21 20 22 35"
            stroke={borderColor}
            strokeWidth="0.6"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M 30 12 Q 29 20 28 35"
            stroke={borderColor}
            strokeWidth="0.6"
            fill="none"
            opacity="0.3"
          />
          {/* Raíz larga y cónica */}
          <path
            d="M 18 38 Q 17 48 16 58 Q 15.5 65 25 67 Q 34.5 65 34 58 Q 33 48 32 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.2"
          />
        </g>
      )
    }

    // Premolares (4, 5)
    if (toothType === 4 || toothType === 5) {
      return (
        <g>
          {/* Corona - premolar con dos cúspides */}
          <path
            d="M 12 14 L 19 7 L 25 11 L 31 7 L 38 14 L 37 32 Q 36 36 25 38 Q 14 36 13 32 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Cúspide bucal izquierda */}
          <line x1="19" y1="7" x2="21" y2="32" stroke={borderColor} strokeWidth="0.6" opacity="0.3" />
          {/* Cúspide bucal derecha */}
          <line x1="31" y1="7" x2="29" y2="32" stroke={borderColor} strokeWidth="0.6" opacity="0.3" />
          {/* Surco central */}
          <line x1="25" y1="11" x2="25" y2="32" stroke={borderColor} strokeWidth="0.7" opacity="0.4" />
          {/* Raíz - puede ser una o dos */}
          <path
            d="M 13 38 Q 12 48 11 58 Q 10.5 65 25 67 Q 39.5 65 39 58 Q 38 48 37 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.2"
          />
        </g>
      )
    }

    // Molares (6, 7, 8)
    if (toothType === 6 || toothType === 7 || toothType === 8) {
      return (
        <g>
          {/* Corona - molar con múltiples cúspides */}
          <path
            d="M 9 15 L 14 8 L 19 10 L 25 6 L 31 10 L 36 8 L 41 15 L 40 33 Q 39 36 25 38 Q 11 36 10 33 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Surco H (horizontal y vertical principal) */}
          <line x1="25" y1="6" x2="25" y2="33" stroke={borderColor} strokeWidth="0.8" opacity="0.4" />
          <line x1="14" y1="15" x2="36" y2="15" stroke={borderColor} strokeWidth="0.8" opacity="0.4" />
          {/* Surcos secundarios */}
          <line x1="19" y1="10" x2="21" y2="33" stroke={borderColor} strokeWidth="0.6" opacity="0.3" />
          <line x1="31" y1="10" x2="29" y2="33" stroke={borderColor} strokeWidth="0.6" opacity="0.3" />
          {/* Surcos oclusales */}
          <path d="M 19 15 Q 19 20 21 25" stroke={borderColor} strokeWidth="0.5" fill="none" opacity="0.2" />
          <path d="M 31 15 Q 31 20 29 25" stroke={borderColor} strokeWidth="0.5" fill="none" opacity="0.2" />
          {/* Raíces - molares pueden tener múltiples */}
          <path
            d="M 10 38 Q 9 48 8 58 Q 7.5 65 25 67 Q 42.5 65 42 58 Q 41 48 40 38"
            fill="#f5f5f5"
            stroke={borderColor}
            strokeWidth="1.2"
          />
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
        margin: '2px',
        userSelect: 'none',
      }}
      title={title}
    >
      <svg
        width="52"
        height="75"
        viewBox="0 0 50 70"
        style={{
          filter: isSelected ? `drop-shadow(0 0 8px ${borderColor})` : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <g transform={transform}>
          {renderToothShape()}

          {/* Checkmark si está seleccionado */}
          {isSelected && (
            <g>
              <circle cx="25" cy="18" r="9" fill={borderColor} opacity="0.25" />
              <text
                x="25"
                y="23"
                textAnchor="middle"
                fill={borderColor}
                fontSize="13"
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
          top: isUpper ? '48px' : '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
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
