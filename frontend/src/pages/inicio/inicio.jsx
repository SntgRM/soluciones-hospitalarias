"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { LayoutDashboard, TrendingUp, ShoppingCart, DollarSign, Package, Calendar } from "lucide-react"
import "./inicio.css"

// Datos de ejemplo para las gráficas
const ventasData = [
  { mes: "Ene", ventas: 4000, pedidos: 240 },
  { mes: "Feb", ventas: 3000, pedidos: 198 },
  { mes: "Mar", ventas: 2000, pedidos: 156 },
  { mes: "Abr", ventas: 2780, pedidos: 208 },
  { mes: "May", ventas: 1890, pedidos: 142 },
  { mes: "Jun", ventas: 2390, pedidos: 178 },
  { mes: "Jul", ventas: 3490, pedidos: 265 },
]

const actividadSemanalData = [
  { dia: "Lun", actividad: 65 },
  { dia: "Mar", actividad: 78 },
  { dia: "Mié", actividad: 90 },
  { dia: "Jue", actividad: 81 },
  { dia: "Vie", actividad: 56 },
  { dia: "Sáb", actividad: 45 },
  { dia: "Dom", actividad: 38 },
]

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header mejorado */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <LayoutDashboard size={28} />
              </div>
              <div className="header-text">
                <h1 className="header-title">Dashboard Ejecutivo</h1>
                <p className="header-subtitle">Panel de control y análisis de datos</p>
              </div>
            </div>
            <div className="header-right">
              <div className="status-info">
                <p className="status-label">Última actualización</p>
                <p className="status-time">Hoy, 14:30</p>
              </div>
              <div className="status-indicator"></div>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Ventas Totales</p>
              <p className="stat-value">$45,231</p>
              <p className="stat-trend stat-trend-positive">
                <TrendingUp size={14} />
                +12% vs mes anterior
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pedidos</p>
              <p className="stat-value">1,423</p>
              <p className="stat-trend stat-trend-positive">
                <TrendingUp size={14} />
                +8% vs mes anterior
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Productos</p>
              <p className="stat-value">2,847</p>
              <p className="stat-trend stat-trend-warning">
                <Package size={14} />
                347 en stock bajo
              </p>
            </div>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="charts-grid">
          {/* Gráfica de barras - Ventas mensuales */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-header-icon chart-icon-green">
                <BarChart size={20} />
              </div>
              <div className="chart-header-text">
                <h3 className="chart-title">Ventas Mensuales</h3>
                <p className="chart-subtitle">Últimos 7 meses</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ventasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0032961e" />
                  <XAxis dataKey="mes" stroke="#000000ff" fontSize={12} />
                  <YAxis stroke="#000000ff" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f0fff0", // Cambiado a un verde muy claro
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="ventas"
                    fill="#10b91eff"
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "#08bb17ff", strokeWidth: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfica de línea - Actividad semanal */}
        <div className="chart-card chart-card-full">
          <div className="chart-header-with-stats">
            <div className="chart-header">
              <div className="chart-header-icon chart-icon-purple">
                <Calendar size={20} />
              </div>
              <div className="chart-header-text">
                <h3 className="chart-title">Actividad de la Semana</h3>
                <p className="chart-subtitle">Porcentaje de actividad por día</p>
              </div>
            </div>
            <div className="chart-stats">
              <p className="chart-stats-value">68%</p>
              <p className="chart-stats-label">Promedio semanal</p>
            </div>
          </div>
          <div className="chart-container chart-container-line">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actividadSemanalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="dia" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actividad"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
