import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavbar = ({ onMoodPress }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Helper: check if route is active
  const isActive = (route) => pathname === route;

  // Define tabs, marking the Mood tab with isMood; it only shows on Home.
  const tabs = [
    { route: '/', label: 'Home', icon: 'home' },
    { route: '/favorites', label: 'Favorites', icon: 'star' },
    { route: 'mood', label: 'Mood', icon: 'happy', isMood: true },
    { route: '/createRecipe', label: 'Add Recipe', icon: 'book' },
    { route: '/settings', label: 'Settings', icon: 'cog' },
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
          // Only show the Mood tab if on Home
          if (tab.isMood && pathname !== '/') {
            return null;
          }
          const active = isActive(tab.route);
          const iconColor = 'black'; // Default icon color

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                tab.isMood && styles.moodTabItem,
                active && styles.activeTabItem,
              ]}
              onPress={() => handleTabPress(tab)}
            >
              {tab.isMood ? (
                <View style={[styles.moodBubble, active && styles.activeMoodBubble]}>
                  <Ionicons name={tab.icon} size={24} color={iconColor} />
                </View>
              ) : (
                <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                  <Ionicons name={tab.icon} size={24} color={iconColor} />
                </View>
              )}
              <Text style={[styles.tabLabel, { color: iconColor }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
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
    position: 'relative',
    backgroundColor: 'transparent',
  },
  navbarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8D64E', // original color
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end', // align icons at the bottom of the navbar
    justifyContent: 'space-around',
    paddingBottom: 3,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60, // fixed width for consistency
    marginBottom: 5,
  },
  activeTabItem: {
    // Active tab pops out more so that half of its circle is out of the navbar
    marginTop: -30,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#f0c209',
    transform: [{ translateY: -5 }],
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  moodBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFA100', // default mood bubble background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  activeMoodBubble: {
    backgroundColor: '#f0c209',
    transform: [{ translateY: -15 }], // pop out more so half is out of the navbar
  },
  tabLabel: {
    fontSize: 11,
  },
});
