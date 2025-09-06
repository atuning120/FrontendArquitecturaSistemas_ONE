import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">
                <span className="text-orange-500">Fac</span>
                <span className="text-pink-500">Tickets</span>
              </h1>
              <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
              <p className="hidden sm:block text-gray-600">Panel del Cliente</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              ¡Bienvenido, Cliente!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre espacios únicos para tus eventos y reserva con facilidad
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 mx-auto rounded-full mt-4"></div>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Buscar Eventos</h3>
            <p className="text-gray-600 mb-4">Encuentra eventos increíbles cerca de ti</p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
              Explorar Eventos
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Mis Reservas</h3>
            <p className="text-gray-600 mb-4">Gestiona todas tus reservas de eventos</p>
            <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
              Ver Reservas
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Favoritos</h3>
            <p className="text-gray-600 mb-4">Eventos y lugares que te encantan</p>
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
              Ver Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;