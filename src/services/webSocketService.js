import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.notifications = [];
    this.listeners = [];
  }

  connect() {
    if (this.connected || (this.client && this.client.active)) {
      console.log('WebSocket ya está conectado o conectándose');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      console.log('Iniciando nueva conexión WebSocket...');
      
      // Crear conexión SockJS
      const socket = new SockJS(`${import.meta.env.VITE_API_BACKEND}/ws`);
      
      // Configurar cliente STOMP
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {},
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Manejar conexión exitosa
      this.client.onConnect = (frame) => {
        console.log('Connected to WebSocket:', frame);
        this.connected = true;

        // Suscribirse al canal de notificaciones
        this.client.subscribe('/topic/notifications', (message) => {
          const notification = JSON.parse(message.body);
          console.log('Nueva notificación recibida:', notification);
          
          // Agregar la notificación a la lista
          this.addNotification(notification);
          
          // Notificar a todos los listeners
          this.notifyListeners(notification);
        });

        resolve();
      };

      // Manejar errores de conexión
      this.client.onStompError = (frame) => {
        console.error('Error en WebSocket:', frame.headers['message']);
        console.error('Detalles adicionales:', frame.body);
        this.connected = false;
        reject(new Error('Error connecting to WebSocket'));
      };

      // Manejar desconexión
      this.client.onDisconnect = () => {
        console.log('Desconectado del WebSocket');
        this.connected = false;
      };

      // Iniciar conexión
      this.client.activate();
    });
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  addNotification(notification) {
    // Agregar timestamp si no existe
    if (!notification.timestamp) {
      notification.timestamp = new Date().toLocaleString();
    }
    
    // Agregar ID único si no existe
    if (!notification.id) {
      notification.id = Date.now() + Math.random();
    }

    this.notifications.unshift(notification);
    
    // Mantener solo las últimas 50 notificaciones
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Guardar en localStorage para persistencia
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  getNotifications() {
    // Cargar notificaciones desde localStorage si no hay ninguna en memoria
    if (this.notifications.length === 0) {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    }
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
    localStorage.removeItem('notifications');
  }

  // Sistema de listeners para componentes React
  addListener(callback) {
    this.listeners.push(callback);
    
    // Retornar función para eliminar el listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(notification) {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error en listener de notificación:', error);
      }
    });
  }

  // Método para obtener el contador de notificaciones no leídas
  getUnreadCount() {
    return this.notifications.filter(notification => !notification.read).length;
  }

  // Marcar notificación como leída
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
  }

  // Marcar todas como leídas
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }
}

// Crear instancia singleton
const webSocketService = new WebSocketService();

export default webSocketService;