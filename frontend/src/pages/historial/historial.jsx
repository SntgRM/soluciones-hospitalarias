"use client"

import { useState, useContext } from "react"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { parse } from "date-fns"
import "./Historial.css"
import { SidebarContext } from "../../context/sidebarContext"
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash,
  Settings,
  ArrowUpToLine,
  Package,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Datos de ejemplo agrupados por producto
const sampleHistoryByProduct = [
  {
    productId: "PROD-001",
    productName: "Paracetamol 500mg",
    lastModificationType: "edicion",
    modifications: [
      {
        id: 1,
        type: "edicion",
        date: "2024-07-17 11:15 AM",
        description: "Se actualizó el precio de $2.500 a $2.800",
        user: "María García",
      },
      {
        id: 2,
        type: "edicion",
        date: "2024-07-16 03:45 PM",
        description: "Se modificó el stock disponible de 150 a 200 unidades",
        user: "Pedro López",
      },
      {
        id: 3,
        type: "creacion",
        date: "2024-07-15 10:30 AM",
        description: "Producto creado en el sistema",
        user: "Juan Pérez",
      },
      {
        id: 4,
        type: "edicion",
        date: "2024-07-14 02:00 PM",
        description: "Se actualizó la descripción del producto",
        user: "Ana Fernández",
      },
    ],
  },
  {
    productId: "PROD-002",
    productName: "Ibuprofeno 400mg",
    lastModificationType: "eliminacion",
    modifications: [
      {
        id: 5,
        type: "eliminacion",
        date: "2024-07-17 09:00 AM",
        description: "Se eliminó del catálogo por vencimiento",
        user: "Admin",
      },
      {
        id: 6,
        type: "edicion",
        date: "2024-07-16 08:50 AM",
        description: "Se actualizó la fecha de vencimiento",
        user: "Carlos Giraldo",
      },
      {
        id: 7,
        type: "edicion",
        date: "2024-07-15 07:20 AM",
        description: "Se modificó el proveedor principal",
        user: "Luis Martínez",
      },
    ],
  },
  {
    productId: "PROD-003",
    productName: "Amoxicilina 250mg",
    lastModificationType: "creacion",
    modifications: [
      {
        id: 8,
        type: "creacion",
        date: "2024-07-16 03:00 PM",
        description: "Nuevo producto registrado en inventario",
        user: "Paola Jiménez",
      },
      {
        id: 9,
        type: "edicion",
        date: "2024-07-15 04:30 PM",
        description: "Se estableció el precio inicial en $3.200",
        user: "María García",
      },
      {
        id: 10,
        type: "general",
        date: "2024-07-14 01:45 PM",
        description: "Producto aprobado por control de calidad",
        user: "Admin",
      },
    ],
  },
  {
    productId: "PROD-004",
    productName: "Aspirina 100mg",
    lastModificationType: "edicion",
    modifications: [
      {
        id: 11,
        type: "edicion",
        date: "2024-07-17 02:15 PM",
        description: "Se actualizó el stock mínimo de 50 a 75 unidades",
        user: "Juan Pérez",
      },
      {
        id: 12,
        type: "edicion",
        date: "2024-07-16 11:30 AM",
        description: "Se modificó la ubicación en almacén",
        user: "Pedro López",
      },
    ],
  },
  {
    productId: "PROD-005",
    productName: "Loratadina 10mg",
    lastModificationType: "creacion",
    modifications: [
      {
        id: 13,
        type: "creacion",
        date: "2024-07-17 08:45 AM",
        description: "Producto agregado al sistema de inventario",
        user: "Ana Fernández",
      },
    ],
  },
]

const filtroOpciones = [
  { value: "todos", label: "Todos", icon: <ClipboardList size={16} color="black" /> },
  { value: "creacion", label: "Creaciones", icon: <Plus size={16} color="black" /> },
  { value: "edicion", label: "Ediciones", icon: <Pencil size={16} color="black" /> },
  { value: "eliminacion", label: "Eliminaciones", icon: <Trash size={16} color="black" /> },
  { value: "general", label: "Eventos Generales", icon: <Settings size={16} color="black" /> },
]

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    color: "#000000",
    borderRadius: "8px",
    minWidth: "240px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000000",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f0f0f0" : "#ffffff",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff",
  }),
}

const getTypeIcon = (type) => {
  switch (type) {
    case "creacion":
      return <Plus size={16} className="type-icon creation" />
    case "edicion":
      return <Pencil size={16} className="type-icon edition" />
    case "eliminacion":
      return <Trash size={16} className="type-icon deletion" />
    case "general":
      return <Settings size={16} className="type-icon general" />
    default:
      return <ClipboardList size={16} className="type-icon" />
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case "creacion":
      return "Creación"
    case "edicion":
      return "Edición"
    case "eliminacion":
      return "Eliminación"
    case "general":
      return "General"
    default:
      return "Actividad"
  }
}

const Historial = () => {
  const [filtro, setFiltro] = useState("todos")
  const { isSidebarOpen } = useContext(SidebarContext)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [expandedProducts, setExpandedProducts] = useState(new Set())

  const filteredHistory = sampleHistoryByProduct
    .map((product) => ({
      ...product,
      modifications: product.modifications.filter((item) => {
        const tipoCoincide = filtro === "todos" || item.type === filtro
        const itemDate = parse(item.date, "yyyy-MM-dd hh:mm a", new Date())
        const dentroDelRango = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate)
        return tipoCoincide && dentroDelRango
      }),
    }))
    .filter((product) => product.modifications.length > 0)

  const toggleExpanded = (productId) => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getMainContentClass = () => {
    let baseClass = "main-content-historial"
    if (window.innerWidth <= 420 && isSidebarOpen) {
      baseClass += " sidebar-visible"
    } else if (window.innerWidth <= 1200 && isSidebarOpen) {
      baseClass += " sidebar-collapsed"
    }
    return baseClass
  }

  return (
    <div className={getMainContentClass()}>
      <div className="historial-header">
        <h2 className="grid-c-title-text">Historial de Productos</h2>

        <Select
          value={filtroOpciones.find((opt) => opt.value === filtro)}
          onChange={(selectedOption) => setFiltro(selectedOption.value)}
          options={filtroOpciones.map((opt) => ({
            ...opt,
            label: (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {opt.icon}
                <span>{opt.label}</span>
              </div>
            ),
          }))}
          styles={customSelectStyles}
          isSearchable={false}
          aria-label="Filtrar historial por tipo"
        />

        <div className="filtro-fechas-container">
          <DatePicker
            className="filtro-datepicker"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Desde"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
          />

          <DatePicker
            className="filtro-datepicker"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Hasta"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
          />
        </div>
      </div>

      <div className="products-history-container">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((product) => {
            const isExpanded = expandedProducts.has(product.productId)
            return (
              <div key={product.productId} className="product-history-card">
                <div className="product-compact-header" onClick={() => toggleExpanded(product.productId)}>
                  <div className="product-basic-info">
                    <div className="product-id-badge">
                      <Package size={14} />
                      <span>{product.productId}</span>
                    </div>
                    <span className="product-name-compact">{product.productName}</span>
                  </div>

                  <div className="product-type-info">
                    {getTypeIcon(product.lastModificationType)}
                    <span className="type-label-compact">{getTypeLabel(product.lastModificationType)}</span>
                  </div>

                  <div className="expand-indicator">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="product-details-expanded">
                    <div className="modifications-header">
                      <h4>Historial de Modificaciones ({product.modifications.length})</h4>
                    </div>

                    <div className="modifications-list">
                      {product.modifications.map((modification, index) => (
                        <div key={modification.id} className="modification-item">
                          <div className="modification-header">
                            <div className="modification-type">
                              {getTypeIcon(modification.type)}
                              <span className="type-label">{getTypeLabel(modification.type)}</span>
                            </div>
                            <div className="modification-meta">
                              <div className="modification-date">
                                <Clock size={14} />
                                <span>{modification.date}</span>
                              </div>
                              <div className="modification-user">
                                <User size={14} />
                                <span>{modification.user}</span>
                              </div>
                            </div>
                          </div>
                          <p className="modification-description">{modification.description}</p>
                          {index < product.modifications.length - 1 && <div className="modification-divider"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="no-results">
            <Package size={48} className="no-results-icon" />
            <h3>No se encontraron productos</h3>
            <p>No hay productos con modificaciones para el filtro seleccionado.</p>
          </div>
        )}
      </div>

      <button
        className="btn-volver-arriba"
        onClick={volverArriba}
        aria-label="Volver al inicio de la página"
        title="Volver arriba"
      >
        <ArrowUpToLine size={24} color="black" />
      </button>
    </div>
  )
}

export default Historial
