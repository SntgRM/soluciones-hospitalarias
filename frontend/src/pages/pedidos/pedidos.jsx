import { useState, useEffect, useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ChevronUp, ChevronDown, Building2, User, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, MapPin, DollarSign, Calendar, Users } from "lucide-react"
import "./pedidos.css";
import { getPedidosAll, getPedidosPorEstado, getResumenPedidos } from "../../services/api.js"

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
  blue: "#007bff",
  red: "#dc3545",
  gray: "#6c757d",
  yellow: "#ffc107",
  purple: "#6f42c1",
  orange: "#fd7e14",
};


const statusConfig = {
  "ENTREGADO AL CLIENTE": {
    color: "green",
    icon: CheckCircle,
  },
  "ENVIADO EN TRANSPORTADORA": {
    color: "blue",
    icon: Truck,
  },
  ANULADO: {
    color: "red",
    icon: XCircle,
  },
  "SIN REGISTRO": {
    color: "gray",
    icon: AlertCircle,
  },
  "PEDIDO NO RECIBIDO": {
    color: "yellow",
    icon: AlertCircle,
  },
  "EN ALISTAMIENTO": {
    color: "purple",
    icon: Package,
  },
  "EN REPARTO": {
    color: "orange",
    icon: Clock,
  },
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

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalPedidos, setTotalPedidos] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      const params = new URLSearchParams(location.search);
      params.set("page", pageNumber);
      navigate(`?${params.toString()}`);
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
        setTotalPedidos(total);
      } catch (error) {
        console.error("Error al obtener resumen de pedidos:", error);
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;

        // Obtener pedidos según filtro
        if (filterStatus) {
          const statusId = statusToIdMap[filterStatus];
          response =
            statusId !== undefined
              ? await getPedidosPorEstado(statusId, currentPage)
              : await getPedidosAll(currentPage);
          if (response.count !== undefined) {
          }
        } else {
          response = await getPedidosAll(currentPage, searchTerm);
        }

        // Manejar diferentes formatos de respuesta
        if (response.results) {
          setPedidos(response.results || []);
          // Actualizar el total solo si no hay filtro aplicado
          if (!filterStatus) {
            setTotalPedidos(response.count || 0);
          }
        } else if (Array.isArray(response)) {
          setPedidos(response);
          // Actualizar el total solo si no hay filtro aplicado
          if (!filterStatus) {
            setTotalPedidos(response.length);
          }
        } else {
          setPedidos([]);
          console.error("Formato de respuesta inesperado:", response);
        }
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        setError(
          "No se pudieron cargar los pedidos. Inténtelo de nuevo más tarde."
        );
        setPedidos([]);
        setTotalPedidos(0); // Resetear el contador en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [filterStatus, currentPage]); // Dependencias del efecto

  const handleFilterChange = useCallback(
    (statusKey) => {
      const params = new URLSearchParams();

      if (statusKey) {
        // Codifica correctamente el status (solo una vez)
        params.set("status", encodeURIComponent(statusKey));
      }

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      // Siempre resetear a página 1 al cambiar filtro
      params.set("page", "1");

      navigate(`?${params.toString()}`);
      setCurrentPage(1); // Sincroniza el estado interno
    },
    [navigate, searchTerm]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      // Actualizar la URL con el término de búsqueda
      const params = new URLSearchParams();
      if (filterStatus) {
        params.set("status", encodeURIComponent(filterStatus));
      }
      if (newSearchTerm) {
        params.set("search", encodeURIComponent(newSearchTerm));
      }
      navigate(`?${params.toString()}`);
      setCurrentPage(1); // Resetear a la primera página al buscar
    },
    [navigate, filterStatus]
  ); // Agregué filterStatus a las dependencias

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

  // Filtrado de pedidos basado en el término de búsqueda y el estado (si el estado no se usa en la API)
  const filteredPedidos = useMemo(() => {
    if (!searchTerm) {
      return pedidos;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return pedidos.filter((pedido) => {
      // Buscar en id_factura
      if (
        pedido.id_factura &&
        String(pedido.id_factura).includes(lowerCaseSearchTerm)
      ) {
        return true;
      }
      // Buscar en ciudad
      if (
        pedido.ciudad &&
        pedido.ciudad.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }
      // Buscar en nombre del cliente
      if (
        pedido.cliente_nombre &&
        pedido.cliente_nombre.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }
      // Buscar en productos (si es un array de strings)
      if (Array.isArray(pedido.productos)) {
        if (
          pedido.productos.some((product) =>
            product.toLowerCase().includes(lowerCaseSearchTerm)
          )
        ) {
          return true;
        }
      }
      // Puedes añadir más campos aquí según sea necesario (ej. transportadora, estado, etc.)
      // Para 'estado', necesitarías el texto del estado para comparar
      const estadoTexto =
        Object.keys(statusToIdMap).find(
          (key) => statusToIdMap[key] === pedido.id_estado
        ) || "";
      if (estadoTexto.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      return false;
    });
  }, [pedidos, searchTerm, statusToIdMap]); // Dependencias para useMemo

  const totalPages = Math.ceil(
    searchTerm
      ? filteredPedidos.length / itemsPerPage
      : (filterStatus ? statusCounts[filterStatus] || 0 : totalPedidos) /
          itemsPerPage
  );

  const pageRangeDisplayed = 5;

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pageItems = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfRange = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // Ajustar si estamos cerca del inicio
    if (currentPage <= halfRange) {
      endPage = Math.min(maxVisiblePages, totalPages);
    }
    // Ajustar si estamos cerca del final
    if (currentPage > totalPages - halfRange) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Botón para la primera página
    if (startPage > 1) {
      pageItems.push(
        <button
          key="page-1"
          onClick={() => paginate(1)}
          className={`pagination-page ${currentPage === 1 ? "active" : ""}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageItems.push(
          <span key="ellipsis-start" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <button
          key={`page-${i}`}
          onClick={() => paginate(i)}
          className={`pagination-page ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Botón para la última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(
          <span key="ellipsis-end" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pageItems.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => paginate(totalPages)}
          className={`pagination-page ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageItems;
  };

  if (loading) {
    return (
      <div className="pedidos-container">
        <div className="main-panel">
          <div className="pedidos-list-container">
            <p className="loading-message">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-container">
        <div className="main-panel">
          <div className="pedidos-list-container">
            <p className="error-message">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

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
                {totalPedidos.toLocaleString()}
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
          onClick={() => setShowFilters(prev => !prev)}
          aria-label={showFilters ? "Contraer filtros" : "Expandir filtros"}
        >
          <span style={{ marginRight: '8px' }}>
            {showFilters ? 'Contraer filtros' : 'Ver más filtros'}
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
                {`Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filterStatus ? statusCounts[filterStatus] || 0 : totalPedidos
                )} de ${
                  filterStatus ? statusCounts[filterStatus] || 0 : totalPedidos
                } pedidos`}
              </p>
            
            {/* Barra de búsqueda - NUEVO */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Buscar por ID, ciudad, cliente, productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="pedidos-content">
            <div className="pedidos-grid">
              {pedidos.length === 0 && !loading && !error ? (
                <p className="no-pedidos-message">
                  No hay pedidos disponibles para este filtro.
                </p>
              ) : (
                pedidos.map((pedido) => {
                  const estadoActual =
                    Object.keys(statusToIdMap).find(
                      (key) => statusToIdMap[key] === pedido.id_estado
                    ) || "SIN REGISTRO";
                  const config = statusConfig[estadoActual];
                  const Icon = config?.icon || Package;
                  const isSelected =
                    selectedPedido?.id_factura === pedido.id_factura; // Comparar por id_factura

                  return (
                    <div
                      key={pedido.id_factura}
                      className={`pedido-card ${isSelected ? "selected" : ""} ${config?.color || "gray"}`}
                      style={{
                        color: colorMap[config?.color] || "#6c757d",
                      }}
                      onClick={() => handlePedidoClick(pedido)}
                    >

                      <div className="pedido-card-content">
                        <div className="pedido-card-left">
                          <div
                          >
                            {typeof pedido.id_cliente === "number" &&
                            pedido.id_cliente % 2 === 0 ? (
                              <Building2 size={20} />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div className="pedido-info">
                            <h3>
                              {pedido.id_factura} - {pedido.ciudad}
                            </h3>
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
            </div>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-nav"
              >
                Anterior
              </button>

              {currentPage > 2 && totalPages > 5 && (
                <button onClick={() => paginate(1)} className="pagination-page">
                  1
                </button>
              )}

              {currentPage > 3 && totalPages > 5 && (
                <span className="pagination-ellipsis">...</span>
              )}

              {[currentPage - 1, currentPage, currentPage + 1].map(
                (page) =>
                  page >= 1 &&
                  page <= totalPages && (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`pagination-page ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  )
              )}

              {currentPage < totalPages - 2 && totalPages > 5 && (
                <span className="pagination-ellipsis">...</span>
              )}

              {currentPage < totalPages - 1 && totalPages > 5 && (
                <button
                  onClick={() => paginate(totalPages)}
                  className="pagination-page"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-nav"
              >
                Siguiente
              </button>

            </div>
          )}
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
              <div className="details-section">
                <h3 className="section-title">Estado</h3>
                <div>
                  {(() => {
                    const estadoTexto =
                      Object.keys(statusToIdMap).find(
                        (key) => statusToIdMap[key] === selectedPedido.id_estado
                      ) || "SIN REGISTRO";
                    const config =
                      statusConfig[estadoTexto] || statusConfig["SIN REGISTRO"];
                    const Icon = config.icon;
                    return (
                      <div
                        className={`pedido-badge ${config?.color || "gray"}`}
                      >
                        <Icon size={16} />
                        {estadoTexto}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Información del cliente */}
              <div className="details-section">
                <h3 className="section-title">Cliente</h3>
                <div className="section-content">
                  <div className="client-info">
                    <div className="client-name">
                      <User size={16} />
                      {selectedPedido.cliente_nombre ||
                        `Cliente ID: ${selectedPedido.id_cliente}`}
                    </div>
                    <div className="client-details">
                      <p>🏙️ {selectedPedido.ciudad || "N/A"}</p>
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
                    <span className="info-value">
                      {formatCurrency(selectedPedido.recaudo_efectivo)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Recaudo Transferencia:</span>
                    <span className="info-value">
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
                      {selectedPedido.vendedor_nombre || `ID: ${selectedPedido.id_vendedor}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Enrutador:</span>
                    <span className="info-value">
                      {selectedPedido.enrutador_nombre || `ID: ${selectedPedido.id_enrutador}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Alistador:</span>
                    <span className="info-value">
                      {selectedPedido.alistador_nombre || `ID: ${selectedPedido.id_alistador}`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Empacador:</span>
                    <span className="info-value">
                      {selectedPedido.empacador_nombre || `ID: ${selectedPedido.id_empacador}`}
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
                    <button className="btn btn-primary">Editar Pedido</button>
                    <button className="btn btn-secondary">Ver Historial</button>
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
