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
  const scale = useRef(new Animated.Value(0.8)).current;
  const collabAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  useEffect(() => {
    // Delay animation and sound by 2 seconds.
    setTimeout(() => {
      // Play sound when the animation starts.
      if (Platform.OS !== "web") {
        (async () => {
          try {
            const { sound } = await Audio.Sound.createAsync(
              require("../assets/sfx/sus.mp3")
            );
            soundRef.current = sound;
            await sound.playAsync();
          } catch (error) {
            console.error("Error loading sound:", error);
          }
        })();
      }

      // Animate in main content and collaboration container together.
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
        Animated.timing(collabAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start(() => {
        // After a delay, animate out all components.
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
            Animated.timing(collabAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: Platform.OS !== "web",
            }),
          ]).start(async () => {
            if (soundRef.current) {
              await soundRef.current.stopAsync();
              await soundRef.current.unloadAsync();
            }
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
    }, 2000);

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [opacity, scale, collabAnim, router]);

  return (
    <LinearGradient
      colors={["#FFDD00", "#FF7F50"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ scale }] },
        ]}
      >
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.appName}>FoodBuddy</Text>
        <Text style={styles.tagline}>Your Personal Recipe Management App</Text>
        <Text style={styles.creatortxt}>Created by:</Text>
        <Text style={styles.creator}>Code_Celestia</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.collaborationContainer,
          {
            opacity: collabAnim,
            transform: [
              {
                translateY: collabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.collaborationText}>In Collaboration With:</Text>
        <View style={styles.logosContainer}>
          <Image
            source={require("../assets/images/react-logo.png")}
            style={styles.collaborationLogo}
          />
          <Image
            source={require("../assets/images/expo-go-logo.png")}
            style={styles.collaborationLogo}
          />
          <Image
            source={require("../assets/images/chatgpt-logo.png")}
            style={styles.collaborationLogo}
          />
        </View>
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
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
    fontStyle: "italic",
  },
  creatortxt: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.8,
  },
  creator: {
    fontSize: 22,
    fontWeight: "400",
    color: "#fff",
    opacity: 0.8,
  },
  collaborationContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  collaborationText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  logosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  collaborationLogo: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    resizeMode: "contain",
  },
});
