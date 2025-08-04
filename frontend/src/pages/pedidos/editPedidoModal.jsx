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

  // Opciones para react-select
  const clienteOptions = clientes.map((cliente, index) => {
    const value = cliente.id_cliente || cliente.id || cliente.cliente_id || index;
    const label = cliente.nombre_cliente || `Cliente ID: ${value}`;
    return { value, label };
  });

  const transportadoraOptions = transportadoras.map((transportadora, index) => {
    const value = transportadora.id || transportadora.id_transportadora || transportadora.transportadora_id || index;
    const label = transportadora.nombre || transportadora.name || transportadora.nombres || 
                 transportadora.transportadora_nombre || transportadora.razon_social || `Transportadora ID: ${value}`;
    return { value, label };
  });

  const estadoOptions = estados.map((estado, index) => {
    const value = estado.id || estado.id_estado || estado.estado_id || index;
    const label = estado.nombre || estado.name || estado.nombres || 
                 estado.estado_nombre || estado.descripcion || `Estado ID: ${value}`;
    return { value, label };
  });

  const vendedorOptions = vendedores.map((vendedor, index) => {
    const value = vendedor.id || vendedor.id_vendedor || vendedor.vendedor_id || index;
    const label = vendedor.nombre || vendedor.name || vendedor.nombres || 
                 vendedor.vendedor_nombre || vendedor.nombre_completo || `Vendedor ID: ${value}`;
    return { value, label };
  });

  const enrutadorOptions = enrutadores.map((enrutador, index) => {
    const value = enrutador.id || enrutador.id_enrutador || enrutador.enrutador_id || index;
    const label = enrutador.nombre || enrutador.name || enrutador.nombres || 
                 enrutador.enrutador_nombre || enrutador.nombre_completo || `Enrutador ID: ${value}`;
    return { value, label };
  });

  const alistadorOptions = alistadores.map((alistador, index) => {
    const value = alistador.id || alistador.id_alistador || alistador.alistador_id || index;
    const label = alistador.nombre || alistador.name || alistador.nombres || 
                 alistador.alistador_nombre || alistador.nombre_completo || `Alistador ID: ${value}`;
    return { value, label };
  });

  const empacadorOptions = empacadores.map((empacador, index) => {
    const value = empacador.id || empacador.id_empacador || empacador.empacador_id || index;
    const label = empacador.nombre || empacador.name || empacador.nombres || 
                 empacador.empacador_nombre || empacador.nombre_completo || `Empacador ID: ${value}`;
    return { value, label };
  });

const tipoRecaudoOptions = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Transferencia', label: 'Transferencia' },
  { value: 'efectivo y transferencia', label: 'efectivo y transferencia' },
  { value: 'Sin registro', label: 'Sin registro' }
];


  // Estilos personalizados para react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '40px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(4, 153, 36, 0.25)' : 'none',
      borderColor: state.isFocused ? '#049924' : '#ddd',
      '&:hover': {
        borderColor: state.isFocused ? '#049924' : '#ddd'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#049924' 
        : state.isFocused 
          ? '#f8f9fa' 
          : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:hover': {
        backgroundColor: state.isSelected ? '#049924' : '#f8f9fa'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333'
    })
  };
  useEffect(() => {
    if (pedido && isOpen) {
      setFormData({
        id_factura: pedido.id_factura || "",
        id_cliente: pedido.id_cliente || "",
        ciudad: pedido.ciudad || "",
        valor: pedido.valor || "",
        id_transportadora: pedido.id_transportadora || "",
        id_estado: pedido.id_estado || "",
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

  const handleSelectChange = (fieldName, selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [fieldName]: selectedValue,
      };

      // Si se cambia el tipo de recaudo a "efectivo y transferencia", calcular el valor total
      if (fieldName === "tipo_recaudo" && selectedValue === "efectivo y transferencia") {
        const efectivo = prev.recaudo_efectivo || 0;
        const transferencia = prev.recaudo_transferencia || 0;
        newFormData.valor = efectivo + transferencia;
      }

      return newFormData;
    });
  };

  const handleRecaudoChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: numericValue,
      };

      // Si el tipo de recaudo es "efectivo y transferencia", actualizar el valor total automáticamente
      if (prev.tipo_recaudo === "efectivo y transferencia") {
        const efectivo = name === "recaudo_efectivo" ? numericValue : (prev.recaudo_efectivo || 0);
        const transferencia = name === "recaudo_transferencia" ? numericValue : (prev.recaudo_transferencia || 0);
        newFormData.valor = efectivo + transferencia;
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const readOnlyFields = ["id_factura"];
      const dataToSend = {};
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
          console.log(`Campo ${key}: nuevo="${newValue}", original="${originalValue}", tipo nuevo: ${typeof newValue}, tipo original: ${typeof originalValue}`);
          
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

      // Validar que tipo_recaudo sea un string y no un array
      if (dataToSend.tipo_recaudo && Array.isArray(dataToSend.tipo_recaudo)) {
        dataToSend.tipo_recaudo = dataToSend.tipo_recaudo[0] || "";
      }

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
                    styles={customSelectStyles}
                    value={clienteOptions.find(option => option.value === formData.id_cliente) || null}
                    onChange={(selectedOption) => handleSelectChange('id_cliente', selectedOption)}
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
                    disabled={formData.tipo_recaudo === "efectivo y transferencia"}
                    style={{
                      backgroundColor: formData.tipo_recaudo === "efectivo y transferencia" ? "#f8f9fa" : "",
                      color: formData.tipo_recaudo === "efectivo y transferencia" ? "#6c757d" : ""
                    }}
                  />
                  {formData.tipo_recaudo === "efectivo y transferencia" && (
                    <small style={{ color: "#6c757d", fontSize: "0.8em" }}>
                      Calculado automáticamente como la suma de efectivo + transferencia
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Estado y Transporte</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="id_estado">Estado:</label>
                  <Select
                    id="id_estado"
                    name="id_estado"
                    options={estadoOptions}
                    placeholder="Seleccionar estado"
                    isClearable
                    styles={customSelectStyles}
                    value={estadoOptions.find(option => option.value === formData.id_estado) || null}
                    onChange={(selectedOption) => handleSelectChange('id_estado', selectedOption)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_transportadora">Transportadora:</label>
                  <Select
                    id="id_transportadora"
                    name="id_transportadora"
                    options={transportadoraOptions}
                    placeholder="Seleccionar transportadora"
                    isClearable
                    styles={customSelectStyles}
                    value={transportadoraOptions.find(option => option.value === formData.id_transportadora) || null}
                    onChange={(selectedOption) => handleSelectChange('id_transportadora', selectedOption)}
                  />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Información de Recaudo</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="tipo_recaudo">Tipo Recaudo:</label>
                  <Select
                    id="tipo_recaudo"
                    name="tipo_recaudo"
                    options={tipoRecaudoOptions}
                    placeholder="Seleccionar tipo"
                    isClearable
                    styles={customSelectStyles}
                    value={tipoRecaudoOptions.find(option => option.value === formData.tipo_recaudo) || null}
                    onChange={(selectedOption) => handleSelectChange('tipo_recaudo', selectedOption)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="recaudo_efectivo">Recaudo Efectivo:</label>
                  <input
                    type="number"
                    id="recaudo_efectivo"
                    name="recaudo_efectivo"
                    value={formData.recaudo_efectivo}
                    onChange={handleRecaudoChange}
                    step="0.01"
                    disabled={formData.tipo_recaudo === "Transferencia"}
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
                    onChange={handleRecaudoChange}
                    step="0.01"
                    disabled={formData.tipo_recaudo === "Efectivo"}
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
                  <Select
                    id="id_vendedor"
                    name="id_vendedor"
                    options={vendedorOptions}
                    placeholder="Seleccionar vendedor"
                    isClearable
                    styles={customSelectStyles}
                    value={vendedorOptions.find(option => option.value === formData.id_vendedor) || null}
                    onChange={(selectedOption) => handleSelectChange('id_vendedor', selectedOption)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_enrutador">Enrutador:</label>
                  <Select
                    id="id_enrutador"
                    name="id_enrutador"
                    options={enrutadorOptions}
                    placeholder="Seleccionar enrutador"
                    isClearable
                    styles={customSelectStyles}
                    value={enrutadorOptions.find(option => option.value === formData.id_enrutador) || null}
                    onChange={(selectedOption) => handleSelectChange('id_enrutador', selectedOption)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_alistador">Alistador:</label>
                  <Select
                    id="id_alistador"
                    name="id_alistador"
                    options={alistadorOptions}
                    placeholder="Seleccionar alistador"
                    isClearable
                    styles={customSelectStyles}
                    value={alistadorOptions.find(option => option.value === formData.id_alistador) || null}
                    onChange={(selectedOption) => handleSelectChange('id_alistador', selectedOption)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_empacador">Empacador:</label>
                  <Select
                    id="id_empacador"
                    name="id_empacador"
                    options={empacadorOptions}
                    placeholder="Seleccionar empacador"
                    isClearable
                    styles={customSelectStyles}
                    value={empacadorOptions.find(option => option.value === formData.id_empacador) || null}
                    onChange={(selectedOption) => handleSelectChange('id_empacador', selectedOption)}
                  />
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