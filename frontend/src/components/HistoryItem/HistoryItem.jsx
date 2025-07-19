import React from 'react';
import './HistoryItem.css'; // Asegúrate de que este CSS esté actualizado

const HistoryItem = ({ type, date, description, user }) => {
    // Definir el color y degradado basado en el tipo de historial
    // Puedes personalizar estos colores.
    let gradientVar = '';
    let colorVar = '';

    switch (type) {
        case 'creacion':
            gradientVar = 'linear-gradient(to bottom, #4CAF50, #8BC34A, #AED581)'; // Verde
            colorVar = '#4CAF50';
            break;
        case 'edicion':
            gradientVar = 'linear-gradient(to bottom, #FFC107, #FFEB3B, #FFCDD2)'; // Amarillo/Naranja
            colorVar = '#FFC107';
            break;
        case 'eliminacion':
            gradientVar = 'linear-gradient(to bottom, #F44336, #EF5350, #E57373)'; // Rojo
            colorVar = '#F44336';
            break;
        default: // 'general' u otros
            gradientVar = 'linear-gradient(to bottom, #2196F3, #64B5F6, #90CAF9)'; // Azul por defecto
            colorVar = '#2196F3';
    }

    // Estilos inline para pasar las variables CSS personalizadas
    const itemStyle = {
        '--gradient': gradientVar,
        '--color': colorVar,
    };

    return (
        <div className="history-item notification" style={itemStyle}>
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            
            {/* Título de la notificación (puede ser el tipo de acción y la fecha) */}
            <div className="notititle">
                {type.charAt(0).toUpperCase() + type.slice(1)} - {date}
            </div>
            
            {/* Cuerpo de la notificación (la descripción de la acción) */}
            <div className="notibody">
                {description}
            </div>

            {/* Información adicional del usuario */}
            <div className="notifooter">
                Realizado por: {user}
            </div>
        </div>
    );
};

export default HistoryItem;