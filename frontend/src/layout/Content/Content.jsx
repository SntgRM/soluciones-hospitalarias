import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ContentTop from '../../components/ContentTop/ContentTop'; // Ruta correcta para ContentTop
import "./Content.css"; // CSS para el layout Content

const Content = () => {
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para obtener el título de la página basado en la ruta
  const getPageTitle = () => {
    // Obtenemos la última parte de la ruta para que funcione con rutas anidadas
    // Por ejemplo, si location.pathname es '/dashboard/ayuda', pagePath será 'ayuda'
    // Si es '/dashboard', pagePath será 'dashboard' o una cadena vacía si solo es '/'
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const lastSegment = pathSegments[pathSegments.length - 1]; // Obtiene la última parte de la URL

    switch (lastSegment) {
      case 'dashboard': // Para la ruta base /dashboard
      case undefined: // Para el caso de que sea solo / (que luego se redirige a /dashboard o /login)
        return 'Inicio';
      case 'ayuda':
        return 'Ayuda';
      case 'historial':
        return 'Historial';
      case 'registro':
        return 'Registro';
      case 'products':
        return 'Productos';
      case 'productsList': // Agrega este si tienes una página productsList
        return 'Lista de Productos';
      // Agrega más casos para tus otras páginas si es necesario
      default:
        // Puedes Capitalizar la primera letra del segmento si quieres
        if (lastSegment) {
          return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
        }
        return 'Página'; // Título por defecto si la ruta no coincide o está vacía
    }
  };

  return (
    <div className='main-content'>
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