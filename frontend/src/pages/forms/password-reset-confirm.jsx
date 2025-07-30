"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
import { iconsImgs } from "../../utils/images"
import "./forms.css"
import rightSideImage from "../../assets/images/login.jpeg"

const PasswordResetConfirm = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const { uidb64, token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar que los parámetros existan
    if (!uidb64 || !token) {
      setError("Enlace inválido o expirado.")
    }
  }, [uidb64, token])

  const validatePasswords = () => {
    // if (newPassword.length < 8) {
    //   setError("La contraseña debe tener al menos 8 caracteres.")
    //   return false
    // }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!validatePasswords()) {
      return
    }

    setLoading(true)

    try {
      await axios.post(`http://localhost:8000/api/auth/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      })

      setPasswordReset(true)
      setMessage("Tu contraseña ha sido restablecida exitosamente.")
    } catch (err) {
      console.error("Error en confirmación de restablecimiento:", err)
      if (err.response?.status === 400) {
        setError("Enlace inválido o expirado. Solicita un nuevo enlace de restablecimiento.")
      } else {
        setError("Ocurrió un error. Por favor, intenta nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoToLogin = () => {
    navigate("/login")
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

          {!passwordReset ? (
            <>
              <p className="heading">Nueva Contraseña</p>
              <p className="subheading">
                Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres para mayor seguridad.
              </p>

              <div className="inputContainer">
                <img src={iconsImgs.lock || "/placeholder.svg"} alt="lock" />
                <input
                  type="password"
                  className="inputField"
                  id="newPassword"
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="inputContainer">
                <img src={iconsImgs.lock || "/placeholder.svg"} alt="lock" />
                <input
                  type="password"
                  className="inputField"
                  id="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button id="button" type="submit" disabled={loading}>
                {loading ? "Restableciendo..." : "Restablecer Contraseña"}
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
              <p className="heading">¡Contraseña Restablecida!</p>
              <p className="email-sent-message">
                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button type="button" className="secondary-button" onClick={handleGoToLogin}>
                Ir al Inicio de Sesión
              </button>
            </div>
          )}
        </form>

        <div className="right-image-panel">
          <img
            className="right-image-content"
            src={
              rightSideImage || "/placeholder.svg?height=400&width=400&query=password+security" || "/placeholder.svg"
            }
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  )
}

export default PasswordResetConfirm
