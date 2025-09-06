import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Vehicles from './components/Vehicles';
import Reservations from './components/Reservations';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/vehicles" />} />
        <Route path="/vehicles" element={token ? <Vehicles /> : <Navigate to="/login" />} />
        <Route path="/reservations" element={token ? <Reservations /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/vehicles" />} />
      </Routes>
    </Router>
  );
}

export default App;