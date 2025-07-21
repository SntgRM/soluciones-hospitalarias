// src/components/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {iconsImgs} from '../../utils/images'; // Asegúrate de que esta ruta sea correcta
import './form.css'; // Asegúrate de que este CSS esté en la misma carpeta o la ruta correcta

// Importa las imágenes desde src/assets/img
// Es la forma recomendada por Vite para procesar assets dentro de src
import rightSideImage from '../../assets/images/login.jpeg'; // Asegúrate de que esta ruta sea correcta
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulación de autenticación básica
        if (username === 'user' && password === 'pass') {
            console.log('Login exitoso!');
            navigate('/productos'); // Redirigir a una ruta después del login
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            {/* Nuevo contenedor para agrupar el formulario y la imagen derecha */}
            <div className="auth-content-wrapper">
                <form action="" className="form_main">
                    <p className="heading">Login</p>
                    <div className="inputContainer">
                        <img src={iconsImgs.user} alt="user" />
                    <input type="text" class="inputField" id="username" placeholder="Username" />
                    </div>
                    <div className="inputContainer">
                        <img src={iconsImgs.lock} alt="lock" />
                        <input type="password" class="inputField" id="password" placeholder="Password" />
                    </div>  
                    <button id="button">Entrar</button>
                        <a className="forgotLink" href="#">Forgot your password?</a>
                </form>
                {/* La nueva imagen a la derecha */}
                <div className="right-image-panel">
                    {/* Utiliza la variable importada para la imagen del lado derecho */}
                    <img className="right-image-content" src={rightSideImage} alt="Decoración" />
                </div>
            </div>
        </div>
    );
};

export default Login;