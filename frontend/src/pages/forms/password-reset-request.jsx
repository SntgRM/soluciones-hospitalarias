"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { iconsImgs } from "../../utils/images";
import "./forms.css";
import rightSideImage from "../../assets/images/login.jpeg";

const API_ENDPOINTS = {
  passwordResetRequest: "/api/auth/password-reset/",
};

const PasswordRequestReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(
        `http://localhost:8000${API_ENDPOINTS.passwordResetRequest}`,
        {
          email,
        }
      );

      setEmailSent(true);
      setMessage(
        "Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña."
      );
    } catch (err) {
      console.error("Error en solicitud de restablecimiento:", err);
      setEmailSent(true);
      setMessage(
        "Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña."
      );
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
            {message && <p className="success_message">{message}</p>}
          </div>

          {!emailSent ? (
            <>
              <p className="heading">Restablecer Contraseña</p>
              <p
                className="subheading"
                style={{ textAlign: "center", zIndex: 2 }}
              >
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>

              <div className="inputContainer">
                <img src={iconsImgs.user || "/placeholder.svg"} alt="user" />
                <input
                  type="email"
                  className="inputField"
                  id="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button id="button" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </>
          ) : (
            <p
              className="subheading"
              style={{ textAlign: "center", zIndex: 2 }}
            >
              Revisa tu correo electrónico y haz clic en el enlace para
              continuar con el restablecimiento de tu contraseña.
            </p>
          )}

          <Link to="/login" className="backLink">
            ← Volver al inicio de sesión
          </Link>
        </form>

        <div className="right-image-panel">
          <img
            className="right-image-content"
            src={
              rightSideImage ||
              "/placeholder.svg?height=400&width=400&query=password+reset"
            }
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordRequestReset;
