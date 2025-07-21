// src/components/FAQ.jsx
import React, { useState } from 'react';
import './ayuda.css';

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo puedo registrar un nuevo pedido?",
    respuesta: "Ve a la sección de 'Registrar Pedido' y completa el formulario con los datos requeridos. Luego haz clic en 'Registrar Pedido'.",
  },
  {
    pregunta: "¿Puedo modificar un pedido después de registrarlo?",
    respuesta: "Actualmente no es posible modificar un pedido desde la interfaz. Debes contactar al administrador.",
  },
  {
    pregunta: "¿Qué significan los diferentes estados del pedido?",
    respuesta: "Los estados indican el progreso del pedido: En Alistamiento, En Proceso, Empacado, En Reparto, Enviado al Cliente, o Enviado en Transportadora.",
  },
  {
    pregunta: "¿Cómo se asigna la prioridad de un pedido?",
    respuesta: "La prioridad la seleccionas tú al registrar el pedido: Alta, Media o Baja, y ayuda a determinar el orden de procesamiento.",
  },
];

function FAQ() {
  const [activo, setActivo] = useState(null);

  const togglePregunta = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Preguntas Frecuentes</h2>
      {preguntasFrecuentes.map((item, index) => (
        <div className="faq-item" key={index}>
          <div
            className={`faq-pregunta ${activo === index ? 'activa' : ''}`}
            onClick={() => togglePregunta(index)}
          >
            {item.pregunta}
            <span className="faq-icon">{activo === index ? '−' : '+'}</span>
          </div>
          {activo === index && <div className="faq-respuesta">{item.respuesta}</div>}
        </div>
      ))}
    </div>
  );
}

export default FAQ;
