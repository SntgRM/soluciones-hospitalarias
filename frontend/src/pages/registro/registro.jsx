import React, { useState } from 'react';
import './Registro.css';
import { iconsImgs } from '../../utils/images';

function RegistroPedido() {
  const [formData, setFormData] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    fecha: '',
    estado: 'pendiente',
    prioridad: 'media',
    notas: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pedido registrado:', formData);
    alert('Pedido registrado con éxito');
    setFormData({
      cliente: '',
      producto: '',
      cantidad: '',
      fecha: '',
      estado: 'pendiente',
      prioridad: 'media',
      notas: '',
    });
  };

  return (
    <div className="registro-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', }}>Registrar Nuevo Pedido</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        
        <label className="input-group">
          Nombre del Cliente
          <input type="text" name="cliente" placeholder="" value={formData.cliente} onChange={handleChange} required />
        </label>

        <label>
          Producto
          <input type="text" name="producto" value={formData.producto} onChange={handleChange} required />
        </label>

        <label>
          Estado
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="en_alistamiento">En Alistamiento</option>
            <option value="en_proceso">En Proceso</option>
            <option value="empacado">Empacado</option>
            <option value="en_reparto">En Reparto</option>
            <option value="enviado_cliente">Enviado al Cliente</option>
            <option value="enviado_transportadora">Enviado en Transportadora</option>
          </select>
        </label>

        {/* Campos condicionales según estado */}
        {formData.estado === 'empacado' && (
          <label>
            Código de Empaque
            <input type="text" name="codigo_empaque" placeholder="Ej: EMP12345" onChange={handleChange} />
          </label>
        )}

        {formData.estado === 'en_reparto' && (
          <label>
            Nombre del repartidor
            <input type="text" name="repartidor" placeholder="Nombre" onChange={handleChange} />
          </label>
        )}

        {formData.estado === 'enviado_transportadora' && (
          <>
            <label>
              Transportadora
              <input type="text" name="transportadora" placeholder="Nombre de la empresa" onChange={handleChange} />
            </label>
            <label>
              Número de guía
              <input type="text" name="guia" placeholder="Código de seguimiento" onChange={handleChange} />
            </label>
          </>
        )}

        <label>
          Cantidad
          <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
        </label>

        <label>
          Fecha
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        </label>

        <label>
          Prioridad
          <select name="prioridad" value={formData.prioridad} onChange={handleChange}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>

        <label>
          Notas
          <textarea name="notas" value={formData.notas} onChange={handleChange}></textarea>
        </label>

        <button type="submit" className="registro-btn">Registrar Pedido</button>
      </form>
    </div>
  );
}

export default RegistroPedido;
