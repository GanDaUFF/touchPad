// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen';
import MouseTecladoScreen from './screens/mouseTeclado';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MouseTeclado" component={MouseTecladoScreen} options={{ title: 'Mouse + Teclado' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
