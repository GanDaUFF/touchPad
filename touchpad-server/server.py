# server.py
import asyncio
import websockets
import json
from pynput.mouse import Controller, Button

mouse = Controller()

async def handle_connection(websocket):
    async for message in websocket:
        try:
            data = json.loads(message)
            dx = data.get("dx", 0)
            dy = data.get("dy", 0)
            tipo = data.get("type", "move")

            if tipo == "move":
                mouse.move(dx, dy)
            elif tipo == "scroll":
                # Scroll vertical: +dy para cima, -dy para baixo
                mouse.scroll(0, -int(dy / 10))  # ajuste a sensibilidade aqui
            elif tipo == "click":
                mouse.click(Button.left)
        except Exception as e:
            print("Erro:", e)

async def main():
    print("Servidor WebSocket rodando na porta 8080")
    async with websockets.serve(handle_connection, "0.0.0.0", 8080):
        await asyncio.Future()

asyncio.run(main())
