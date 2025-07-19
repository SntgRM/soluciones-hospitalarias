// src/pages/products/products.jsx

import React, { useState } from 'react'; // Importamos useState
import ProductListItem from '../../components/ProductListItem/ProductListItem';
import EditProductSidebar from '../../components/EditProductSidebar/EditProductSidebar'; // Importa el nuevo componente
import '../../components/ProductListItem/ProductListItem.css'; 

// Simulación de datos de productos (¡estos están perfectos para la lista!)
const initialProducts = [ // Cambiamos a initialProducts para poder modificarlos
    {
        id: 38560,
        icon: 'fa-building',
        title: 'CENTRO MEDICO AURA ELENA SAS',
        description: 'Breve descripción del Centro Medico Aura Elena SAS.'
    },
    {
        id: 38561,
        icon: 'fa-user',
        title: 'RAMIRO UTRIA',
        description: 'Descripción de Ramiro Utria.'
    },
    {
        id: 38562,
        icon: 'fa-user',
        title: 'DANIEL DIAZ URIBE',
        description: 'Descripción de Daniel Diaz Uribe.'
    },
    {
        id: 38563,
        icon: 'fa-building',
        title: 'CENTRO MEDICO QUIRURGICO LA RIVIERA SAS',
        description: 'Descripción de Centro Medico Quirurgico La Riviera SAS.'
    },
    {
        id: 38564,
        icon: 'fa-user',
        title: 'DANIEL DIAZ URIBE',
        description: 'Descripción de Daniel Diaz Uribe.'
    },
    {
        id: 38565,
        icon: 'fa-user',
        title: 'MAURO ALEJANDRO HERRERA RODELO',
        description: 'Descripción de Mauro Alejandro Herrera Rodelo.'
    },
    // ... más productos
];

const Products = () => {
    const [products, setProducts] = useState(initialProducts); // Usamos estado para la lista de productos
    const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto que se está editando

    // Función para manejar el clic en el botón de editar
    const handleEditClick = (productId) => {
        const productToEdit = products.find(p => p.id === productId);
        setEditingProduct(productToEdit); // Establece el producto a editar
    };

    // Función para cerrar el panel lateral
    const handleCloseSidebar = () => {
        setEditingProduct(null); // Limpia el producto en edición para cerrar el panel
    };

    // Función para guardar los cambios del producto (simulada)
    const handleSaveProduct = (updatedProduct) => {
        // En una aplicación real, aquí harías una llamada a tu API para guardar
        console.log("Guardando cambios para:", updatedProduct);
        
        setProducts(prevProducts => 
            prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        // Opcional: Podrías añadir una notificación de éxito aquí
        alert(`Producto "${updatedProduct.title}" actualizado exitosamente!`);
    };

    return (
        <div className="main-content">
            <h2 className="grid-c-title-text" style={{ paddingLeft: '20px' }}>Listado de Entidades</h2>
            <div className="product-list-container">
                {products.map(product => (
                    <ProductListItem
                        key={product.id}
                        id={product.id}
                        iconClass={product.icon}
                        title={product.title}
                        description={product.description}
                        onEditClick={handleEditClick} // Pasamos la función al ProductListItem
                    />
                ))}
            </div>

            {/* Renderiza el panel lateral solo si hay un producto en edición */}
            <EditProductSidebar 
                product={editingProduct} // Pasa el producto actual a editar
                onClose={handleCloseSidebar} // Función para cerrar el panel
                onSave={handleSaveProduct} // Función para guardar los cambios
            />
        </div>
    );
};

export default Products;