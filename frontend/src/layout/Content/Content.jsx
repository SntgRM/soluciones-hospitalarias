import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ContentTop from '../../components/ContentTop/ContentTop';
import { SidebarContext } from '../../context/sidebarContext';
import "./Content.css";

const Content = () => {
  const location = useLocation();
  const { isSidebarOpen } = useContext(SidebarContext);

  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case 'dashboard':
        return 'dashboard'
      case undefined:
        return 'Inicio';
      case 'ayuda':
        return 'Ayuda';
      case 'historial':
        return 'Historial';
      case 'bodega':
        return 'Bodega';
      case 'registro':
        return 'Registro';
      case 'products':
        return 'Productos';
      case 'productsList':
        return 'Lista de Productos';
      default:
        if (lastSegment) {
          return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
        }
        return 'Página'; // Título por defecto si la ruta no coincide o está vacía
    }
  };

  return (
    <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Renderiza ContentTop y le pasa el título dinámico */}
      <ContentTop pageTitle={getPageTitle()} /> 

      <div className='main-content-body'>
        {/* Aquí es donde React Router renderizará el componente de la ruta anidada (Home, Ayuda, etc.) */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default Content;