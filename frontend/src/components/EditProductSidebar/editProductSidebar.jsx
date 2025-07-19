// src/components/EditProductSidebar/EditProductSidebar.jsx
import React, { useState, useEffect } from 'react';
import './EditProductSidebar.css'; // Crea este archivo CSS

const EditProductSidebar = ({ product, onClose, onSave }) => {
    // Si no hay producto, no mostramos nada
    if (!product) {
        return null;
    }

    const [editedTitle, setEditedTitle] = useState(product.title);
    const [editedDescription, setEditedDescription] = useState(product.description);
    const [editedIcon, setEditedIcon] = useState(product.icon);

    // Actualizar el estado local cuando el 'product' prop cambie (ej. al seleccionar otro producto)
    useEffect(() => {
        setEditedTitle(product.title);
        setEditedDescription(product.description);
        setEditedIcon(product.icon);
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Llamar a la función onSave con los datos actualizados
        onSave({
            ...product, // Mantenemos el ID y cualquier otra propiedad
            title: editedTitle,
            description: editedDescription,
            icon: editedIcon
        });
        onClose(); // Cerrar el panel después de guardar
    };

    return (
        <div className={`edit-sidebar-overlay ${product ? 'open' : ''}`} onClick={onClose}>
            <div className={`edit-sidebar ${product ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="sidebar-header">
                    <h3>Editar Entidad: {product.title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="sidebar-form">
                    <div className="form-group">
                        <label htmlFor="title">Título:</label>
                        <input
                            type="text"
                            id="title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="icon">Ícono (clase Font Awesome):</label>
                        <input
                            type="text"
                            id="icon"
                            value={editedIcon}
                            onChange={(e) => setEditedIcon(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-btn">Guardar Cambios</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductSidebar;