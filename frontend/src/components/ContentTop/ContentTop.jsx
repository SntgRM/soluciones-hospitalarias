import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { SidebarContext } from "../../context/sidebarContext";
import { authAPI } from "../../services/api";
import { DoorOpen } from "lucide-react";
import Swal from "sweetalert2";

const ContentTop = ({ pageTitle }) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await authAPI.getProfile();
        console.log("Perfil recibido:", profile);

        if (!profile || !profile.user) {
          console.warn("Estructura de perfil inesperada", profile);
          setUserName("Usuario");
          setUserProfileImage(iconsImgs.user);
          return;
        }

        const name =
          profile.user.first_name?.trim() ||
          profile.user.username?.trim() ||
          "Usuario";
        const image = profile.user.profile_image_url || iconsImgs.user;

        setUserName(name);
        setUserProfileImage(image);
      } catch (error) {
        console.error("Error obteniendo el perfil:", error);
        setUserName("Usuario");
        setUserProfileImage(iconsImgs.user);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTruncatedTitle = (title) => {
    if (!title) return "";
    if (isMobile && title.length > 10) {
      return title.substring(0, 8) + "...";
    }
    return title;
  };

  const handleImageError = (e) => {
    e.target.src = iconsImgs.user;
    setUserProfileImage(null);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = (e) => {
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

    setShowDropdown(false);
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
        <h3 className="content-top-title" title={pageTitle}>
          {getTruncatedTitle(pageTitle)}
        </h3>
      </div>
      <div className="content-top-btns">
        <div className="profile-container" ref={dropdownRef}>
          <p className="user-greeting">Hola, {userName}</p>
          <div className="user-profile-wrapper">
            <img
              src={userProfileImage}
              alt="Usuario"
              className="user-img-top"
              onError={handleImageError}
              onClick={toggleDropdown}
              style={{ cursor: "pointer" }}
            />
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={handleLogout}>
                  <DoorOpen />
                  <span>Cerrar sesión</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTop;
