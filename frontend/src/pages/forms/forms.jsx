import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { iconsImgs } from "../../utils/images";
import "./forms.css";
import rightSideImage from "../../assets/images/login.jpeg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      const profileResponse = await axios.get(
        "http://localhost:8000/api/auth/profile/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const userRole = profileResponse.data.user.role;
      localStorage.setItem("userRole", userRole);
      console.log("ROL:", userRole);

      navigate("/");
    } catch (err) {
      console.error("Error completo:", err);
      setError("Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content-wrapper">
        <form onSubmit={handleSubmit} className="form_main">
          <div className="error-container">
            {error && <p className="error_message">{error}</p>}
          </div>
          <p className="heading">Inicio de Sesión</p>
          <div className="inputContainer">
            <img src={iconsImgs.user || "/placeholder.svg"} alt="user" />
            <input
              type="text"
              className="inputField"
              id="username"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <img src={iconsImgs.lock || "/placeholder.svg"} alt="lock" />
            <input
              type="password"
              className="inputField"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button id="button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <a href="/password-reset-request" className="forgotLink">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
        <div className="right-image-panel">
          <img
            className="right-image-content"
            src={rightSideImage || "/placeholder.svg"}
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
