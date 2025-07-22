import "./App.css";
import Sidebar from "./layout/Sidebar/Sidebar";
import Content from "./layout/Content/Content";
import { SidebarProvider } from "./context/sidebarContext";
import { AuthProvider } from "./context/authContext";
import { Routes, Route } from "react-router-dom";
// Importar tus componentes de página
import Ayuda from "./pages/ayuda/ayuda.jsx";
import Historial from "./pages/historial/historial.jsx";
import Home from "./pages/home/home.jsx";
import Registro from "./pages/registro/registro.jsx";
import Products from "./pages/products/products.jsx";
import Login from "./pages/login/login.jsx";

// Componente para rutas protegidas
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    
      <AuthProvider>
        <SidebarProvider>
          <div className="app">
            <Routes>
              {/* Rutas protegidas con sidebar */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Sidebar />
                    <Content />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="ayuda" element={<Ayuda />} />
                <Route path="historial" element={<Historial />} />
                <Route path="registro" element={<Registro />} />
                <Route path="productos" element={<Products />} />
              </Route>

              {/* Rutas públicas sin sidebar */}
              <Route path="/login" element={<Login />} />

              {/* Ruta 404 */}
              <Route
                path="*"
                element={
                  <div>
                    <h1>404 Not Found</h1>
                    <p>La página solicitada no existe.</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </SidebarProvider>
      </AuthProvider>
    
  );
}

export default App;