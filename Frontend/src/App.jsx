import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryAdd from "./pages/Adminpages/CategoryAdd";
import ErrorBoundary from "./components/ErrorBoundary"; // Optional but recommended

function App() {
  return (
    <Router>
   
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoryAdd />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
