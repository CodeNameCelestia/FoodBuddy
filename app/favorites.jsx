import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform, // <-- Added Platform import here
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import database from '../database/database';
import RecipeCard from '../components/RecipeCard';
import BottomNavbar from '../components/BottomNavbar';

const HEADER_HEIGHT = 70;

const Favorites = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        const favoriteRecipes = data.filter(
          (recipe) => recipe.favorite && !recipe.hidden
        );
        setRecipes(favoriteRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchData();
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.centeredHeader}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 30 }}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        {recipes.length === 0 ? (
          <Text style={styles.noFavoritesText}>No favorite recipes found.</Text>
        ) : (
          recipes.map((item) => (
            <RecipeCard key={item.id} item={item} onPress={handleViewRecipe} />
          ))
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 25,
    zIndex: 11,
  },
  centeredHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
});
