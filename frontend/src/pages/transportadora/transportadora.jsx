"use client"

import { useEffect, useState } from "react"
import { ChevronRight, User, X, MapPin, Calendar, Package, Truck, CreditCard, HandCoins, Banknote, } from "lucide-react"
import { getTransportadoras, getPedidosPorTransportadora, } from "../../services/api"
import "./transportadora.css"

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
  const [transportadoras, setTransportadoras] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [selectedTransportadora, setSelectedTransportadora] = useState(null)
  const [selectedDetailId, setSelectedDetailId] = useState(null)
  const [searchFactura, setSearchFactura] = useState("")

  useEffect(() => {
    async function fetchTransportadoras() {
      try {
        const response = await getTransportadoras()
        setTransportadoras(response)
      } catch (error) {
        console.error("Error al obtener transportadoras:", error)
      }
    }

    fetchTransportadoras()
  }, [])

  const toggleExpanded = async (transportadora) => {
    setSelectedDetailId(null)

    if (
      selectedTransportadora?.id_transportadora ===
      transportadora.id_transportadora
    ) {
      setSelectedTransportadora(null)
      setPedidos([])
    } else {
      setSelectedTransportadora(transportadora)
      try {
        const response = await getPedidosPorTransportadora(
          transportadora.id_transportadora
        )
        setPedidos(response)
      } catch (error) {
        console.error("Error al obtener pedidos:", error)
      }
    }
  }

  const handleDetailClick = (detailId) => {
    setSelectedDetailId(selectedDetailId === detailId ? null : detailId)
  }

  const getStatusStyle = (status) => {
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pendiente
    return {
      color: config.color,
      backgroundColor: config.backgroundColor,
      label: config.label,
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="transportadora-container">
      <div className="header">
        <h1>TRANSPORTADORA</h1>
      </div>

      <div className="content">
        {/* Columna Izquierda */}
        <div className="pedidos-section">
          <div className="section-header">
            <h2>TRANSPORTADORA PEDIDOS</h2>
          </div>

          <div className="pedidos-list">
            {transportadoras.map((item) => (
              <div key={item.id_transportadora} className="pedido-item">
                <div
                  className={`pedido-header ${
                    selectedTransportadora?.id_transportadora ===
                    item.id_transportadora
                      ? "active"
                      : ""
                  }`}
                  onClick={() => toggleExpanded(item)}
                >
                  <span className="pedido-name">
                    {item.nombre_transportadora}
                  </span>
                  <span className="pedido-count">{item.total}</span>
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
            {selectedDetailId && (
              <button
                className="close-details-button"
                onClick={() => setSelectedDetailId(null)}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {selectedTransportadora ? (
            <div
              className={`pedido-details ${
                selectedDetailId ? "detail-expanded-mode" : ""
              }`}
            >
              <div className="details-header">
                <span>{selectedTransportadora.nombre_transportadora}</span>
              </div>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar por factura..."
                value={searchFactura}
                onChange={(e) => setSearchFactura(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />

              <div className="details-content">
                {pedidos.length === 0 ? (
                  <p>No hay pedidos.</p>
                ) : pedidos
  .filter((detail) =>
    detail.id_factura.toString().includes(searchFactura.trim())
  )
  .map((detail) =>
    renderDetail(
      detail,
      selectedDetailId === detail.id_factura,
      handleDetailClick
    )
  )

                }
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

  function renderDetail(detail, expanded, onClick) {
    const statusStyle = getStatusStyle(detail.estado?.toLowerCase())
    return (
      <div
        key={detail.id_factura}
        className={`detail-item ${expanded ? "expanded" : ""}`}
        onClick={() => onClick?.(detail.id_factura)}
      >
        <div className="detail-header-row">
          <div className="detail-id">{detail.id_factura}</div>
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
          <span className="client-name">{detail.cliente_nombre || "Cliente"}</span>
        </div>
        <div className="detail-value">
          ${parseFloat(detail.valor || 0).toLocaleString()}
        </div>

        {expanded && (
          <div className="additional-details">
            <div className="detail-row">
              <User size={16} className="detail-icon" />
              <span>Nombre del Vendedor: {detail.vendedor_nombre}</span>
            </div>
            <div className="detail-row">
              <User size={16} className="detail-icon" />
              <span>Nombre del Alistador: {detail.alistador_nombre}</span>
            </div>
            <div className="detail-row">
              <User size={16} className="detail-icon" />
              <span>Nombre del Empacador: {detail.empacador_nombre}</span>
            </div>
            <div className="detail-row">
              <User size={16} className="detail-icon" />
              <span>Nombre del Enrutador: {detail.enrutador_nombre}</span>
            </div>
            <div className="detail-row">
              <Calendar size={16} className="detail-icon" />
              <span>Fecha de Entrega: {formatDate(detail.fecha_entrega)}</span>
            </div>
            <div className="detail-row">
              <Calendar size={16} className="detail-icon" />
              <span>
                Fecha de Enrutamiento: {formatDate(detail.fecha_enrutamiento)}
              </span>
            </div>
            <div className="detail-row">
              <Calendar size={16} className="detail-icon" />
              <span>Fecha de Recibido: {formatDate(detail.fecha_recibido)}</span>
            </div>
            <div className="detail-row">
              <Package size={16} className="detail-icon" />
              <span>Numero de Cajas: {detail.no_caja}</span>
            </div>
            <div className="detail-row">
              <HandCoins size={16} className="detail-icon" />
              {detail.tipo_recaudo && (
                <span>Tipo de recaudo: {detail.tipo_recaudo.toUpperCase()}</span>
              )}
            </div>
            <div className="detail-row">
              <Banknote size={16} className="detail-icon" />
              <span>Recaudo en Efectivo: {detail.recaudo_efectivo}</span>
            </div>
            <div className="detail-row">
              <CreditCard size={16} className="detail-icon" />
              <span>Recaudo en Transferencia: {detail.recaudo_transferencia}</span>
            </div>
            <div className="detail-row">
              <Truck size={16} className="detail-icon" />
              <span>Ciudad: {detail.ciudad || "N/A"}</span>
            </div>
            <div className="detail-row">
              <Package size={16} className="detail-icon" />
              <span>Observación: {detail.observacion || "N/A"}</span>
            </div>
          </div>
        )}
      </div>
    )
  }
}
