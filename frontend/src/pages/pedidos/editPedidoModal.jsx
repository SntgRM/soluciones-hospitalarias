import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import Select from "react-select";
import "./editPedidoModal.css"
import {
  updatePedido,
  getClientes,
  getTransportadoras,
  getVendedores,
  getAlistadores,
  getEmpacadores,
  getEnrutadores,
  getEstados,
} from "../../services/api.js";

const EditPedidoModal = ({ pedido, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para los datos de selección
  const [clientes, setClientes] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [alistadores, setAlistadores] = useState([]);
  const [empacadores, setEmpacadores] = useState([]);
  const [enrutadores, setEnrutadores] = useState([]);
  const [estados, setEstados] = useState([]);
    const clienteOptions = clientes.map((cliente, index) => {
        const value = cliente.id_cliente || cliente.id || cliente.cliente_id || index;
        const label = cliente.nombre_cliente || `Cliente ID: ${value}`;
        return { value, label };
    });
    console.log("Opciones de cliente:", clienteOptions);

  useEffect(() => {
    if (pedido && isOpen) {
      console.log("Pedido recibido en modal:", pedido);
      setFormData({
        id_factura: pedido.id_factura || "",
        id_cliente: pedido.id_cliente || "",
        ciudad: pedido.ciudad || "",
        valor: pedido.valor || "",
        id_transportadora: pedido.id_transportadora || "",
        id_estado: pedido.id_estado || "",
        fecha_recibido: pedido.fecha_recibido
          ? new Date(pedido.fecha_recibido).toISOString().split("T")[0]
          : "",
        fecha_enrutamiento: pedido.fecha_enrutamiento
          ? new Date(pedido.fecha_enrutamiento).toISOString().split("T")[0]
          : "",
        fecha_entrega: pedido.fecha_entrega
          ? new Date(pedido.fecha_entrega).toISOString().split("T")[0]
          : "",
        tipo_recaudo: pedido.tipo_recaudo || "",
        recaudo_efectivo: pedido.recaudo_efectivo || 0,
        recaudo_transferencia: pedido.recaudo_transferencia || 0,
        no_caja: pedido.no_caja || "",
        ubicacion: pedido.ubicacion || "",
        id_vendedor: pedido.id_vendedor || "",
        id_enrutador: pedido.id_enrutador || "",
        id_alistador: pedido.id_alistador || "",
        id_empacador: pedido.id_empacador || "",
        observacion: pedido.observacion || "",
      });

      // Cargar datos para los selects
      loadSelectData();
    }
  }, [pedido, isOpen]);

  const loadSelectData = async () => {
    setLoading(true);
    try {
      const [
        clientesData,
        transportadorasData,
        vendedoresData,
        alistadoresData,
        empacadoresData,
        enrutadoresData,
        estadosData,
      ] = await Promise.all([
        getClientes(),
        getTransportadoras(),
        getVendedores(),
        getAlistadores(),
        getEmpacadores(),
        getEnrutadores(),
        getEstados(),
      ]);

      console.log("Datos cargados:", {
        clientes: clientesData,
        transportadoras: transportadorasData,
        vendedores: vendedoresData,
        alistadores: alistadoresData,
        empacadores: empacadoresData,
        enrutadores: enrutadoresData,
        estados: estadosData,
      });

      // Manejar diferentes estructuras de respuesta
      setClientes(
        Array.isArray(clientesData)
          ? clientesData
          : clientesData?.results || clientesData?.data || []
      );
      setTransportadoras(
        Array.isArray(transportadorasData)
          ? transportadorasData
          : transportadorasData?.results || transportadorasData?.data || []
      );
      setVendedores(
        Array.isArray(vendedoresData)
          ? vendedoresData
          : vendedoresData?.results || vendedoresData?.data || []
      );
      setAlistadores(
        Array.isArray(alistadoresData)
          ? alistadoresData
          : alistadoresData?.results || alistadoresData?.data || []
      );
      setEmpacadores(
        Array.isArray(empacadoresData)
          ? empacadoresData
          : empacadoresData?.results || empacadoresData?.data || []
      );
      setEnrutadores(
        Array.isArray(enrutadoresData)
          ? enrutadoresData
          : enrutadoresData?.results || enrutadoresData?.data || []
      );
      setEstados(
        Array.isArray(estadosData)
          ? estadosData
          : estadosData?.results || estadosData?.data || []
      );
    } catch (error) {
      console.error("Error cargando datos para selects:", error);
      alert("Error cargando datos para los formularios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log("Datos del formulario antes de enviar:", formData);
      console.log("ID del pedido:", pedido.id_factura);

      // Campos que no deben ser modificados pero sí enviados
      const readOnlyFields = ["id_factura"];

      // Preparar datos para envío - incluir campos de solo lectura y campos que han cambiado
      const dataToSend = {};

      // Primero, agregar campos de solo lectura
      readOnlyFields.forEach((field) => {
        if (formData[field]) {
          dataToSend[field] = formData[field];
        }
      });

      // Luego, comparar cada campo y solo incluir los que han cambiado
      Object.keys(formData).forEach((key) => {
        // Saltar campos de solo lectura ya que ya los agregamos
        if (readOnlyFields.includes(key)) {
          return;
        }

        const newValue = formData[key];
        const originalValue = pedido[key];

        // Convertir fechas para comparación
        if (key.includes("fecha") && originalValue) {
          const originalDate = new Date(originalValue)
            .toISOString()
            .split("T")[0];
          if (newValue !== originalDate) {
            dataToSend[key] = newValue ? `${newValue}T00:00:00Z` : null;
          }
        } else if (key.includes("fecha") && !originalValue && newValue) {
          // Si no había fecha original pero ahora sí hay una
          dataToSend[key] = `${newValue}T00:00:00Z`;
        } else if (newValue !== originalValue) {
          // Para otros campos, incluir si son diferentes
          if (newValue === "" || newValue === 0) {
            // Solo enviar null si el valor original no era vacío
            if (
              originalValue !== "" &&
              originalValue !== 0 &&
              originalValue !== null
            ) {
              dataToSend[key] = null;
            }
          } else {
            dataToSend[key] = newValue;
          }
        }
      });

      console.log("Datos a enviar (solo campos modificados):", dataToSend);

      // Si no hay cambios, mostrar mensaje y salir
      if (Object.keys(dataToSend).length === 0) {
        alert("No se detectaron cambios en el pedido");
        onClose();
        return;
      }

      const updatedPedido = await updatePedido(pedido.id_factura, dataToSend);
      console.log("Pedido actualizado:", updatedPedido);

      // Llamar al callback para actualizar la lista
      if (onUpdate) {
        onUpdate(updatedPedido);
      }

      alert("Pedido actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error completo al actualizar pedido:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error message:", error.message);

      let errorMessage = "Error desconocido al actualizar el pedido";

      if (error.response?.data) {
        // Si hay detalles específicos del error
        const errorData = error.response.data;
        console.log("Procesando errorData:", errorData);

        if (typeof errorData === "object") {
          const fieldErrors = Object.entries(errorData)
            .map(([field, messages]) => {
              let messageArray;
              if (Array.isArray(messages)) {
                messageArray = messages;
              } else if (typeof messages === "string") {
                messageArray = [messages];
              } else {
                messageArray = [JSON.stringify(messages)];
              }
              return `• ${field}: ${messageArray.join(", ")}`;
            })
            .join("\n");
          errorMessage = `Errores de validación:\n${fieldErrors}`;
        } else {
          errorMessage = errorData.toString();
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error al actualizar el pedido:\n${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Editar Pedido #{pedido?.id_factura}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="modal-loading">
            <Loader size={24} className="spinner" />
            <p>Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-section">
              <h3>Información Básica</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="id_factura">ID Factura:</label>
                  <input
                    type="text"
                    id="id_factura"
                    name="id_factura"
                    value={formData.id_factura}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

            <div className="form-group">
            <label htmlFor="id_cliente">Cliente:</label>
            <Select
                id="id_cliente"
                name="id_cliente"
                options={clienteOptions}
                placeholder="Seleccionar cliente"
                isClearable
                value={clienteOptions.find(option => option.value === formData.id_cliente) || null}
                onChange={(selectedOption) =>
                setFormData((prev) => ({
                    ...prev,
                    id_cliente: selectedOption ? selectedOption.value : "",
                }))
                }
            />
            </div>

                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad:</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="valor">Valor Total:</label>
                  <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Estado y Transporte</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="id_estado">Estado:</label>
                  <select
                    id="id_estado"
                    name="id_estado"
                    value={formData.id_estado}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar estado</option>
                    {estados.map((estado, index) => {
                      const estadoId =
                        estado.id ||
                        estado.id_estado ||
                        estado.estado_id ||
                        index;
                      const estadoNombre =
                        estado.nombre ||
                        estado.name ||
                        estado.nombres ||
                        estado.estado_nombre ||
                        estado.descripcion ||
                        `Estado ID: ${estadoId}`;

                      return (
                        <option key={`estado-${estadoId}`} value={estadoId}>
                          {estadoNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="id_transportadora">Transportadora:</label>
                  <select
                    id="id_transportadora"
                    name="transportadora_nombre"
                    value={formData.transportadora_nombre}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar transportadora</option>
                    {transportadoras.map((transportadora, index) => {
                      const transportadoraId =
                        transportadora.id ||
                        transportadora.id_transportadora ||
                        transportadora.transportadora_id ||
                        index;
                      const transportadoraNombre =
                        transportadora.nombre ||
                        transportadora.name ||
                        transportadora.nombres ||
                        transportadora.transportadora_nombre ||
                        transportadora.razon_social ||
                        `Transportadora ID: ${transportadoraId}`;

                      return (
                        <option
                          key={`transportadora-${transportadoraId}`}
                          value={transportadoraId}
                        >
                          {transportadoraNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Información de Recaudo</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="tipo_recaudo">Tipo Recaudo:</label>
                  <select
                    id="tipo_recaudo"
                    name="tipo_recaudo"
                    value={formData.tipo_recaudo}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">
                      Transferencia
                    </option>
                    <option value="Efectivo_transferencia">Efectivo y Transferencia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="recaudo_efectivo">Recaudo Efectivo:</label>
                  <input
                    type="number"
                    id="recaudo_efectivo"
                    name="recaudo_efectivo"
                    value={formData.recaudo_efectivo}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recaudo_transferencia">
                    Recaudo Transferencia:
                  </label>
                  <input
                    type="number"
                    id="recaudo_transferencia"
                    name="recaudo_transferencia"
                    value={formData.recaudo_transferencia}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="no_caja">No. Caja:</label>
                  <input
                    type="text"
                    id="no_caja"
                    name="no_caja"
                    value={formData.no_caja}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Personal Involucrado</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="id_vendedor">Vendedor:</label>
                  <select
                    id="id_vendedor"
                    name="id_vendedor"
                    value={formData.id_vendedor}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar vendedor</option>
                    {vendedores.map((vendedor, index) => {
                      const vendedorId =
                        vendedor.id ||
                        vendedor.id_vendedor ||
                        vendedor.vendedor_id ||
                        index;
                      const vendedorNombre =
                        vendedor.nombre ||
                        vendedor.name ||
                        vendedor.nombres ||
                        vendedor.vendedor_nombre ||
                        vendedor.nombre_completo ||
                        `Vendedor ID: ${vendedorId}`;

                      return (
                        <option
                          key={`vendedor-${vendedorId}`}
                          value={vendedorId}
                        >
                          {vendedorNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="id_enrutador">Enrutador:</label>
                  <select
                    id="id_enrutador"
                    name="id_enrutador"
                    value={formData.id_enrutador}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar enrutador</option>
                    {enrutadores.map((enrutador, index) => {
                      const enrutadorId =
                        enrutador.id ||
                        enrutador.id_enrutador ||
                        enrutador.enrutador_id ||
                        index;
                      const enrutadorNombre =
                        enrutador.nombre ||
                        enrutador.name ||
                        enrutador.nombres ||
                        enrutador.enrutador_nombre ||
                        enrutador.nombre_completo ||
                        `Enrutador ID: ${enrutadorId}`;

                      return (
                        <option
                          key={`enrutador-${enrutadorId}`}
                          value={enrutadorId}
                        >
                          {enrutadorNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="id_alistador">Alistador:</label>
                  <select
                    id="id_alistador"
                    name="id_alistador"
                    value={formData.id_alistador}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar alistador</option>
                    {alistadores.map((alistador, index) => {
                      const alistadorId =
                        alistador.id ||
                        alistador.id_alistador ||
                        alistador.alistador_id ||
                        index;
                      const alistadorNombre =
                        alistador.nombre ||
                        alistador.name ||
                        alistador.nombres ||
                        alistador.alistador_nombre ||
                        alistador.nombre_completo ||
                        `Alistador ID: ${alistadorId}`;

                      return (
                        <option
                          key={`alistador-${alistadorId}`}
                          value={alistadorId}
                        >
                          {alistadorNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="id_empacador">Empacador:</label>
                  <select
                    id="id_empacador"
                    name="id_empacador"
                    value={formData.id_empacador}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar empacador</option>
                    {empacadores.map((empacador, index) => {
                      const empacadorId =
                        empacador.id ||
                        empacador.id_empacador ||
                        empacador.empacador_id ||
                        index;
                      const empacadorNombre =
                        empacador.nombre ||
                        empacador.name ||
                        empacador.nombres ||
                        empacador.empacador_nombre ||
                        empacador.nombre_completo ||
                        `Empacador ID: ${empacadorId}`;

                      return (
                        <option
                          key={`empacador-${empacadorId}`}
                          value={empacadorId}
                        >
                          {empacadorNombre}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Ubicación y Observaciones</h3>
              <div className="form-group">
                <label htmlFor="ubicacion">Ubicación:</label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  placeholder="Coordenadas o dirección"
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacion">Observaciones:</label>
                <textarea
                  id="observacion"
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>

            <div className="modal-actions">
              {/* <button
                type="button"
                className="btn-debug"
                onClick={() => {
                  console.log("=== DEBUG INFO COMPLETO ===");
                  console.log("Pedido original:", pedido);
                  console.log("FormData actual:", formData);
                  console.log("ID Cliente desde pedido:", pedido?.id_cliente);
                  console.log(
                    "ID Cliente desde formData:",
                    formData.id_cliente
                  );
                  console.log(
                    "Tipo recaudo desde pedido:",
                    pedido?.tipo_recaudo
                  );
                  console.log(
                    "Tipo recaudo desde formData:",
                    formData.tipo_recaudo
                  );
                  console.log("ID Factura desde pedido:", pedido?.id_factura);
                  console.log(
                    "ID Factura desde formData:",
                    formData.id_factura
                  );
                  console.log("Clientes cargados:", clientes);
                  console.log("Estados cargados:", estados);
                  console.log("Transportadoras cargadas:", transportadoras);

                  // Simular lo que se enviaría
                  const readOnlyFields = ["id_factura"];
                  const testDataToSend = {};

                  readOnlyFields.forEach((field) => {
                    if (formData[field]) {
                      testDataToSend[field] = formData[field];
                    }
                  });

                  Object.keys(formData).forEach((key) => {
                    if (readOnlyFields.includes(key)) return;
                    const newValue = formData[key];
                    const originalValue = pedido[key];
                    if (newValue !== originalValue) {
                      testDataToSend[key] = newValue;
                    }
                  });

                  console.log("Datos que se enviarían:", testDataToSend);
                  console.log("===============================");
                }}
              >
                Debug
              </button> */}
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? (
                  <>
                    <Loader size={16} className="spinner" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPedidoModal;
