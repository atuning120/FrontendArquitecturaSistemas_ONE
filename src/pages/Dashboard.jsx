import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user.name}</span>
              <button
                onClick={() => navigate('/test')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Ir a Pruebas
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card de bienvenida */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Bienvenido
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.name}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de información del usuario */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white">@</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Email
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.email}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de ID de usuario */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white">#</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        ID de Usuario
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.id}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación a otras páginas */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Navegación</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/client')}
                className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Cliente
              </button>
              <button
                onClick={() => navigate('/event-owner')}
                className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Dueño de Evento
              </button>
              <button
                onClick={() => navigate('/spot-owner')}
                className="bg-yellow-500 text-white p-4 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Dueño de Local
              </button>
              <button
                onClick={() => navigate('/test')}
                className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Pruebas API
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
