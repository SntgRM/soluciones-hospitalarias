import React from 'react';
import { useNavigate } from 'react-router-dom';
import { iconsImgs } from '../../utils/images';
import './Cards.css';

const Cards = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/pedidos'); // Redirige sin filtro
    };

    return (
        <div className="product-summary-cards-wrapper grid-common grid-c1">
            <div className="grid-c-title">
                <h3 className="grid-c-title-text">Resumen de Pedidos</h3>
            </div>

            <div className="summary-cards-container" style={{ justifyContent: 'center' }}>
                <button
                    className="summary-card"
                    onClick={handleClick}
                    style={{
                        border: '1px solid #13af1bff',
                        padding: '20px 30px',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    <img src={iconsImgs.check} alt="Todos" style={{ width: '24px', height: '24px' }} />
                    Ver todos los pedidos
                </button>
            </div>
        </div>
    );
};

export default Cards;
