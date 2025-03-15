import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RecipeDetailBottomBar = ({ isEditing, setIsEditing, setShowRemoveAlert }) => {
  const router = useRouter();
  if (!isEditing) {
    return (
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.tabText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setIsEditing(true)}>
          <Ionicons name="create" size={24} color="black" />
          <Text style={styles.tabText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setShowRemoveAlert(true)}>
          <Ionicons name="trash" size={24} color="black" />
          <Text style={styles.tabText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8D64E",
    paddingVertical: 8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default RecipeDetailBottomBar;
