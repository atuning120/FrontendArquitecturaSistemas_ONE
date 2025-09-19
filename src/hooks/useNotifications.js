import { useState, useEffect, useCallback } from 'react';
import webSocketService from '../services/webSocketService';
import nativeWebSocketService from '../services/nativeWebSocketService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [service, setService] = useState(null);

  // Función para actualizar las notificaciones
  const updateNotifications = useCallback(() => {
    if (service) {
      const currentNotifications = service.getNotifications();
      setNotifications(currentNotifications);
      setUnreadCount(service.getUnreadCount());
    }
  }, [service]);

  // Función que se ejecuta cuando llega una nueva notificación
  const handleNewNotification = useCallback((notification) => {
    updateNotifications();
    
    // Mostrar notificación del navegador si está permitido
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  }, [updateNotifications]);

  useEffect(() => {
    let isMounted = true;
    
    // Intentar usar SockJS primero, si falla usar WebSocket nativo
    const connectWebSocket = async () => {
      try {
        console.log('Intentando conexión WebSocket...');
        // Intentar conectar con SockJS
        await webSocketService.connect();
        if (isMounted) {
          setService(webSocketService);
          setConnected(true);
          updateNotifications();
          console.log('✅ Conectado usando SockJS');
        }
      } catch (error) {
        console.warn('⚠️ SockJS falló, intentando WebSocket nativo:', error);
        try {
          // Si SockJS falla, usar WebSocket nativo
          await nativeWebSocketService.connect();
          if (isMounted) {
            setService(nativeWebSocketService);
            setConnected(true);
            updateNotifications();
            console.log('✅ Conectado usando WebSocket nativo');
          }
        } catch (nativeError) {
          console.error('❌ Ambos métodos de conexión fallaron:', nativeError);
          if (isMounted) {
            setConnected(false);
          }
        }
      }
    };

    connectWebSocket();

    // Pedir permisos para notificaciones del navegador
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []); // Solo ejecutar una vez

  // Efecto separado para manejar el listener cuando cambia el servicio
  useEffect(() => {
    if (service) {
      const removeListener = service.addListener(handleNewNotification);
      return removeListener;
    }
  }, [service, handleNewNotification]);

  // Función para marcar como leída
  const markAsRead = useCallback((notificationId) => {
    if (service) {
      service.markAsRead(notificationId);
      updateNotifications();
    }
  }, [service, updateNotifications]);

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    if (service) {
      service.markAllAsRead();
      updateNotifications();
    }
  }, [service, updateNotifications]);

  // Función para limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    if (service) {
      service.clearNotifications();
      updateNotifications();
    }
  }, [service, updateNotifications]);

  return {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    updateNotifications
  };
};