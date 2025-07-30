"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
import { iconsImgs } from "../../utils/images"
import "./login.css"
import rightSideImage from "../../assets/images/login.jpeg"

const API_ENDPOINTS = {
  passwordResetRequest: "/api/auth/password-reset/",
}

const PasswordRequestReset = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await axios.post(`http://localhost:8000${API_ENDPOINTS.passwordResetRequest}`, {
        email,
      })

      setEmailSent(true)
      setMessage(
        "Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
      )
    } catch (err) {
      console.error("Error en solicitud de restablecimiento:", err)
      setEmailSent(true)
      setMessage(
        "Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content-wrapper">
        <form onSubmit={handleSubmit} className="form_main">
          <Link to="/login" className="backLink">
            <ArrowLeft size={16} />
            <span>Volver al inicio de sesión</span>
          </Link>

          <div className="error-container">
            {error && <p className="error_message">{error}</p>}
            {message && <p className="success_message">{message}</p>}
          </div>

          {!emailSent ? (
            <>
              <p className="heading">Restablecer Contraseña</p>
              <p className="subheading">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
            <div className="email-sent-container">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4caf50" />
                  <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="heading">¡Correo Enviado!</p>
              <p className="email-sent-message">
                Revisa tu correo electrónico y haz clic en el enlace para continuar con el restablecimiento de tu
                contraseña.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                  setMessage("")
                }}
              >
                Enviar a otro correo
              </button>
            </div>
          )}
        </form>

        <div className="right-image-panel">
          <img
            className="right-image-content"
            src={rightSideImage || "/placeholder.svg?height=400&width=400&query=password+reset" || "/placeholder.svg"}
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  )
}

export default PasswordRequestReset
