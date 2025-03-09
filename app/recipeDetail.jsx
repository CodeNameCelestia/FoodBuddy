import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Navbar from '../components/NavBar';
import database from '../database/database';

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const rec = await database.getRecipeById(id);
      setRecipe(rec);
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Loading recipe...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.description}>{recipe.description}</Text>
      <Text style={styles.sectionHeader}>Recipe</Text>
      <Text>{recipe.recipe}</Text>
      <Text style={styles.sectionHeader}>How to Cook</Text>
      <Text>{recipe.howToCook}</Text>
      <Text style={styles.sectionHeader}>Mood</Text>
      <Text>{recipe.mood}</Text>
    </ScrollView>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    marginBottom: 16
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  }
});
