"use client"

import { useEffect, useState, useContext, useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { personsImgs } from "../../utils/images"
import { navigationLinks_bodega, navigationLinks_ventas, navigationLinks_admin } from "../../data/data"
import "./Sidebar.css"
import { SidebarContext } from "../../context/sidebarContext"
import Swal from "sweetalert2"
import { ChevronDown, X, Warehouse, BadgeDollarSign } from "lucide-react" // Importar iconos de Lucide React

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("")
  const [isBodegaDropdownOpen, setIsBodegaDropdownOpen] = useState(false) // Renombrado para claridad
  const [isVentasDropdownOpen, setIsVentasDropdownOpen] = useState(false)
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext) // Obtener toggleSidebar del contexto
  const navigate = useNavigate()
  const sidebarRef = useRef(null) // Ref para el sidebar

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change")
    } else {
      setSidebarClass("")
    }
  }, [isSidebarOpen])

  // Cerrar dropdowns cuando se cierra el sidebar
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsBodegaDropdownOpen(false)
      setIsVentasDropdownOpen(false)
    }
  }, [isSidebarOpen])

  // Lógica para cerrar el sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        toggleSidebar() // Cierra el sidebar si el clic es fuera
      }
    }

    // Solo añadir el listener si el sidebar está abierto y en móvil
    if (isSidebarOpen && window.innerWidth <= 768) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isSidebarOpen, toggleSidebar])

  const toggleBodegaDropdown = () => {
    setIsBodegaDropdownOpen(!isBodegaDropdownOpen)
    if (isVentasDropdownOpen) {
      // Cerrar el otro dropdown si está abierto
      setIsVentasDropdownOpen(false)
    }
  }

  const toggleVentasDropdown = () => {
    setIsVentasDropdownOpen(!isVentasDropdownOpen)
    if (isBodegaDropdownOpen) {
      // Cerrar el otro dropdown si está abierto
      setIsBodegaDropdownOpen(false)
    }
  }

  const handleLinkClick = () => {
    // Cierra el sidebar si está abierto y es una pantalla pequeña
    if (window.innerWidth <= 768 && isSidebarOpen) {
      toggleSidebar()
    }
  }

  const handleLogoutClick = (e) => {
    e.preventDefault()

    Swal.fire({
      title: "¿Estás seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#fff",
      color: "#1A1A1A",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken")
        navigate("/login")
      }
    })
  }

  return (
    <>
      {/* Placeholder invisible que ocupa el espacio del sidebar en desktop */}
      <div className={`sidebar-placeholder ${sidebarClass}`}></div>

      {/* Sidebar fijo */}
      <div className={`sidebar ${sidebarClass}`} ref={sidebarRef}>
        <div className="sidebar-inner">
          {/* Botón de cierre para móvil */}
          <button className="sidebar-close-btn" onClick={toggleSidebar} aria-label="Cerrar menú">
            <X size={24} />
          </button>

          {/* Header del usuario */}
          <div className="user-info">
            <img src={personsImgs.ISOTIPO || "/placeholder.svg"} className="user-avatar" alt="Avatar de usuario" />
            <span className="info-name">Soluciones Hospitalarias de la costa S.A.S</span>
          </div>

          {/* Navegación con dropdowns */}
          <nav className="navigation">
            {/* Dropdown de Bodega */}
            <div className="dropdown-container">
              <button
                className={`dropdown-toggle ${isBodegaDropdownOpen ? "active" : ""}`}
                onClick={toggleBodegaDropdown}
                aria-expanded={isBodegaDropdownOpen}
                aria-controls="bodega-menu"
              >
                <div className="dropdown-toggle-content">
                  {/* Asumiendo que navigationLinks_bodega[0].image es el icono principal de Bodega */}
                  <Warehouse size={20} />
                  <span className="dropdown-toggle-text">Bodega</span>
                </div>
                <ChevronDown size={16} className={`dropdown-arrow ${isBodegaDropdownOpen ? "rotated" : ""}`} />
              </button>

              <div id="bodega-menu" className={`dropdown-menu ${isBodegaDropdownOpen ? "open" : ""}`} role="menu">
                <ul className="nav-list">
                  {navigationLinks_bodega
                    .filter((navigationLink) => navigationLink.title !== "Salir")
                    .map((navigationLink) => (
                      <li className="nav-item" key={navigationLink.id} role="none">
                        <NavLink
                          to={navigationLink.path}
                          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                          onClick={handleLinkClick} // Usa la función unificada
                          role="menuitem"
                        >
                          <img
                            src={navigationLink.image || "/placeholder.svg"}
                            className="nav-link-icon"
                            style={{ filter: "invert(100%)" }}
                            alt={navigationLink.title}
                          />
                          <span className="nav-link-text">{navigationLink.title}</span>
                        </NavLink>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Dropdown de Ventas */}
            <div className="dropdown-container">
              <button
                className={`dropdown-toggle ${isVentasDropdownOpen ? "active" : ""}`}
                onClick={toggleVentasDropdown}
                aria-expanded={isVentasDropdownOpen}
                aria-controls="ventas-menu"
              >
                <div className="dropdown-toggle-content">
                  {/* Asumiendo que navigationLinks_ventas[0].image es el icono principal de Ventas */}
                  <BadgeDollarSign size={20} />
                  <span className="dropdown-toggle-text">Ventas</span>
                </div>
                <ChevronDown size={16} className={`dropdown-arrow ${isVentasDropdownOpen ? "rotated" : ""}`} />
              </button>
              <div id="ventas-menu" className={`dropdown-menu ${isVentasDropdownOpen ? "open" : ""}`} role="menu">
                <ul className="nav-list">
                  {navigationLinks_ventas
                    .filter((navigationLink) => navigationLink.title !== "Salir")
                    .map((navigationLink) => (
                      <li className="nav-item" key={navigationLink.id} role="none">
                        <NavLink
                          to={navigationLink.path}
                          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                          onClick={handleLinkClick} // Usa la función unificada
                          role="menuitem"
                        >
                          <img
                            src={navigationLink.image || "/placeholder.svg"}
                            className="nav-link-icon"
                            style={{ filter: "invert(100%)" }}
                            alt={navigationLink.title}
                          />
                          <span className="nav-link-text">{navigationLink.title}</span>
                        </NavLink>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Enlaces individuales fuera de los dropdowns */}
            <ul className="nav-list extra-links">
              {navigationLinks_admin.map((navigationLink) => (
                <li className="nav-item" key={navigationLink.id} role="none">
                  {navigationLink.title === "Salir" ? (
                    <a href="/login" onClick={handleLogoutClick} className="nav-link" role="menuitem">
                      <img
                        src={navigationLink.image || "/placeholder.svg"}
                        className="nav-link-icon"
                        style={{ filter: "invert(100%)" }}
                        alt={navigationLink.title}
                      />
                      <span className="nav-link-text">{navigationLink.title}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={navigationLink.path}
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                      onClick={handleLinkClick} // Usa la función unificada
                      role="menuitem"
                    >
                      <img
                        src={navigationLink.image || "/placeholder.svg"}
                        className="nav-link-icon"
                        style={{ filter: "invert(100%)" }}
                        alt={navigationLink.title}
                      />
                      <span className="nav-link-text">{navigationLink.title}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
