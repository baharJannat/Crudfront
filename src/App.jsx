import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Table from "./components/pages/Table";
import RegisterPage from "./components/pages/RegisterPage";
import LoginPage from "./components/pages/LoginPage";
import { Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </Router>
  );
}
