import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const BottomNavbar = ({ onMoodPress }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Animated value for the active tab (used for scale and translateY).
  const activeTabAnim = useRef(new Animated.Value(1)).current;
  // Animated value for the mood button; if on Home then it should rise.
  const moodAnim = useRef(new Animated.Value(pathname === "/" ? 1 : 0)).current;

  // When the route (and thus active tab) changes, run an animation on activeTabAnim.
  useEffect(() => {
    Animated.sequence([
      Animated.timing(activeTabAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(activeTabAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(activeTabAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pathname]);

  // Animate the mood button. When on Home, rise it up; otherwise, lower it.
  useEffect(() => {
    if (pathname === "/") {
      Animated.timing(moodAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(moodAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [pathname]);

  // Helper: Check if the given route is active.
  const isActive = (route) => pathname === route;

  // Define tabs; note the "Mood" tab is only shown on Home.
  const tabs = [
    { route: "/", label: "Home", icon: "home" },
    { route: "/favorites", label: "Favorites", icon: "star" },
    { route: "mood", label: "Mood", icon: "happy", isMood: true },
    { route: "/createRecipe", label: "Add Recipe", icon: "book" },
    { route: "/settings", label: "Settings", icon: "cog" },
  ];

  const handleTabPress = (tab) => {
    if (tab.isMood && onMoodPress) {
      onMoodPress();
    } else {
      router.push(tab.route);
    }
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbarBackground} />
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => {
          // Only show the Mood tab if on Home.
          if (tab.isMood && pathname !== "/") return null;

          const active = isActive(tab.route);
          const iconColor = "black";

          if (tab.isMood) {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tabItem, styles.moodTabItem]}
                onPress={() => handleTabPress(tab)}
              >
                <Animated.View
                  style={[
                    styles.moodBubble,
                    active && styles.activeMoodBubble,
                    {
                      transform: [
                        {
                          // Translate the mood bubble up when on Home.
                          translateY: moodAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -15],
                          }),
                        },
                        {
                          // Apply the active tab scale animation if this tab is active.
                          scale: active ? activeTabAnim : 1,
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name={tab.icon} size={24} color={iconColor} />
                </Animated.View>
                <Text style={[styles.tabLabel, { color: iconColor }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tabItem, active && styles.activeTabItem]}
                onPress={() => handleTabPress(tab)}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    active && {
                      backgroundColor: "#f0c209",
                      transform: [
                        {
                          translateY: activeTabAnim.interpolate({
                            inputRange: [0.8, 1, 1.2], // Must be ascending!
                            outputRange: [-5, -15, -5],
                          }),
                        },
                        { scale: activeTabAnim },
                      ],
                    },
                  ]}
                >
                  <Ionicons name={tab.icon} size={24} color={iconColor} />
                </Animated.View>
                <Text style={[styles.tabLabel, { color: iconColor }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </View>
  );
};

export default BottomNavbar;

const NAVBAR_HEIGHT = 70;

const styles = StyleSheet.create({
  navbarContainer: {
    height: NAVBAR_HEIGHT,
    position: "relative",
    backgroundColor: "transparent",
  },
  navbarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F8D64E",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  tabRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 3,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 60,
    marginBottom: 5,
  },
  activeTabItem: {
    marginTop: -30,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  moodTabItem: {
    // Extra styles for mood tab if needed.
  },
  moodBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFA100",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  activeMoodBubble: {
    backgroundColor: "#f0c209",
  },
  tabLabel: {
    fontSize: 11,
  },
});
