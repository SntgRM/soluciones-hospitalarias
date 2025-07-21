import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../../data/data';
import { iconsImgs } from '../../utils/images';
import './Cards.css';

const Cards = () => {
    const navigate = useNavigate();

    // Calcular el conteo de productos por estado
    const productCounts = productsData.reduce((acc, product) => {
        acc[product.status] = (acc[product.status] || 0) + 1;
        return acc;
    }, {});

    // Datos para las tarjetas resumen
    const summaryItems = [
        {
            id: 'en alistamiento',
            title: 'En Alistamiento',
            count: productCounts['en alistamiento'] || 0,
            icon: iconsImgs.check1,
            bgColor: '#FFD700'
        },
        {
            id: 'en preparación',
            title: 'En Preparación',
            count: productCounts['en preparación'] || 0,
            icon: iconsImgs.settings,
            bgColor: '#831386ff'
        },
        {
            id: 'empacado',
            title: 'Empacado',
            count: productCounts.empacado || 0,
            icon: iconsImgs.packageIcon,
            bgColor: '#831386ff'
        },
        {
            id: 'en reparto',
            title: 'En Reparto',
            count: productCounts['en reparto'] || 0,
            icon: iconsImgs.bike,
            bgColor: '#e68a00ff'
        },
        {
            id: 'enviado al cliente',
            title: 'Enviado al Cliente',
            count: productCounts['enviado al cliente'] || 0,
            icon: iconsImgs.send,
            bgColor: '#13af1bff'
        },
        {
            id: 'enviado en transportadora',
            title: 'Enviado en Transportadora',
            count: productCounts['enviado en transportadora'] || 0,
            icon: iconsImgs.truck,
            bgColor: '#13af1bff'
        },
        {
            id: 'pedido no recibido',
            title: 'Pedido No Recibido',
            count: productCounts['pedido no recibido'] || 0,
            icon: iconsImgs.xCircle,
            bgColor: '#3f3f3fff'
        },
        {
            id: 'anulado',
            title: 'Anulado',
            count: productCounts.anulado || 0,
            icon: iconsImgs.ban,
            bgColor: '#0079f1ff'
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
                {summaryItems.map((item) => (
                    <div
                        key={item.id}
                        className="summary-card"
                        onClick={() => handleCardClick(item.id)}
                        style={{ border: `1px solid ${item.bgColor}` }}
                    >
                        <div className="card-content">
                            <div className="card-icon-box" style={{ backgroundColor: item.bgColor }}>
                                <img src={item.icon} alt={item.title} className="card-icon" />
                            </div>
                            <div className="card-text">
                                <h4 className="card-title">{item.title}</h4>
                                <p className="card-count">{item.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;