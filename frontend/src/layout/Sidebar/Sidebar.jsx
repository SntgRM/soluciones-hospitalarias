import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom"; // ¡Importante para la navegación!
import { personsImgs } from "../../utils/images"; // Asumo que esto es para la imagen del perfil
import { navigationLinks } from "../../data/data"; // Tus datos de enlaces
import "./Sidebar.css"; // CSS específico del sidebar
import { SidebarContext } from "../../context/sidebarContext"; // Contexto para controlar el sidebar

const Sidebar = () => {
  // Ya no necesitamos activeLinkIdx porque NavLink maneja el estado 'active' automáticamente

  // const [activeLinkIdx] = useState(1); // COMENTAR O ELIMINAR

  const [sidebarClass, setSidebarClass] = useState("");

  const { isSidebarOpen } = useContext(SidebarContext); // Obtener el estado de apertura del sidebar // Efecto para aplicar la clase CSS cuando el sidebar se abre/cierra

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change"); // Clase para abrir/expandir
    } else {
      setSidebarClass(""); // Clase para cerrar/colapsar
    }
  }, [isSidebarOpen]);

  return (
    <div className={`sidebar ${sidebarClass}`}>
                 {" "}
      <div className="user-info">
                       {" "}
        <img
          src={personsImgs.ISOTIPO}
          className="user-avatar"
          alt="Avatar de usuario"
        />
                        <span className="info-name">NOMBRE DE USUARIO</span>   
               {" "}
      </div>
                 {" "}
      <nav className="navigation">
                       {" "}
        <ul className="nav-list">
                             {" "}
          {
            // Mapea tus enlaces de navegación
            navigationLinks.map((navigationLink) => (
              <li className="nav-item" key={navigationLink.id}>
                                               {" "}
                {/* ¡USAMOS NavLink para la navegación! */}                     
                         {" "}
                <NavLink
                  to={navigationLink.path} // La ruta a la que se navegará // La clase 'active' se añade automáticamente si la ruta coincide
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  } // Opcional: Cierra el sidebar al hacer clic en un enlace si está abierto
                  onClick={() => {
                    /* Puedes agregar aquí lógica para cerrar el sidebar si lo deseas */
                  }}
                >
                                                     {" "}
                  <img
                    src={navigationLink.image}
                    className="nav-link-icon"
                    alt={navigationLink.title}
                  />
                                                     {" "}
                  <span className="nav-link-text">{navigationLink.title}</span> 
                                               {" "}
                </NavLink>
                                           {" "}
              </li>
            ))
          }
                         {" "}
        </ul>
                   {" "}
      </nav>
             {" "}
    </div>
  );
};

export default Sidebar;
