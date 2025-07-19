// src/components/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css'; // Asegúrate de que este CSS esté en la misma carpeta o la ruta correcta

// Importa las imágenes desde src/assets/img
// Es la forma recomendada por Vite para procesar assets dentro de src
import rightSideImage from '../../assets/images/login.jpeg'; // Asegúrate de que esta ruta sea correcta
import IMAGOTIPO from '../../assets/images/IMAGOTIPO.png';

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
                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Usa las variables importadas para las imágenes */}
                    <img className="logo" src={IMAGOTIPO} alt="Logo de la empresa" />
                    
                    <h2 className='auth-title'>Login</h2>
                    <p className='auth-subtitle'>Inicia sesión en tu cuenta</p>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="form-group">
                        <label htmlFor="username"><strong>Usuario</strong></label>

                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='lts' htmlFor="password"><strong>Contraseña</strong></label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Iniciando...' : 'Entrar'}
                    </button>
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