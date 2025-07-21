import "./App.css";
import Sidebar from "./layout/Sidebar/Sidebar";
import Content from "./layout/Content/Content";
import { SidebarProvider } from "./context/sidebarContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Ayuda from "./pages/ayuda/ayuda.jsx";
import Historial from "./pages/historial/historial.jsx";
import Home from "./pages/home/home.jsx";
import Registro from "./pages/registro/registro.jsx";
import Products from "./pages/products/products.jsx";
import Login from "./pages/login/login.jsx";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Sidebar />
                  <Content />
                </>
              }
            >
              <Route index element={<Home />} />
              <Route path="ayuda" element={<Ayuda />} />
              <Route path="historial" element={<Historial />} />
              <Route path="registro" element={<Registro />} />
              <Route path="productos" element={<Products />} />
            </Route>

            <Route path="/login" element={<Login />} />

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
    </Router>
  );
}

export default App;
