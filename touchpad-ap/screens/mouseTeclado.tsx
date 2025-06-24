import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connectSocket, sendClick } from '../services/socket';
import TouchPad from '../components/touchPad';

export default function HomeScreen() {
  useEffect(() => {
    connectSocket("192.168.1.11");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.touchpadWrapper}>
        <TouchPad />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  touchpadWrapper: { flex: 0.95 },
  buttonsRow: {
    flex: 0.15,
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#bbb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
