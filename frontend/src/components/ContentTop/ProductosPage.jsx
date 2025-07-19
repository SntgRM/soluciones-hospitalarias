// src/pages/ProductosPage.jsx
import React, { useState } from 'react';
import ContentTop from '../ContentTop/ContentTop';
import { productsData } from '../../data/data';

const ProductosPage = () => {
    const [productosFiltrados, setProductosFiltrados] = useState(productsData);

    const handleBuscar = (termino) => {
        const resultado = productsData.filter((producto) =>
            producto.name.toLowerCase().includes(termino.toLowerCase()) ||
            producto.description.toLowerCase().includes(termino.toLowerCase()) ||
            producto.status.toLowerCase().includes(termino.toLowerCase())
        );
        setProductosFiltrados(resultado);
    };

    return (
        <div className="productos-page">
            <ContentTop pageTitle="Gestión de Productos" onSearch={handleBuscar} />

            <div className="productos-list">
                {productosFiltrados.length > 0 ? (
                    <ul className="productos-ul">
                        {productosFiltrados.map((p) => (
                            <li key={p.id} className="producto-item">
                                <img src={p.image} alt={p.name} width={80} />
                                <div>
                                    <h4>{p.name}</h4>
                                    <p>{p.description}</p>
                                    <p><strong>Estado:</strong> {p.status}</p>
                                    <p><strong>Cantidad:</strong> {p.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>
        </div>
    );
};

export default ProductosPage;
