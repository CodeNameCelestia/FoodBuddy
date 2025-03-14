import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current; // Start slightly smaller

  useEffect(() => {
    // Entrance animation: fade in & scale up
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      // Hold for 2 seconds, then animate out (exit)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]).start(() => {
          // After exit animation, navigate to Home
          router.replace('/');
        });
      }, 2000);
    });
  }, [opacity, scale, router]);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
      <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
      <Text style={styles.appName}>FoodBuddy</Text>
      <Text style={styles.creator}>Created by: Alejandro A. Cayasa</Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8D64E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 25,
  },
  appName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  creator: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
});
