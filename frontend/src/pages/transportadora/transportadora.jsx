"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronRight, User, X, MapPin, Calendar, Package, Truck,
  CreditCard, HandCoins, Banknote,
  CheckCircle, XCircle, AlertCircle, Inbox, Wrench, Clock, Settings, PackageCheck
} from "lucide-react";
import { getTransportadoras, getPedidosPorTransportadora } from "../../services/api";
import "./transportadora.css";


const statusToIdMap = {
  "ENTREGADO AL CLIENTE":      1,
  "ENVIADO EN TRANSPORTADORA": 2,
  "ANULADO":                   3,
  "SIN REGISTRO":              4,
  "PEDIDO NO RECIBIDO":        5,
  "EN ALISTAMIENTO":           6,
  "EN REPARTO":                7,
  "EN PREPARACION":            8,
  "EMPACADO":                  9,
};

const colorMap = {
  green: "#28a745",
  green2: "#126b27ff",
  blue: "#007bff",
  red: "#dc3545",
  yellow: "#e9ec08ff",
  purple: "#6f42c1",
  orange: "#fd7e14",
  orange2: "#fdc714ff",
  orange3: "#cfa20cff",
  gray: "#6c757d",
};

const statusConfig = {
  "ENTREGADO AL CLIENTE": { color: "green2", icon: CheckCircle },
  "ENVIADO EN TRANSPORTADORA": { color: "green2", icon: Truck },
  "ANULADO": { color: "blue", icon: XCircle },
  "SIN REGISTRO": { color: "gray", icon: AlertCircle },
  "PEDIDO NO RECIBIDO": { color: "gray", icon: Inbox },
  "EN ALISTAMIENTO": { color: "yellow", icon: Wrench },
  "EN REPARTO": { color: "orange", icon: Clock },
  "EN PREPARACION": { color: "orange2", icon: Settings },
  "EMPACADO": { color: "orange3", icon: PackageCheck },
};

export default function Transportadora() {
  const [transportadoras, setTransportadoras] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [selectedTransportadora, setSelectedTransportadora] = useState(null);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [searchFactura, setSearchFactura] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchTransportadoras = async () => {
      try {
        const response = await getTransportadoras();
        setTransportadoras(response);
      } catch (error) {
        console.error("Error al obtener transportadoras:", error);
      }
    };
    fetchTransportadoras();
  }, []);

  const fetchPedidosPorTransportadora = async (transportadora, page = 1) => {
    try {
      const response = await getPedidosPorTransportadora(
        transportadora.id_transportadora,
        page
      );
      const nuevos = page === 1
        ? response.results || []
        : [...pedidos, ...(response.results || [])];
      setPedidos(nuevos);
      setHasMore(response && response.next !== null);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setHasMore(false);
    }
  };

  const toggleExpanded = async (transportadora) => {
    setSelectedDetailId(null);
    if (
      selectedTransportadora?.id_transportadora ===
      transportadora.id_transportadora
    ) {
      setSelectedTransportadora(null);
      setPedidos([]);
      setPage(1);
      setHasMore(true);
    } else {
      setSelectedTransportadora(transportadora);
      setPedidos([]);
      setPage(1);
      setHasMore(true);
      fetchPedidosPorTransportadora(transportadora, 1);
    }
  };

  const handleDetailClick = (detailId) => {
    setSelectedDetailId(selectedDetailId === detailId ? null : detailId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const lastPedidoRef = useCallback(
    (node) => {
      if (!hasMore || !selectedTransportadora) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, selectedTransportadora]
  );

  useEffect(() => {
    if (page === 1 || !selectedTransportadora) return;
    fetchPedidosPorTransportadora(selectedTransportadora, page);
  }, [page]);

  return (
    <div className="transportadora-container">
      <div className="header"><h1>TRANSPORTADORA</h1></div>
      <div className="content">
        <div className="pedidos-section">
          <div className="section-header"><h2>TRANSPORTADORA PEDIDOS</h2></div>
          <div className="pedidos-list">
            {transportadoras.map((item) => (
              <div key={item.id_transportadora} className="pedido-item">
                <div
                  className={`pedido-header ${selectedTransportadora?.id_transportadora === item.id_transportadora ? "active" : ""}`}
                  onClick={() => toggleExpanded(item)}
                >
                  <span className="pedido-name">{item.nombre_transportadora}</span>
                  <span className="pedido-count">{item.total}</span>
                  <ChevronRight className="arrow" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detalles-transportadora">
          <div className="section-header">
            <h2>DETALLES</h2>
            {selectedDetailId && (
              <button className="close-details-button" onClick={() => setSelectedDetailId(null)}>
                <X size={20} />
              </button>
            )}
          </div>

          {selectedTransportadora ? (
            <div className={`pedido-details ${selectedDetailId ? "detail-expanded-mode" : ""}`}>
              <div className="details-header">
                <span>{selectedTransportadora.nombre_transportadora}</span>
              </div>

              <input
                type="text"
                placeholder="Buscar por factura..."
                value={searchFactura}
                onChange={(e) => setSearchFactura(e.target.value)}
                style={{
                  width: "100%", padding: "6px 10px", marginBottom: "10px",
                  borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px"
                }}
              />

              <div className="details-content">
                {pedidos.length === 0 ? (
                  <p>No hay pedidos.</p>
                ) : (
                  pedidos
                    .filter((d) => d.id_factura.toString().includes(searchFactura.trim()))
                    .map((detail, i, arr) =>
                      renderDetail(detail, selectedDetailId === detail.id_factura, handleDetailClick, i === arr.length - 1 ? lastPedidoRef : null)
                    )
                )}
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
  );

  function renderDetail(detail, expanded, onClick, ref = null) {
    const estado = detail.estado_nombre || "SIN ESTADO";
    const config = statusConfig[estado] || { color: "gray", icon: AlertCircle };
    const Icon = config.icon;

    return (
      <div
        key={detail.id_factura}
        className={`detail-item ${expanded ? "expanded" : ""}`}
        onClick={() => onClick?.(detail.id_factura)}
        ref={ref}
      >
        <div className="detail-header-row">
          <div className="detail-id">{detail.id_factura}</div>
          <div
            className="detail-status"
            style={{
              backgroundColor: colorMap[config.color] + "20",
              color: colorMap[config.color],
            }}
          >
            <Icon size={14} />
            {estado}
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
            <div className="detail-row"><User size={16} className="detail-icon" /><span>Nombre del Vendedor: {detail.vendedor_nombre}</span></div>
            <div className="detail-row"><User size={16} className="detail-icon" /><span>Nombre del Alistador: {detail.alistador_nombre}</span></div>
            <div className="detail-row"><User size={16} className="detail-icon" /><span>Nombre del Empacador: {detail.empacador_nombre}</span></div>
            <div className="detail-row"><User size={16} className="detail-icon" /><span>Nombre del Enrutador: {detail.enrutador_nombre}</span></div>
            <div className="detail-row"><Calendar size={16} className="detail-icon" /><span>Fecha de Entrega: {formatDate(detail.fecha_entrega)}</span></div>
            <div className="detail-row"><Calendar size={16} className="detail-icon" /><span>Fecha de Enrutamiento: {formatDate(detail.fecha_enrutamiento)}</span></div>
            <div className="detail-row"><Calendar size={16} className="detail-icon" /><span>Fecha de Recibido: {formatDate(detail.fecha_recibido)}</span></div>
            <div className="detail-row"><Package size={16} className="detail-icon" /><span>Numero de Cajas: {detail.no_caja}</span></div>
            <div className="detail-row"><HandCoins size={16} className="detail-icon" /><span>Tipo de recaudo: {detail.tipo_recaudo?.toUpperCase()}</span></div>
            <div className="detail-row"><Banknote size={16} className="detail-icon" /><span>Recaudo en Efectivo: {detail.recaudo_efectivo}</span></div>
            <div className="detail-row"><CreditCard size={16} className="detail-icon" /><span>Recaudo en Transferencia: {detail.recaudo_transferencia}</span></div>
            <div className="detail-row"><Truck size={16} className="detail-icon" /><span>Ciudad: {detail.ciudad || "N/A"}</span></div>
            <div className="detail-row"><Package size={16} className="detail-icon" /><span>Observación: {detail.observacion || "N/A"}</span></div>
          </div>
        )}
      </div>
    );
  }
}
