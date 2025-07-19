// src/App.jsx
import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content'; 
import { SidebarProvider } from './context/sidebarContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importar tus componentes de página
import Ayuda from './pages/ayuda/ayuda.jsx';
import Historial from './pages/historial/historial.jsx';
import Home from './pages/home/home.jsx'; 
import Registro from './pages/registro/registro.jsx';
import Products from './pages/products/products.jsx';

import Login from './pages/login/login.jsx'; 

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className='app'>
          {/* ¡IMPORTANTE CAMBIO AQUÍ!
            El <Sidebar /> ya NO se renderiza directamente aquí.
            Ahora, el Sidebar se renderizará CONDICIONALMENTE
            dentro del componente Content, o de cualquier otro layout que lo necesite.
          */}
          
          <Routes>
            {/* Esta ruta principal ("/") ahora encapsula tanto el Sidebar como el Content.
              Cuando se acceda a estas rutas anidadas, el Sidebar y el Content se mostrarán juntos.
            */}
            <Route path="/" element={
              <> {/* Usamos un Fragment para agrupar Sidebar y Content */}
                <Sidebar /> 
                <Content />
              </>
            }>
              {/* home.jsx ahora podría usar ProductSummaryCards */}
              <Route index element={<Home />} /> 
              <Route path="ayuda" element={<Ayuda />} /> 
              <Route path="historial" element={<Historial />} /> 
              <Route path="registro" element={<Registro />} /> 
              <Route path="/productos" element={<Products />} /> 
            </Route>

            {/* Estas rutas son completamente independientes y NO tendrán Sidebar ni Content 
              automáticamente, ya que no están anidadas bajo el layout que los incluye.
            */}
            <Route path="/login" element={<Login />} />

            {/* Si alguna vez necesitas una ruta para un producto individual por ID, sería algo así: */}
            {/* <Route path="/producto/:id" element={<SingleProductDetails />} /> */}

            {/* Opcional: Ruta para 404. Considera si debe tener dashboard o no. */}
            <Route path="*" element={<div><h1>404 Not Found</h1><p>La página solicitada no existe.</p></div>} />
          </Routes>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;