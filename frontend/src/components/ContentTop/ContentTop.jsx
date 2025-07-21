import React, { useContext, useState } from 'react';
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { SidebarContext } from "../../context/sidebarContext";
import { useNavigate } from 'react-router-dom';

const ContentTop = ({ pageTitle }) => {
    const { toggleSidebar } = useContext(SidebarContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Realizando búsqueda con el término:", searchTerm);
    };
const navigate = useNavigate();

const handleLogout = () => {
// Aquí podrías borrar algún token o limpiar estado si usas autenticación
navigate('/login'); // Redirige al login
};


    return (
        <div className="main-content-top">
            <div className="content-top-left">
                <button type="button" className="sidebar-toggler" onClick={toggleSidebar}>
                    <img src={iconsImgs.menu} alt="Toggle Sidebar" />
                </button>
                <h3 className="content-top-title">{pageTitle}</h3>
            </div>
            <div className="content-top-btns">
                <form className="search-bar-container" onSubmit={handleSearchSubmit}>
                    <div className="search_container">
                        <input type="text" name="text" className="input_search" placeholder="Search" />
                        <button className="search__btn">
                            <img src={iconsImgs.search} alt="Search" />
                        </button>
                    </div>
                    {/* Botón adicional "Salir", puedes cambiarlo por lógica o ruta si es necesario */}
                </form>
            </div>
        </div>
    );
};

export default ContentTop;
