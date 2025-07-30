"use client"

import { useState } from "react"
import "./Registro.css"
import {
  User,
  Package,
  Hash,
  Calendar,
  FileText,
  MapPin,
  Building,
  CheckCircle,
  Save,
  RotateCcw,
  DollarSign,
  Truck,
  CreditCard,
  Eye,
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
    // Campos adicionales según estado
    ciudad: "",
    vendedor: "",
    valor: "",
    no_caja: "",
    enrutador: "",
    alistado_por: "",
    empacado_por: "",
    transportadora: "",
    observacion: "",
    tipo_recaudo: "credito",
    recaudo_efectivo: "",
    recaudo_transferencia: "",
    codigo_empaque: "",
    repartidor: "",
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
        ciudad: "",
        vendedor: "",
        valor: "",
        no_caja: "",
        enrutador: "",
        alistado_por: "",
        empacado_por: "",
        transportadora: "",
        observacion: "",
        tipo_recaudo: "credito",
        recaudo_efectivo: "",
        recaudo_transferencia: "",
        codigo_empaque: "",
        repartidor: "",
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
      ciudad: "",
      vendedor: "",
      valor: "",
      no_caja: "",
      enrutador: "",
      alistado_por: "",
      empacado_por: "",
      transportadora: "",
      observacion: "",
      tipo_recaudo: "credito",
      recaudo_efectivo: "",
      recaudo_transferencia: "",
      codigo_empaque: "",
      repartidor: "",
      guia: "",
    })
  }

  // Función para determinar qué campos mostrar según el estado
  const getFieldsForState = (estado) => {
    switch (estado) {
      case "en_alistamiento":
        return ["ciudad", "vendedor", "valor"]
      case "en_reparto":
        return [
          "ciudad",
          "valor",
          "no_caja",
          "enrutador",
          "alistado_por",
          "empacado_por",
          "transportadora",
          "observacion",
        ]
      case "enviado_cliente":
        return [
          "ciudad",
          "valor",
          "tipo_recaudo",
          "no_caja",
          "enrutador",
          "alistado_por",
          "empacado_por",
          "transportadora",
          "observacion",
        ]
      case "enviado_transportadora":
        return [
          "ciudad",
          "valor",
          "tipo_recaudo",
          "no_caja",
          "enrutador",
          "alistado_por",
          "empacado_por",
          "transportadora",
          "observacion",
        ]
      case "anulado":
        return [
          "ciudad",
          "valor",
          "no_caja",
          "enrutador",
          "alistado_por",
          "empacado_por",
          "transportadora",
          "observacion",
        ]
      case "no_recibido":
        return ["ciudad", "valor", "recaudo_transferencia", "no_caja", "enrutador"]
      default:
        return []
    }
  }

  // Función para determinar qué campos de recaudo mostrar según el tipo
  const getRecaudoFields = () => {
    if (!["enviado_cliente", "enviado_transportadora"].includes(formData.estado)) {
      return []
    }

    switch (formData.tipo_recaudo) {
      case "efectivo":
        return ["recaudo_efectivo"]
      case "transferencia":
        return ["recaudo_transferencia"]
      case "efectivo_transferencia":
        return ["recaudo_efectivo", "recaudo_transferencia"]
      default:
        return []
    }
  }

  const requiredFields = getFieldsForState(formData.estado)
  const recaudoFields = getRecaudoFields()

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
      <div className="form-header" style={{ marginBottom: "8px" }}>
        <div className="header-icon" style={{ padding: "8px" }}>
          <Package size={24} />
        </div>
        <div className="header-content">
          <h2 className="form-title" style={{ fontSize: "1.25rem" }}>
            Registrar Nuevo Pedido
          </h2>
          <p className="form-subtitle">Complete la información del pedido para procesarlo</p>
        </div>
      </div>

      <form className="registro-form" onSubmit={handleSubmit}>
        <div className="form-grid" style={{ gap: "16px" }}>
          <div className="form-section-unified">
            {/* Campos básicos */}
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Cliente</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="cliente"
                    placeholder="Nombre completo"
                    value={formData.cliente}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Producto</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Package size={16} className="input-icon" />
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
                  <Hash size={16} className="input-icon" />
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
                    <option value="en_reparto">En Reparto</option>
                    <option value="enviado_cliente">Entregado al Cliente</option>
                    <option value="enviado_transportadora">Enviado a Transportadora</option>
                    <option value="anulado">Anulado</option>
                    <option value="no_recibido">Pedido No Recibido</option>
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

              <div className="input-group">
                <label className="input-label">
                  <span className="label-text">Fecha</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
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

            {/* Campos condicionales según el estado */}
            {requiredFields.length > 0 && (
              <div className="conditional-row">
                <div className="form-row">
                  {requiredFields.includes("ciudad") && (
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text">Ciudad</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <MapPin size={16} className="input-icon" />
                        <input
                          type="text"
                          name="ciudad"
                          placeholder="Ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}

                  {requiredFields.includes("vendedor") && (
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text">Vendedor</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <User size={16} className="input-icon" />
                        <input
                          type="text"
                          name="vendedor"
                          placeholder="Nombre del vendedor"
                          value={formData.vendedor}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}

                  {requiredFields.includes("valor") && (
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text">Valor</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <DollarSign size={16} className="input-icon" />
                        <input
                          type="number"
                          name="valor"
                          placeholder="0.00"
                          value={formData.valor}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tipo de recaudo para estados específicos */}
                {requiredFields.includes("tipo_recaudo") && (
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text">Tipo de Recaudo</span>
                        <span className="required">*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          name="tipo_recaudo"
                          value={formData.tipo_recaudo}
                          onChange={handleChange}
                          className="form-select"
                          required
                        >
                          <option value="credito">Crédito</option>
                          <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia</option>
                          <option value="efectivo_transferencia">Efectivo y Transferencia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campos de recaudo condicionales */}
                {recaudoFields.length > 0 && (
                  <div className="form-row">
                    {recaudoFields.includes("recaudo_efectivo") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Recaudo Efectivo</span>
                          <span className="required">*</span>
                        </label>
                        <div className="input-wrapper">
                          <DollarSign size={16} className="input-icon" />
                          <input
                            type="number"
                            name="recaudo_efectivo"
                            placeholder="0.00"
                            value={formData.recaudo_efectivo}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {recaudoFields.includes("recaudo_transferencia") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Recaudo Transferencia</span>
                          <span className="required">*</span>
                        </label>
                        <div className="input-wrapper">
                          <CreditCard size={16} className="input-icon" />
                          <input
                            type="number"
                            name="recaudo_transferencia"
                            placeholder="0.00"
                            value={formData.recaudo_transferencia}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(requiredFields.includes("no_caja") ||
                  requiredFields.includes("enrutador") ||
                  requiredFields.includes("alistado_por")) && (
                  <div className="form-row">
                    {requiredFields.includes("no_caja") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">No. Caja</span>
                          {["enviado_cliente", "enviado_transportadora", "no_recibido"].includes(formData.estado) && (
                            <span className="required">*</span>
                          )}
                        </label>
                        <div className="input-wrapper">
                          <Hash size={16} className="input-icon" />
                          <input
                            type="text"
                            name="no_caja"
                            placeholder="Número de caja"
                            value={formData.no_caja}
                            onChange={handleChange}
                            required={["enviado_cliente", "enviado_transportadora", "no_recibido"].includes(
                              formData.estado,
                            )}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {requiredFields.includes("enrutador") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Enrutador</span>
                          {["enviado_cliente", "enviado_transportadora", "no_recibido"].includes(formData.estado) && (
                            <span className="required">*</span>
                          )}
                        </label>
                        <div className="input-wrapper">
                          <Truck size={16} className="input-icon" />
                          <input
                            type="text"
                            name="enrutador"
                            placeholder="Nombre del enrutador"
                            value={formData.enrutador}
                            onChange={handleChange}
                            required={["enviado_cliente", "enviado_transportadora", "no_recibido"].includes(
                              formData.estado,
                            )}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {requiredFields.includes("alistado_por") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Alistado Por</span>
                        </label>
                        <div className="input-wrapper">
                          <User size={16} className="input-icon" />
                          <input
                            type="text"
                            name="alistado_por"
                            placeholder="Quien alistó"
                            value={formData.alistado_por}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(requiredFields.includes("empacado_por") || requiredFields.includes("transportadora")) && (
                  <div className="form-row">
                    {requiredFields.includes("empacado_por") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Empacado Por</span>
                        </label>
                        <div className="input-wrapper">
                          <User size={16} className="input-icon" />
                          <input
                            type="text"
                            name="empacado_por"
                            placeholder="Quien empacó"
                            value={formData.empacado_por}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {requiredFields.includes("transportadora") && (
                      <div className="input-group">
                        <label className="input-label">
                          <span className="label-text">Transportadora</span>
                        </label>
                        <div className="input-wrapper">
                          <Building size={16} className="input-icon" />
                          <input
                            type="text"
                            name="transportadora"
                            placeholder="Empresa transportadora"
                            value={formData.transportadora}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {requiredFields.includes("observacion") && (
                  <div className="form-row">
                    <div className="input-group full-width">
                      <label className="input-label">
                        <span className="label-text">Observación</span>
                      </label>
                      <div className="textarea-wrapper">
                        <Eye size={16} className="textarea-icon" />
                        <textarea
                          name="observacion"
                          placeholder="Observaciones específicas del estado..."
                          value={formData.observacion}
                          onChange={handleChange}
                          className="form-textarea"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-row">
              <div className="input-group full-width">
                <label className="input-label">
                  <span className="label-text">Notas</span>
                </label>
                <div className="textarea-wrapper">
                  <FileText size={16} className="textarea-icon" />
                  <textarea
                    name="notas"
                    placeholder="Información adicional..."
                    value={formData.notas}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions" style={{ marginTop: "16px", paddingTop: "16px" }}>
          <button type="button" onClick={handleReset} className="btn-secondary" disabled={isSubmitting}>
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
