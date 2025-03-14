import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  TextInput,
  Platform, // Make sure Platform is imported
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import database from '../database/database';
import MoodModal from '../components/MoodModal';
import RecipeCard from '../components/RecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import NoMoodRecipeAlert from '../components/NoMoodRecipeAlert';

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [noMoodAlertVisible, setNoMoodAlertVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [scaleValue] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        const visibleRecipes = data.filter((recipe) => !recipe.hidden);
        setRecipes(visibleRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (moodModalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: Platform.OS !== 'web', // Disable native driver on web
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [moodModalVisible]);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  const moods = [
    { label: 'Happy', image: require('../assets/images/happy.png') },
    { label: 'Sad', image: require('../assets/images/sad.png') },
    { label: 'Hungry', image: require('../assets/images/hungry.png') },
    { label: 'Cool', image: require('../assets/images/cool.png') },
    { label: 'Stressed', image: require('../assets/images/stressed.png') },
  ];

  const handleMoodSelect = async (mood) => {
    setMoodModalVisible(false);
    try {
      const moodRecipes = await database.getRecipesByMood(mood);
      const visibleMoodRecipes = moodRecipes.filter((recipe) => !recipe.hidden);
      if (visibleMoodRecipes.length > 0) {
        const randomRecipe =
          visibleMoodRecipes[Math.floor(Math.random() * visibleMoodRecipes.length)];
        router.push(`/recipeDetail?id=${randomRecipe.id}`);
      } else {
        setSelectedMood(mood);
        setNoMoodAlertVisible(true);
      }
    } catch (error) {
      console.error('Error selecting mood:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>FoodBuddy</Text>
        </View>
      </Animated.View>

      {/* Search Bar & Add Recipe Button */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => router.push('/createRecipe')}
        >
          <Ionicons name="add-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Recipes */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 5 }}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          Recent Recipes
        </Text>
        {filteredRecipes.map((item) => (
          <RecipeCard key={item.id} item={item} onPress={handleViewRecipe} />
        ))}
      </Animated.ScrollView>

      {/* Bottom Navbar with Mood Button visible on Home */}
      <BottomNavbar showMoodButton={true} onMoodPress={() => setMoodModalVisible(true)} />

      {/* Mood Selection Modal */}
      <MoodModal
        visible={moodModalVisible}
        moods={moods}
        onSelect={handleMoodSelect}
        onCancel={() => setMoodModalVisible(false)}
      />

      {/* Custom Alert for No Recipes Found for Mood */}
      <NoMoodRecipeAlert
        visible={noMoodAlertVisible}
        mood={selectedMood}
        onClose={() => setNoMoodAlertVisible(false)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  /* Header */
  header: {
    backgroundColor: "#F8D64E",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  /* Search Row */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F8D64E",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    marginRight: 8,
  },
  addButtonContainer: {
    backgroundColor: "#f0c209",
    borderRadius: 50,
    padding: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
  },
  /* Scrollable Content */
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
});
