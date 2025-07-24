"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./NotFound.css"

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="pharmacy-404-page not-found-wrapper">
      <div className="p404-container">
        {/* Píldoras flotantes decorativas */}
        <div className="p404-floating-pills">
          <div className="p404-pill p404-pill-1"></div>
          <div className="p404-pill p404-pill-2"></div>
          <div className="p404-pill p404-pill-3"></div>
          <div className="p404-pill p404-pill-4"></div>
          <div className="p404-pill p404-pill-5"></div>
        </div>

        {/* Contenido principal */}
        <div className="p404-content">
          <div className="p404-error-code">
            <span className="p404-four">4</span>
            <div className="p404-pill-zero">
              <div className="p404-pill-top">
                <div className="p404-pill-powder"></div>
              </div>
              <div className="p404-pill-gap">
                <div className="p404-powder-spill"></div>
              </div>
              <div className="p404-pill-bottom"></div>
            </div>
            <span className="p404-four">4</span>
          </div>

          <h1 className="p404-title">¡Página no encontrada!</h1>
          <p className="p404-description">Oops, la página que estás buscando no existe o ha sido movida. Pero no te preocupes, puedes volver al inicio o explorar otras secciones.</p>


          <div className="p404-actions">
            <Link to="/" className="p404-btn-primary">
              <svg className="p404-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Volver al inicio
            </Link>
          </div>

          {/* Iconos decorativos */}
          <div className="p404-medical-icons">
            <div className="p404-stethoscope">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a3 3 0 0 1 6 0v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2Z" />
                <path d="M16 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                <path d="M21 10.5a4.5 4.5 0 1 1-9 0" />
                <path d="M4 15a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H4Z" />
                <path d="M7 15v2a5 5 0 0 1-5-5" />
              </svg>
            </div>
            <div className="p404-cross">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 2v8H3v4h8v8h4v-8h8V10h-8V2h-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
