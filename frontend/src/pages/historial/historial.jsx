import React from 'react';
import HistoryItem from '../../components/HistoryItem/HistoryItem'; // Importa el nuevo componente
import '../../components/HistoryItem/HistoryItem.css'; // Importa el CSS del historial

// Datos simulados para el historial
const sampleHistory = [
    {
        id: 1,
        type: 'creacion', // 'creacion', 'edicion', 'eliminacion', 'general'
        date: '2024-07-17 10:30 AM',
        description: 'Se creó una nueva entidad: "Soluciones Tecnológicas S.A.S."',
        user: 'Juan Pérez'
    },
    {
        id: 2,
        type: 'edicion',
        date: '2024-07-17 11:15 AM',
        description: 'Se actualizó la descripción de "Distribuciones XYZ Ltda.".',
        user: 'María García'
    },
    {
        id: 3,
        type: 'eliminacion',
        date: '2024-07-16 03:45 PM',
        description: 'Se eliminó la entidad "Servicios Rápidos S.A.S." del sistema.',
        user: 'Pedro López'
    },
    {
        id: 4,
        type: 'general',
        date: '2024-07-16 09:00 AM',
        description: 'Inicio de sesión exitoso por el administrador.',
        user: 'Admin'
    },
    {
        id: 5,
        type: 'edicion',
        date: '2024-07-15 02:00 PM',
        description: 'Se modificó el título de "CENTRO MEDICO AURA ELENA SAS" a "LENA SAS".',
        user: 'Ana Fernández'
    },
    {
        id: 6,
        type: 'creacion',
        date: '2024-07-14 08:50 AM',
        description: 'Nueva persona registrada: "Carlos Giraldo".',
        user: 'Juan Pérez'
    },
];

const Historial = () => {
    return (
        <div className="main-content"> {/* Asegúrate de que esto se alinee con tu layout principal */}
            <h2 className="grid-c-title-text" style={{ paddingLeft: '20px' }}>Historial de Actividad</h2>
            <div className="history-list-container"> {/* Contenedor específico para la lista del historial */}
                {sampleHistory.map(item => (
                    <HistoryItem
                        key={item.id}
                        type={item.type}
                        date={item.date}
                        description={item.description}
                        user={item.user}
                    />
                ))}
            </div>
        </div>
    );
};

export default Historial;