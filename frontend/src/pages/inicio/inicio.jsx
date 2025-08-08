"use client"
import { Home, Shield, Package, ShoppingCart, Users, BarChart3, Settings, Bell, Calendar, Clock, CheckCircle } from "lucide-react"
import "./inicio.css"
import { topContent } from "../../data/data"
import * as LucideIcons from 'lucide-react';

const IconComponent = LucideIcons[topContent[0].iconName];

const WelcomePage = () => {
  // const currentTime = new Date().toLocaleTimeString('es-ES', { 
  //   hour: '2-digit', 
  //   minute: '2-digit' 
  // })
  // const currentDate = new Date().toLocaleDateString('es-ES', { 
  //   weekday: 'long', 
  //   year: 'numeric', 
  //   month: 'long', 
  //   day: 'numeric' 
  // })

  const roleFeatures = {
    admin: [
      { icon: Users, title: "Gestión de Usuarios", description: "Administra permisos y roles del sistema" },
      { icon: BarChart3, title: "Reportes Avanzados", description: "Accede a análisis detallados y métricas" },
      { icon: Settings, title: "Configuración", description: "Personaliza el sistema según tus necesidades" }
    ],
    bodega: [
      { icon: Package, title: "Control de Inventario", description: "Gestiona stock y movimientos de productos" },
      { icon: CheckCircle, title: "Recepción de Mercancía", description: "Registra entradas y salidas de almacén" },
      { icon: BarChart3, title: "Reportes de Bodega", description: "Consulta estadísticas de inventario" }
    ],
    ventas: [
      { icon: ShoppingCart, title: "Gestión de Ventas", description: "Procesa pedidos y cotizaciones" },
      { icon: Users, title: "Clientes", description: "Administra tu cartera de clientes" },
      { icon: BarChart3, title: "Métricas de Ventas", description: "Revisa tu rendimiento y comisiones" }
    ]
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">

        {/* Header de Bienvenida */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <IconComponent />
              </div>
              <div className="header-text">
                <h1 className="header-title">{ topContent[0].title }</h1>
                <p className="header-subtitle">{ topContent[0].description }</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de la empresa */}
        <div className="company-info-section">
          <div className="company-card">
            <div className="company-header">
              <div className="company-logo">
                <Shield size={48} />
              </div>
              <div className="company-intro">
                <h2>¿Quiénes somos?</h2>
                <p>
                  Somos una empresa proactiva e innovadora dedicada a brindarle soluciones a sus clientes 
                  en la adquisición de equipos médicos, medicamentos, insumos hospitalarios, repuestos, 
                  accesorios y gestión de mantenimiento, naciendo así en respuesta a las necesidades del 
                  sector salud de encontrar un aliado que le suministre un servicio integral.
                </p>
              </div>
            </div>
            
            <div className="company-values">
              <div className="value-card">
                <div className="value-icon value-icon-mission">
                  <CheckCircle size={32} />
                </div>
                <div className="value-content">
                  <h3>Misión</h3>
                  <p>
                    Ofrecemos un servicio integral a nuestros clientes a través de la asesoría en la 
                    adquisición de dispositivos médicos, repuestos, accesorios, insumos hospitalarios 
                    y medicamentos, realizamos mantenimiento de equipos médicos cumpliendo con la 
                    normativa legal vigente, apoyándonos con plataformas tecnológicas.
                  </p>
                </div>
              </div>

              <div className="value-card">
                <div className="value-icon value-icon-vision">
                  <BarChart3 size={32} />
                </div>
                <div className="value-content">
                  <h3>Visión</h3>
                  <p>
                    En el 2030 estaremos consolidados como una empresa líder en Colombia en la 
                    comercialización de productos médicos y en soluciones tecnológicas para el 
                    apoyo a la gestión de la tecnología Biomédica manteniendo así un nivel alto 
                    de calidad para seguir siendo identificados como símbolo de excelencia en el sector salud.
                  </p>
                </div>
              </div>

              <div className="value-card value-card-full">
                <div className="value-icon value-icon-quality">
                  <Settings size={32} />
                </div>
                <div className="value-content">
                  <h3>Política de Calidad</h3>
                  <p>
                    Nos comprometemos a garantizar la satisfacción de las necesidades de nuestros clientes 
                    ofreciéndoles productos y servicios de acuerdo a los requisitos especificados en el área 
                    hospitalaria, haciendo entrega de estos de manera eficaz y oportuna brindándole una 
                    atención personalizada. Contamos con un recurso humano altamente calificado bajo los 
                    principios de seriedad, responsabilidad, cumplimiento y honestidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
                {/* Mensaje de bienvenida personalizado */}
        <div className="welcome-message">
          <div className="message-card">
            <div className="message-header">
              <div className="message-icon">
                <CheckCircle size={24} />
              </div>
              <h3>¡Bienvenido al Sistema de Gestión!</h3>
            </div>
            <div className="message-content">
              <p>
                Nuestro sistema de gestión está diseñado específicamente para el sector de la salud, 
                integrando todas las áreas operativas de Soluciones Hospitalarias de la Costa S.A.S. 
                Utiliza el menú de navegación para acceder a las diferentes funcionalidades según tu rol asignado.
              </p>
              <div className="message-tips">
                <h4>Nuestros Servicios:</h4>
                <ul>
                  <li>Comercialización de equipos médicos y dispositivos especializados</li>
                  <li>Suministro de medicamentos genéricos y comerciales</li>
                  <li>Gestión de insumos hospitalarios y accesorios médicos</li>
                  <li>Mantenimiento preventivo y correctivo de equipos biomédicos</li>
                  <li>Asesoría técnica especializada en tecnología hospitalaria</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Tarjetas de acceso rápido por rol */}
        <div className="welcome-section">
          <h2 className="section-title">Acceso por Rol del Sistema</h2>
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon role-icon-admin">
                <Shield size={32} />
              </div>
              <div className="role-info">
                <h3 className="role-title">Administrador</h3>
                <p className="role-description">Control total del sistema de gestión hospitalaria</p>
                <div className="role-features">
                  {roleFeatures.admin.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <feature.icon size={16} />
                      <span>{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="role-card">
              <div className="role-icon role-icon-bodega">
                <Package size={32} />
              </div>
              <div className="role-info">
                <h3 className="role-title">Bodega</h3>
                <p className="role-description">Gestión de inventario de equipos médicos e insumos</p>
                <div className="role-features">
                  {roleFeatures.bodega.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <feature.icon size={16} />
                      <span>{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="role-card">
              <div className="role-icon role-icon-ventas">
                <ShoppingCart size={32} />
              </div>
              <div className="role-info">
                <h3 className="role-title">Ventas</h3>
                <p className="role-description">Gestión de clientes y comercialización de productos</p>
                <div className="role-features">
                  {roleFeatures.ventas.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <feature.icon size={16} />
                      <span>{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage