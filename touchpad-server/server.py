import asyncio
import websockets
import json
from pynput.mouse import Controller as MouseController, Button
from pynput.keyboard import Controller as KeyboardController, Key

mouse = MouseController()
keyboard = KeyboardController()

async def handle_connection(websocket):
    print("🖥️ Cliente conectado.")
    async for message in websocket:
        try:
            data = json.loads(message)
            dx = data.get("dx", 0)
            dy = data.get("dy", 0)
            action = data.get("action", "move")

            if action == "type":
                texto = data.get("text", "")
                for char in texto:
                    if char == '\n':
                        keyboard.press(Key.enter)
                        keyboard.release(Key.enter)
                    elif char == '\b':
                        keyboard.press(Key.backspace)
                        keyboard.release(Key.backspace)
                    else:
                        keyboard.press(char)
                        keyboard.release(char)

            elif action == "textMode":
                print("Modo texto:", data.get("ativo"))

            elif action == "move":
                mouse.move(dx, dy)
            elif action == "scroll":
                mouse.scroll(0, -dy / 50)  # ajuste sensibilidade do scroll
            elif action == "click":
                mouse.click(Button.left, 1)
            elif action == "leftClick":
                mouse.press(Button.left)
                mouse.release(Button.left)
            elif action == "rightClick":
                mouse.press(Button.right)
                mouse.release(Button.right)
        except Exception as e:
            print("Erro:", e)

async def main():
    print("🚀 Servidor WebSocket rodando na porta 8080")
    async with websockets.serve(handle_connection, "0.0.0.0", 8080):
        await asyncio.Future()

asyncio.run(main())
