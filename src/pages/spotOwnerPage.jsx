import React from 'react';
import { useNavigate } from 'react-router-dom';

const SpotOwnerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Dueño de Local</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Panel de Dueño de Local
              </h2>
              <p className="text-gray-700 mb-6">
                Administra tu local y alquílalo para eventos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-2">Mi Local</h3>
                  <p className="text-indigo-600">Información y fotos del local</p>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-pink-800 mb-2">Reservas</h3>
                  <p className="text-pink-600">Gestionar reservas del local</p>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Disponibilidad</h3>
                  <p className="text-teal-600">Configurar horarios disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotOwnerPage;