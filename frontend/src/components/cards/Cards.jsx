import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../../data/data';
import { iconsImgs } from '../../utils/images'; // Asegúrate de que esta ruta sea correcta
import './Cards.css';

const Cards = () => {
    const navigate = useNavigate();

    // Calcular el conteo de productos por estado
    const productCounts = productsData.reduce((acc, product) => {
        acc[product.status] = (acc[product.status] || 0) + 1;
        return acc;
    }, {});

    // Datos para las tarjetas resumen - ¡ACTUALIZADOS!
    const summaryItems = [
        {
            id: 'en alistamiento',
            title: 'En Alistamiento',
            count: productCounts['en alistamiento'] || 0,
            icon: '📝', // Icono de ejemplo
            bgColor: '#FFD700' // Dorado
        },
        {
            id: 'en preparación',
            title: 'En Preparación',
            count: productCounts['en preparación'] || 0,
            icon: '🛠️', // Icono de ejemplo
            bgColor: '#831386ff' // Naranja
        },
        {
            id: 'empacado',
            title: 'Empacado',
            count: productCounts.empacado || 0,
            icon: '📦', // Icono de ejemplo
            bgColor: '#831386ff' // Verde
        },
        {
            id: 'en reparto',
            title: 'En Reparto',
            count: productCounts['en reparto'] || 0,
            icon: '🛵', // Icono de ejemplo
            bgColor: '#e68a00ff' // Azul cielo
        },
        {
            id: 'enviado al cliente',
            title: 'Enviado al Cliente',
            count: productCounts['enviado al cliente'] || 0,
            icon: '📧', // Icono de ejemplo (por correo/notificación)
            bgColor: '#13af1bff' // Gris
        },
        {
            id: 'enviado en transportadora',
            title: 'Enviado en Transportadora',
            count: productCounts['enviado en transportadora'] || 0,
            icon: '🚛', // Icono de ejemplo
            bgColor: '#13af1bff' // Púrpura
        },
        {
            id: 'pedido no recibido',
            title: 'Pedido No Recibido',
            count: productCounts['pedido no recibido'] || 0,
            icon: '❌', // Icono de ejemplo
            bgColor: '#3f3f3fff' // Rojo
        },
        {
            id: 'anulado',
            title: 'Anulado',
            count: productCounts.anulado || 0,
            icon: '🚫', // Icono de ejemplo
            bgColor: '#0079f1ff' // Gris oscuro
        },
    ];

    const handleCardClick = (status) => {
        navigate(`/productos?status=${status}`);
    };

    return (
        <div className="product-summary-cards-wrapper grid-common grid-c1">
            <div className="grid-c-title">
                <h3 className="grid-c-title-text">Resumen de Pedidos</h3>
                <button className="grid-c-title-icon" onClick={() => navigate('/productos')}>
                    <img src={iconsImgs.check} alt="Ver Todos" />
                    <span className="tooltip">Ver todos</span>
                </button>
            </div>

            <div className="summary-cards-container">
                {summaryItems.map(item => (
                    <div
                        key={item.id}
                        className="summary-card"
                        style={{ backgroundColor: item.bgColor }}
                        onClick={() => handleCardClick(item.id)}
                    >
                        <div className="card-icon">{item.icon}</div>
                        <h4 className="card-title">{item.title}</h4>
                        <p className="card-count">{item.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;