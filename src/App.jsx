import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientPage from './pages/clientPage.jsx';
import EventOwner from './pages/eventOwner.jsx';
import SpotOwnerPage from './pages/spotOwnerPage.jsx';
import CreateSpot from './pages/CreateSpot.jsx';
import SpotEvents from './pages/SpotEvents.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import ManageEvents from './pages/ManageEvents.jsx';
import AvailableEvents from './pages/AvailableEvents.jsx';
import MyTickets from './pages/MyTickets.jsx';
import QRValidator from './pages/QRValidator.jsx';
import Test from './pages/Test.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta por defecto - muestra página de bienvenida */}
          <Route path="/" element={<Welcome />} />
          
          {/* Página de bienvenida */}
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Ruta de login/register */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard principal después del login */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Páginas específicas por tipo de usuario */}
          <Route path="/client" element={<ClientPage />} />
          <Route path="/event-owner" element={<EventOwner />} />
          <Route path="/spot-owner" element={<SpotOwnerPage />} />
          
          {/* Funcionalidades del cliente */}
          <Route path="/available-events" element={<AvailableEvents />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          
          {/* Funcionalidades del propietario */}
          <Route path="/create-spot" element={<CreateSpot />} />
          <Route path="/spot-events" element={<SpotEvents />} />
          
          {/* Funcionalidades del organizador */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/qr-validator" element={<QRValidator />} />
          
          {/* Página de pruebas de API */}
          <Route path="/test" element={<Test />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
