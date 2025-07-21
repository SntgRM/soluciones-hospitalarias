import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { personsImgs } from "../../utils/images";
import { navigationLinks } from "../../data/data";
import "./Sidebar.css";
import { SidebarContext } from "../../context/sidebarContext";
import Swal from "sweetalert2";

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change");
    } else {
      setSidebarClass("");
    }
  }, [isSidebarOpen]);

  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevenir la navegación automática

    Swal.fire({
      title: "¿Estás seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6C5DD3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#fff",
      color: "#1A1A1A",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login"); // Redirige al login
      }
    });
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <img
          src={personsImgs.ISOTIPO}
          className="user-avatar"
          alt="Avatar de usuario"
        />
        <span className="info-name">NOMBRE DE USUARIO</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.map((navigationLink) => (
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
