"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LayoutDashboard, Package } from "lucide-react";
import { getResumenFechas, getAlistadoresResumen } from "../../services/api";
import "./dashboard.css";
import { topContent } from "../../data/data.js";
import DashboardHeader from "../../components/titleContent/titleContent.jsx";

const DashboardPage = () => {
  const [resumen, setResumen] = useState({
    diarios: 0,
    mensuales: 0,
    anuales: 0,
  });
  const [period, setPeriod] = useState("month");
  const [alistadoresData, setAlistadoresData] = useState([]);
  const [periodValue, setPeriodValue] = useState(""); // valor concreto (ej. "2025-08-01" o "2025-08" o "2025")
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [loadingAlistadores, setLoadingAlistadores] = useState(false);

  const fetchResumen = async () => {
    try {
      const data = await getResumenFechas();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen de pedidos:", error);
    }
  };

  const fetchAlistadores = async (p = period, filters = {}) => {
    try {
      setLoadingAlistadores(true);
      const data = await getAlistadoresResumen(p, filters);
      const formatted = (Array.isArray(data) ? data : []).map((item) => ({
        nombre_alistador: item.nombre_alistador,
        total: item.total,
      }));
      setAlistadoresData(formatted);
    } catch (error) {
      console.error("Error al cargar resumen de alistadores:", error);
      setAlistadoresData([]);
    } finally {
      setLoadingAlistadores(false);
    }
  };

  useEffect(() => {
    fetchResumen();
    fetchAlistadores();
    const interval = setInterval(() => {
      fetchResumen();
      fetchAlistadores();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cuando cambia el periodo, recargar datos
  useEffect(() => {
    fetchAlistadores(period);
  }, [period]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header de Bienvenida */}
        <DashboardHeader
          icon={topContent[6].icon}
          title={topContent[6].title}
          description={topContent[6].description}
        />
        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pedidos diarios</p>
              <p className="stat-value">{resumen.diarios}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pedidos mensuales</p>
              <p className="stat-value">{resumen.mensuales}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pedidos anuales</p>
              <p className="stat-value">{resumen.anuales}</p>
            </div>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="charts-grid">
          {/* Gráfica de barras - Alistadores con más pedidos */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-header-icon chart-icon-green">
                <BarChart size={20} />
              </div>
              <div className="chart-header-text">
                <h3 className="chart-title">Alistadores con más pedidos</h3>
                <p className="chart-subtitle">
                  {period === "day" && "Hoy"}
                  {period === "month" && "Este mes"}
                  {period === "year" && "Este año"}
                </p>
              </div>
            </div>

            {/* Botones para cambiar periodo */}
            <div className="period-buttons">
              <button
                className={period === "day" ? "active" : ""}
                onClick={() => setPeriod("day")}
                aria-pressed={period === "day"}
                type="button"
              >
                Día
              </button>
              <button
                className={period === "month" ? "active" : ""}
                onClick={() => setPeriod("month")}
                aria-pressed={period === "month"}
                type="button"
              >
                Mes
              </button>
              <button
                className={period === "year" ? "active" : ""}
                onClick={() => setPeriod("year")}
                aria-pressed={period === "year"}
                type="button"
              >
                Año
              </button>
            </div>

            {/* Inputs dinámicos a la derecha */}
            <div className="period-input">
              {period === "day" && (
                <input
                  aria-label="Seleccionar fecha"
                  type="date"
                  value={periodValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPeriodValue(v);
                    if (!v) return;
                    const date = new Date(v);
                    if (isNaN(date.getTime())) return;
                    fetchAlistadores("day", {
                      year: date.getFullYear(),
                      month: date.getMonth() + 1,
                      day: date.getDate(),
                    });
                  }}
                />
              )}

              {period === "month" && (
                <input
                  aria-label="Seleccionar mes"
                  type="month"
                  value={periodValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPeriodValue(v);
                    if (!v) return;
                    const [year, month] = v.split("-");
                    if (!year || !month) return;
                    fetchAlistadores("month", { year, month });
                  }}
                />
              )}

              {period === "year" && (
                <input
                  aria-label="Seleccionar año"
                  type="number"
                  placeholder="Año"
                  min={2000}
                  max={2100}
                  value={periodValue}
                  onChange={(e) => {
                    const y = e.target.value;
                    setPeriodValue(y);
                    if (!y) return;
                    fetchAlistadores("year", { year: y });
                  }}
                />
              )}
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alistadoresData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#0032961e" />
                  <XAxis
                    dataKey="nombre_alistador"
                    stroke="#000000ff"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={40}
                  />
                  <YAxis stroke="#000000ff" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f0fff0", // Verde muy claro
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#10b91eff"
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "#08bb17ff", strokeWidth: 2 }}
                    name="Pedidos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfica de línea - Actividad semanal */}
        {/* <div className="chart-card chart-card-full">
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
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
