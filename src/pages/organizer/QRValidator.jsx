import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';

const QRValidator = () => {
  const navigate = useNavigate();
  const [scannedQR, setScannedQR] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState('text'); // 'text' or 'camera'
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  // Función para validar QR code (modo texto)
  const validateQR = async () => {
    await validateQRData(scannedQR);
  };

  const clearForm = () => {
    setScannedQR('');
    setValidationResult(null);
  };

  // Función para verificar permisos de cámara
  const checkCameraPermissions = async () => {
    try {
      // Verificar contexto seguro (HTTPS o localhost)
      const isSecure = window.isSecureContext || 
                      location.protocol === 'https:' || 
                      location.hostname === 'localhost' || 
                      location.hostname === '127.0.0.1';
                      
      if (!isSecure) {
        throw new Error('La cámara requiere una conexión segura (HTTPS). Actualmente estás en: ' + location.protocol);
      }

      // Verificar si la API de getUserMedia está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Verificar APIs legacy
        const hasLegacy = navigator.getUserMedia || 
                         navigator.webkitGetUserMedia || 
                         navigator.mozGetUserMedia || 
                         navigator.msGetUserMedia;
        
        if (!hasLegacy) {
          throw new Error('La API de cámara no está soportada en este navegador. Navegadores compatibles: Chrome 53+, Firefox 36+, Safari 11+, Edge 12+');
        }
      }

      // Verificar permisos si está disponible
      if (navigator.permissions) {
        try {
          const permissions = await navigator.permissions.query({ name: 'camera' });
          
          if (permissions.state === 'denied') {
            throw new Error('Permisos de cámara denegados. Ve a Configuración > Privacidad > Cámara y permite el acceso para este sitio.');
          }
        } catch (permError) {
          console.log('Permissions API no disponible, continuando con getUserMedia:', permError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error verificando permisos de cámara:', error);
      throw error;
    }
  };

  // Función para solicitar permisos manualmente
  const requestCameraPermissions = async () => {
    try {
      setLoading(true);
      
      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Preferir cámara trasera
        } 
      });
      
      // Cerrar el stream inmediatamente (solo era para obtener permisos)
      stream.getTracks().forEach(track => track.stop());
      
      setValidationResult({
        success: true,
        message: '✅ Permisos concedidos. Ahora puedes usar el escáner.',
        error: false
      });
      
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      let errorMessage = '❌ No se pudieron obtener los permisos. Verifica la configuración de tu navegador.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '🚫 Permisos denegados. Para solucionarlo:\n1. Haz clic en el ícono 🔒 o 📷 en la barra de direcciones\n2. Selecciona "Permitir"\n3. Recarga la página';
      }
      
      setValidationResult({
        success: false,
        message: errorMessage,
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Función mejorada para iniciar el escáner de cámara
  const startCamera = async () => {
    try {
      setLoading(true);
      
      // Verificar permisos primero
      await checkCameraPermissions();

      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }

      if (!videoRef.current) {
        throw new Error('Elemento de video no encontrado');
      }

      // Configurar el escáner con opciones mejoradas
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR detectado:', result.data);
          setScannedQR(result.data);
          stopCamera();
          // Auto-validar el QR detectado
          setTimeout(() => {
            validateQRData(result.data);
          }, 500);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Cámara trasera por defecto
        }
      );

      // Verificar si hay cámaras disponibles
      const cameras = await QrScanner.listCameras(true);
      if (cameras.length === 0) {
        throw new Error('No se encontraron cámaras disponibles');
      }

      await qrScannerRef.current.start();
      setCameraActive(true);
      setValidationResult(null);
      
    } catch (error) {
      console.error('Error iniciando cámara:', error);
      
      // Mensajes específicos según el tipo de error
      let errorMessage = 'Error desconocido al acceder a la cámara';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '🚫 Permisos de cámara denegados. Para solucionarlo:\n\n1. Haz clic en el ícono 🔒 o 📷 en la barra de direcciones\n2. Selecciona "Permitir" para la cámara\n3. Recarga la página\n\nO usa el botón "Solicitar Permisos" más abajo.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = '📷 No se encontró una cámara disponible en este dispositivo';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = '❌ Tu navegador no soporta el acceso a la cámara. Prueba con Chrome, Firefox o Safari.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = '🔒 La cámara está siendo usada por otra aplicación. Cierra otras apps que puedan estar usando la cámara.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setValidationResult({
        success: false,
        message: errorMessage,
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para detener el escáner
  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setCameraActive(false);
  };

  // Función para cambiar de modo
  const switchMode = (mode) => {
    if (mode === 'camera' && scanMode !== 'camera') {
      setScanMode('camera');
      setTimeout(startCamera, 100);
    } else if (mode === 'text') {
      setScanMode('text');
      stopCamera();
    }
  };

  // Validar QR con datos específicos
  const validateQRData = async (qrData) => {
    if (!qrData.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/tickets/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `qrData=${encodeURIComponent(qrData)}`
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

  // Cleanup al desmontar componente
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

          {/* Selector de modo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => switchMode('text')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  scanMode === 'text'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📝 Texto Manual
              </button>
              <button
                onClick={() => switchMode('camera')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  scanMode === 'camera'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📷 Escanear Cámara
              </button>
            </div>
          </div>

          {/* Aviso de compatibilidad para modo cámara */}
          {scanMode === 'camera' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="text-amber-800 font-semibold mb-2">⚠️ Requisitos para usar la cámara:</h4>
              <div className="text-sm text-amber-700 space-y-1">
                <div>• <strong>Conexión segura:</strong> Se requiere HTTPS o localhost</div>
                <div>• <strong>Navegadores compatibles:</strong> Chrome 53+, Firefox 36+, Safari 11+, Edge 12+</div>
                <div>• <strong>Permisos:</strong> Debe permitir el acceso a la cámara cuando se solicite</div>
                <div>• <strong>Ubicación actual:</strong> {location.protocol}//{location.host}</div>
                {!window.isSecureContext && location.protocol !== 'https:' && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
                    <strong>❌ Conexión no segura:</strong> La cámara no funcionará en HTTP. Necesitas HTTPS.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Instrucciones:</h3>
            {scanMode === 'text' ? (
              <ul className="text-blue-700 space-y-2">
                <li>• Escanea el código QR del ticket con tu dispositivo</li>
                <li>• Copia y pega el contenido completo del QR en el campo de abajo</li>
                <li>• Haz clic en "Validar QR" para verificar la autenticidad</li>
                <li>• El sistema mostrará los detalles del ticket si es válido</li>
              </ul>
            ) : (
              <ul className="text-blue-700 space-y-2">
                <li>• Asegúrate de permitir el acceso a la cámara cuando se solicite</li>
                <li>• Enfoca el código QR del ticket dentro del área de escaneo</li>
                <li>• La validación se realizará automáticamente al detectar el QR</li>
                <li>• Mantén el código QR estable para una mejor detección</li>
              </ul>
            )}
          </div>

          {/* Formulario de validación */}
          <div className="space-y-6">
            {scanMode === 'camera' ? (
              /* Modo Cámara */
              <div className="text-center">
                <div className="relative inline-block">
                  <video
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-xl border-4 border-blue-300 shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <p className="text-gray-600">Cámara lista para escanear</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-center gap-4">
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Iniciar Cámara
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                        </svg>
                        Detener Cámara
                      </span>
                    </button>
                  )}
                </div>
                
                {/* Botón de solicitar permisos cuando hay errores */}
                {validationResult && validationResult.error && !cameraActive && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={requestCameraPermissions}
                      disabled={loading}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Solicitando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          Solicitar Permisos de Cámara
                        </span>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Mostrar el QR detectado */}
                {scannedQR && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 QR Detectado:</h4>
                    <pre className="text-sm text-blue-700 whitespace-pre-wrap break-all bg-white p-3 rounded border">
                      {scannedQR}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              /* Modo Texto */
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
            )}

            {/* Botones de acción - Solo mostrar en modo texto */}
            {scanMode === 'text' && (
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
            )}

            {/* Botón de limpiar para modo cámara */}
            {scanMode === 'camera' && scannedQR && (
              <div className="flex justify-center">
                <button
                  onClick={clearForm}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Limpiar y Escanear Otro
                </button>
              </div>
            )}

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

            {/* Loading indicator para modo cámara */}
            {loading && scanMode === 'camera' && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-800 font-medium">Validando QR detectado...</span>
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

          {/* Sección de solución de problemas */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔧 Solución de Problemas - Cámara:</h3>
            <div className="space-y-3 text-sm text-yellow-700">
              <div>
                <strong>🚫 "Permisos denegados":</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  <li>• Haz clic en el ícono 🔒 o 📷 en la barra de direcciones</li>
                  <li>• Selecciona "Permitir" para la cámara</li>
                  <li>• Recarga la página (F5)</li>
                </ul>
              </div>
              <div>
                <strong>❌ "API no soportada":</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  <li>• Usa un navegador compatible: Chrome, Firefox, Safari, Edge</li>
                  <li>• Actualiza tu navegador a la versión más reciente</li>
                  <li>• En dispositivos móviles, usa el navegador predeterminado</li>
                </ul>
              </div>
              <div>
                <strong>🔒 "Conexión no segura":</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  <li>• La cámara requiere HTTPS (conexión segura)</li>
                  <li>• Si estás desarrollando, usa localhost o configura HTTPS</li>
                  <li>• Como alternativa, usa el modo "Texto Manual"</li>
                </ul>
              </div>
              <div>
                <strong>📱 Para dispositivos móviles:</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  <li>• Samsung Internet: Ve a Configuración {'->'} Sitios web y permisos {'->'} Cámara</li>
                  <li>• Chrome móvil: Menú (⋮) {'->'} Configuración {'->'} Configuración del sitio {'->'} Cámara</li>
                  <li>• Safari iOS: Configuración {'->'} Safari {'->'} Cámara {'->'} Permitir</li>
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
