// app/_layout.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';
import SplashScreen from '../components/SplashScreen';
import { LayoutProvider } from '../contexts/LayoutContext';
import { MoodProvider } from '../contexts/MoodContext';

const RootLayout = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 7000); // Updated duration to 7 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutProvider>
      <MoodProvider>
        <View style={styles.container}>
          {showSplash ? <SplashScreen /> : <Slot />}
        </View>
      </MoodProvider>
    </LayoutProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
