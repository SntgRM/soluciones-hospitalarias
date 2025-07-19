// src/components/ProductCard/ProductCard.jsx

import React from 'react';
import './ProductCard.css'; // Asegúrate de crear este archivo CSS

// Importa los iconos de Font Awesome si no los estás usando de una CDN globalmente.
// Si ya tienes Font Awesome configurado en tu proyecto (por ejemplo, con 'react-icons/fa'),
// puedes usar esos imports en su lugar.
// Para este ejemplo, asumo que la CDN se está cargando en tu index.html.

const ProductCard = ({ iconClass, title, description }) => {
    return (
        <div className="product-card-wrapper"> {/* Renombramos 'card' para evitar conflictos */}
            <div className="product-slide product-slide1">
                <div className="product-content">
                    <div className="product-icon">
                        {/* Usamos el iconClass directamente. Si usas react-icons/fa,
                            tendrías que importar el componente del icono específico y pasarlo como prop.
                            Para la plantilla que pasaste, se asume Font Awesome 4.7.0. */}
                        <i className={`fa ${iconClass}`} aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className="product-slide product-slide2">
                <div className="product-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;