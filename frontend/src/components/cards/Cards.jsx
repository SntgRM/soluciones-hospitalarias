"use client"

import { useNavigate } from "react-router-dom"
import { iconsImgs } from "../../utils/images"
import {
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Eye,
} from "lucide-react"
import "./Cards.css"

const Cards = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/pedidos")
  }

  // Datos simulados para el dashboard
  const dashboardStats = [
    {
      title: "Pedidos Hoy",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Ventas del Mes",
      value: "$45,230",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Productos Activos",
      value: "1,247",
      change: "+3.1%",
      trend: "up",
      icon: Package,
      color: "purple",
    },
    {
      title: "Clientes Nuevos",
      value: "89",
      change: "-2.4%",
      trend: "down",
      icon: Users,
      color: "orange",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "order",
      message: "Nuevo pedido #12345 recibido",
      time: "Hace 5 min",
      status: "new",
    },
    {
      id: 2,
      type: "payment",
      message: "Pago confirmado para pedido #12340",
      time: "Hace 12 min",
      status: "success",
    },
    {
      id: 3,
      type: "alert",
      message: "Stock bajo: Paracetamol 500mg",
      time: "Hace 25 min",
      status: "warning",
    },
    {
      id: 4,
      type: "delivery",
      message: "Pedido #12338 entregado exitosamente",
      time: "Hace 1 hora",
      status: "success",
    },
  ]

  const quickActions = [
    {
      title: "Nuevo Pedido",
      description: "Registrar pedido manualmente",
      icon: Package,
      action: () => navigate("/registro"),
      color: "blue",
    },
    {
      title: "Ver Inventario",
      description: "Consultar stock disponible",
      icon: Eye,
      action: () => navigate("/historial"),
      color: "green",
    },
    {
      title: "Reportes",
      description: "Generar reportes de ventas",
      icon: Activity,
      action: () => navigate("/reportes"),
      color: "purple",
    },
  ]

  return (
    <div className="cards-dashboard-wrapper">
      {/* Botón original */}
      <div className="cards-dashboard-header">
        <div className="cards-dashboard-title-section">
          <h3 className="cards-dashboard-title">Resumen de Pedidos</h3>
        </div>
        <div className="cards-dashboard-main-action">
          <button className="cards-dashboard-view-all-btn" onClick={handleClick}>
            <img src={iconsImgs.check || "/placeholder.svg"} alt="Todos" className="cards-dashboard-btn-icon" />
            Ver todos los pedidos
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="cards-dashboard-content">
        {/* Sección de dos columnas */}
        <div className="cards-dashboard-two-column">
          {/* Actividad reciente */}
          <div className="cards-dashboard-activity-section">
            <div className="cards-dashboard-section-header">
              <h4 className="cards-dashboard-section-title">
                <Activity size={20} />
                Actividad Reciente
              </h4>
              <button className="cards-dashboard-view-more">Ver más</button>
            </div>
            <div className="cards-dashboard-activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="cards-dashboard-activity-item">
                  <div className={`cards-dashboard-activity-indicator ${activity.status}`}></div>
                  <div className="cards-dashboard-activity-content">
                    <p className="cards-dashboard-activity-message">{activity.message}</p>
                    <span className="cards-dashboard-activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="cards-dashboard-actions-section">
            <div className="cards-dashboard-section-header">
              <h4 className="cards-dashboard-section-title">
                <Clock size={20} />
                Acciones Rápidas
              </h4>
            </div>
            <div className="cards-dashboard-quick-actions">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    className={`cards-dashboard-quick-action cards-dashboard-action-${action.color}`}
                    onClick={action.action}
                  >
                    <div className="cards-dashboard-action-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="cards-dashboard-action-content">
                      <h5 className="cards-dashboard-action-title">{action.title}</h5>
                      <p className="cards-dashboard-action-description">{action.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Alertas importantes */}
        <div className="cards-dashboard-alerts-section">
          <div className="cards-dashboard-section-header">
            <h4 className="cards-dashboard-section-title">
              <AlertTriangle size={20} />
              Alertas Importantes
            </h4>
          </div>
          <div className="cards-dashboard-alerts-grid">
            <div className="cards-dashboard-alert cards-dashboard-alert-warning">
              <AlertTriangle size={18} />
              <div className="cards-dashboard-alert-content">
                <h5>Stock Bajo</h5>
                <p>5 productos requieren reabastecimiento</p>
              </div>
              <button className="cards-dashboard-alert-action">Revisar</button>
            </div>
            <div className="cards-dashboard-alert cards-dashboard-alert-info">
              <Calendar size={18} />
              <div className="cards-dashboard-alert-content">
                <h5>Pedidos Pendientes</h5>
                <p>12 pedidos esperan confirmación</p>
              </div>
              <button className="cards-dashboard-alert-action">Ver</button>
            </div>
            <div className="cards-dashboard-alert cards-dashboard-alert-success">
              <CheckCircle size={18} />
              <div className="cards-dashboard-alert-content">
                <h5>Meta Alcanzada</h5>
                <p>Objetivo de ventas del mes cumplido</p>
              </div>
              <button className="cards-dashboard-alert-action">Detalles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Función para formatear números
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

// Función para obtener el color del estado
const getStatusColor = (status) => {
  const colors = {
    new: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
  }
  return colors[status] || "#6b7280"
}

// Datos adicionales para el dashboard
const todayStats = {
  totalOrders: 24,
  completedOrders: 18,
  pendingOrders: 6,
  totalRevenue: 45230,
  newCustomers: 89,
  activeProducts: 1247,
}

// Función para calcular porcentajes
const calculatePercentage = (current, previous) => {
  if (previous === 0) return 0
  return (((current - previous) / previous) * 100).toFixed(1)
}

export default Cards
