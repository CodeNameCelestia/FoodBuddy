import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import database from '../database/database';

const moods = [
  { label: 'Happy', icon: require('../assets/images/happy.png') },
  { label: 'Sad', icon: require('../assets/images/sad.png') },
  { label: 'Hungry', icon: require('../assets/images/hungry.png') },
  { label: 'Cool', icon: require('../assets/images/cool.png') },
  { label: 'Stressed', icon: require('../assets/images/stressed.png') }
];

const MoodScreen = () => {
  const router = useRouter();

  const handleMoodSelect = async (mood) => {
    const recipes = await database.getRecipesByMood(mood);
    if (recipes && recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      router.push(`/recipeDetail?id=${randomRecipe.id}`);
    } else {
      Alert.alert('No Recipes', `No recipes found for mood ${mood}.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Mood</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity key={m.label} onPress={() => handleMoodSelect(m.label)} style={styles.moodItem}>
            <Image source={m.icon} style={styles.moodIcon} />
            <Text>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  moodItem: {
    alignItems: 'center',
    marginBottom: 20
  },
  moodIcon: {
    width: 60,
    height: 60,
    marginBottom: 8
  }
});
