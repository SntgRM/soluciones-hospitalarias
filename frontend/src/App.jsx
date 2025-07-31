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
import Pedidos from "./pages/pedidos/pedidos.jsx";
import Login from "./pages/forms/forms.jsx";
import PasswordResetRequest from "./pages/forms/password-reset-request.jsx"
import PasswordResetConfirm from "./pages/forms/password-reset-confirm.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx";
import User from "./pages/user/user.jsx";
import Transportadora from "./pages/transportadora/transportadora.jsx"
import { useResizeAnimationStopper } from './utils/hooks';

// Componente para rutas protegidas
import ProtectedRoute from "./components/ProtectedRoute.jsx";



function App() {
  useResizeAnimationStopper();
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
                <Route path="transportadora" element={<Transportadora />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="usuarios" element={<User />} />
              </Route>

              {/* Rutas públicas sin sidebar */}
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset-request" element={<PasswordResetRequest />} />
              <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </AuthProvider>
    
  );
}

export default App;