"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, User, X, MapPin, Calendar, Package, Truck } from "lucide-react" // Import new icons
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
        address: "Carrera 50 # 80-12, Barranquilla",
        delivery_date: "2025-07-28",
        tracking_number: "AA737628",
        products: ["Medicamento X (x1)", "Suministro Y (x5)"],
        notes: "Entregar en recepción principal. Contactar a Juan Pérez.",
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
        address: "Calle 72 # 41-30, Bogotá",
        delivery_date: "2025-08-05",
        tracking_number: "AR450000",
        products: ["Vacuna Z (x10)", "Jeringas (x100)"],
        notes: "Urgente. Llamar 30 minutos antes de la llegada.",
      },
    ],
  },
  {
    name: "Angel",
    count: 3,
    details: [
      {
        id: "47192",
        client: "HOSPITAL SAN JOSE",
        value: "$ 320,000",
        status: "entregado",
        address: "Avenida Caracas # 1-00, Medellín",
        delivery_date: "2025-07-29",
        tracking_number: "AN320000",
        products: ["Kit de pruebas (x2)", "Guantes (x500)"],
        notes: "Dejar en bodega.",
      },
      {
        id: "47193",
        client: "CLINICA SANTA MARIA",
        value: "$ 280,000",
        status: "en_transito",
        address: "Calle 10 # 20-30, Cali",
        delivery_date: "2025-08-02",
        tracking_number: "AN280000",
        products: ["Mascarillas N95 (x200)", "Alcohol (x10L)"],
        notes: "Confirmar entrega con seguridad.",
      },
      {
        id: "47194",
        client: "CENTRO MEDICO BOLIVAR",
        value: "$ 190,000",
        status: "pendiente",
        address: "Carrera 43 # 50-10, Cartagena",
        delivery_date: "2025-08-07",
        tracking_number: "AN190000",
        products: ["Vendas (x30)", "Desinfectante (x5L)"],
        notes: "Entrega en horario de oficina.",
      },
    ],
  },
  {
    name: "ARON",
    count: 3,
    details: [
      {
        id: "47195",
        client: "HOSPITAL UNIVERSITARIO",
        value: "$ 520,000",
        status: "entregado",
        address: "Calle 100 # 15-20, Bucaramanga",
        delivery_date: "2025-07-30",
        tracking_number: "AR520000",
        products: ["Sondas (x10)", "Catéteres (x20)"],
        notes: "N/A",
      },
      {
        id: "47196",
        client: "CLINICA DEL CARIBE",
        value: "$ 380,000",
        status: "cancelado",
        address: "Avenida Santander # 10-05, Manizales",
        delivery_date: "2025-07-25",
        tracking_number: "AR380000",
        products: ["Analgésicos (x50)", "Antibióticos (x30)"],
        notes: "Pedido cancelado por cliente.",
      },
      {
        id: "47197",
        client: "CENTRO DE SALUD NORTE",
        value: "$ 290,000",
        status: "en_transito",
        address: "Carrera 27 # 40-10, Pereira",
        delivery_date: "2025-08-03",
        tracking_number: "AR290000",
        products: ["Vitaminas (x100)", "Suplementos (x50)"],
        notes: "Entrega programada para la tarde.",
      },
    ],
  },
  {
    name: "CARLOS CABRERA",
    count: 2,
    details: [
      {
        id: "47198",
        client: "HOSPITAL METROPOLITANO",
        value: "$ 680,000",
        status: "entregado",
        address: "Calle 50 # 50-50, Cúcuta",
        delivery_date: "2025-07-31",
        tracking_number: "CC680000",
        products: ["Equipos de laboratorio (x1)", "Reactivos (x3)"],
        notes: "N/A",
      },
      {
        id: "47199",
        client: "CLINICA MODERNA",
        value: "$ 420,000",
        status: "pendiente",
        address: "Avenida del Río # 1-01, Ibagué",
        delivery_date: "2025-08-06",
        tracking_number: "CC420000",
        products: ["Material de curación (x20)", "Suturas (x10)"],
        notes: "Esperando confirmación de horario.",
      },
    ],
  },
  {
    name: "CHEVALIER",
    count: 3,
    details: [
      {
        id: "47200",
        client: "HOSPITAL CENTRAL",
        value: "$ 890,000",
        status: "entregado",
        address: "Calle 10 # 10-10, Pasto",
        delivery_date: "2025-07-28",
        tracking_number: "CH890000",
        products: ["Instrumental quirúrgico (x1)", "Implantes (x2)"],
        notes: "N/A",
      },
      {
        id: "47201",
        client: "CLINICA ESPECIALIZADA",
        value: "$ 750,000",
        status: "en_transito",
        address: "Carrera 8 # 12-15, Neiva",
        delivery_date: "2025-08-01",
        tracking_number: "CH750000",
        products: ["Medicamentos oncológicos (x5)", "Quimioterapia (x1)"],
        notes: "Requiere cadena de frío.",
      },
      {
        id: "47202",
        client: "CENTRO MEDICO INTEGRAL",
        value: "$ 650,000",
        status: "pendiente",
        address: "Calle 20 # 30-40, Popayán",
        delivery_date: "2025-08-08",
        tracking_number: "CH650000",
        products: ["Vacunas (x50)", "Antivirales (x20)"],
        notes: "N/A",
      },
    ],
  },
  {
    name: "COORDINADORA",
    count: 2,
    details: [
      {
        id: "47203",
        client: "HOSPITAL REGIONAL",
        value: "$ 540,000",
        status: "entregado",
        address: "Avenida Principal # 1-01, Tunja",
        delivery_date: "2025-07-29",
        tracking_number: "CO540000",
        products: ["Material de laboratorio (x10)", "Tubos de ensayo (x200)"],
        notes: "N/A",
      },
      {
        id: "47204",
        client: "CLINICA PRIVADA",
        value: "$ 380,000",
        status: "en_transito",
        address: "Calle 15 # 25-35, Villavicencio",
        delivery_date: "2025-08-04",
        tracking_number: "CO380000",
        products: ["Sillas de ruedas (x2)", "Muletas (x4)"],
        notes: "Entrega en portería.",
      },
    ],
  },
  {
    name: "EDWIN BOSSIO",
    count: 9,
    details: [
      {
        id: "47205",
        client: "HOSPITAL NACIONAL",
        value: "$ 720,000",
        status: "entregado",
        address: "Carrera 7 # 7-77, Armenia",
        delivery_date: "2025-07-30",
        tracking_number: "EB720000",
        products: ["Monitores de signos vitales (x1)", "Desfibriladores (x1)"],
        notes: "N/A",
      },
      {
        id: "47206",
        client: "CLINICA ESPECIALISTAS",
        value: "$ 580,000",
        status: "pendiente",
        address: "Calle 22 # 33-44, Manizales",
        delivery_date: "2025-08-09",
        tracking_number: "EB580000",
        products: ["Medicamentos controlados (x5)", "Recetas (x100)"],
        notes: "Requiere firma de médico.",
      },
      {
        id: "47207",
        client: "CENTRO DE DIAGNOSTICO",
        value: "$ 460,000",
        status: "cancelado",
        address: "Avenida 30 # 40-50, Tunja",
        delivery_date: "2025-07-26",
        tracking_number: "EB460000",
        products: ["Rayos X (x1)", "Ecógrafo (x1)"],
        notes: "Cliente no disponible.",
      },
    ],
  },
  {
    name: "EN ESPERA",
    count: 22,
    details: [
      {
        id: "47208",
        client: "HOSPITAL DE EMERGENCIAS",
        value: "$ 920,000",
        status: "pendiente",
        address: "Calle 1 # 1-1, Riohacha",
        delivery_date: "2025-08-10",
        tracking_number: "EE920000",
        products: ["Suministros de emergencia (x10)", "Botiquines (x5)"],
        notes: "N/A",
      },
      {
        id: "47209",
        client: "CLINICA DE URGENCIAS",
        value: "$ 780,000",
        status: "pendiente",
        address: "Carrera 2 # 2-2, Sincelejo",
        delivery_date: "2025-08-11",
        tracking_number: "EE780000",
        products: ["Analgesia (x20)", "Antiinflamatorios (x15)"],
        notes: "N/A",
      },
      {
        id: "47210",
        client: "CENTRO MEDICO 24H",
        value: "$ 640,000",
        status: "en_transito",
        address: "Avenida 3 # 3-3, Montería",
        delivery_date: "2025-08-05",
        tracking_number: "EE640000",
        products: ["Material de sutura (x50)", "Agujas (x100)"],
        notes: "N/A",
      },
    ],
  },
  {
    name: "ENVIA",
    count: 2,
    details: [
      {
        id: "47211",
        client: "HOSPITAL PEDIATRICO",
        value: "$ 480,000",
        status: "entregado",
        address: "Calle 4 # 4-4, Valledupar",
        delivery_date: "2025-07-31",
        tracking_number: "EN480000",
        products: ["Juguetes médicos (x5)", "Libros infantiles (x10)"],
        notes: "N/A",
      },
      {
        id: "47212",
        client: "CLINICA INFANTIL",
        value: "$ 360,000",
        status: "en_transito",
        address: "Carrera 5 # 5-5, Popayán",
        delivery_date: "2025-08-06",
        tracking_number: "EN360000",
        products: ["Pañales (x200)", "Fórmulas lácteas (x10)"],
        notes: "N/A",
      },
    ],
  },
  {
    name: "FABIO",
    count: 10,
    details: [
      {
        id: "47213",
        client: "HOSPITAL GENERAL",
        value: "$ 820,000",
        status: "entregado",
        address: "Avenida 6 # 6-6, Florencia",
        delivery_date: "2025-07-29",
        tracking_number: "FA820000",
        products: ["Equipos de reanimación (x1)", "Medicamentos de urgencia (x5)"],
        notes: "N/A",
      },
      {
        id: "47214",
        client: "CLINICA MULTIESPECIALIDAD",
        value: "$ 690,000",
        status: "pendiente",
        address: "Calle 7 # 7-7, Quibdó",
        delivery_date: "2025-08-12",
        tracking_number: "FA690000",
        products: ["Material de osteosíntesis (x3)", "Prótesis (x1)"],
        notes: "N/A",
      },
      {
        id: "47215",
        client: "CENTRO MEDICO AVANZADO",
        value: "$ 570,000",
        status: "cancelado",
        address: "Carrera 8 # 8-8, San Andrés",
        delivery_date: "2025-07-27",
        tracking_number: "FA570000",
        products: ["Implantes dentales (x10)", "Material de ortodoncia (x5)"],
        notes: "Cliente no responde.",
      },
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
  const [selectedDetailId, setSelectedDetailId] = useState(null) // Nuevo estado para el detalle expandido

  const toggleExpanded = (name) => {
    setExpandedItem(expandedItem === name ? null : name)
    setSelectedDetailId(null) // Resetear el detalle expandido al cambiar el ítem principal
  }

  const handleDetailClick = (detailId) => {
    // Si el detalle clickeado ya está seleccionado, deselecciónalo. De lo contrario, selecciónalo.
    setSelectedDetailId(selectedDetailId === detailId ? null : detailId)
  }

  const getStatusStyle = (status) => {
    const config = statusConfig[status] || statusConfig.pendiente
    return {
      color: config.color,
      backgroundColor: config.backgroundColor,
      label: config.label,
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Fecha inválida"
      }
      return date.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })
    } catch (e) {
      console.error("Error formatting date:", dateString, e)
      return dateString
    }
  }

  const currentDetails = expandedItem
    ? transportadoraData.find((item) => item.name === expandedItem)?.details || []
    : []

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
            {selectedDetailId && ( // Mostrar botón de cerrar cuando un detalle está expandido
              <button className="close-details-button" onClick={() => setSelectedDetailId(null)}>
                <X size={20} />
              </button>
            )}
          </div>

          {expandedItem ? (
            <div className={`pedido-details ${selectedDetailId ? "detail-expanded-mode" : ""}`}>
              <div className="details-header">
                <span>ENTREGADO AL CLIENTE - {expandedItem}</span>
                <ChevronDown className="dropdown-arrow" size={14} />
              </div>
              <div className="details-content">
                {selectedDetailId
                  ? // Renderizar solo el detalle seleccionado
                    currentDetails
                      .filter((detail) => detail.id === selectedDetailId)
                      .map((detail) => {
                        const statusStyle = getStatusStyle(detail.status)
                        return (
                          <div key={detail.id} className="detail-item expanded">
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

                            {/* Nuevos detalles agregados aquí */}
                            <div className="additional-details">
                              <div className="detail-row">
                                <MapPin size={16} className="detail-icon" />
                                <span>Dirección: {detail.address || "N/A"}</span>
                              </div>
                              <div className="detail-row">
                                <Calendar size={16} className="detail-icon" />
                                <span>Fecha de Entrega: {formatDate(detail.delivery_date) || "N/A"}</span>
                              </div>
                              <div className="detail-row">
                                <Truck size={16} className="detail-icon" />
                                <span>No. de Seguimiento: {detail.tracking_number || "N/A"}</span>
                              </div>
                              <div className="detail-row">
                                <Package size={16} className="detail-icon" />
                                <span>
                                  Productos:{" "}
                                  {detail.products && detail.products.length > 0 ? detail.products.join(", ") : "N/A"}
                                </span>
                              </div>
                              {detail.notes && (
                                <div className="detail-row notes">
                                  <span>Notas: {detail.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                  : // Renderizar todos los detalles cuando no hay un detalle específico seleccionado
                    currentDetails.map((detail) => {
                      const statusStyle = getStatusStyle(detail.status)
                      return (
                        <div
                          key={detail.id}
                          className="detail-item"
                          onClick={() => handleDetailClick(detail.id)} // Añadir manejador de clic
                        >
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
