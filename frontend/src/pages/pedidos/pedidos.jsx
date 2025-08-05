import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditPedidoModal from "./editPedidoModal";
import { ChevronUp, ChevronDown, Building2, User, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, MapPin,DollarSign, Users, ListChecks, Archive, PackageCheck, Inbox, Warehouse, Settings, } from "lucide-react";
import "./pedidos.css";
import { getPedidosAll, getPedidosPorEstado, getResumenPedidos, } from "../../services/api.js";

const statusToIdMap = {
  "ENTREGADO AL CLIENTE": 1,
  "ENVIADO EN TRANSPORTADORA": 2,
  ANULADO: 3,
  "SIN REGISTRO": 4,
  "PEDIDO NO RECIBIDO": 5,
  "EN ALISTAMIENTO": 6,
  "EN REPARTO": 7,
  "EN PREPARACION": 8,
  EMPACADO: 9,
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
};

const statusConfig = {
  "ENTREGADO AL CLIENTE": { color: "green2", icon: CheckCircle, },
  "ENVIADO EN TRANSPORTADORA": { color: "green2", icon: Truck, },
  "ANULADO": { color: "blue", icon: XCircle, },
  "SIN REGISTRO": { color: "gray", icon: AlertCircle, },
  "PEDIDO NO RECIBIDO": { color: "gray", icon: Inbox, },
  "EN ALISTAMIENTO": { color: "yellow", icon: ListChecks, },
  "EN REPARTO": { color: "orange", icon: Clock, },
  "EN PREPARACION": { color: "orange2", icon: Settings, },
  "EMPACADO": { color: "orange3", icon: PackageCheck, },
};

const findMatchingStatusKey = (rawStatus, map) => {
  if (!rawStatus) return "";
  const trimmedLowerRawStatus = rawStatus.trim().toLowerCase();
  for (const key in map) {
    if (key.toLowerCase() === trimmedLowerRawStatus) {
      return key;
    }
  }
  return "";
};

const PedidosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalGlobalPedidos, setTotalGlobalPedidos] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  // Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const handlePedidoUpdate = (updatedPedido) => {
    // Actualizar el pedido en la lista
    setPedidos((prevPedidos) =>
      prevPedidos.map((p) =>
        p.id_factura === updatedPedido.id_factura ? updatedPedido : p
      )
    );
    // Actualizar el pedido seleccionado si es el mismo
    if (
      selectedPedido &&
      selectedPedido.id_factura === updatedPedido.id_factura
    ) {
      setSelectedPedido(updatedPedido);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromUrl = params.get("status");
    const pageFromUrl = params.get("page");

    // Decodifica correctamente el status
    if (statusFromUrl) {
      const decodedStatus = decodeURIComponent(statusFromUrl);
      const matchedStatus = findMatchingStatusKey(decodedStatus, statusToIdMap);
      setFilterStatus(matchedStatus || "");
    } else {
      setFilterStatus("");
    }

    // Maneja el número de página
    const pageNumber = pageFromUrl ? parseInt(pageFromUrl) : 1;
    setCurrentPage(isNaN(pageNumber) ? 1 : Math.max(1, pageNumber));
  }, [location.search]);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const data = await getResumenPedidos();

        if (!data || data.length === 0) {
          console.warn("No hay datos de resumen de pedidos");
          setStatusCounts({});
          return;
        }

        // Procesamiento que mantiene exactamente los nombres de tu statusToIdMap
        const counts = {};
        let total = 0;

        data.forEach((item) => {
          const estadoNombre = item.nombre_estado.trim(); // Limpia los \r
          if (statusToIdMap[estadoNombre] !== undefined) {
            counts[estadoNombre] = item.total;
            total += item.total;
          }
        });

        console.log("Resumen de estados:", counts);
        setStatusCounts(counts);
        setTotalGlobalPedidos(total);
      } catch (error) {
        console.error("Error al obtener resumen de pedidos:", error);
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);

      try {
        let response;

        if (filterStatus) {
          const statusId = statusToIdMap[filterStatus];
          response = await getPedidosPorEstado(
            statusId,
            currentPage,
            searchTerm
          );
        } else {
          response = await getPedidosAll(currentPage, searchTerm);
        }

        if (response.results && response.results.length > 0) {
          setPedidos((prev) => [...prev, ...response.results]);
          setTotalPedidos(response.count || 0);
        }

        if (!response.next || response.results.length < 1) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [filterStatus, currentPage, searchTerm]);

  const handleFilterChange = (statusKey) => {
    setFilterStatus(statusKey); 
    setSearchTerm(""); // Limpia búsqueda si deseas
    setPedidos([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const lastPedidoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearchChange = useCallback((e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setPedidos([]); // limpiar lista actual
    setCurrentPage(1); // volver a la página 1
    setHasMore(true); // habilitar scroll infinito
  }, []);

  const handlePedidoClick = (pedido) => {
    setSelectedPedido(pedido);
  };

  const formatDate = (dateString) => {
    if (
      !dateString ||
      dateString === "2000-01-01T00:00:00Z" ||
      dateString.startsWith("0001-")
    )
      return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      return date.toLocaleDateString("es-CO");
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      return "";
    }

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  return (
    <div className="pedidos-container">
      <div className="filters-panel">
        <div className="filters-header">
          <h2 className="filters-title">Filtros de Pedidos</h2>
        </div>

        <div className={`filters-content ${showFilters ? "expanded" : ""}`}>
          <div className="filters-list">
            <button
              onClick={() => handleFilterChange("")}
              className={`filter-button ${!filterStatus ? "active green" : ""}`}
            >
              <div className="filter-button-content">
                <Package size={20} />
                <span className="filter-button-text">Todo</span>
              </div>
              <span className="filter-badge">
                {totalGlobalPedidos.toLocaleString()}
              </span>
            </button>

            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const count = statusCounts[status] || 0;
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`filter-button ${
                    isActive ? `active ${config.color}` : ""
                  }`}
                  style={{
                    color: colorMap[config?.color] || "#6c757d",
                  }}
                >
                  <div className="filter-button-content">
                    <Icon size={20} />
                    <span className="filter-button-text">{status}</span>
                  </div>
                  <span className="filter-badge">{count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          className="filters-toggle-button"
          onClick={() => setShowFilters((prev) => !prev)}
          aria-label={showFilters ? "Contraer filtros" : "Expandir filtros"}
        >
          <span style={{ marginRight: "8px" }}>
            {showFilters ? "Contraer filtros" : "Ver más filtros"}
          </span>
          {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="main-panel">
        <div
          className={`pedidos-list-container ${
            selectedPedido ? "with-details" : ""
          }`}
        >
          <div className="pedidos-header">
            <h1 className="pedidos-title">
              {filterStatus ? `Pedidos - ${filterStatus}` : "Todos los Pedidos"}
            </h1>

            <p className="pedidos-subtitle">
              Mostrando {pedidos.length} de {totalPedidos} pedidos
            </p>

            {/* Barra de búsqueda - NUEVO */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Buscar por ID, ciudad, cliente"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="pedidos-content">
            <div className="pedidos-grid">
              {/* Mostrar mensaje si no hay pedidos */}
              {pedidos.length === 0 && !loading && !error ? (
                <p className="no-pedidos-message">
                  No hay pedidos disponibles para este filtro.
                </p>
              ) : (
                pedidos.map((pedido, index) => {
                  const estadoActual =
                    Object.keys(statusToIdMap).find(
                      (key) => statusToIdMap[key] === pedido.id_estado
                    ) || "SIN REGISTRO";

                  const config = statusConfig[estadoActual];
                  const Icon = config?.icon || Package;
                  const isSelected =
                    selectedPedido?.id_factura === pedido.id_factura;

                  const refProp =
                    index === pedidos.length - 1 ? { ref: lastPedidoRef } : {};

                  return (
                    <div
                      key={pedido.id_factura}
                      {...refProp}
                      className={`pedido-card ${isSelected ? "selected" : ""} ${
                        config?.color || "gray"
                      }`}
                      style={{
                        color: colorMap[config?.color] || "#6c757d",
                      }}
                      onClick={() => handlePedidoClick(pedido)}
                    >
                      <div className="pedido-card-content">
                        <div className="pedido-card-left">
                          <div>
                            {typeof pedido.id_cliente === "number" &&
                            pedido.id_cliente % 2 === 0 ? (
                              <Building2 size={20} />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div className="pedido-info">
                            <h2 className="pedido-id">{pedido.id_factura}</h2>
                            <h3>
                              {pedido.cliente_nombre ||
                                `Cliente ID: ${pedido.id_cliente}`}
                            </h3>
                            <p>
                              {pedido.transportadora_nombre} | {pedido.ciudad}
                            </p>
                            <p>
                              Fecha: {formatDate(pedido.fecha_recibido)} |
                              Valor: {formatCurrency(pedido.valor)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Mostrar mensaje si ya no hay más por cargar */}
              {!hasMore && !loading && pedidos.length > 0 && (
                <p className="end-message">No hay más pedidos por cargar.</p>
              )}
            </div>
          </div>
        </div>

        {selectedPedido && (
          <div className="details-panel">
            <div className="details-header">
              <h2 className="details-title">
                Detalles del Pedido #{selectedPedido.id_factura}
              </h2>
              <button
                className="close-button"
                onClick={() => setSelectedPedido(null)}
              >
                ✕
              </button>
            </div>

            <div className="details-content">
              {/* Modal de edición */}
              {showEditModal && (
                <EditPedidoModal
                  pedido={selectedPedido}
                  isOpen={showEditModal}
                  onClose={() => setShowEditModal(false)}
                  onUpdate={handlePedidoUpdate}
                />
              )}

              {/* Información del cliente */}
              <div className="details-section">
                <h3 className="section-title">Cliente</h3>
                <div className="section-content">
                  <div className="client-info">
                    <div className="field-row">
                      <span className="field-label">Nombre:</span>
                      <span
                        className="field-value"
                        style={{
                          color:
                            colorMap[
                              statusConfig[
                                Object.keys(statusToIdMap).find(
                                  (key) =>
                                    statusToIdMap[key] ===
                                    selectedPedido.id_estado
                                ) || "SIN REGISTRO"
                              ]?.color
                            ] || "#222",
                        }}
                      >
                        {selectedPedido.cliente_nombre ||
                          `Cliente ID: ${selectedPedido.id_cliente}`}
                      </span>
                    </div>

                    <div className="field-row">
                      <span className="field-label">Ciudad:</span>
                      <span className="field-value">
                        {selectedPedido.ciudad || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del pedido */}
              <div className="details-section">
                <h3 className="section-title">Información del Pedido</h3>
                <div className="section-content">
                  <div className="info-row">
                    <span className="info-label">Fecha recibido:</span>
                    <span className="info-value">
                      {formatDate(selectedPedido.fecha_recibido)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valor total:</span>
                    <span className="info-value price">
                      {formatCurrency(selectedPedido.valor)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Transportadora:</span>
                    <span className="info-value">
                      {selectedPedido.transportadora_nombre ||
                        selectedPedido.transportadora ||
                        `ID: ${selectedPedido.id_transportadora}`}
                    </span>
                  </div>
                  {selectedPedido.fecha_enrutamiento && (
                    <div className="info-row">
                      <span className="info-label">Fecha enrutamiento:</span>
                      <span className="info-value">
                        {formatDate(selectedPedido.fecha_enrutamiento)}
                      </span>
                    </div>
                  )}
                  {selectedPedido.fecha_entrega && (
                    <div className="info-row">
                      <span className="info-label">Fecha entrega:</span>
                      <span className="info-value">
                        {formatDate(selectedPedido.fecha_entrega)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Recaudo */}
              <div className="details-section">
                <h3 className="section-title">
                  <DollarSign
                    size={18}
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  />{" "}
                  Información de Recaudo
                </h3>
                <div className="section-content">
                  <div className="info-row">
                    <span className="info-label">Tipo Recaudo:</span>
                    <span className="info-value">
                      {selectedPedido.tipo_recaudo || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Recaudo Efectivo:</span>
                    <span className="info-value price">
                      {formatCurrency(selectedPedido.recaudo_efectivo)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Recaudo Transferencia:</span>
                    <span className="info-value price">
                      {formatCurrency(selectedPedido.recaudo_transferencia)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">No. Caja:</span>
                    <span className="info-value">
                      {selectedPedido.no_caja || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              {selectedPedido.ubicacion &&
                selectedPedido.ubicacion !== "0, 0" && (
                  <div className="details-section">
                    <h3 className="section-title">
                      <MapPin
                        size={18}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />{" "}
                      Ubicación
                    </h3>
                    <div className="section-content">
                      <p>{selectedPedido.ubicacion}</p>
                      {selectedPedido.ubicacion && (
                        <a
                          // Corrección del enlace de Google Maps. Debe ser https://www.google.com/maps/search/?api=1&query=
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            selectedPedido.ubicacion
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                          style={{
                            fontSize: "0.9em",
                            color: "#007bff",
                            textDecoration: "none",
                          }}
                        >
                          Ver en Mapa
                        </a>
                      )}
                    </div>
                  </div>
                )}

              {/* Personal Involucrado */}
              <div className="details-section">
                <h3 className="section-title">
                  <Users
                    size={18}
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  />{" "}
                  Personal Involucrado
                </h3>
                <div className="section-content">
                  <div className="info-row">
                    <span className="info-label">ID Vendedor:</span>
                    <span className="info-value">
                      {selectedPedido.vendedor_nombre ||
                        `ID: ${selectedPedido.id_vendedor}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Enrutador:</span>
                    <span className="info-value">
                      {selectedPedido.enrutador_nombre ||
                        `ID: ${selectedPedido.id_enrutador}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Alistador:</span>
                    <span className="info-value">
                      {selectedPedido.alistador_nombre ||
                        `ID: ${selectedPedido.id_alistador}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Empacador:</span>
                    <span className="info-value">
                      {selectedPedido.empacador_nombre ||
                        `ID: ${selectedPedido.id_empacador}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {selectedPedido.observacion && (
                <div className="details-section">
                  <h3 className="section-title">Observaciones</h3>
                  <div className="observations">
                    <p>{selectedPedido.observacion}</p>
                  </div>
                </div>
              )}

              <div className="details-section">
                <div className="actions-section">
                  <div className="actions-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowEditModal(true)}
                    >
                      Editar Pedido
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate("/historial")}
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;
