import React, { useState } from 'react';
import HistoryItem from '../../components/HistoryItem/HistoryItem';
import '../../components/HistoryItem/HistoryItem.css';
import './Historial.css';
import { iconsImgs } from '../../utils/images';

const sampleHistory = [
  { id: 1, type: 'creacion', date: '2024-07-17 10:30 AM', description: 'Se creó una nueva entidad: "Soluciones Tecnológicas S.A.S."', user: 'Juan Pérez' },
  { id: 2, type: 'edicion', date: '2024-07-17 11:15 AM', description: 'Se actualizó la descripción de "Distribuciones XYZ Ltda."', user: 'María García' },
  { id: 3, type: 'eliminacion', date: '2024-07-16 03:45 PM', description: 'Se eliminó la entidad "Servicios Rápidos S.A.S." del sistema.', user: 'Pedro López' },
  { id: 4, type: 'general', date: '2024-07-16 09:00 AM', description: 'Inicio de sesión exitoso por el administrador.', user: 'Admin' },
  { id: 5, type: 'edicion', date: '2024-07-15 02:00 PM', description: 'Se modificó el título de "CENTRO MEDICO AURA ELENA SAS" a "LENA SAS".', user: 'Ana Fernández' },
  { id: 6, type: 'creacion', date: '2024-07-14 08:50 AM', description: 'Nueva persona registrada: "Carlos Giraldo".', user: 'Juan Pérez' },
  { id: 7, type: 'general', date: '2024-07-13 07:20 AM', description: 'Cambio de contraseña realizado.', user: 'Admin' },
  { id: 8, type: 'creacion', date: '2024-07-12 03:00 PM', description: 'Se registró la empresa "Innovatek Solutions".', user: 'Luis Martínez' },
  { id: 9, type: 'edicion', date: '2024-07-11 04:30 PM', description: 'Actualización de dirección para "Transporte Global".', user: 'Paola Jiménez' },
  { id: 10, type: 'eliminacion', date: '2024-07-10 01:45 PM', description: 'Eliminación del usuario "carlos123".', user: 'Admin' },
];

const Historial = () => {
  const [filtro, setFiltro] = useState('todos');

  const filteredHistory = filtro === 'todos'
    ? sampleHistory
    : sampleHistory.filter(item => item.type === filtro);

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="main-content">
      <div className="historial-header">
        <h2 className="grid-c-title-text">Historial de Actividad</h2>

        <select
          className="filtro-select"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="creacion">Creaciones</option>
          <option value="edicion">Ediciones</option>
          <option value="eliminacion">Eliminaciones</option>
          <option value="general">Eventos Generales</option>
        </select>
      </div>

      <div className="history-list-container">
        {filteredHistory.map(item => (
          <HistoryItem
            key={item.id}
            type={item.type}
            date={item.date}
            description={item.description}
            user={item.user}
          />
        ))}
      </div>

      <button className="btn-volver-arriba" onClick={volverArriba}>
        <img src={iconsImgs.arrow} alt="Volver arriba" />
      </button>
    </div>
  );
};

export default Historial;
