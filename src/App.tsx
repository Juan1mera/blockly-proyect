import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import User from "./View/Screens/User/User";
import Admin from "./View/Screens/Admin/Admin";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Blockly Navegación</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/user/1" style={{ marginRight: "10px", textDecoration: "none", color: "white" }}>
            Usuario
          </Link>
          <Link to="/admin/1" style={{ textDecoration: "none", color: "white" }}>
            Administrador
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/user/1" replace />} />
          <Route path="/user/:levelId" element={<User />} />
          <Route path="/admin/:levelId" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;