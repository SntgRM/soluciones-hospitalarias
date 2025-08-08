import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditPedidoModal from "./editPedidoModal";
import { ChevronUp, ChevronDown, Building2, User, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, MapPin, DollarSign, Users, ListChecks, Archive, PackageCheck, Inbox, Warehouse, Settings, Filter, X } from 'lucide-react';
import "./pedidos.css";
import { 
  getPedidosAll, 
  getPedidosPorEstado, 
  getResumenPedidos,
  getFilterOptions,
  getPedidosWithFilters,
  getPedidosPorEstadoWithFilters
} from "../../services/api";

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
const [showFilterModal, setShowFilterModal] = useState(false);

const [additionalFilters, setAdditionalFilters] = useState({
  vendedor: '',
  fecha_inicio: '',
  fecha_fin: '',
  tipo_recaudo: '',
  enrutador: '',
  fecha_enrutamiento_inicio: '',
  fecha_enrutamiento_fin: '',
  alistador: '',
  empacador: '',
  transportadora: '',
  fecha_entrega_inicio: '',
  fecha_entrega_fin: ''
});

const [filterOptions, setFilterOptions] = useState({
  vendedores: [],
  tipos_recaudo: [],
  enrutadores: [],
  alistadores: [],
  empacadores: [],
  transportadoras: []
});

const [loadingFilters, setLoadingFilters] = useState(false);

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

const fetchFilterOptions = async () => {
  setLoadingFilters(true);
  try {
    console.log('Cargando opciones de filtro...');
    const options = await getFilterOptions();
    console.log('Opciones de filtro cargadas:', options);
    
    setFilterOptions(options);
  } catch (error) {
    console.error("Error cargando opciones de filtro:", error);
    // Mantener estructura vacía en caso de error
    setFilterOptions({
      vendedores: [],
      tipos_recaudo: [],
      enrutadores: [],
      alistadores: [],
      empacadores: [],
      transportadoras: []
    });
  } finally {
    setLoadingFilters(false);
  }
};

// Cargar opciones de filtro cuando se abre el modal
useEffect(() => {
  if (showFilterModal && Object.values(filterOptions).every(arr => arr.length === 0)) {
    fetchFilterOptions();
  }
}, [showFilterModal]);

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

      // Filtrar solo los filtros que tienen valores
      const activeFilters = Object.entries(additionalFilters).reduce((acc, [key, value]) => {
        if (value && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log('Filtros activos:', activeFilters);

      if (filterStatus) {
        const statusId = statusToIdMap[filterStatus];
        // Usar la nueva función con filtros adicionales
        response = await getPedidosPorEstadoWithFilters(
          statusId,
          currentPage,
          searchTerm,
          activeFilters
        );
      } else {
        // Usar la nueva función con filtros adicionales
        response = await getPedidosWithFilters(
          currentPage,
          searchTerm,
          activeFilters
        );
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
      setError("Error al cargar los pedidos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  fetchPedidos();
}, [filterStatus, currentPage, searchTerm, additionalFilters]);

const handleFilterChange = (statusKey) => {
  if (filterStatus === statusKey) {
    return;
  }
  setFilterStatus(statusKey);
  setSearchTerm("");
  setPedidos([]);
  setCurrentPage(1);
  setHasMore(true);
  const params = new URLSearchParams();
  if (statusKey) {
    params.append("status", encodeURIComponent(statusKey));
  }
  navigate({ search: params.toString() }, { replace: true });
};

const handleAdditionalFilterChange = (filterKey, value) => {
  console.log(`Cambiando filtro ${filterKey} a: ${value}`);
  setAdditionalFilters(prev => ({
    ...prev,
    [filterKey]: value
  }));
  setPedidos([]);
  setCurrentPage(1);
  setHasMore(true);
};

const clearAdditionalFilters = () => {
  setAdditionalFilters({
    vendedor: '',
    fecha_inicio: '',
    fecha_fin: '',
    tipo_recaudo: '',
    enrutador: '',
    fecha_enrutamiento_inicio: '',
    fecha_enrutamiento_fin: '',
    alistador: '',
    empacador: '',
    transportadora: '',
    fecha_entrega_inicio: '',
    fecha_entrega_fin: ''
  });
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

// Función helper para renderizar las opciones de los selects
const renderSelectOptions = (
  options,
  valueKeyCandidates = ['value', 'id', 'id_vendedor', 'id_transportadora'],
  labelKeyCandidates = ['label', 'nombre', 'nombre_vendedor', 'nombre_transportadora', 'name']
) => {
  if (!Array.isArray(options)) return null;

  return options.map((option, index) => {
    if (option === null || option === undefined) return null;

    // Si viene un string/number directo
    if (typeof option === 'string' || typeof option === 'number') {
      return (
        <option key={option + index} value={option}>
          {option}
        </option>
      );
    }

    // Buscar la mejor key para value y label entre varias posibles
    const value = valueKeyCandidates.reduce(
      (found, key) => (found !== undefined ? found : option[key]),
      undefined
    );
    const label = labelKeyCandidates.reduce(
      (found, key) => (found !== undefined ? found : option[key]),
      undefined
    );

    const key = value !== undefined ? value : label !== undefined ? label : index;
    const display = label !== undefined ? label : value !== undefined ? String(value) : JSON.stringify(option);
    const valAttr = value !== undefined ? value : display;

    return (
      <option key={key} value={valAttr}>
        {display}
      </option>
    );
  });
};

return (
  <div className="pedidos-container">
    {/* Panel de filtros lateral existente */}
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

          {/* Contenedor para búsqueda y botón de filtro */}
          <div className="search-and-filter-controls">
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Buscar por ID, ciudad, cliente"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <button className="filter-modal-button" onClick={() => setShowFilterModal(true)}>
              <Filter size={20} />
              Filtros
              {Object.values(additionalFilters).filter(value => value !== '').length > 0 && (
                <span style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '8px'
                }}>
                  {Object.values(additionalFilters).filter(value => value !== '').length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="pedidos-content">
          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
          
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
            
            {/* Mostrar indicador de carga */}
            {loading && (
              <div className="loading-message">
                Cargando pedidos...
              </div>
            )}
            
            {/* Mostrar mensaje si ya no hay más por cargar */}
            {!hasMore && !loading && pedidos.length > 0 && (
              <p className="end-message">No hay más pedidos por cargar.</p>
            )}
          </div>
        </div>
      </div>

      {/* Panel de detalles - mantener el código existente */}
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
              <h3 className="pedidos-section-title">Cliente</h3>
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
              <h3 className="pedidos-section-title">Información del Pedido</h3>
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
              <h3 className="pedidos-section-title">
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
                  <h3 className="pedidos-section-title">
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
              <h3 className="pedidos-section-title">
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
                <h3 className="pedidos-section-title">Observaciones</h3>
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

      {/* Modal de Filtros Actualizado */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Filtros de Pedidos</h3>
              <button className="close-button" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {loadingFilters ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <div>Cargando opciones de filtro...</div>
                </div>
              ) : (
                <div className="additional-filters">
                  
                  {/* Filtro por Vendedor */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Vendedor:
                    </label>
                    <select
                      value={additionalFilters.vendedor}
                      onChange={(e) => handleAdditionalFilterChange('vendedor', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todos los vendedores</option>
                      {renderSelectOptions(filterOptions.vendedores)}
                    </select>
                  </div>

                  {/* Filtro por Fecha Recibido */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <Clock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Fecha Recibido:
                    </label>
                    <div className="date-range-inputs">
                      <input
                        type="date"
                        value={additionalFilters.fecha_inicio}
                        onChange={(e) => handleAdditionalFilterChange('fecha_inicio', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Desde"
                        title="Fecha inicio"
                      />
                      <span className="date-separator">hasta</span>
                      <input
                        type="date"
                        value={additionalFilters.fecha_fin}
                        onChange={(e) => handleAdditionalFilterChange('fecha_fin', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Hasta"
                        title="Fecha fin"
                      />
                    </div>
                  </div>

                  {/* Filtro por Tipo de Recaudo */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <DollarSign size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Tipo de Recaudo:
                    </label>
                    <select
                      value={additionalFilters.tipo_recaudo}
                      onChange={(e) => handleAdditionalFilterChange('tipo_recaudo', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todos los tipos</option>
                      {filterOptions.tipos_recaudo.map((tipo, index) => (
                        <option key={index} value={typeof tipo === 'object' ? tipo.value : tipo}>
                          {typeof tipo === 'object' ? tipo.label : tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por Enrutador */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Enrutador:
                    </label>
                    <select
                      value={additionalFilters.enrutador}
                      onChange={(e) => handleAdditionalFilterChange('enrutador', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todos los enrutadores</option>
                      {renderSelectOptions(filterOptions.enrutadores)}
                    </select>
                  </div>

                  {/* Filtro por Fecha de Enrutamiento */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Fecha Enrutamiento:
                    </label>
                    <div className="date-range-inputs">
                      <input
                        type="date"
                        value={additionalFilters.fecha_enrutamiento_inicio}
                        onChange={(e) => handleAdditionalFilterChange('fecha_enrutamiento_inicio', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Desde"
                        title="Fecha enrutamiento inicio"
                      />
                      <span className="date-separator">hasta</span>
                      <input
                        type="date"
                        value={additionalFilters.fecha_enrutamiento_fin}
                        onChange={(e) => handleAdditionalFilterChange('fecha_enrutamiento_fin', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Hasta"
                        title="Fecha enrutamiento fin"
                      />
                    </div>
                  </div>

                  {/* Filtro por Alistador */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <ListChecks size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Alistado por:
                    </label>
                    <select
                      value={additionalFilters.alistador}
                      onChange={(e) => handleAdditionalFilterChange('alistador', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todos los alistadores</option>
                      {renderSelectOptions(filterOptions.alistadores)}
                    </select>
                  </div>

                  {/* Filtro por Empacador */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <PackageCheck size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Empacado por:
                    </label>
                    <select
                      value={additionalFilters.empacador}
                      onChange={(e) => handleAdditionalFilterChange('empacador', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todos los empacadores</option>
                      {renderSelectOptions(filterOptions.empacadores)}
                    </select>
                  </div>

                  {/* Filtro por Transportadora */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <Truck size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Transportadora:
                    </label>
                    <select
                      value={additionalFilters.transportadora}
                      onChange={(e) => handleAdditionalFilterChange('transportadora', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Todas las transportadoras</option>
                      {renderSelectOptions(filterOptions.transportadoras)}
                    </select>
                  </div>

                  {/* Filtro por Fecha de Entrega */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <CheckCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Fecha Entrega:
                    </label>
                    <div className="date-range-inputs">
                      <input
                        type="date"
                        value={additionalFilters.fecha_entrega_inicio}
                        onChange={(e) => handleAdditionalFilterChange('fecha_entrega_inicio', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Desde"
                        title="Fecha entrega inicio"
                      />
                      <span className="date-separator">hasta</span>
                      <input
                        type="date"
                        value={additionalFilters.fecha_entrega_fin}
                        onChange={(e) => handleAdditionalFilterChange('fecha_entrega_fin', e.target.value)}
                        className="filter-input date-input"
                        placeholder="Hasta"
                        title="Fecha entrega fin"
                      />
                    </div>
                  </div>

                  {/* Indicador de filtros activos */}
                  {Object.values(additionalFilters).some(value => value !== '') && (
                    <div className="active-filters-indicator">
                      <div className="active-filters-badge">
                        <Filter size={14} />
                        <span>Filtros activos: {Object.values(additionalFilters).filter(value => value !== '').length}</span>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="filter-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={clearAdditionalFilters}
                      disabled={Object.values(additionalFilters).every(value => value === '')}
                    >
                      <X size={16} style={{ marginRight: '8px' }} />
                      Limpiar Filtros
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowFilterModal(false)}
                    >
                      <CheckCircle size={16} style={{ marginRight: '8px' }} />
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default PedidosPage;