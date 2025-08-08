"use client"

import { useContext } from "react"
import ProductSummaryCards from "../../components/cards/cards.jsx"
import ProductCard from "../../components/ProductCard/productCard.jsx"
import "./home.css"
import { SidebarContext } from "../../context/sidebarContext"
import { topContent } from "../../data/data.js"
import * as LucideIcons from 'lucide-react';

const IconComponent = LucideIcons[topContent[1].iconName];

const Home = () => {
  const { isSidebarOpen } = useContext(SidebarContext)

  const getMainContentClass = () => {
    let baseClass = "main-content-home"
    if (window.innerWidth <= 420 && isSidebarOpen) {
      baseClass += " sidebar-visible"
    } else if (window.innerWidth <= 1200 && isSidebarOpen) {
      baseClass += " sidebar-collapsed"
    }
    return baseClass
  }

  const featureCards = [
    {
      iconClass: "fa-chart-bar",
      title: "Análisis de Ventas",
      description: "Monitorea el rendimiento de ventas y tendencias del mercado en tiempo real.",
    },
    {
      iconClass: "fa-boxes",
      title: "Gestión de Inventario",
      description: "Control completo del stock, alertas de productos y gestión automatizada.",
    },
    {
      iconClass: "fa-users",
      title: "Gestión de Clientes",
      description: "Administra la información de clientes y su historial de compras.",
    },
    {
      iconClass: "fa-truck",
      title: "Control de Envíos",
      description: "Seguimiento completo de pedidos desde el almacén hasta el cliente.",
    },
  ]

  return (
    <div className={getMainContentClass()}>
        {/* Header de Bienvenida */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <IconComponent />
              </div>
              <div className="header-text">
                <h1 className="header-title">{ topContent[1].title }</h1>
                <p className="header-subtitle">{ topContent[1].description }</p>
              </div>
            </div>
          </div>
        </div>

      <div className="main-content-holder">
        <div className="content-grid-one">
          <ProductSummaryCards />
        </div>
      </div>
    </div>
  )
}

export default Home
