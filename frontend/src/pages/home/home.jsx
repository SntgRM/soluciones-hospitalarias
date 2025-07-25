"use client"

import { useContext } from "react"
import ProductSummaryCards from "../../components/Cards/cards.jsx"
import ProductCard from "../../components/ProductCard/productCard.jsx"
import "./home.css"
import { SidebarContext } from "../../context/sidebarContext"
import { BarChart3, Package, TrendingUp, Activity, ShoppingCart, Users, AlertTriangle, CheckCircle } from "lucide-react"

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
      <div className="dashboard-header">
        <div className="header-title-section">
          <Activity size={32} className="header-icon" />
          <div>
            <h1 className="dashboard-title">Gestión de Bodega</h1>
            <p className="dashboard-subtitle">Panel de control y gestión integral</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="quick-stat">
            <TrendingUp size={20} className="stat-icon success" />
            <span className="stat-value">+12%</span>
            <span className="stat-label">Ventas del mes</span>
          </div>
          <div className="quick-stat">
            <AlertTriangle size={20} className="stat-icon warning" />
            <span className="stat-value">5</span>
            <span className="stat-label">Stock bajo</span>
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
