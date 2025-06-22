import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { connectSocket } from '../services/socket';
import TouchPad from '../components/touchPad'; // cuidado com a capitalização

export default function HomeScreen() {
  useEffect(() => {
    connectSocket("192.168.1.11");
  }, []);

  return (
    <View style={styles.container}>
      <TouchPad />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ESSENCIAL para ocupar toda a tela
    backgroundColor: '#fff',
  },
});
