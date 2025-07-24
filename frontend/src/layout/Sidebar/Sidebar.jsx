import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { personsImgs } from "../../utils/images";
import { navigationLinks_bodega, navigationLinks_ventas, navigationLinks_admin } from "../../data/data";
import "./Sidebar.css";
import { SidebarContext } from "../../context/sidebarContext";
import Swal from "sweetalert2";


const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVentasDropdownOpen, setIsVentasDropdownOpen] = useState(false);
  const { isSidebarOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change");
    } else {
      setSidebarClass("");
    }
  }, [isSidebarOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleVentasDropdown = () => {
    setIsVentasDropdownOpen(!isVentasDropdownOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5dd36dff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#fff",
      color: "#1A1A1A",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    });
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      {/* Header del usuario */}
      <div className="user-info">
        <img
          src={personsImgs.ISOTIPO}
          className="user-avatar"
          alt="Avatar de usuario"
        />
        <span className="info-name">NOMBRE DE USUARIO</span>
      </div>

      {/* Navegación con dropdowns */}
      <nav className="navigation">
        {/* Dropdown de Bodega */}
        <div className="dropdown-container">
          <button
            className={`dropdown-toggle ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            <span className="dropdown-toggle-text">Bodega</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}>
              ▼
            </span>
          </button>

          <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            <ul className="nav-list">
              {navigationLinks_bodega
                .filter((navigationLink) => navigationLink.title !== "Salir")
                .map((navigationLink) => (
                  <li className="nav-item" key={navigationLink.id}>
                    <NavLink
                      to={navigationLink.path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <img
                        src={navigationLink.image}
                        className="nav-link-icon"
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
          >
            <span className="dropdown-toggle-text">Ventas</span>
            <span className={`dropdown-arrow ${isVentasDropdownOpen ? "rotated" : ""}`}>
              ▼
            </span>
          </button>

          <div className={`dropdown-menu ${isVentasDropdownOpen ? "open" : ""}`}>
            <ul className="nav-list">
              {navigationLinks_admin.map((navigationLink) => (
                <li className="nav-item" key={navigationLink.id}>
                  {navigationLink.title === "Salir" ? (
                    <a
                      href="/login"
                      onClick={handleLogoutClick}
                      className="nav-link"
                    >
                      <img
                        src={navigationLink.image}
                        className="nav-link-icon"
                        alt={navigationLink.title}
                      />
                      <span className="nav-link-text">{navigationLink.title}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={navigationLink.path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <img
                        src={navigationLink.image}
                        className="nav-link-icon"
                        alt={navigationLink.title}
                      />
                      <span className="nav-link-text">{navigationLink.title}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>


          </div>
        </div>

        <ul className="nav-list">
        {navigationLinks_admin.map((navigationLink) => (
          <li className="nav-item" key={navigationLink.id}>
            {navigationLink.title === "Salir" ? (
              <a
                href="/login"
                onClick={handleLogoutClick}
                className="nav-link"
              >
                <img
                  src={navigationLink.image}
                  className="nav-link-icon"
                  alt={navigationLink.title}
                />
                <span className="nav-link-text">{navigationLink.title}</span>
              </a>
            ) : (
              <NavLink
                to={navigationLink.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <img
                  src={navigationLink.image}
                  className="nav-link-icon"
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
  );
};

export default Sidebar;
