"use client"

// src/pages/products/products.jsx

import { useState } from "react"
import ProductListItem from "../../components/ProductListItem/ProductListItem"
import EditProductSidebar from "../../components/EditProductSidebar/EditProductSidebar"
import { Building2 } from "lucide-react"
import "../../components/ProductListItem/ProductListItem.css"

const initialProducts = [
  {
    id: 38560,
    icon: "fa-building",
    title: "CENTRO MEDICO AURA ELENA SAS",
    description: "Centro médico especializado en atención integral de salud con tecnología de vanguardia.",
  },
  {
    id: 38561,
    icon: "fa-user",
    title: "RAMIRO UTRIA",
    description: "Profesional de la salud con amplia experiencia en medicina general y especializada.",
  },
  {
    id: 38562,
    icon: "fa-user",
    title: "DANIEL DIAZ URIBE",
    description: "Especialista médico con certificaciones en múltiples áreas de la medicina.",
  },
  {
    id: 38563,
    icon: "fa-building",
    title: "CENTRO MEDICO QUIRURGICO LA RIVIERA SAS",
    description: "Institución médica con servicios quirúrgicos y de hospitalización de alta calidad.",
  },
  {
    id: 38564,
    icon: "fa-user",
    title: "DANIEL DIAZ URIBE",
    description: "Médico especialista con experiencia en procedimientos ambulatorios y hospitalarios.",
  },
  {
    id: 38565,
    icon: "fa-user",
    title: "MAURO ALEJANDRO HERRERA RODELO",
    description: "Profesional de la salud especializado en atención primaria y medicina preventiva.",
  },
]

const Products = () => {
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleEditClick = (productId) => {
    const productToEdit = products.find((p) => p.id === productId)
    setEditingProduct(productToEdit)
  }

  const handleCloseSidebar = () => {
    setEditingProduct(null)
  }

  const handleSaveProduct = (updatedProduct) => {
    console.log("Guardando cambios para:", updatedProduct)

    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))

    alert(`Producto "${updatedProduct.title}" actualizado exitosamente!`)
  }

  return (
    <div className="products-main-content">

      <div className="product-list-container">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            id={product.id}
            icon={product.icon}
            title={product.title}
            description={product.description}
            onEditClick={handleEditClick}
          />
        ))}
      </div>

      <EditProductSidebar product={editingProduct} onClose={handleCloseSidebar} onSave={handleSaveProduct} />
    </div>
  )
}

export default Products
