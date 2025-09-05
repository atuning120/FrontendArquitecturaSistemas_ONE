import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientPage from './pages/clientPage.jsx';
import EventOwner from './pages/eventOwner.jsx';
import SpotOwnerPage from './pages/spotOwnerPage.jsx';
import Test from './pages/Test.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta por defecto - redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta de login/register */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard principal después del login */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Páginas específicas por tipo de usuario */}
          <Route path="/client" element={<ClientPage />} />
          <Route path="/event-owner" element={<EventOwner />} />
          <Route path="/spot-owner" element={<SpotOwnerPage />} />
          
          {/* Página de pruebas de API */}
          <Route path="/test" element={<Test />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
