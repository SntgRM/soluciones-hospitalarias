"use client"

import { useState } from "react"
import "./ayuda.css"
import { topContent } from "../../data/data.js";
import * as LucideIcons from 'lucide-react';
import {
  HelpCircle,
  Package,
  Clock,
  User,
  ShoppingCart,
  FileText,
  Settings,
  Shield,
  Database,
  Search,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const preguntasFrecuentes = [
  // Sección de Pedidos
  {
    categoria: "Pedidos",
    icono: <Package size={20} />,
    preguntas: [
      {
        pregunta: "¿Cómo puedo registrar un nuevo pedido?",
        respuesta:
          "Ve a la sección de 'Registrar Pedido' y completa el formulario con los datos requeridos: cliente, producto, cantidad, fecha y estado. Luego haz clic en 'Registrar Pedido'. El sistema validará automáticamente los campos obligatorios.",
      },
      {
        pregunta: "¿Puedo modificar un pedido después de registrarlo?",
        respuesta:
          "Actualmente no es posible modificar un pedido desde la interfaz una vez registrado. Para realizar cambios, debes contactar al administrador del sistema o crear un nuevo pedido con la información correcta.",
      },
      {
        pregunta: "¿Qué significan los diferentes estados del pedido?",
        respuesta:
          "Los estados indican el progreso del pedido: 'En Alistamiento' (preparando productos), 'En Proceso' (siendo procesado), 'Empacado' (listo para envío), 'En Reparto' (con repartidor), 'Enviado al Cliente' (entregado directamente), 'Enviado en Transportadora' (enviado por empresa de transporte).",
      },
      {
        pregunta: "¿Cómo se asigna la prioridad de un pedido?",
        respuesta:
          "La prioridad la seleccionas al registrar el pedido: Alta (urgente, procesamiento inmediato), Media (procesamiento normal), o Baja (puede esperar). Esta prioridad ayuda a determinar el orden de procesamiento en el sistema.",
      },
      {
        pregunta: "¿Qué información adicional puedo agregar a un pedido?",
        respuesta:
          "Puedes agregar notas adicionales en el campo de observaciones, especificar códigos de empaque para pedidos empacados, asignar repartidores para entregas directas, y registrar información de transportadora con número de guía para envíos externos.",
      },
    ],
  },
  // Sección de Usuarios
  {
    categoria: "Gestión de Usuarios",
    icono: <User size={20} />,
    preguntas: [
      {
        pregunta: "¿Cómo crear un nuevo usuario en el sistema?",
        respuesta:
          "Ve a la sección 'User', haz clic en 'Nuevo Usuario', completa el formulario con nombre, apellido, email, teléfono, rol, departamento y contraseña temporal. El usuario recibirá las credenciales para su primer acceso.",
      },
      {
        pregunta: "¿Qué roles de usuario están disponibles?",
        respuesta:
          "Los roles disponibles son: Administrador (acceso completo), Farmacéutico (gestión de medicamentos), Vendedor (procesamiento de ventas), e Inventario (control de stock). Cada rol tiene permisos específicos según sus responsabilidades.",
      },
      {
        pregunta: "¿Cómo desactivar un usuario?",
        respuesta:
          "En la lista de usuarios, busca al usuario deseado, haz clic en 'Editar', cambia el estado a 'Inactivo' y guarda los cambios. Los usuarios inactivos no podrán acceder al sistema pero mantendrán su historial.",
      },
      {
        pregunta: "¿Puedo cambiar el rol de un usuario existente?",
        respuesta:
          "Sí, puedes modificar el rol de cualquier usuario editando su perfil. Ve a 'User', busca al usuario, haz clic en 'Editar', selecciona el nuevo rol y guarda los cambios. Los nuevos permisos se aplicarán inmediatamente.",
      },
    ],
  },
  // Sección de Historial y Eventos
  {
    categoria: "Historial y Eventos",
    icono: <Clock size={20} />,
    preguntas: [
      {
        pregunta: "¿Cómo consultar el historial de modificaciones de un producto?",
        respuesta:
          "Ve a la sección 'Historial', busca el producto por ID o nombre. Haz clic en la tarjeta del producto para expandir y ver todas las modificaciones: creaciones, ediciones, eliminaciones, con fecha, hora y usuario responsable.",
      },
      {
        pregunta: "¿Qué tipos de eventos se registran en el historial?",
        respuesta:
          "Se registran cuatro tipos de eventos: Creación (nuevos productos), Edición (cambios en precio, stock, descripción), Eliminación (productos retirados), y Eventos Generales (aprobaciones, validaciones del sistema).",
      },
      {
        pregunta: "¿Puedo filtrar el historial por fechas específicas?",
        respuesta:
          "Sí, utiliza los filtros de fecha en la parte superior. Selecciona 'Fecha inicio' y 'Fecha fin' para ver solo las modificaciones en ese período. También puedes filtrar por tipo de evento (creación, edición, eliminación).",
      },
      {
        pregunta: "¿Quién puede ver el historial de modificaciones?",
        respuesta:
          "El historial es visible para usuarios con roles de Administrador e Inventario. Los demás roles tienen acceso limitado solo a consultas básicas. Esto garantiza la trazabilidad y control de cambios en el sistema.",
      },
      {
        pregunta: "¿Se puede exportar el historial de eventos?",
        respuesta:
          "Actualmente la exportación no está disponible desde la interfaz. Para obtener reportes detallados del historial, contacta al administrador del sistema quien puede generar reportes personalizados según tus necesidades.",
      },
    ],
  },
  // Sección de Sistema
  {
    categoria: "Sistema y Configuración",
    icono: <Settings size={20} />,
    preguntas: [
      {
        pregunta: "¿Cómo cambiar mi contraseña?",
        respuesta:
          "Ve a tu perfil de usuario, selecciona 'Cambiar Contraseña', ingresa tu contraseña actual y la nueva contraseña dos veces. La nueva contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números.",
      },
      {
        pregunta: "¿Qué hacer si olvido mi contraseña?",
        respuesta:
          "Contacta al administrador del sistema para que restablezca tu contraseña. Por seguridad, solo los administradores pueden generar contraseñas temporales que deberás cambiar en tu primer acceso.",
      },
      {
        pregunta: "¿El sistema guarda automáticamente los cambios?",
        respuesta:
          "No, debes hacer clic en 'Guardar' o 'Registrar' para confirmar los cambios. El sistema te mostrará mensajes de confirmación cuando los datos se guarden exitosamente o si hay errores que corregir.",
      },
      {
        pregunta: "¿Puedo usar el sistema desde dispositivos móviles?",
        respuesta:
          "Sí, el sistema es completamente responsivo y se adapta a tablets y smartphones. Todas las funcionalidades están disponibles en dispositivos móviles con una interfaz optimizada para pantallas táctiles.",
      },
    ],
  },
  // Sección de Ventas
  {
    categoria: "Ventas y Reportes",
    icono: <ShoppingCart size={20} />,
    preguntas: [
      {
        pregunta: "¿Cómo registrar una nueva venta?",
        respuesta:
          "Ve a 'Ventas' > 'Nueva Venta', selecciona el cliente, agrega los productos con cantidades, verifica el total y confirma la venta. El sistema actualizará automáticamente el inventario y generará la factura correspondiente.",
      },
      {
        pregunta: "¿Puedo consultar el historial de ventas?",
        respuesta:
          "Sí, en 'Ventas' > 'Historial' puedes ver todas las ventas realizadas. Puedes filtrar por fecha, cliente, vendedor o estado. Cada venta muestra detalles completos incluyendo productos, cantidades y totales.",
      },
      {
        pregunta: "¿Cómo generar reportes de ventas?",
        respuesta:
          "Ve a 'Ventas' > 'Reportes' donde puedes generar reportes por período, vendedor, producto o cliente. Los reportes incluyen gráficos y estadísticas detalladas para análisis de rendimiento y tendencias de venta.",
      },
      {
        pregunta: "¿Qué hacer si hay un error en una venta registrada?",
        respuesta:
          "Las ventas no pueden modificarse directamente. Debes crear una nota de crédito o devolución según el caso, o contactar al administrador para realizar los ajustes necesarios en el sistema.",
      },
    ],
  },
]

function FAQ() {
  const IconComponent = LucideIcons[topContent[4].iconName];
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [preguntaActiva, setPreguntaActiva] = useState(null)
  const [busqueda, setBusqueda] = useState("")

  const toggleCategoria = (index) => {
    setCategoriaActiva(categoriaActiva === index ? null : index)
    setPreguntaActiva(null) // Reset pregunta activa al cambiar categoría
  }

  const togglePregunta = (categoriaIndex, preguntaIndex) => {
    const key = `${categoriaIndex}-${preguntaIndex}`
    setPreguntaActiva(preguntaActiva === key ? null : key)
  }

  // Filtrar preguntas por búsqueda
  const preguntasFiltradas = preguntasFrecuentes
    .map((categoria) => ({
      ...categoria,
      preguntas: categoria.preguntas.filter(
        (item) =>
          item.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.respuesta.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    }))
    .filter((categoria) => categoria.preguntas.length > 0)

  return (
    <div className="faq-container">
      {/* Header de Bienvenida */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <IconComponent />
            </div>
            <div className="header-text">
              <h1 className="header-title">{ topContent[4].title }</h1>
              <p className="header-subtitle">{ topContent[4].description }</p>
            </div>
          </div>
        </div>
        <div className="faq-search">
          <input
            type="text"
            placeholder="Buscar en preguntas frecuentes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
      </div>


      <div className="faq-stats">
        <div className="stat-item">
          <span className="stat-number">{preguntasFrecuentes.length}</span>
          <span className="stat-label">Categorías</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {preguntasFrecuentes.reduce((total, cat) => total + cat.preguntas.length, 0)}
          </span>
          <span className="stat-label">Preguntas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{preguntasFiltradas.length}</span>
          <span className="stat-label">Resultados</span>
        </div>
      </div>

      <div className="faq-content">
        {preguntasFiltradas.length > 0 ? (
          preguntasFiltradas.map((categoria, categoriaIndex) => (
            <div key={categoriaIndex} className="faq-categoria">
              <div
                className={`categoria-header ${categoriaActiva === categoriaIndex ? "activa" : ""}`}
                onClick={() => toggleCategoria(categoriaIndex)}
              >
                <div className="categoria-info">
                  <div className="categoria-icon">{categoria.icono}</div>
                  <div className="categoria-details">
                    <h3 className="categoria-titulo">{categoria.categoria}</h3>
                    <span className="categoria-count">{categoria.preguntas.length} preguntas</span>
                  </div>
                </div>
                <div className="categoria-toggle">
                  {categoriaActiva === categoriaIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {categoriaActiva === categoriaIndex && (
                <div className="categoria-content">
                  {categoria.preguntas.map((item, preguntaIndex) => {
                    const preguntaKey = `${categoriaIndex}-${preguntaIndex}`
                    return (
                      <div key={preguntaIndex} className="faq-item">
                        <div
                          className={`faq-pregunta ${preguntaActiva === preguntaKey ? "activa" : ""}`}
                          onClick={() => togglePregunta(categoriaIndex, preguntaIndex)}
                        >
                          <span className="pregunta-texto">{item.pregunta}</span>
                          <span className="faq-icon">
                            {preguntaActiva === preguntaKey ? <Minus size={18} /> : <Plus size={18} />}
                          </span>
                        </div>
                        {preguntaActiva === preguntaKey && (
                          <div className="faq-respuesta">
                            <div className="respuesta-content">
                              <FileText size={16} className="respuesta-icon" />
                              <p>{item.respuesta}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <Search size={48} className="no-results-icon" />
            <h3>No se encontraron resultados</h3>
            <p>No hay preguntas que coincidan con tu búsqueda "{busqueda}"</p>
            <button className="clear-search" onClick={() => setBusqueda("")}>
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      <div className="faq-footer">
        <div className="contact-info">
          <h4>¿No encontraste lo que buscabas?</h4>
          <p>Contacta al administrador del sistema para obtener ayuda adicional</p>
          <div className="contact-methods">
            <div className="contact-item">
              <Shield size={16} />
              <span>Administrador del Sistema</span>
            </div>
            <div className="contact-item">
              <Database size={16} />
              <span>Soporte Técnico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
