// webSocketService.jsx
class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = '';

    // Connection state
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = Infinity;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.reconnectTimer = null;

    // Heartbeat settings
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
    this.pingTimeout = 25000;
    this.pongTimeout = 5000;

    // Event handlers
    this.eventHandlers = {
      onMessage: null,
      onOpen: null,
      onClose: null,
      onError: null
    };

    // Store connection parameters for reconnection
    this.connectionPath = '';
    this.connectionHandlers = {};
  }

  connect(path, { onMessage, onOpen, onClose, onError } = {}) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.connectionPath = path;
    this.connectionHandlers = { onMessage, onOpen, onClose, onError };

    if (path.startsWith('ws://') || path.startsWith('wss://')) {
      this.url = path;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const basePath = path.startsWith('/') ? path : `/${path}`;
      this.url = `${protocol}//${host}${basePath}`;
    }

    this.eventHandlers = { onMessage, onOpen, onClose, onError };

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      this.eventHandlers.onError?.(error);
      this.scheduleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = (event) => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.eventHandlers.onOpen?.(event);
    };

    this.ws.onmessage = (event) => {
      this.resetHeartbeatTimeout();

      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') return;
        this.eventHandlers.onMessage?.(data);
      } catch (e) {
        this.eventHandlers.onMessage?.(event.data);
      }
    };

    this.ws.onclose = (event) => {
      this.cleanup();
      this.eventHandlers.onClose?.(event);

      if (event.code !== 1000) {
         this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.cleanup();
      this.eventHandlers.onError?.(error);
      this.scheduleReconnect();
    };
  }

  startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          this.reconnect();
        }

        this.heartbeatTimeout = setTimeout(() => {
          this.reconnect();
        }, this.pongTimeout);
      }
    }, this.pingTimeout);
  }

  resetHeartbeatTimeout() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN && this.ws?.readyState !== WebSocket.CONNECTING) {
        this.connect(this.connectionPath, this.connectionHandlers);
      }
    }, delay);
  }

  reconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Reconnecting');
    }
    this.scheduleReconnect();
  }

  cleanup() {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  disconnect() {
    this.cleanup();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close(1000, 'Normal closure');
    }

    this.ws = null;
    this.reconnectAttempts = 0;
  }

  sendMessage(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        return true;
      } catch (error) {
        this.reconnect();
        return false;
      }
    }

    return false;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export { WebSocketService };

export const webSocketService = new WebSocketService();