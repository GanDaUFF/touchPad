let socket: WebSocket | null = null;

export const connectSocket = (ip: string, port = 8080) => {
  const url = `ws://${ip}:${port}`;
  console.log("Tentando conectar em:", url);
  socket = new WebSocket(url);

  socket.onopen = () => console.log("✅ Conectado ao servidor");
  socket.onerror = (e) => console.log("❌ Erro no socket:", e);
  socket.onclose = () => console.log("🔌 Socket desconectado");
};
export const sendClick = (button: 'left' | 'right') => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ click: button }));
  }
};

export const sendTextMode = (ativo: boolean) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'textMode', ativo }));
  }
};

export const sendTextInput = (text: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'type', text }));
  }
};

export const sendMouseDelta = (
  dx: number,
  dy: number,
  action: "move" | "scroll" | "click" | "leftClick" | "rightClick" = "move"
) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ dx, dy, action }));
  }
};

