let socket: WebSocket | null = null;

export const connectSocket = (ip: string, port = 8080) => {
  const url = `ws://${ip}:${port}`;
  console.log("Tentando conectar em:", url);
  socket = new WebSocket(url);

  socket.onopen = () => console.log("✅ Conectado ao servidor");
  socket.onerror = (e) => console.log("❌ Erro no socket:", e);
  socket.onclose = () => console.log("🔌 Socket desconectado");
};

export const sendMouseDelta = (dx: number, dy: number, type: 'move' | 'scroll' | 'click' = 'move') => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ dx, dy, type }));
  }
};

