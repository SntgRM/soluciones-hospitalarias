import React, { useState, useContext } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, isWithinInterval } from 'date-fns';
import HistoryItem from '../../components/HistoryItem/HistoryItem';
import '../../components/HistoryItem/HistoryItem.css';
import './Historial.css';
import { SidebarContext } from '../../context/sidebarContext';
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash,
  Settings,
  ArrowUpToLine,
} from 'lucide-react';



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

const filtroOpciones = [
  { value: 'todos', label: 'Todos', icon: <ClipboardList size={16} color="black" /> },
  { value: 'creacion', label: 'Creaciones', icon: <Plus size={16} color="black" /> },
  { value: 'edicion', label: 'Ediciones', icon: <Pencil size={16} color="black" /> },
  { value: 'eliminacion', label: 'Eliminaciones', icon: <Trash size={16} color="black" /> },
  { value: 'general', label: 'Eventos Generales', icon: <Settings size={16} color="black" /> },
];

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#ffffff',         // fondo claro
    borderColor: '#ccc',                // borde suave
    color: '#000000',                   // texto oscuro
    borderRadius: '8px',
    minWidth: '240px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000000',                   // valor seleccionado oscuro
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : '#ffffff', // hover gris claro
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#ffffff',         // fondo del menú
  }),
};


const Historial = () => {
  const [filtro, setFiltro] = useState('todos');
  const { isSidebarOpen } = useContext(SidebarContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

    const filteredHistory = sampleHistory.filter(item => {
    const tipoCoincide = filtro === 'todos' || item.type === filtro;

    const itemDate = parse(item.date, 'yyyy-MM-dd hh:mm a', new Date());

    const dentroDelRango = (!startDate || itemDate >= startDate) &&
                          (!endDate || itemDate <= endDate);

    return tipoCoincide && dentroDelRango;
  });


  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getMainContentClass = () => {
    let baseClass = 'main-content-historial';
    if (window.innerWidth <= 420 && isSidebarOpen) {
      baseClass += ' sidebar-visible';
    } else if (window.innerWidth <= 1200 && isSidebarOpen) {
      baseClass += ' sidebar-collapsed';
    }
    return baseClass;
  };

  return (
    <div className={getMainContentClass()}>
      <div className="historial-header">
        <h2 className="grid-c-title-text">Historial de Actividad</h2>

        <Select
          value={filtroOpciones.find(opt => opt.value === filtro)}
          onChange={(selectedOption) => setFiltro(selectedOption.value)}
          options={filtroOpciones.map(opt => ({
            ...opt,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {opt.icon}
                <span>{opt.label}</span>
              </div>
            )
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

      <div className="history-list-container">
        {filteredHistory.length > 0 ? (
          filteredHistory.map(item => (
            <HistoryItem
              key={item.id}
              type={item.type}
              date={item.date}
              description={item.description}
              user={item.user}
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontSize: '16px'
          }}>
            No se encontraron elementos para el filtro seleccionado.
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
  );
};

export default Historial;
