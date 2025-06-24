import React, { useEffect, useRef, useState } from 'react';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { sendMouseDelta, sendTextMode, sendTextInput } from '../services/socket';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const SCALE = 2;
const SEND_INTERVAL = 16;

export default function TouchPad() {
  const last = useRef({ x: 0, y: 0 });
  const delta = useRef({ dx: 0, dy: 0 });
  const isFirstMove = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  let lastTap = 0;
  const [modoTexto, setModoTexto] = useState(false);
  const [text, setText] = useState('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !modoTexto,

      onPanResponderGrant: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap < DOUBLE_TAP_DELAY) {
          console.log("🖱️ Clique detectado (duplo toque)");
          sendMouseDelta(0, 0, 'click');
        }

        lastTap = now;
        isFirstMove.current = true;
        last.current = { x: gestureState.moveX, y: gestureState.moveY };
      },

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          const scrollAmount = gestureState.dy * 0.5;
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
const toggleModoTexto = () => {
  setModoTexto((prev) => {
    const novo = !prev;
    sendTextMode(novo);
    if (!novo) Keyboard.dismiss();
    return novo;
  });
};

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
  <View style={{ flex: 1, position: 'relative' }}>
    {/* Área de toque */}
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        backgroundColor: '#ddd',
        margin: 20,
        marginBottom: 5,
        borderRadius: 10,
      }}
    />

    {modoTexto && (
      <TextInput
        autoFocus
        style={styles.input}
        placeholder="Digite aqui..."
        value={text}
        onChangeText={(t) => {
          setText(t);
          sendTextInput(t);
        }}
        onSubmitEditing={() => {
          sendTextInput('\n');
          setText('');
        }}
      />
    )}

    {/* ✅ Agora o botão flutuante vai aparecer corretamente */}
    <TouchableOpacity onPress={toggleModoTexto} style={styles.fab}>
      <Ionicons name={modoTexto ? 'close' : 'create'} size={24} color="white" />
    </TouchableOpacity>

    {/* Área inferior com botões */}
    {!modoTexto && (
      <View style={{ flexDirection: 'row', height: 80, paddingHorizontal: 20, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => sendMouseDelta(0, 0, 'leftClick')}
          style={{ flex: 1, backgroundColor: '#bbb', marginRight: 2, borderRadius: 10 }}
        />
        <TouchableOpacity
          onPress={() => sendMouseDelta(0, 0, 'rightClick')}
          style={{ flex: 1, backgroundColor: '#bbb', marginLeft: 2, borderRadius: 10 }}
        />
      </View>
    )}
  </View>
);

}

const styles = StyleSheet.create({
 fab: {
  position: 'absolute',
  top: 24,           // <-- substitui o bottom
  right: 24,
  backgroundColor: '#2196F3',
  padding: 12,
  borderRadius: 50,
  elevation: 5,
  zIndex: 10,        // <-- garante que fique acima das outras views
},

  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 10,
    margin: 20,
    borderRadius: 8,
  },
});

