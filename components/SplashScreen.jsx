import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = () => {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current; // Start slightly smaller
  const soundRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      if (Platform.OS !== "web") {
        // Skip sound on web
        try {
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sfx/sus.mp3")
          );
          soundRef.current = sound;
          await sound.playAsync();
        } catch (error) {
          console.error("Error loading sound:", error);
        }
      }
    };

    playSound();

    // Entrance animation: fade in & scale up
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start(() => {
      // Hold for a while, then animate out (exit)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: Platform.OS !== "web",
          }),
          Animated.timing(scale, {
            toValue: 0.1,
            duration: 1000,
            useNativeDriver: Platform.OS !== "web",
          }),
        ]).start(async () => {
          // Stop and unload the sound before navigating
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          }
          // On web, delay navigation a bit
          if (Platform.OS === "web") {
            setTimeout(() => {
              router.replace("/");
            }, 300);
          } else {
            router.replace("/");
          }
        });
      }, 3000);
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [opacity, scale, router]);

  return (
    <LinearGradient
      colors={["#FFDD00", "#FF7F50"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Animated.View
        style={[styles.container, { opacity, transform: [{ scale }] }]}
      >
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.appName}>FoodBuddy</Text>
        <Text style={styles.tagline}>Your Personal Recipe Management App</Text>
        <Text style={styles.creatortxt}>Created by:</Text>
        <Text style={styles.creator}>Alejandro A. Cayasa</Text>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 5,
    borderRadius: 80,
  },
  appName: {
    fontSize: 55,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
    fontStyle: "italic",
  },
  creatortxt: {
    fontSize: 20,
    color: "#fff",
    opacity: 0.8,
  },
  creator: {
    fontSize: 25,
    fontWeight: "400",
    color: "#fff",
    opacity: 0.8,
  },
});
