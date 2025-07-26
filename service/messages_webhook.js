// Impor hook React tidak lagi diperlukan karena ini adalah modul layanan biasa
// import { useRef } from 'react';

const WEBSOCKET_URL_BASE = "ws://localhost:8080/api/v1/ws/messages/";

const createWebSocketService = ({ channelId, token, onMessageReceived }) => {
  let ws = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL_MS = 3000;
  let intentionalClose = false;

  const connect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket connection is already open.');
      return;
    }

    if (!token || typeof token !== 'string') {
      console.error("WebSocket Connection Error: Invalid or missing JWT token.");
      return;
    }

    intentionalClose = false;
    const websocketUrl = `${WEBSOCKET_URL_BASE}${channelId}?token=${token}`;
      console.log(`[WS] Attempting to connect to: ${websocketUrl}`); // Log URL lengkap
    console.log(`[WS] Token sent: ${token.substring(0, 10)}...`); // Log awal token
    
    // Sesuai dokumentasi MDN: Membuat instance WebSocket baru
    ws = new WebSocket(websocketUrl);

    // Menggunakan sintaks event handler on... sesuai preferensi
    ws.onopen = () => {
      console.log(`Connected to WebSocket for channel ${channelId}`);
      reconnectAttempts = 0;
      sendMessage({ type: 'get_message_history', payload: { limit: 50, skip: 0 } });
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.log(`Received non-JSON message from server:`, event.data);
        data = { type: 'server_log', payload: event.data };
      }
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    };

    ws.onerror = (event) => {
      console.error(`WebSocket Error for channel ${channelId}:`, event);
    };

    ws.onclose = (event) => {
      console.log(`Disconnected from WebSocket. Code: ${event.code}, Reason: ${event.reason}`);
      if (!intentionalClose && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        setTimeout(connect, RECONNECT_INTERVAL_MS);
      } else if (!intentionalClose) {
        console.error(`Max reconnect attempts reached for channel ${channelId}.`);
      }
    };
  };

  // Sesuai dokumentasi MDN: Fungsi untuk mengirim data
  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn(`WebSocket is not open. Cannot send message.`);
    }
  };

  // Sesuai dokumentasi MDN: Fungsi untuk menutup koneksi
  const disconnect = () => {
    if (ws) {
      console.log(`Intentionally disconnecting WebSocket for channel ${channelId}.`);
      intentionalClose = true;
      ws.close(1000, "Client initiated disconnect");
      ws = null;
    }
  };

  return { connect, sendMessage, disconnect };
};

export default createWebSocketService; 