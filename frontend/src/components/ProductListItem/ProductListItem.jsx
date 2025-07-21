// src/components/ProductListItem/ProductListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Si lo usas para el Link del título
import { FaEdit } from 'react-icons/fa'; // Importa el icono de lápiz para editar (necesitas instalar react-icons)
import edit from '../../assets/icons/edit.svg';


// Asegúrate de tener instalado react-icons: npm install react-icons

const ProductListItem = ({ id, iconClass, title, description, onEditClick }) => {
    // Definimos la URL de detalle si es necesario, o se puede pasar como prop
    const detailUrl = `/producto/${id}`; // Ejemplo: /producto/38560

    return (
        <div className="product-list-item">
            <div className="product-icon">
                {/* Asegúrate de que Font Awesome esté importado globalmente o usa React Icons */}
                <i className={`fa ${iconClass}`}></i> 
            </div>
            <div className="product-info">
                {/* Podrías hacer el título un Link si quieres ir a una página de detalle */}
                <h3 className="product-title">
                    <Link to={detailUrl}>{title}</Link> 
                </h3>
                <p className="product-description">{description}</p>
            </div>
            <div className="product-actions">
                {/* Botón de editar. Llama a onEditClick pasando el ID del producto */}
                <button className="edit-button" onClick={() => onEditClick(id)}>
                    <img src={edit} alt="Editar" />
                </button>
                {/* Otros botones como "Ver Detalles" podrían ir aquí */}
                {/* <Link to={detailUrl} className="view-details-button">Ver Detalles</Link> */}
            </div>
        </div>
    );
};

export default ProductListItem;