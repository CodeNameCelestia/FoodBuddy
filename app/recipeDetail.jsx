import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import database from '../database/database';

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipeData, setRecipeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedRecipe, setEditedRecipe] = useState('');
  const [editedHowToCook, setEditedHowToCook] = useState('');
  const [editedMood, setEditedMood] = useState('');
  const [editedImage, setEditedImage] = useState('');

  // For mood selection modal in edit mode
  const [editMoodModalVisible, setEditMoodModalVisible] = useState(false);

  // Define available moods
  const moods = [
    { label: 'Happy', image: require('../assets/images/happy.png') },
    { label: 'Sad', image: require('../assets/images/sad.png') },
    { label: 'Hungry', image: require('../assets/images/hungry.png') },
    { label: 'Cool', image: require('../assets/images/cool.png') },
    { label: 'Stressed', image: require('../assets/images/stressed.png') }
  ];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const rec = await database.getRecipeById(id);
        setRecipeData(rec);
        // Initialize edit states
        setEditedName(rec.name);
        setEditedDescription(rec.description);
        setEditedRecipe(rec.recipe);
        setEditedHowToCook(rec.howToCook);
        setEditedMood(rec.mood);
        setEditedImage(rec.image);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  // Image picker function using MediaTypeOptions.Images
  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      });
    }
    console.log("Image picker result:", result);
    if (!result.canceled) {
      setEditedImage(result.assets[0].uri);
    }
  };

  // Helper: render bullet list for Recipe (ingredients)
  const renderBulletList = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return null;
      return (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bulletText}>- {line.trim()}</Text>
        </View>
      );
    });
  };

  // Helper: render numbered list for How to Cook
  const renderNumberedList = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return null;
      return (
        <View key={index} style={styles.numberedItem}>
          <Text style={styles.numberedText}>{index + 1}. {line.trim()}</Text>
        </View>
      );
    });
  };

  // Helper: get mood image based on label
  const getMoodImage = (mood) => {
    switch (mood) {
      case 'Happy':
        return require('../assets/images/happy.png');
      case 'Sad':
        return require('../assets/images/sad.png');
      case 'Hungry':
        return require('../assets/images/hungry.png');
      case 'Cool':
        return require('../assets/images/cool.png');
      case 'Stressed':
        return require('../assets/images/stressed.png');
      default:
        return null;
    }
  };

  // Handle Save changes with confirmation
  const handleSave = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to save changes?")) {
        const updatedRecipe = {
          ...recipeData,
          name: editedName,
          description: editedDescription,
          recipe: editedRecipe,
          howToCook: editedHowToCook,
          mood: editedMood,
          image: editedImage
        };
        database.updateRecipe(updatedRecipe)
          .then(() => {
            setRecipeData(updatedRecipe);
            setIsEditing(false);
            window.alert("Recipe updated successfully");
          })
          .catch(() => {
            window.alert("Failed to update recipe");
          });
      }
      return;
    }
    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save changes?",
      [
        {
          text: "Cancel",
          onPress: () => {
            Alert.alert(
              "Discard Changes?",
              "Do you want to keep editing or discard your changes?",
              [
                { text: "Keep Editing", onPress: () => {} },
                { 
                  text: "Discard", 
                  onPress: () => {
                    // Revert changes and exit edit mode
                    setEditedName(recipeData.name);
                    setEditedDescription(recipeData.description);
                    setEditedRecipe(recipeData.recipe);
                    setEditedHowToCook(recipeData.howToCook);
                    setEditedMood(recipeData.mood);
                    setEditedImage(recipeData.image);
                    setIsEditing(false);
                  },
                  style: "destructive" 
                }
              ]
            );
          },
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            const updatedRecipe = {
              ...recipeData,
              name: editedName,
              description: editedDescription,
              recipe: editedRecipe,
              howToCook: editedHowToCook,
              mood: editedMood,
              image: editedImage
            };
            try {
              await database.updateRecipe(updatedRecipe);
              setRecipeData(updatedRecipe);
              setIsEditing(false);
              Alert.alert("Success", "Recipe updated successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to update recipe");
            }
          }
        }
      ]
    );
  };

  // Handle Cancel editing with confirmation
  const handleCancel = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Do you want to discard your changes?")) {
        setEditedName(recipeData.name);
        setEditedDescription(recipeData.description);
        setEditedRecipe(recipeData.recipe);
        setEditedHowToCook(recipeData.howToCook);
        setEditedMood(recipeData.mood);
        setEditedImage(recipeData.image);
        setIsEditing(false);
      }
      return;
    }
    Alert.alert(
      "Cancel Editing",
      "Do you want to keep editing or discard your changes?",
      [
        { text: "Keep Editing", onPress: () => {} },
        { 
          text: "Discard", 
          onPress: () => {
            setEditedName(recipeData.name);
            setEditedDescription(recipeData.description);
            setEditedRecipe(recipeData.recipe);
            setEditedHowToCook(recipeData.howToCook);
            setEditedMood(recipeData.mood);
            setEditedImage(recipeData.image);
            setIsEditing(false);
          },
          style: "destructive" 
        }
      ]
    );
  };

  if (!recipeData) {
    return (
      <View style={styles.container}>
        <Text>Loading Recipe...</Text>
      </View>
    );
  }

  // Render header: if editing, show Cancel and Save buttons; else show logo and title.
  const renderHeader = () => {
    if (isEditing) {
      return (
        <View style={styles.header}>
          <TouchableOpacity style={styles.editHeaderButton} onPress={handleCancel}>
            <Text style={styles.editHeaderButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Recipe</Text>
          <TouchableOpacity style={styles.editHeaderButton} onPress={handleSave}>
            <Text style={styles.editHeaderButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
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
    );
  };

  // Render content: if editing, show input fields with image picker and mood selector modal; else show formatted details.
  const renderContent = () => {
    if (isEditing) {
      return (
        <ScrollView style={styles.contentContainer}>
          {/* Editable Image Section */}
          <View style={styles.imageEditContainer}>
            <Image source={{ uri: editedImage }} style={styles.recipeImage} />
            <View style={styles.imageEditButtons}>
              <TouchableOpacity style={styles.imageEditButton} onPress={() => pickImage('camera')}>
                <Text style={styles.imageEditButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageEditButton} onPress={() => pickImage('gallery')}>
                <Text style={styles.imageEditButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Editable Fields */}
          <Text style={styles.label}>Recipe Name:</Text>
          <TextInput style={styles.input} value={editedName} onChangeText={setEditedName} />
          <Text style={styles.label}>Description:</Text>
          <TextInput 
            style={[styles.input, { height: 60 }]} 
            value={editedDescription} 
            onChangeText={setEditedDescription} 
            multiline 
          />
          <Text style={styles.label}>Recipe (Ingredients):</Text>
          <TextInput 
            style={[styles.input, { height: 100 }]} 
            value={editedRecipe} 
            onChangeText={setEditedRecipe} 
            multiline 
          />
          <Text style={styles.label}>How to Cook:</Text>
          <TextInput 
            style={[styles.input, { height: 120 }]} 
            value={editedHowToCook} 
            onChangeText={setEditedHowToCook} 
            multiline 
          />
          {/* Mood Selector */}
          <Text style={styles.label}>Mood:</Text>
          <View style={styles.moodSelectionContainer}>
            <TouchableOpacity 
              style={styles.moodSelectButton} 
              onPress={() => setEditMoodModalVisible(true)}
            >
              <Text style={styles.moodSelectText}>{editedMood || "Select Mood"}</Text>
              <Ionicons name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
          </View>
          {/* Edit Mood Modal */}
          <Modal
            visible={editMoodModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setEditMoodModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Mood</Text>
                <View style={styles.moodsContainer}>
                  {moods.map((m) => (
                    <TouchableOpacity
                      key={m.label}
                      style={styles.moodOption}
                      onPress={() => {
                        setEditedMood(m.label);
                        setEditMoodModalVisible(false);
                      }}
                    >
                      <Image source={m.image} style={styles.moodImage} />
                      <Text style={styles.moodLabel}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setEditMoodModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      );
    }
    return (
      <ScrollView style={styles.contentContainer}>
        <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
        <Text style={styles.recipeName}>{recipeData.name}</Text>
        <Text style={styles.recipeDescription}>{recipeData.description}</Text>
        {recipeData.date && (
          <Text style={styles.recipeDate}>Created on: {recipeData.date}</Text>
        )}
        {recipeData.mood && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>Mood: {recipeData.mood}</Text>
            {getMoodImage(recipeData.mood) && (
              <Image source={getMoodImage(recipeData.mood)} style={styles.moodImage} />
            )}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recipe:</Text>
          {renderBulletList(recipeData.recipe)}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>How to Cook:</Text>
          {renderNumberedList(recipeData.howToCook)}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {/* Only show bottom tab bar in view mode */}
      {!isEditing && (
        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.tabText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setIsEditing(true)}>
            <Ionicons name="create" size={24} color="black" />
            <Text style={styles.tabText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={async () => {
              try {
                await database.deleteRecipe(recipeData.id);
                router.push('/');
              } catch (error) {
                console.error('Error deleting recipe:', error);
              }
            }}
          >
            <Ionicons name="trash" size={24} color="black" />
            <Text style={styles.tabText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  /* Header Styles */
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  editHeaderButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3
  },
  editHeaderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue'
  },
  /* Content Styles */
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  recipeDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8
  },
  recipeDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  moodLabel: {
    fontSize: 16,
    marginRight: 8
  },
  moodImage: {
    width: 30,
    height: 30
  },
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  bulletText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10
  },
  numberedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  numberedText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10
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
  /* Edit Form Styles */
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  /* Image Edit Styles */
  imageEditContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  imageEditButtons: {
    flexDirection: 'row',
    marginTop: 8
  },
  imageEditButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3
  },
  imageEditButtonText: {
    color: '#000',
    fontWeight: 'bold'
  },
  /* Mood Selection Styles in Edit Mode */
  moodSelectionContainer: {
    marginBottom: 16
  },
  moodSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  moodSelectText: {
    flex: 1,
    fontSize: 16
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
