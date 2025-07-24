"use client"

import { useState } from "react"
import "./Registro.css"
import {
  User,
  Package,
  Hash,
  Calendar,
  AlertCircle,
  FileText,
  Truck,
  MapPin,
  Building,
  Receipt,
  CheckCircle,
  Save,
  RotateCcw,
} from "lucide-react"

function RegistroPedido() {
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    cantidad: "",
    fecha: "",
    estado: "en_alistamiento",
    prioridad: "media",
    notas: "",
    codigo_empaque: "",
    repartidor: "",
    transportadora: "",
    guia: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Pedido registrado:", formData)
    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Resetear después de 2 segundos
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        cliente: "",
        producto: "",
        cantidad: "",
        fecha: "",
        estado: "en_alistamiento",
        prioridad: "media",
        notas: "",
        codigo_empaque: "",
        repartidor: "",
        transportadora: "",
        guia: "",
      })
    }, 2000)
  }

  const handleReset = () => {
    setFormData({
      cliente: "",
      producto: "",
      cantidad: "",
      fecha: "",
      estado: "en_alistamiento",
      prioridad: "media",
      notas: "",
      codigo_empaque: "",
      repartidor: "",
      transportadora: "",
      guia: "",
    })
  }

  // const getEstadoColor = (estado) => {
  //   switch (estado) {
  //     case "en_alistamiento":
  //       return "#f59e0b"
  //     case "en_proceso":
  //       return "#3b82f6"
  //     case "empacado":
  //       return "#8b5cf6"
  //     case "en_reparto":
  //       return "#06b6d4"
  //     case "enviado_cliente":
  //       return "#10b981"
  //     case "enviado_transportadora":
  //       return "#ef4444"
  //     default:
  //       return "#6b7280"
  //   }
  // }

  // const getPrioridadColor = (prioridad) => {
  //   switch (prioridad) {
  //     case "alta":
  //       return "#ef4444"
  //     case "media":
  //       return "#f59e0b"
  //     case "baja":
  //       return "#10b981"
  //     default:
  //       return "#6b7280"
  //   }
  // }

  if (submitSuccess) {
    return (
      <div className="registro-container">
        <div className="success-message">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>¡Pedido Registrado Exitosamente!</h2>
          <p>El pedido ha sido guardado en el sistema correctamente.</p>
          <div className="success-animation"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="registro-container">
      <div className="form-header">
        <div className="header-icon">
          <Package size={32} />
        </div>
        <div className="header-content">
          <h2 className="form-title">Registrar Nuevo Pedido</h2>
          <p className="form-subtitle">Complete la información del pedido para procesarlo</p>
        </div>
      </div>

      <form className="registro-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Información del Cliente */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} />
              Información del Cliente
            </h3>

            <div className="input-group">
              <label className="input-label">
                <span className="label-text">Nombre del Cliente</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="cliente"
                  placeholder="Ingrese el nombre completo"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Información del Producto */}
          <div className="form-section">
            <h3 className="section-title">
              <Package size={20} />
              Información del Producto
            </h3>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Producto</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Package size={18} className="input-icon" />
                  <input
                    type="text"
                    name="producto"
                    placeholder="Nombre del producto"
                    value={formData.producto}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Cantidad</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Hash size={18} className="input-icon" />
                  <input
                    type="number"
                    name="cantidad"
                    placeholder="0"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Prioridad */}
          <div className="form-section">
            <h3 className="section-title">
              <AlertCircle size={20} />
              Estado y Prioridad
            </h3>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Estado</span>
                </label>
                <div className="select-wrapper">
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="en_alistamiento">En Alistamiento</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="empacado">Empacado</option>
                    <option value="en_reparto">En Reparto</option>
                    <option value="enviado_cliente">Enviado al Cliente</option>
                    <option value="enviado_transportadora">Enviado en Transportadora</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Prioridad</span>
                </label>
                <div className="select-wrapper">
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-text">Fecha</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Campos condicionales */}
          {formData.estado === "empacado" && (
            <div className="form-section conditional-section">
              <h3 className="section-title">
                <Receipt size={20} />
                Información de Empaque
              </h3>
              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Código de Empaque</span>
                </label>
                <div className="input-wrapper">
                  <Receipt size={18} className="input-icon" />
                  <input
                    type="text"
                    name="codigo_empaque"
                    placeholder="Ej: EMP12345"
                    value={formData.codigo_empaque}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.estado === "en_reparto" && (
            <div className="form-section conditional-section">
              <h3 className="section-title">
                <Truck size={20} />
                Información de Reparto
              </h3>
              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Nombre del Repartidor</span>
                </label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="repartidor"
                    placeholder="Nombre del repartidor"
                    value={formData.repartidor}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.estado === "enviado_transportadora" && (
            <div className="form-section conditional-section">
              <h3 className="section-title">
                <Building size={20} />
                Información de Transportadora
              </h3>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-text">Transportadora</span>
                  </label>
                  <div className="input-wrapper">
                    <Building size={18} className="input-icon" />
                    <input
                      type="text"
                      name="transportadora"
                      placeholder="Nombre de la empresa"
                      value={formData.transportadora}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-text">Número de Guía</span>
                  </label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      name="guia"
                      placeholder="Código de seguimiento"
                      value={formData.guia}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          <div className="form-section">
            <h3 className="section-title">
              <FileText size={20} />
              Notas Adicionales
            </h3>
            <div className="input-group">
              <label className="input-label">
                <span className="label-text">Notas</span>
              </label>
              <div className="textarea-wrapper">
                <FileText size={18} className="textarea-icon" />
                <textarea
                  name="notas"
                  placeholder="Agregue cualquier información adicional sobre el pedido..."
                  value={formData.notas}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-secondary-registro" disabled={isSubmitting}>
            <RotateCcw size={18} />
            Limpiar Formulario
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Registrando...
              </>
            ) : (
              <>
                <Save size={18} />
                Registrar Pedido
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegistroPedido
