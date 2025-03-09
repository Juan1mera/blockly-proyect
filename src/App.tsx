import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import User from "./View/Screens/User/User";
import Admin from "./View/Screens/Admin/Admin";

function App() {
  return (
    <Router>
      <div>
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