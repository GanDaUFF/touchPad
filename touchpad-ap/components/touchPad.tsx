import React, { useEffect, useRef } from 'react';
import { sendMouseDelta } from '../services/socket';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

const SCALE = 2;
const SEND_INTERVAL = 16;

export default function TouchPad() {
  const last = useRef({ x: 0, y: 0 });
  const delta = useRef({ dx: 0, dy: 0 });
  const isFirstMove = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


let lastTap = 0;

const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      // Clique com 2 toques rápidos
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        console.log("🖱️ Clique detectado (duplo toque)");
        sendMouseDelta(0, 0, 'click'); // novo tipo de ação
      }

      lastTap = now;
      isFirstMove.current = true;
      last.current = { x: gestureState.moveX, y: gestureState.moveY };
    },

    onPanResponderMove: (_, gestureState) => {
      if (gestureState.numberActiveTouches === 2) {
        // Scroll
        const scrollAmount = gestureState.dy * 0.5; // ajuste sensibilidade
        console.log("🖱️ Scroll detectado:", scrollAmount);
        sendMouseDelta(0, scrollAmount, 'scroll');
        return;
      }

      if (isFirstMove.current) {
        isFirstMove.current = false;
        last.current = { x: gestureState.moveX, y: gestureState.moveY };
        return;
      }

      const dx = (gestureState.moveX - last.current.x) * SCALE;
      const dy = (gestureState.moveY - last.current.y) * SCALE;

      delta.current = { dx, dy };
      last.current = { x: gestureState.moveX, y: gestureState.moveY };
    },

    onPanResponderRelease: () => {
      delta.current = { dx: 0, dy: 0 };
      isFirstMove.current = true;
    },
  })
).current;


  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const { dx, dy } = delta.current;
      if (dx !== 0 || dy !== 0) {
        sendMouseDelta(dx, dy);
        delta.current = { dx: 0, dy: 0 };
      }
    }, SEND_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        backgroundColor: '#ddd',
        margin: 20,
        borderRadius: 10,
      }}
    />
  );
}
