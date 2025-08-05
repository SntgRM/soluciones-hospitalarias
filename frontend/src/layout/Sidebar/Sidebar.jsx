"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { personsImgs } from "../../utils/images";
import { navigationLinks_bodega, navigationLinks_ventas, navigationLinks_admin, inicioLink } from "../../data/data";
import "./Sidebar.css";
import { SidebarContext } from "../../context/sidebarContext";
import { ChevronDown, X, Warehouse, BadgeDollarSign } from "lucide-react";

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const [isBodegaDropdownOpen, setIsBodegaDropdownOpen] = useState(false);
  const [isVentasDropdownOpen, setIsVentasDropdownOpen] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const sidebarRef = useRef(null);

  const role = localStorage.getItem("userRole") || "";

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change");
    } else {
      setSidebarClass("");
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) {
      setIsBodegaDropdownOpen(false);
      setIsVentasDropdownOpen(false);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        toggleSidebar();
      }
    };

    if (isSidebarOpen && window.innerWidth <= 768) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);

  const toggleBodegaDropdown = () => {
    setIsBodegaDropdownOpen(!isBodegaDropdownOpen);
    if (isVentasDropdownOpen) {
      setIsVentasDropdownOpen(false);
    }
  };

  const toggleVentasDropdown = () => {
    setIsVentasDropdownOpen(!isVentasDropdownOpen);
    if (isBodegaDropdownOpen) {
      setIsBodegaDropdownOpen(false);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div className={`sidebar-placeholder ${sidebarClass}`}></div>

      <div className={`sidebar ${sidebarClass}`} ref={sidebarRef}>
        <div className="sidebar-inner">
          <button
            className="sidebar-close-btn"
            onClick={toggleSidebar}
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>

          <div className="user-info">
            <img
              src={personsImgs.ISOTIPO || "/placeholder.svg"}
              className="user-avatar"
              alt="Avatar de usuario"
            />
            <span className="info-name">
              Soluciones Hospitalarias de la costa S.A.S
            </span>
          </div>

          <nav className="navigation">
          {/* INICIO - Ahora aparece primero, arriba de todo */}
            <ul className="nav-list">
              <li className="nav-item dropdown-container" role="none">
                <NavLink
                  to={inicioLink.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={handleLinkClick}
                  role="menuitem"
                >
                  <img
                    src={inicioLink.image || "/placeholder.svg"}
                    className="nav-link-icon"
                    style={{ filter: "invert(100%)" }}
                    alt={inicioLink.title}
                  />
                  <span className="nav-link-text">
                    {inicioLink.title}
                  </span>
                </NavLink>
              </li>
            </ul>
            {["administrador", "bodega", "ventas"].includes(role) && (
              <div className="dropdown-container">
                <button
                  className={`dropdown-toggle ${
                    isBodegaDropdownOpen ? "active" : ""
                  }`}
                  onClick={toggleBodegaDropdown}
                  aria-expanded={isBodegaDropdownOpen}
                  aria-controls="bodega-menu"
                >
                  <div className="dropdown-toggle-content">
                    <Warehouse size={20} />
                    <span className="dropdown-toggle-text">Bodega</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`dropdown-arrow ${
                      isBodegaDropdownOpen ? "rotated" : ""
                    }`}
                  />
                </button>

                <div
                  id="bodega-menu"
                  className={`dropdown-menu ${
                    isBodegaDropdownOpen ? "open" : ""
                  }`}
                  role="menu"
                >
                  <ul className="nav-list">
                    {navigationLinks_bodega
                      .filter(
                        (navigationLink) => navigationLink.title !== "Salir"
                      )
                      .map((navigationLink) => (
                        <li
                          className="nav-item"
                          key={navigationLink.id}
                          role="none"
                        >
                          <NavLink
                            to={navigationLink.path}
                            className={({ isActive }) =>
                              `nav-link ${isActive ? "active" : ""}`
                            }
                            onClick={handleLinkClick}
                            role="menuitem"
                          >
                            <img
                              src={navigationLink.image || "/placeholder.svg"}
                              className="nav-link-icon"
                              style={{ filter: "invert(100%)" }}
                              alt={navigationLink.title}
                            />
                            <span className="nav-link-text">
                              {navigationLink.title}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Ventas: Solo administrador y ventas */}
            {["administrador", "ventas"].includes(role) && (
              <div className="dropdown-container">
                <button
                  className={`dropdown-toggle ${
                    isVentasDropdownOpen ? "active" : ""
                  }`}
                  onClick={toggleVentasDropdown}
                  aria-expanded={isVentasDropdownOpen}
                  aria-controls="ventas-menu"
                >
                  <div className="dropdown-toggle-content">
                    <BadgeDollarSign size={20} />
                    <span className="dropdown-toggle-text">Ventas</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`dropdown-arrow ${
                      isVentasDropdownOpen ? "rotated" : ""
                    }`}
                  />
                </button>
                <div
                  id="ventas-menu"
                  className={`dropdown-menu ${
                    isVentasDropdownOpen ? "open" : ""
                  }`}
                  role="menu"
                >
                  <ul className="nav-list">
                    {navigationLinks_ventas
                      .filter(
                        (navigationLink) => navigationLink.title !== "Salir"
                      )
                      .map((navigationLink) => (
                        <li
                          className="nav-item"
                          key={navigationLink.id}
                          role="none"
                        >
                          <NavLink
                            to={navigationLink.path}
                            className={({ isActive }) =>
                              `nav-link ${isActive ? "active" : ""}`
                            }
                            onClick={handleLinkClick}
                            role="menuitem"
                          >
                            <img
                              src={navigationLink.image || "/placeholder.svg"}
                              className="nav-link-icon"
                              style={{ filter: "invert(100%)" }}
                              alt={navigationLink.title}
                            />
                            <span className="nav-link-text">
                              {navigationLink.title}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Enlaces individuales (ayuda, usuarios, salir) */}
            <ul className="nav-list extra-links">
              {navigationLinks_admin
                .filter((link) => {
                  if (link.title === "Usuarios")
                    return role === "administrador";
                  return true;
                })
                .map((navigationLink) => (
                  <li className="nav-item" key={navigationLink.id} role="none">
                    {navigationLink.title === "Salir" ? (
                      <a
                        href="/login"
                        onClick={handleLinkClick}
                        className="nav-link"
                        role="menuitem"
                      >
                        <img
                          src={navigationLink.image || "/placeholder.svg"}
                          className="nav-link-icon"
                          style={{ filter: "invert(100%)" }}
                          alt={navigationLink.title}
                        />
                        <span className="nav-link-text">
                          {navigationLink.title}
                        </span>
                      </a>
                    ) : (
                      <NavLink
                        to={navigationLink.path}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={handleLinkClick}
                        role="menuitem"
                      >
                        <img
                          src={navigationLink.image || "/placeholder.svg"}
                          className="nav-link-icon"
                          style={{ filter: "invert(100%)" }}
                          alt={navigationLink.title}
                        />
                        <span className="nav-link-text">
                          {navigationLink.title}
                        </span>
                      </NavLink>
                    )}
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
