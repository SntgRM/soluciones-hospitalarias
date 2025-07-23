import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {iconsImgs} from '../../utils/images'; // Asegúrate de que esta ruta sea correcta
import './form.css'; // Asegúrate de que este CSS esté en la misma carpeta o la ruta correcta
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

        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', {
                username,
                password,
            });
            localStorage.setItem('authToken', response.data.token);
            console.log('Login exitoso, redirigiendo al dashboard', response.data);
            navigate('/');
        } catch (err) {
             console.error('Error completo:', err); 
            setError('Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content-wrapper">
                <form onSubmit={handleSubmit} className="form_main">
                    <p className="heading">Login</p>
                    {error && <p className="error_message">{error}</p>}
                    <div className="inputContainer">
                        <img src={iconsImgs.user} alt="user" />
                        <input
                            type="text"
                            className="inputField"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <img src={iconsImgs.lock} alt="lock" />
                        <input
                            type="password"
                            className="inputField"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button id="button" type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className="right-image-panel">
                    <img className="right-image-content" src={rightSideImage} alt="Decoración" />
                </div>
            </div>
        </div>
    );
};

export default Login;