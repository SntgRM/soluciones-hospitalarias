import React, { useContext, useState, useEffect } from 'react';
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { SidebarContext } from "../../context/sidebarContext";
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ContentTop = ({ pageTitle }) => {
    const { toggleSidebar } = useContext(SidebarContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [userName, setUserName] = useState('');
    const [userProfileImage, setUserProfileImage] = useState(null);

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

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await authAPI.getProfile();
                console.log("Perfil recibido:", profile);
                setUserName(
                    profile.user.first_name?.trim() || profile.user.username?.trim() || "Usuario"
                );

                if (profile.user.profile_image_url) {
                    setUserProfileImage(profile.user.profile_image_url);
                } else {
                    setUserProfileImage(iconsImgs.user);
                }
            } catch (error) {
                console.error("Error obteniendo el perfil:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log("Realizando búsqueda con el término:", searchTerm);
        }
    };

    const navigate = useNavigate();

    const getTruncatedTitle = (title) => {
        if (!title) return '';
        if (isMobile && title.length > 10) {
            return title.substring(0, 8) + '...';
        }
        return title;
    };

    const handleImageError = (e) => {
        e.target.src = iconsImgs.user;
        setUserProfileImage(null);
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
                    title={pageTitle}
                >
                    {getTruncatedTitle(pageTitle)}
                </h3>
            </div>
            <div className="content-top-btns">
                <form className="search-bar-container" onSubmit={handleSearchSubmit}>
                    <div className="search_container">
                        <p className="user-greeting">Hola, {userName}</p>
                        <img src={userProfileImage} alt="Usuario" className='user_img' onError={handleImageError} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentTop;
