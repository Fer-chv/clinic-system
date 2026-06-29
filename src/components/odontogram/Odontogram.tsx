import { useState } from 'react'
import { Button, Row, Col, Card, Space, Tooltip, Select } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { DentalCondition } from '@/types'
import ToothSVG from './ToothSVG'
import './Odontogram.css'

interface OdontogramProps {
  patientType: 'adult' | 'child'
  conditions: DentalCondition[]
  selectedTeeth: {
    [toothNumber: string]: DentalCondition | null
  }
  onToothSelect: (toothNumber: string, condition: DentalCondition | null) => void
}

export default function Odontogram({
  patientType,
  conditions,
  selectedTeeth,
  onToothSelect,
}: OdontogramProps) {
  const [selectedCondition, setSelectedCondition] = useState<DentalCondition | null>(
    conditions.length > 0 ? conditions[0] : null
  )

  // Adultos: 32 dientes (numeración FDI: 11-18, 21-28, 31-38, 41-48)
  // Niños: 20 dientes (numeración: 51-55, 61-65, 71-75, 81-85)
  const getTeethNumbers = () => {
    if (patientType === 'adult') {
      return {
        upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
        upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
        lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
        lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
      }
    } else {
      return {
        upperRight: [55, 54, 53, 52, 51],
        upperLeft: [61, 62, 63, 64, 65],
        lowerLeft: [71, 72, 73, 74, 75],
        lowerRight: [85, 84, 83, 82, 81],
      }
    }
  }

  const teeth = getTeethNumbers()

  const renderTooth = (toothNumber: number, quadrant: 'UD' | 'UI' | 'LI' | 'LD') => {
    const key = String(toothNumber)
    const selected = selectedTeeth[key]
    const bgColor = selected ? selected.color : '#ffffff'
    const borderColor = selected ? selected.color : '#d0d0d0'

    return (
      <Tooltip
        title={
          selected
            ? `${toothNumber}: ${selected.name} - L ${selected.price}`
            : `Diente ${toothNumber}`
        }
        key={toothNumber}
      >
        <ToothSVG
          toothNumber={toothNumber}
          isSelected={!!selected}
          bgColor={bgColor}
          borderColor={borderColor}
          quadrant={quadrant}
          onClick={() => {
            if (selectedCondition) {
              onToothSelect(key, selectedCondition)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            onToothSelect(key, null)
          }}
          title="Click para marcar | Click derecho para limpiar"
        />
      </Tooltip>
    )
  }

  return (
    <Card className="odontogram-container">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>
          🦷 Selecciona una condición y haz clic en el diente
        </h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="Selecciona una condición"
            value={selectedCondition?.id || undefined}
            onChange={(value) => {
              const cond = conditions.find((c) => c.id === value)
              setSelectedCondition(cond || null)
            }}
            options={conditions.map((c) => ({
              label: (
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      backgroundColor: c.color,
                      borderRadius: '4px',
                      marginRight: '8px',
                    }}
                  />
                  {c.name} - L {c.price}
                </span>
              ),
              value: c.id,
            }))}
            style={{ width: '100%' }}
            size="large"
          />
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            💡 Click para marcar | Click derecho para limpiar
          </p>
        </Space>
      </div>

      <div className="odontogram">
        {/* CUADRANTE SUPERIOR DERECHO */}
        <div className="quadrant upper-right">
          <div className="quadrant-label">UD</div>
          <div className="teeth-row">
            {teeth.upperRight.map((num) => renderTooth(num, 'UD'))}
          </div>
        </div>

        {/* CUADRANTE SUPERIOR IZQUIERDO */}
        <div className="quadrant upper-left">
          <div className="quadrant-label">UI</div>
          <div className="teeth-row">
            {teeth.upperLeft.map((num) => renderTooth(num, 'UI'))}
          </div>
        </div>

        {/* LÍNEA CENTRAL */}
        <div className="center-line vertical" />
        <div className="center-line horizontal" />

        {/* CUADRANTE INFERIOR IZQUIERDO */}
        <div className="quadrant lower-left">
          <div className="quadrant-label">LI</div>
          <div className="teeth-row">
            {teeth.lowerLeft.map((num) => renderTooth(num, 'LI'))}
          </div>
        </div>

        {/* CUADRANTE INFERIOR DERECHO */}
        <div className="quadrant lower-right">
          <div className="quadrant-label">LD</div>
          <div className="teeth-row">
            {teeth.lowerRight.map((num) => renderTooth(num, 'LD'))}
          </div>
        </div>
      </div>

      {/* Resumen de dientes seleccionados */}
      <Card style={{ marginTop: '20px', backgroundColor: '#f9fafb' }}>
        <h4>📋 Dientes Seleccionados</h4>
        <Row gutter={[16, 16]}>
          {Object.entries(selectedTeeth).map(([toothNum, condition]) =>
            condition ? (
              <Col xs={24} sm={12} md={8} key={toothNum}>
                <div
                  style={{
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: condition.color,
                        borderRadius: '4px',
                      }}
                    />
                    <span style={{ fontWeight: '600' }}>Diente {toothNum}</span>
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    <div>
                      <strong>{condition.name}</strong>
                    </div>
                    <div style={{ color: '#667eea' }}>L {condition.price}</div>
                  </div>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onToothSelect(toothNum, null)}
                    style={{ width: '100%' }}
                  >
                    Limpiar
                  </Button>
                </div>
              </Col>
            ) : null
          )}
        </Row>
        {Object.values(selectedTeeth).every((c) => !c) && (
          <p style={{ color: '#999', fontStyle: 'italic' }}>Sin dientes seleccionados</p>
        )}
      </Card>
    </Card>
  )
}
