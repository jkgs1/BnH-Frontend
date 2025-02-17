import { Stack } from 'expo-router/stack';
import React from 'react';

interface LayoutProps {
  isLoggedIn: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn }) => {
  return (
    <Stack
    screenOptions={{
      headerShown: false,
    }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="loginPage" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default Layout;
