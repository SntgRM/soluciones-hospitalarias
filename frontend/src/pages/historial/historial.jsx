"use client";

import { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from "date-fns";
import "./historial.css";
import { SidebarContext } from "../../context/sidebarContext";
import { ClipboardList, Plus, Pencil, Trash, Settings, Package, Clock, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getHistorialGeneral } from "../../services/api";

const getTypeIcon = (type) => {
  switch (type) {
    case "creacion":
      return <Plus size={16} className="type-icon creation" />;
    case "edicion":
      return <Pencil size={16} className="type-icon edition" />;
    case "eliminacion":
      return <Trash size={16} className="type-icon deletion" />;
    case "general":
      return <Settings size={16} className="type-icon general" />;
    default:
      return <ClipboardList size={16} className="type-icon" />;
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case "edicion":
      return "Edición";
    case "eliminacion":
      return "Eliminación";
    default:
      return "Actividad";
  }
};

const formatDateString = (isoString) => {
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-");
  const [hourStr, minute] = timePart.split(":");
  let hour = parseInt(hourStr);
  const suffix = hour >= 12 ? "p. m." : "a. m.";

  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  return `${day}/${month}/${year} ${hour}:${minute} ${suffix}`;
};

const Historial = () => {
  const [filtro, setFiltro] = useState("todos");
  const { isSidebarOpen } = useContext(SidebarContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const [historialFacturas, setHistorialFacturas] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialGeneral();
        console.log("Historial recibido:", JSON.stringify(data, null, 2));
        setHistorialFacturas(data);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };

    fetchHistorial();
  }, []);

  const grouped = historialFacturas.reduce((acc, item) => {
    const id = item.id_pedido;
    if (!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(item);
    return acc;
  }, {});

  // Formatear el historial agrupado
  const formattedHistory = Object.entries(grouped).map(
    ([id_pedido, modificaciones]) => ({
      rawId: id_pedido,
      productId: `FACT-${id_pedido}`,
      productName: `Historial de Factura #${id_pedido}`,
      lastModificationType: "edicion",
      modifications: modificaciones.map((item) => ({
        id: item.id_historial,
        type: "edicion",
        date: formatDateString(item.fecha_cambio),
        description: item.observacion,
      })),
    })
  );

  const filteredHistory = formattedHistory
    .filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.rawId.toString().includes(searchTerm);
      return matchesSearch;
    })
    .map((product) => ({
      ...product,
      modifications: product.modifications.filter((item) => {
        const tipoCoincide = filtro === "todos" || item.type === filtro;
        const itemDate = parse(item.date, "dd/MM/yyyy, hh:mm:ss a", new Date());
        const dentroDelRango =
          (!startDate || itemDate >= startDate) &&
          (!endDate || itemDate <= endDate);
        return tipoCoincide && dentroDelRango;
      }),
    }))
    .filter((product) => product.modifications.length > 0);

  const toggleExpanded = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getMainContentClass = () => {
    let baseClass = "main-content-historial";
    if (window.innerWidth <= 420 && isSidebarOpen) {
      baseClass += " sidebar-visible";
    } else if (window.innerWidth <= 1200 && isSidebarOpen) {
      baseClass += " sidebar-collapsed";
    }
    return baseClass;
  };

  return (
    <div className={getMainContentClass()}>
      <div className="historial-header">
        <h2 className="grid-c-title-text">Historial de Productos</h2>

        {/* Barra de búsqueda usando los estilos de user */}
        <div className="user-search-box">
          <Search size={18} className="user-search-icon" />
          <input
            type="text"
            placeholder="Buscar por número de factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="user-search-input"
          />
        </div>
      </div>

      <div className="products-history-container">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((product) => {
            const isExpanded = expandedProducts.has(product.productId);
            return (
              <div key={product.productId} className="product-history-card">
                <div
                  className="product-compact-header"
                  onClick={() => toggleExpanded(product.productId)}
                >
                  <div className="product-basic-info">
                    <div className="product-id-badge">
                      <Package size={14} />
                      <span>{product.productId}</span>
                    </div>
                    <span className="product-name-compact">
                      {product.productName}
                    </span>
                  </div>

                  <div className="product-type-info">
                    {getTypeIcon(product.lastModificationType)}
                    <span className="type-label-compact">
                      {getTypeLabel(product.lastModificationType)}
                    </span>
                  </div>

                  <div className="expand-indicator">
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="product-details-expanded">
                    <div className="modifications-header">
                      <h4>
                        Historial de Modificaciones (
                        {product.modifications.length})
                      </h4>
                    </div>

                    <div className="modifications-list">
                      {product.modifications.map((modification, index) => (
                        <div
                          key={modification.id}
                          className="modification-item"
                        >
                          <div className="modification-header">
                            <div className="modification-type">
                              {getTypeIcon(modification.type)}
                              <span className="type-label">
                                {getTypeLabel(modification.type)}
                              </span>
                            </div>
                            <div className="modification-meta">
                              <div className="modification-date">
                                <Clock size={14} />
                                <span>{modification.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="modification-description">
                            {modification.description}
                          </p>
                          {index < product.modifications.length - 1 && (
                            <div className="modification-divider"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <Package size={48} className="no-results-icon" />
            <h3>No se encontraron resultados</h3>
            <p>
              No hay productos que coincidan con tu búsqueda o filtros
              seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;
