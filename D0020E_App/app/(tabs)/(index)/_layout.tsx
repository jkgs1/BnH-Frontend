import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeLayout() {
  return (
    <Stack
        screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },  
      }}>
      <Stack.Screen name="loginPage"/>
      <Stack.Screen name="homeScreen"/>
    </Stack>
  );
}
