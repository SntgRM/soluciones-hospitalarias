import React, { useContext, useState, useEffect } from 'react';
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { SidebarContext } from "../../context/sidebarContext";
import { useNavigate } from 'react-router-dom';

const ContentTop = ({ pageTitle }) => {
    const { toggleSidebar } = useContext(SidebarContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si estamos en móvil para ajustar el comportamiento
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log("Realizando búsqueda con el término:", searchTerm);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí podrías borrar algún token o limpiar estado si usas autenticación
        navigate('/login'); // Redirige al login
    };

    // Función para truncar el título en pantallas pequeñas
    const getTruncatedTitle = (title) => {
        if (!title) return '';
        
        if (isMobile && title.length > 10) {
            return title.substring(0, 8) + '...';
        }
        return title;
    };

    return (
        <div className="main-content-top">
            <div className="content-top-left">
                <button 
                    type="button" 
                    className="sidebar-toggler" 
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    <img src={iconsImgs.menu} alt="Toggle Sidebar" />
                </button>
                <h3 
                    className="content-top-title"
                    title={pageTitle} // Muestra el título completo en hover
                >
                    {getTruncatedTitle(pageTitle)}
                </h3>
            </div>
            <div className="content-top-btns">
                <form className="search-bar-container" onSubmit={handleSearchSubmit}>
                    <div className="search_container">
                        <input 
                            type="text" 
                            name="text" 
                            className="input_search" 
                            placeholder={isMobile ? "Buscar..." : "Search"} 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button 
                            type="submit"
                            className="search__btn"
                            aria-label="Search"
                        >
                            <img src={iconsImgs.search} alt="Search" />
                        </button>
                    </div>
                </form>
                
                {/* Opcional: Botón de salir - solo mostrar si hay espacio suficiente */}
            </div>
        </div>
    );
};

export default ContentTop;