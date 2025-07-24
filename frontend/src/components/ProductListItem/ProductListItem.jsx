"use client"
import "./ProductListItem.css"
import * as Icons from "lucide-react"

const ProductListItem = ({ id, icon, title, description, onEditClick }) => {
  const iconMap = {
    "fa-building": "Building2",
    "fa-user": "User",
    "fa-hospital": "Hospital",
    "fa-clinic-medical": "Stethoscope",
    "fa-user-md": "UserCheck",
    "fa-briefcase": "Briefcase",
    "fa-home": "Home",
    "fa-office": "Building",
    "fa-users": "Users",
    "fa-person": "User",
  }

  // Obtener el icono de Lucide correspondiente
  const iconName = iconMap[icon] || "Circle"
  const LucideIcon = Icons[iconName] || Icons.Circle

  return (
    <div className="pli-product-list-item">
      <div className="pli-product-icon">
        <LucideIcon className="pli-lucide-icon" size={24} />
      </div>
      <div className="pli-product-content">
        <h3 className="pli-product-title">{title}</h3>
        <p className="pli-product-description">{description}</p>
      </div>
      <div className="pli-product-actions">
        <button className="pli-edit-button" onClick={() => onEditClick(id)} title="Editar producto">
          <Icons.Edit size={18} />
        </button>
      </div>
    </div>
  )
}

export default ProductListItem
