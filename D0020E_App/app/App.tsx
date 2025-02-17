import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from './_layout'; 

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if a token exists in AsyncStorage
        const token = await AsyncStorage.getItem("userToken");

        if (token) {
          setIsLoggedIn(true); // User is logged in
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading indicator while checking login status
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Pass the login status to the Layout component
  return <Layout isLoggedIn={isLoggedIn} />;
};

export default App;