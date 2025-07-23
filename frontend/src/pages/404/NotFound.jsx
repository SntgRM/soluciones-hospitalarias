import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div id="clouds">
        <div className="cloud x1"></div>
        <div className="cloud x1_5"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
      </div>

      <div className="notfound-content">
        <div className="notfound-404">404</div>
        <hr />
        <div className="notfound-title">LA PÁGINA</div>
        <div className="notfound-subtitle">NO FUE ENCONTRADA</div>
        <Link className="notfound-btn" to="/">VOLVER AL INICIO</Link>
      </div>
    </div>
  );
};

export default NotFound;
