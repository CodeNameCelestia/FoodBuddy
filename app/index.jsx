import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import database from '../database/database';

const Home = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  // Fetch data from your local database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchData();
  }, []);

  // Animate the modal when moodModalVisible changes
  useEffect(() => {
    if (moodModalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [moodModalVisible]);

  // Filter recipes by name based on searchQuery
  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  // Define mood options
  const moods = [
    { label: 'Happy', image: require('../assets/images/happy.png') },
    { label: 'Sad', image: require('../assets/images/sad.png') },
    { label: 'Hungry', image: require('../assets/images/hungry.png') },
    { label: 'Cool', image: require('../assets/images/cool.png') },
    { label: 'Stressed', image: require('../assets/images/stressed.png') }
  ];

  const handleMoodSelect = async (mood) => {
    setMoodModalVisible(false);
    try {
      const moodRecipes = await database.getRecipesByMood(mood);
      if (moodRecipes && moodRecipes.length > 0) {
        const randomRecipe =
          moodRecipes[Math.floor(Math.random() * moodRecipes.length)];
        router.push(`/recipeDetail?id=${randomRecipe.id}`);
      } else {
        alert(`No recipes found for mood: ${mood}`);
      }
    } catch (error) {
      console.error('Error selecting mood:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>FoodBuddy</Text>
        </View>
      </View>

      {/* Search Bar and Add Recipe Button Row */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => router.push('/createRecipe')}
        >
          <Ionicons name="add-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Recipes */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          Recent Recipes
        </Text>

        {filteredRecipes.map((item) => (
          <View key={item.id} style={styles.recipeCard}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewRecipe(item.id)}
              >
                <Text style={styles.viewButtonText}>View Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/')}
        >
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setMoodModalVisible(true)}
        >
          <Ionicons name="happy" size={24} color="black" />
          <Text style={styles.tabText}>Mood</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="book" size={24} color="black" />
          <Text style={styles.tabText}>Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Selection Modal */}
      <Modal
        visible={moodModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMoodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}
          >
            <Text style={styles.modalTitle}>Select Your Mood</Text>
            <View style={styles.moodsContainer}>
              {moods.map((m) => (
                <TouchableOpacity
                  key={m.label}
                  style={styles.moodOption}
                  onPress={() => handleMoodSelect(m.label)}
                >
                  <Image source={m.image} style={styles.moodImage} />
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setMoodModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  /* Top Header */
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  /* Search Bar and Add Button Row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8D64E',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 8
  },
  addButtonContainer: {
    backgroundColor: '#f0c209',
    borderRadius: 50,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4
  },
  /* Main Scrollable Content */
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16
  },
  // Recipe card style with adjustable width
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    alignSelf: 'center'
  },
  recipeImage: {
    width: '100%',
    height: 170
  },
  recipeContent: {
    padding: 10
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12
  },
  viewButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  viewButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  /* Bottom Tab Bar */
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8D64E',
    paddingVertical: 8
  },
  tabItem: {
    alignItems: 'center'
  },
  tabText: {
    fontSize: 12,
    marginTop: 2
  },
  /* Modal Styles for Mood Selection */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  moodOption: {
    alignItems: 'center',
    margin: 10
  },
  moodImage: {
    width: 50,
    height: 50,
    marginBottom: 5
  },
  moodLabel: {
    fontSize: 14
  },
  modalCancelButton: {
    marginTop: 20,
    backgroundColor: '#F8D64E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
