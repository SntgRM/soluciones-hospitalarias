import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  AlertTriangle,
  ShieldQuestion,
  Send,
  Plus,
  ChevronLeft,
  ChevronRight,
  List,
  Trash2,
  X
} from "lucide-react";
import Select from "react-select";
import Swal from "sweetalert2";
import "./pqr.css";

const tipoData = [
  {
    key: "peticion",
    label: "Petición",
    icon: <MessageSquare size={18} color="#0ea5e9" />,
    color: "#e0f2fe",
    borderColor: "#0284c7",
  },
  {
    key: "queja",
    label: "Queja",
    icon: <AlertTriangle size={18} color="#f97316" />,
    color: "#fff7ed",
    borderColor: "#ea580c",
  },
  {
    key: "reclamo",
    label: "Reclamo",
    icon: <ShieldQuestion size={18} color="#facc15" />,
    color: "#fefce8",
    borderColor: "#ca8a04",
  },
];

const areaOptions = [
  { value: "ventas", label: "Ventas" },
  { value: "bodega", label: "Bodega" },
];

const PQRPage = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("peticion");
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
    area: null,
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAreaChange = (selectedOption) =>
    setFormData((prev) => ({ ...prev, area: selectedOption }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaSolicitud = {
      id: Date.now(),
      tipo: tipoSeleccionado,
      nombre: formData.nombre,
      correo: formData.correo,
      mensaje: formData.mensaje,
      area: formData.area?.label || "-",
      fechaCliente: new Date().toLocaleDateString(),
      cliente: "Cliente Ejemplo",
      persona: formData.nombre,
      resuelto: false,
      fechaBodega: "-",
      novedadBodega: "-",
    };
    setSolicitudes([nuevaSolicitud, ...solicitudes]);
    Swal.fire({
      icon: "success",
      title: "Enviado",
      text: `Tu ${tipoSeleccionado} ha sido enviada correctamente.`,
    });
    setFormData({ nombre: "", correo: "", mensaje: "", area: null });
    setShowModal(false);
  };

  const toggleResuelto = (id) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resuelto: !s.resuelto } : s))
    );
  };

  const openDetail = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowDetail(true);
  };

  const eliminarPeticion = (id) => {
    setSolicitudes((prev) => prev.filter((item) => item.id !== id));
  };

  const renderList = () => {
  const filtered = solicitudes.filter((s) => s.tipo === tipoSeleccionado);
  if (filtered.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        No hay solicitudes de tipo "
        {tipoData.find((t) => t.key === tipoSeleccionado)?.label}" aún.
      </div>
    );
  }
  return (
    <div className="pqr-list">
      {/* Encabezado */}
      <div className="pqr-list-header" style={{ fontSize: "14px", fontWeight: "bold" }}>
        {!isMobile && <div className="pqr-list-col">ID</div>}
        <div className="pqr-list-col">Nombre</div>
        {!isMobile && <div className="pqr-list-col">Área Responsable</div>}
        <div className="pqr-list-col">Resuelto</div>
        <div className="pqr-list-col" style={{ minWidth: "150px" }}>Acciones</div>
      </div>

      {/* Filas */}
      {filtered.map((s) => (
        <div
          key={s.id}
          className={`pqr-list-item ${s.resuelto ? "resuelto" : "no-resuelto"}`}
        >
          {!isMobile && <div className="pqr-list-col">{s.id}</div>}
          <div className="pqr-list-col">{s.nombre}</div>
          {!isMobile && <div className="pqr-list-col">{s.area}</div>}
          <div className="pqr-list-col">
            <input
              type="checkbox"
              checked={s.resuelto}
              onChange={() => toggleResuelto(s.id)}
            />
          </div>
          <div className="pqr-list-col" style={{ display: "flex", gap: "6px" }}>
            <button
              className="pqr-submit-btn effect-button"
              style={{ padding: "8px 8px" }}
              onClick={() => openDetail(s)}
            >
              <List size={18} />
            </button>
            <button
              className="pqr-cancel-btn effect-button"
              style={{ padding: "8px 8px", backgroundColor: "#c00303ff" }}
              onClick={() => {
                if (window.confirm("¿Seguro que deseas eliminar esta petición?")) {
                  eliminarPeticion(s.id);
                }
              }}
            >
              <Trash2 size={18} style={{ filter: 'invert(100%)' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


  return (
    <div className="pqr-main-container">
      {/* Sidebar */}
      <aside
        className={`pqr-sidebar ${
          sidebarMinimized && !isMobile ? "minimized" : ""
        }`}
      >
        <div className="pqr-sidebar-header">
          {(!sidebarMinimized || isMobile) && <h3>Tipos de Solicitud</h3>}
          {!isMobile && (
            <button
              className="pqr-minimize-btn"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
            >
              {sidebarMinimized ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
            
          )}
        </div>
        <ul className="pqr-filter-list">
          {tipoData.map((tipo) => (
            <li
              key={tipo.key}
              className={`pqr-filter-item ${
                tipoSeleccionado === tipo.key ? "active" : ""
              }`}
              style={{
                backgroundColor:
                  tipoSeleccionado === tipo.key ? tipo.color : "transparent",
                borderLeft:
                  tipoSeleccionado === tipo.key
                    ? `2px solid ${tipo.borderColor}`
                    : "2px solid transparent",
              }}
              onClick={() => setTipoSeleccionado(tipo.key)}
            >
              {tipo.icon}
              {(!sidebarMinimized || isMobile) && <span>{tipo.label}</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Section */}
      <section className="pqr-form-section">
        <div className="pqr-header">
          <h1 className="pqr-form-title">
            {tipoData.find((t) => t.key === tipoSeleccionado)?.label}
          </h1>
          <button className="pqr-submit-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nueva Solicitud
          </button>
        </div>
        {renderList()}
      </section>

      {/* Modal de creación */}
      {showModal && (
        <div
          className="pqr-modal"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="pqr-modal-content">
            <h2>
              Crear {tipoData.find((t) => t.key === tipoSeleccionado)?.label}
            </h2>
            <form className="pqr-form" onSubmit={handleSubmit}>
              <div className="pqr-field">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pqr-field">
                <label htmlFor="correo">Correo *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pqr-field">
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pqr-field">
                <label>Área Responsable</label>
                <Select
                  options={areaOptions}
                  value={formData.area}
                  onChange={handleAreaChange}
                />
              </div>
              <div className="pqr-modal-actions">
                <button
                  type="button"
                  className="pqr-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="pqr-submit-btn">
                  <Send size={16} /> Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal lateral de detalles */}
      {showDetail && selectedSolicitud && (
        <div className="pqr-side-modal">
          <div className="pqr-side-content">
            <button
              className="pqr-detail-close-btn"
              onClick={() => setShowDetail(false)}
            >
              <X />
            </button>
            <h2>Información de la Solicitud</h2>
            <div className="pqr-detail-item">
              <span className="pqr-detail-label">ID de Solicitud</span>
              <span className="pqr-detail-value">#{selectedSolicitud.id}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Tipo de Solicitud</span>
              <span className="pqr-detail-value">
                {tipoData.find(t => t.key === selectedSolicitud.tipo)?.label || selectedSolicitud.tipo}
              </span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Nombre del Solicitante</span>
              <span className="pqr-detail-value">{selectedSolicitud.nombre}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Correo Electrónico</span>
              <span className="pqr-detail-value">{selectedSolicitud.correo}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Área Responsable</span>
              <span className="pqr-detail-value">{selectedSolicitud.area}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Fecha de Creación</span>
              <span className="pqr-detail-value">{selectedSolicitud.fechaCliente}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Estado</span>
              <span className={`pqr-detail-value ${selectedSolicitud.resuelto ? 'status-resolved' : 'status-pending'}`}>
                {selectedSolicitud.resuelto ? '✓ Resuelto' : '⏳ Pendiente'}
              </span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Mensaje</span>
              <span className="pqr-detail-value">{selectedSolicitud.mensaje}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Fecha de Bodega</span>
              <span className="pqr-detail-value">{selectedSolicitud.fechaBodega}</span>
            </div>

            <div className="pqr-detail-item">
              <span className="pqr-detail-label">Novedad de Bodega</span>
              <span className="pqr-detail-value">{selectedSolicitud.novedadBodega}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PQRPage;
