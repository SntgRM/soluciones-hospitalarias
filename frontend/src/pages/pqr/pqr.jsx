import React, { useState, useEffect } from "react";
import { MessageSquare, AlertTriangle, ShieldQuestion, Send, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
    };
    
    handleResize(); // Ejecutar al inicio
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAreaChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, area: selectedOption }));
  };

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
      resuelto: "No",
      fechaBodega: "-",
      novedadBodega: "-",
    };

    setSolicitudes([nuevaSolicitud, ...solicitudes]);

    Swal.fire({
      icon: "success",
      title: "Enviado",
      text: `Tu ${tipoSeleccionado} ha sido enviada correctamente.`,
    });

    setFormData({
      nombre: "",
      correo: "",
      mensaje: "",
      area: null,
    });

    setShowModal(false);
  };

  const renderTable = () => {
    const filteredSolicitudes = solicitudes.filter((s) => s.tipo === tipoSeleccionado);
    
    if (filteredSolicitudes.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          No hay solicitudes de tipo "{tipoData.find((t) => t.key === tipoSeleccionado)?.label}" aún.
        </div>
      );
    }

    return (
      <div className="pqr-table-wrapper">
        <table className="pqr-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha Cliente</th>
              <th>Persona</th>
              <th>Área Responsable</th>
              <th>Cliente</th>
              <th>Novedad Cliente</th>
              <th>¿Resuelto?</th>
              <th>Fecha Bodega</th>
              <th>Novedad Bodega</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolicitudes.map((s) => (
              <tr key={s.id}>
                <td data-label="ID">{s.id}</td>
                <td data-label="Fecha Cliente">{s.fechaCliente}</td>
                <td data-label="Persona">{s.persona}</td>
                <td data-label="Área Responsable">{s.area}</td>
                <td data-label="Cliente">{s.cliente}</td>
                <td data-label="Novedad Cliente">{s.mensaje}</td>
                <td data-label="¿Resuelto?">{s.resuelto}</td>
                <td data-label="Fecha Bodega">{s.fechaBodega}</td>
                <td data-label="Novedad Bodega">{s.novedadBodega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="pqr-main-container">
      <aside className={`pqr-sidebar ${sidebarMinimized && !isMobile ? "minimized" : ""}`}>
        <div className="pqr-sidebar-header">
          {(!sidebarMinimized || isMobile) && <h2>Tipos de Solicitud</h2>}
          {!isMobile && (
            <button
              className="pqr-minimize-btn"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              title={sidebarMinimized ? "Expandir" : "Minimizar"}
            >
              {sidebarMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <ul className="pqr-filter-list">
          {tipoData.map((tipo) => (
            <li
              key={tipo.key}
              className={`pqr-filter-item ${tipoSeleccionado === tipo.key ? "active" : ""}`}
              style={{
                backgroundColor:
                  tipoSeleccionado === tipo.key ? tipo.color : "transparent",
                borderLeft:
                  tipoSeleccionado === tipo.key
                    ? `2px solid ${tipo.borderColor}`
                    : "2px solid transparent",
              }}
              onClick={() => setTipoSeleccionado(tipo.key)}
              title={tipo.label}
            >
              {tipo.icon}
              {(!sidebarMinimized || isMobile) && <span>{tipo.label}</span>}
            </li>
          ))}
        </ul>
      </aside>

      <section className="pqr-form-section" style={{ minWidth: 0 }}>
        <div className="pqr-header">
          <h1 className="pqr-form-title">
            {tipoData.find((t) => t.key === tipoSeleccionado)?.label}
          </h1>
          <button className="pqr-submit-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nueva Solicitud
          </button>
        </div>

        {renderTable()}
      </section>

      {/* Modal */}
      {showModal && (
        <div 
          className="pqr-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="pqr-modal-content">
            <h2>Crear {tipoData.find((t) => t.key === tipoSeleccionado)?.label}</h2>
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
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              <div className="pqr-field">
                <label htmlFor="correo">Correo electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@correo.com"
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
                  placeholder="Describe detalladamente tu solicitud..."
                  rows={4}
                />
              </div>
              <div className="pqr-field">
                <label>Área Responsable</label>
                <Select
                  options={areaOptions}
                  value={formData.area}
                  onChange={handleAreaChange}
                  placeholder="Seleccione un área"
                  classNamePrefix="pqr-select"
                  isClearable
                  isSearchable={false}
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
    </div>
  );
};

export default PQRPage;
