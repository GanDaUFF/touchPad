// screens/HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o modo:</Text>

      <Button
        title="🖱️ Mouse + Teclado"
        onPress={() => navigation.navigate('MouseTeclado')}
      />

      {/* Futuramente */}
      {/* <Button title="🎮 Controle Gamer" onPress={() => {}} /> */}
      {/* <Button title="⌨️ Teclado Gamer" onPress={() => {}} /> */}
      {/* <Button title="🖱️+⌨️ Gamer" onPress={() => {}} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24, marginBottom: 30, fontWeight: 'bold'
  }
});
