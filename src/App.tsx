import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Admin from "./screens/Admin/Admin";
import User from "./screens/User/User";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Blockly Navegación</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/user" style={{ marginRight: "10px", textDecoration: "none", color: "white" }}>
            Usuario
          </Link>
          <Link to="/admin" style={{ textDecoration: "none", color: "white" }}>
            Administrador
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin/:levelId" element={<Admin />} /> {/* Ruta dinámica para niveles */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;