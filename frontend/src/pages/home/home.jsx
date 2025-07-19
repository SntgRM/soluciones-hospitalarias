// src/pages/home.jsx
import React from "react";
// import Cards from "../../layout/Cards/Cards"; // <--- ESTO ES INCORRECTO
// import Transactions from "../../layout/Transactions/Transactions"; // <--- ESTO ES INCORRECTO
// ... y así con todos

// Las importaciones DEBEN apuntar a src/components/
import ProductSummaryCards from "../../components/Cards/Cards"; // Usaremos 'Cards' como el nombre del componente
import Transactions from "../../components/Transactions/Transactions";
import Report from "../../components/Report/Report";
import Budget from "../../components/Budget/Budget";
import Subscriptions from "../../components/Subscriptions/Subscriptions";
import Savings from "../../components/Savings/Savings";
import Loans from "../../components/Loans/Loans";
import Financial from "../../components/Financial/Financial";


import './home.css'; 

const Home = () => {
  return (
    <div className="screens-common home-container">
      <div className="home-grid">
        {/* Aquí ahora usamos el nuevo componente de resumen */}
        <ProductSummaryCards /> {/* Manteniendo el nombre 'Cards' en el JSX */}
        
        {/* Tus otros componentes del dashboard */}
        <Transactions />
        <Report />
        <Budget />
        <Subscriptions />
        <Savings />
        <Financial />
        <Loans />
      </div>
    </div>
  )
}

export default Home;