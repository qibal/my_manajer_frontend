import { useState, useEffect, useRef } from 'react';

const WEBSOCKET_URL = "ws://localhost:8080/ws/messages/"; // Sesuaikan dengan URL WebSocket backend Anda

const createWebSocketService = (channelId, onMessageReceived) => {
  let ws = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL_MS = 3000;

  const connect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already open.');
      return;
    }

    console.log(`Attempting to connect to WebSocket for channel ${channelId}...`);
    ws = new WebSocket(`${WEBSOCKET_URL}${channelId}`);

    ws.onopen = () => {
      console.log(`Connected to WebSocket for channel ${channelId}`);
      reconnectAttempts = 0;
      // Kirim pesan untuk fetch history segera setelah terhubung
      sendMessage({ type: 'get_message_history', payload: { limit: 50, skip: 0 } });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`Received message for channel ${channelId}:`, data);
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    };

    ws.onclose = (event) => {
      console.log(`Disconnected from WebSocket for channel ${channelId}. Code: ${event.code}, Reason: ${event.reason}`);
      if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) { // 1000 = Normal Closure
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        setTimeout(connect, RECONNECT_INTERVAL_MS);
      } else if (event.code !== 1000) {
        console.error(`Max reconnect attempts reached for channel ${channelId}.`);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket Error for channel ${channelId}:`, error);
      // It's crucial to also log the event object for more details
      console.error(`WebSocket Error Event for channel ${channelId}:`, error);
      ws.close(); // Close to trigger onclose and potential reconnect
    };
  };

  const sendMessage = (message) => {
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log(`Sent message to channel ${channelId}:`, message);
      } else {
        console.warn(`WebSocket for channel ${channelId} not open. Current readyState: ${ws.readyState}. Message not sent:`, message);
      }
    } else {
      console.warn(`WebSocket for channel ${channelId} not initialized. Message not sent:`, message);
    }
  };

  const disconnect = () => {
    if (ws) {
      console.log(`Disconnecting WebSocket for channel ${channelId}`);
      ws.close(1000, "Client initiated disconnect"); // 1000 = Normal Closure
      ws = null;
    }
  };

  return { connect, sendMessage, disconnect };
};

export default createWebSocketService; 