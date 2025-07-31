"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, User } from "lucide-react"
import "./transportadora.css"

const transportadoraData = [
  {
    name: "AARON",
    count: 1,
    details: [
      {
        id: "47190",
        client: "UNIDAD PRESTADORA DE SALUD ATLANTICO",
        value: "$ 737,628",
        status: "entregado",
      },
    ],
  },
  {
    name: "ANDREA RIBON",
    count: 1,
    details: [
      {
        id: "47191",
        client: "CLINICA GENERAL DEL NORTE",
        value: "$ 450,000",
        status: "pendiente",
      },
    ],
  },
  {
    name: "Angel",
    count: 3,
    details: [
      { id: "47192", client: "HOSPITAL SAN JOSE", value: "$ 320,000", status: "entregado" },
      { id: "47193", client: "CLINICA SANTA MARIA", value: "$ 280,000", status: "en_transito" },
      { id: "47194", client: "CENTRO MEDICO BOLIVAR", value: "$ 190,000", status: "pendiente" },
    ],
  },
  {
    name: "ARON",
    count: 3,
    details: [
      { id: "47195", client: "HOSPITAL UNIVERSITARIO", value: "$ 520,000", status: "entregado" },
      { id: "47196", client: "CLINICA DEL CARIBE", value: "$ 380,000", status: "cancelado" },
      { id: "47197", client: "CENTRO DE SALUD NORTE", value: "$ 290,000", status: "en_transito" },
    ],
  },
  {
    name: "CARLOS CABRERA",
    count: 2,
    details: [
      { id: "47198", client: "HOSPITAL METROPOLITANO", value: "$ 680,000", status: "entregado" },
      { id: "47199", client: "CLINICA MODERNA", value: "$ 420,000", status: "pendiente" },
    ],
  },
  {
    name: "CHEVALIER",
    count: 3,
    details: [
      { id: "47200", client: "HOSPITAL CENTRAL", value: "$ 890,000", status: "entregado" },
      { id: "47201", client: "CLINICA ESPECIALIZADA", value: "$ 750,000", status: "en_transito" },
      { id: "47202", client: "CENTRO MEDICO INTEGRAL", value: "$ 650,000", status: "pendiente" },
    ],
  },
  {
    name: "COORDINADORA",
    count: 2,
    details: [
      { id: "47203", client: "HOSPITAL REGIONAL", value: "$ 540,000", status: "entregado" },
      { id: "47204", client: "CLINICA PRIVADA", value: "$ 380,000", status: "en_transito" },
    ],
  },
  {
    name: "EDWIN BOSSIO",
    count: 9,
    details: [
      { id: "47205", client: "HOSPITAL NACIONAL", value: "$ 720,000", status: "entregado" },
      { id: "47206", client: "CLINICA ESPECIALISTAS", value: "$ 580,000", status: "pendiente" },
      { id: "47207", client: "CENTRO DE DIAGNOSTICO", value: "$ 460,000", status: "cancelado" },
    ],
  },
  {
    name: "EN ESPERA",
    count: 22,
    details: [
      { id: "47208", client: "HOSPITAL DE EMERGENCIAS", value: "$ 920,000", status: "pendiente" },
      { id: "47209", client: "CLINICA DE URGENCIAS", value: "$ 780,000", status: "pendiente" },
      { id: "47210", client: "CENTRO MEDICO 24H", value: "$ 640,000", status: "en_transito" },
    ],
  },
  {
    name: "ENVIA",
    count: 2,
    details: [
      { id: "47211", client: "HOSPITAL PEDIATRICO", value: "$ 480,000", status: "entregado" },
      { id: "47212", client: "CLINICA INFANTIL", value: "$ 360,000", status: "en_transito" },
    ],
  },
  {
    name: "FABIO",
    count: 10,
    details: [
      { id: "47213", client: "HOSPITAL GENERAL", value: "$ 820,000", status: "entregado" },
      { id: "47214", client: "CLINICA MULTIESPECIALIDAD", value: "$ 690,000", status: "pendiente" },
      { id: "47215", client: "CENTRO MEDICO AVANZADO", value: "$ 570,000", status: "cancelado" },
    ],
  },
]

// Configuración de estados con colores y etiquetas
const statusConfig = {
  entregado: {
    label: "ENTREGADO",
    color: "#4caf50",
    backgroundColor: "#e8f5e8",
  },
  pendiente: {
    label: "PENDIENTE",
    color: "#ff9800",
    backgroundColor: "#fff3e0",
  },
  en_transito: {
    label: "EN TRÁNSITO",
    color: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  cancelado: {
    label: "CANCELADO",
    color: "#f44336",
    backgroundColor: "#ffebee",
  },
}

export default function Transportadora() {
  const [expandedItem, setExpandedItem] = useState(null)

  const toggleExpanded = (name) => {
    setExpandedItem(expandedItem === name ? null : name)
  }

  const getStatusStyle = (status) => {
    const config = statusConfig[status] || statusConfig.pendiente
    return {
      color: config.color,
      backgroundColor: config.backgroundColor,
      label: config.label,
    }
  }

  return (
    <div className="transportadora-container">
      <div className="header">
        <h1>TRANSPORTADORA</h1>
        <div className="header-icons"></div>
      </div>

      <div className="content">
        {/* Columna Izquierda */}
        <div className="pedidos-section">
          <div className="section-header">
            <h2>TRANSPORTADORA PEDIDOS</h2>
            <div className="section-icons"></div>
          </div>

          <div className="filter-section">
            <span>Todo</span>
          </div>

          <div className="pedidos-list">
            {transportadoraData.map((item) => (
              <div key={item.name} className="pedido-item">
                <div
                  className={`pedido-header ${expandedItem === item.name ? "active" : ""}`}
                  onClick={() => toggleExpanded(item.name)}
                >
                  <span className="pedido-name">{item.name}</span>
                  <span className="pedido-count">{item.count}</span>
                  <ChevronRight className="arrow" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="detalles-transportadora">
          <div className="section-header">
            <h2>DETALLES</h2>
          </div>

          {expandedItem ? (
            <div className="pedido-details">
              <div className="details-header">
                <span>ENTREGADO AL CLIENTE - {expandedItem}</span>
                <ChevronDown className="dropdown-arrow" size={14} />
              </div>

              <div className="details-content">
                {transportadoraData
                  .find((item) => item.name === expandedItem)
                  ?.details.slice(0, 3)
                  .map((detail) => {
                    const statusStyle = getStatusStyle(detail.status)
                    return (
                      <div key={detail.id} className="detail-item">
                        <div className="detail-header-row">
                          <div className="detail-id">{detail.id}</div>
                          <div
                            className="detail-status"
                            style={{
                              color: statusStyle.color,
                              backgroundColor: statusStyle.backgroundColor,
                            }}
                          >
                            {statusStyle.label}
                          </div>
                        </div>
                        <div className="detail-client">
                          <User className="client-icon" size={16} />
                          <span className="client-name">{detail.client}</span>
                        </div>
                        <div className="detail-value">{detail.value}</div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Selecciona una transportadora para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
