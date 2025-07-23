"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./NotFound.css"

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="not-found">
      <div className="container">
        {/* Píldoras flotantes decorativas */}
        <div className="floating-pills">
          <div className="pill pill-1"></div>
          <div className="pill pill-2"></div>
          <div className="pill pill-3"></div>
          <div className="pill pill-4"></div>
          <div className="pill pill-5"></div>
        </div>

        {/* Contenido principal */}
        <div className="content">
          <div className="error-code">
            <span className="four">4</span>
            <div className="pill-zero">
              <div className="pill-top">
                <div className="pill-powder"></div>
              </div>
              <div className="pill-gap">
                <div className="powder-spill"></div>
              </div>
              <div className="pill-bottom"></div>
            </div>
            <span className="four">4</span>
          </div>

          <h1 className="title">¡Página no encontrada!</h1>
          <p className="description">
            Parece que la página que buscas se ha agotado en nuestra farmacia. No te preocupes, tenemos muchas otras
            opciones disponibles.
          </p>

          <div className="actions">
            <Link to="/" className="btn-primary-404">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Volver al inicio
            </Link>
          </div>

          {/* Iconos decorativos */}
          <div className="medical-icons">
            <div className="stethoscope">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a3 3 0 0 1 6 0v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2Z" />
                <path d="M16 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                <path d="M21 10.5a4.5 4.5 0 1 1-9 0" />
                <path d="M4 15a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H4Z" />
                <path d="M7 15v2a5 5 0 0 1-5-5" />
              </svg>
            </div>
            <div className="cross">
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
