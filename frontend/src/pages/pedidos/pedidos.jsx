"use client"

import { useState, useEffect, useCallback, useMemo } from "react" // Agregué useMemo
import { useLocation, useNavigate } from "react-router-dom"
import { Building2, User, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, MapPin, DollarSign, Calendar, Users, Search } from "lucide-react" // Agregué Search icon
import "./pedidos.css"
import { getPedidosAll, getPedidosPorEstado, getResumenPedidos } from '../../services/api.js';


const statusToIdMap = {
  "ENTREGADO AL CLIENTE": 1,
  "ENVIADO EN TRANSPORTADORA": 2,
  "ANULADO": 3,
  "SIN REGISTRO": 4,
  "PEDIDO NO RECIBIDO": 5,
  "EN ALISTAMIENTO": 6,
  "EN REPARTO": 7,
  "EN PREPARACION": 8,
  "EMPACADO": 9,
}

const statusConfig = {
  "ENTREGADO AL CLIENTE": {
    color: "green",
    icon: CheckCircle,
  },
  "ENVIADO EN TRANSPORTADORA": {
    color: "blue",
    icon: Truck,
  },
  "ANULADO": {
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
}

const findMatchingStatusKey = (rawStatus, map) => {
    if (!rawStatus) return '';
    const trimmedLowerRawStatus = rawStatus.trim().toLowerCase();
    for (const key in map) {
        if (key.toLowerCase() === trimmedLowerRawStatus) {
            return key;
        }
    }
    return '';
};


const PedidosPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedPedido, setSelectedPedido] = useState(null)
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const pageRangeDisplayed = 10;

  // Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const statusFromUrl = params.get("status")
    const searchTermFromUrl = params.get("search"); // Obtener término de búsqueda de la URL

    if (statusFromUrl) {
      const decodedAndMatchedStatus = findMatchingStatusKey(decodeURIComponent(statusFromUrl), statusToIdMap);
      setFilterStatus(decodedAndMatchedStatus);
    } else {
      setFilterStatus("");
    }
    setSearchTerm(searchTermFromUrl || ""); // Establecer el término de búsqueda
    setCurrentPage(1);
  }, [location.search]);


  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const data = await getResumenPedidos();
        const counts = {};
        data.forEach(item => {
          const normalizedKey = findMatchingStatusKey(item.nombre_estado, statusToIdMap);
          if (normalizedKey) {
            counts[normalizedKey] = item.total;
          }
        });
        setStatusCounts(counts);
      } catch (err) {
        console.error("Error fetching status counts:", err);
      }
    };
    fetchStatusCounts();
  }, []);


  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (filterStatus) {
          const statusId = statusToIdMap[filterStatus];
          if (statusId !== undefined) {
            data = await getPedidosPorEstado(statusId);
          } else {
            console.warn(`Estado '${filterStatus}' no encontrado en el mapeo. Mostrando todos los pedidos.`);
            data = await getPedidosAll();
          }
        } else {
          data = await getPedidosAll();
        }
        setPedidos(data);
        console.log("Pedidos recibidos del backend:", data);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        setError("No se pudieron cargar los pedidos. Inténtelo de nuevo más tarde.");
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedidos();
    
  }, [filterStatus]); // Ya no depende de searchTerm aquí, el filtrado por búsqueda es local


  const handleFilterChange = useCallback((statusKey) => {
    const params = new URLSearchParams()
    if (statusKey) {
      params.set("status", encodeURIComponent(statusKey))
    }
    if (searchTerm) { // Mantener el término de búsqueda si existe
      params.set("search", encodeURIComponent(searchTerm));
    }
    navigate(`?${params.toString()}`)
    setSelectedPedido(null)
  }, [navigate, searchTerm]); // Agregué searchTerm a las dependencias

  // Nueva función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = useCallback((e) => {
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
  }, [navigate, filterStatus]); // Agregué filterStatus a las dependencias

  const handlePedidoClick = (pedido) => {
    setSelectedPedido(pedido)
  }

  const totalPedidos = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

  const formatDate = (dateString) => {
    if (!dateString || dateString === "2000-01-01T00:00:00Z" || dateString.startsWith("0001-")) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return date.toLocaleDateString("es-CO");
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString;
    }
  }

  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      return '';
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
    return pedidos.filter(pedido => {
      // Buscar en id_factura
      if (pedido.id_factura && String(pedido.id_factura).includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Buscar en ciudad
      if (pedido.ciudad && pedido.ciudad.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Buscar en nombre del cliente
      if (pedido.cliente_nombre && pedido.cliente_nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Buscar en productos (si es un array de strings)
      if (Array.isArray(pedido.productos)) {
        if (pedido.productos.some(product => product.toLowerCase().includes(lowerCaseSearchTerm))) {
          return true;
        }
      }
      // Puedes añadir más campos aquí según sea necesario (ej. transportadora, estado, etc.)
      // Para 'estado', necesitarías el texto del estado para comparar
      const estadoTexto = Object.keys(statusToIdMap).find(key => statusToIdMap[key] === pedido.id_estado) || "";
      if (estadoTexto.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      return false;
    });
  }, [pedidos, searchTerm, statusToIdMap]); // Dependencias para useMemo

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem); // Usar filteredPedidos
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage); // Calcular totalPages basado en filteredPedidos

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageItems = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(pageRangeDisplayed / 2));

    if (startPage > 1) {
      pageItems.push({ type: 'page', value: 1, key: 'page-1' });
      if (startPage > 2) {
        pageItems.push({ type: 'ellipsis', key: 'ellipsis-start' });
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push({ type: 'page', value: i, key: `page-${i}` });
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push({ type: 'ellipsis', key: 'ellipsis-end' });
      }
      pageItems.push({ type: 'page', value: totalPages, key: `page-${totalPages}` });
    }

    return pageItems.map(item => {
      if (item.type === 'ellipsis') {
        return <span key={item.key} className="ellipsis">...</span>;
      } else {
        return (
          <button
            key={item.key}
            onClick={() => paginate(item.value)}
            className={currentPage === item.value ? 'active' : ''}
          >
            {item.value}
          </button>
        );
      }
    });
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

        <div className="filters-content">
          <div className="filters-list">
            <button
              onClick={() => handleFilterChange("")}
              className={`filter-button ${!filterStatus ? "active green" : ""}`}
            >
              <div className="filter-button-content">
                <Package size={20} />
                <span className="filter-button-text">Todo</span>
              </div>
              <span className="filter-badge">{totalPedidos.toLocaleString()}</span>
            </button>

            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              const count = statusCounts[status] || 0
              const isActive = filterStatus === status

              return (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`filter-button ${isActive ? `active ${config.color}` : ""}`}
                >
                  <div className="filter-button-content">
                    <Icon size={20} />
                    <span className="filter-button-text">{status}</span>
                  </div>
                  <span className="filter-badge">{count.toLocaleString()}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="main-panel">
        <div className={`pedidos-list-container ${selectedPedido ? "with-details" : ""}`}>
          <div className="pedidos-header">
            <h1 className="pedidos-title">{filterStatus ? `Pedidos - ${filterStatus}` : "Todos los Pedidos"}</h1>
            <p className="pedidos-subtitle">
              {filteredPedidos.length} pedido{filteredPedidos.length !== 1 ? "s" : ""} encontrado
            </p>
            {/* Barra de búsqueda - NUEVO */}
            <div className="search-bar-container">
              <Search size={20} className="search-icon" />
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
              {currentItems.length === 0 && !loading && !error ? (
                <p className="no-pedidos-message">No hay pedidos disponibles para este filtro.</p>
              ) : (
                currentItems.map((pedido) => {
                  // Asumo que 'estado' ya viene en el objeto pedido, si no, usa el mapeo inverso aquí
                  const estadoActual = Object.keys(statusToIdMap).find(key => statusToIdMap[key] === pedido.id_estado) || "SIN REGISTRO";
                  const config = statusConfig[estadoActual]
                  const Icon = config?.icon || Package
                  const isSelected = selectedPedido?.id_factura === pedido.id_factura // Comparar por id_factura

                  return (
                    <div
                      key={pedido.id_factura}
                      className={`pedido-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handlePedidoClick(pedido)}
                    >
                      <div className="pedido-card-content">
                        <div className="pedido-card-left">
                          <div className={`pedido-icon ${config?.color || "gray"}`}>
                            {typeof pedido.id_cliente === 'number' && pedido.id_cliente % 2 === 0 ? <Building2 size={20} /> : <User size={20} />}
                          </div>
                          <div className="pedido-info">
                            <h3>
                              {pedido.cliente_nombre} - {pedido.ciudad}
                            </h3>
                            <p>
                              Fecha: {formatDate(pedido.fecha_recibido)} | Valor: {formatCurrency(pedido.valor)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                Anterior
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>


        {selectedPedido && (
          <div className="details-panel">
            <div className="details-header">
              <h2 className="details-title">Detalles del Pedido #{selectedPedido.id_factura}</h2>
              <button className="close-button" onClick={() => setSelectedPedido(null)}>
                ✕
              </button>
            </div>

            <div className="details-content">
              <div className="details-section">
                <h3 className="section-title">Estado</h3>
                <div>
                  {(() => {
                    const estadoTexto = Object.keys(statusToIdMap).find(key => statusToIdMap[key] === selectedPedido.id_estado) || "SIN REGISTRO";
                    const config = statusConfig[estadoTexto] || statusConfig["SIN REGISTRO"];
                    const Icon = config.icon;
                    return (
                      <div className={`pedido-badge ${config?.color || "gray"}`}>
                        <Icon size={16} />
                        {estadoTexto}
                      </div>
                    )
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
                      {selectedPedido.cliente_nombre || `Cliente ID: ${selectedPedido.id_cliente}`}
                    </div>
                    <div className="client-details">
                      <p>📞 {selectedPedido.cliente_telefono || 'N/A'}</p>
                      <p>📍 {selectedPedido.cliente_direccion || 'N/A'}</p>
                      <p>🏙️ {selectedPedido.ciudad || 'N/A'}</p>
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
                    <span className="info-value">{formatDate(selectedPedido.fecha_recibido)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valor total:</span>
                    <span className="info-value price">{formatCurrency(selectedPedido.valor)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Transportadora:</span>
                    <span className="info-value">{selectedPedido.transportadora || `ID: ${selectedPedido.id_transportadora}`}</span>
                  </div>
                  {selectedPedido.fecha_enrutamiento && (
                    <div className="info-row">
                      <span className="info-label">Fecha enrutamiento:</span>
                      <span className="info-value">{formatDate(selectedPedido.fecha_enrutamiento)}</span>
                    </div>
                  )}
                   {selectedPedido.fecha_entrega && (
                    <div className="info-row">
                      <span className="info-label">Fecha entrega:</span>
                      <span className="info-value">{formatDate(selectedPedido.fecha_entrega)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Recaudo */}
              <div className="details-section">
                <h3 className="section-title"><DollarSign size={18} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Información de Recaudo</h3>
                <div className="section-content">
                  <div className="info-row">
                    <span className="info-label">Tipo Recaudo:</span>
                    <span className="info-value">{selectedPedido.tipo_recaudo || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Recaudo Efectivo:</span>
                    <span className="info-value">{formatCurrency(selectedPedido.recaudo_efectivo)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Recaudo Transferencia:</span>
                    <span className="info-value">{formatCurrency(selectedPedido.recaudo_transferencia)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">No. Caja:</span>
                    <span className="info-value">{selectedPedido.no_caja || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              {selectedPedido.ubicacion && selectedPedido.ubicacion !== "0, 0" && (
                <div className="details-section">
                  <h3 className="section-title"><MapPin size={18} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Ubicación</h3>
                  <div className="section-content">
                    <p>{selectedPedido.ubicacion}</p>
                    {selectedPedido.ubicacion && (
                        <a 
                            // Corrección del enlace de Google Maps. Debe ser https://www.google.com/maps/search/?api=1&query=
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPedido.ubicacion)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="map-link"
                            style={{fontSize: '0.9em', color: '#007bff', textDecoration: 'none'}}
                        >
                            Ver en Mapa
                        </a>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Involucrado */}
              <div className="details-section">
                <h3 className="section-title"><Users size={18} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Personal Involucrado</h3>
                <div className="section-content">
                  <div className="info-row">
                    <span className="info-label">ID Vendedor:</span>
                    <span className="info-value">{selectedPedido.id_vendedor || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Enrutador:</span>
                    <span className="info-value">{selectedPedido.id_enrutador || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Alistador:</span>
                    <span className="info-value">{selectedPedido.id_alistador || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Empacador:</span>
                    <span className="info-value">{selectedPedido.id_empacador || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="details-section">
                <h3 className="section-title">Productos</h3>
                <div className="products-list">
                  {selectedPedido.productos && selectedPedido.productos.map((producto, index) => (
                    <div key={index} className="product-item">
                      <Package size={16} />
                      <span>{producto}</span>
                    </div>
                  ))}
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
  )
}

export default PedidosPage