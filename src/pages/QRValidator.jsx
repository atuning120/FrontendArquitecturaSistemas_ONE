import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRValidator = () => {
  const navigate = useNavigate();
  const [scannedQR, setScannedQR] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para validar QR code
  const validateQR = async () => {
    if (!scannedQR.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/tickets/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `qrData=${encodeURIComponent(scannedQR)}`
      });

      if (response.ok) {
        const result = await response.text();
        setValidationResult({ success: true, message: result });
      } else {
        const error = await response.text();
        setValidationResult({ success: false, message: error });
      }
    } catch (err) {
      setValidationResult({ success: false, message: 'Error de conexión al validar QR' });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setScannedQR('');
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
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
              <p className="hidden sm:block text-gray-600">Validador QR</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/event-owner')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Panel Organizador
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🔍 Validador de QR Codes
            </h2>
            <p className="text-lg text-gray-600">
              Valida los códigos QR de los tickets para verificar su autenticidad
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Instrucciones:</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Escanea el código QR del ticket con tu dispositivo</li>
              <li>• Copia y pega el contenido completo del QR en el campo de abajo</li>
              <li>• Haz clic en "Validar QR" para verificar la autenticidad</li>
              <li>• El sistema mostrará los detalles del ticket si es válido</li>
            </ul>
          </div>

          {/* Formulario de validación */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                📱 Contenido del Código QR:
              </label>
              <textarea
                value={scannedQR}
                onChange={(e) => setScannedQR(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="6"
                placeholder="Pega aquí el contenido del QR code:&#10;&#10;Ejemplo:&#10;TICKET_ID:1|EVENT:Concierto de Rock|USER:Juan Pérez|DATE:2024-12-25T20:00:00|VALIDATION_CODE:VAL12345"
              />
              <p className="text-sm text-gray-500 mt-2">
                El contenido debe incluir: ID del ticket, evento, usuario, fecha y código de validación
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button
                onClick={validateQR}
                disabled={!scannedQR.trim() || loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Validar QR Code
                  </span>
                )}
              </button>
              
              <button
                onClick={clearForm}
                className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
              >
                Limpiar
              </button>
            </div>

            {/* Resultado de validación */}
            {validationResult && (
              <div className={`p-6 rounded-xl border-2 ${
                validationResult.success 
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    validationResult.success ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {validationResult.success ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className={`text-lg font-bold ${
                      validationResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.success ? '✅ QR Code Válido' : '❌ QR Code Inválido'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      validationResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      <pre className="whitespace-pre-wrap font-mono bg-white bg-opacity-50 p-3 rounded-lg">
                        {validationResult.message}
                      </pre>
                    </div>
                    {validationResult.success && (
                      <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
                        <p className="text-green-800 font-medium">
                          🎫 Este ticket es válido y puede ser usado para ingresar al evento.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Información Adicional:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800">✅ QR Válido incluye:</h4>
                <ul className="mt-1 space-y-1">
                  <li>• ID único del ticket</li>
                  <li>• Nombre del evento</li>
                  <li>• Información del comprador</li>
                  <li>• Fecha y hora del evento</li>
                  <li>• Código de validación único</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">❌ Motivos de invalidez:</h4>
                <ul className="mt-1 space-y-1">
                  <li>• Formato incorrecto del QR</li>
                  <li>• Ticket ya usado anteriormente</li>
                  <li>• Código de validación incorrecto</li>
                  <li>• Ticket no existe en el sistema</li>
                  <li>• Evento ya finalizado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRValidator;
