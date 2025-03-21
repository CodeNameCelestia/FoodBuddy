// components/EditRecipeForm.jsx
import React, { useState, useContext } from 'react';
import { 
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CancelAlert from './alerts/CancelAlert';
import SaveAlert from './alerts/SaveAlert';
import { MoodContext } from '../contexts/MoodContext';

const EditRecipeForm = ({
  editedImage,
  onPickImage,
  editedName,
  setEditedName,
  editedDescription,
  setEditedDescription,
  editedRecipe,
  setEditedRecipe,
  editedHowToCook,
  setEditedHowToCook,
  editedMood,
  onOpenMoodModal,
  onCancelEditing, // callback from parent RecipeDetail
  onSaveEditing    // callback from parent RecipeDetail
}) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const { moodFolder } = useContext(MoodContext);

  // Define mood images mapping for editing mode.
  const moodImages = {
    Anime: {
      happy: require("../assets/images/Moods/Anime/happy.png"),
      sad: require("../assets/images/Moods/Anime/sad.png"),
      hungry: require("../assets/images/Moods/Anime/hungry.png"),
      cool: require("../assets/images/Moods/Anime/cool.png"),
      stressed: require("../assets/images/Moods/Anime/stressed.png"),
    },
    Cats: {
      happy: require("../assets/images/Moods/Cats/happy.png"),
      sad: require("../assets/images/Moods/Cats/sad.png"),
      hungry: require("../assets/images/Moods/Cats/hungry.png"),
      cool: require("../assets/images/Moods/Cats/cool.png"),
      stressed: require("../assets/images/Moods/Cats/stressed.png"),
    },
    Dogs: {
      happy: require("../assets/images/Moods/Dogs/happy.png"),
      sad: require("../assets/images/Moods/Dogs/sad.png"),
      hungry: require("../assets/images/Moods/Dogs/hungry.png"),
      cool: require("../assets/images/Moods/Dogs/cool.png"),
      stressed: require("../assets/images/Moods/Dogs/stressed.png"),
    },
    Emoji: {
      happy: require("../assets/images/Moods/Emoji/happy.png"),
      sad: require("../assets/images/Moods/Emoji/sad.png"),
      hungry: require("../assets/images/Moods/Emoji/hungry.png"),
      cool: require("../assets/images/Moods/Emoji/cool.png"),
      stressed: require("../assets/images/Moods/Emoji/stressed.png"),
    },
    Pepe: {
      happy: require("../assets/images/Moods/Pepe/happy.png"),
      sad: require("../assets/images/Moods/Pepe/sad.png"),
      hungry: require("../assets/images/Moods/Pepe/hungry.png"),
      cool: require("../assets/images/Moods/Pepe/cool.png"),
      stressed: require("../assets/images/Moods/Pepe/stressed.png"),
    },
    Tiktok: {
      happy: require("../assets/images/Moods/Tiktok/happy.png"),
      sad: require("../assets/images/Moods/Tiktok/sad.png"),
      hungry: require("../assets/images/Moods/Tiktok/hungry.png"),
      cool: require("../assets/images/Moods/Tiktok/cool.png"),
      stressed: require("../assets/images/Moods/Tiktok/stressed.png"),
    },
    Melody: {
      happy: require("../assets/images/Moods/Melody/happy.png"),
      sad: require("../assets/images/Moods/Melody/sad.png"),
      hungry: require("../assets/images/Moods/Melody/hungry.png"),
      cool: require("../assets/images/Moods/Melody/cool.png"),
      stressed: require("../assets/images/Moods/Melody/stressed.png"),
    },
    Kuromi: {
      happy: require("../assets/images/Moods/Kuromi/happy.png"),
      sad: require("../assets/images/Moods/Kuromi/sad.png"),
      hungry: require("../assets/images/Moods/Kuromi/hungry.png"),
      cool: require("../assets/images/Moods/Kuromi/cool.png"),
      stressed: require("../assets/images/Moods/Kuromi/stressed.png"),
    },
  };

  // Helper to get the mood image based on current mood folder.
  const getMoodImage = (mood) => {
    if (!mood || !moodFolder || !moodImages[moodFolder]) return null;
    return moodImages[moodFolder][mood.toLowerCase()];
  };

  return (
    <ScrollView style={styles.contentContainer}>
      {/* Editable Image Section */}
      <View style={styles.imageEditContainer}>
        <Image source={{ uri: editedImage }} style={styles.recipeImage} />
        <View style={styles.imageEditButtons}>
          <TouchableOpacity style={styles.imageEditButton} onPress={() => onPickImage('camera')}>
            <Text style={styles.imageEditButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageEditButton} onPress={() => onPickImage('gallery')}>
            <Text style={styles.imageEditButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Editable Fields */}
      <Text style={styles.label}>Recipe Name:</Text>
      <TextInput 
        style={styles.input} 
        value={editedName} 
        onChangeText={setEditedName} 
      />
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
      <Text style={styles.label}>Mood:</Text>
      <View style={styles.moodSelectionContainer}>
        {getMoodImage(editedMood) && (
          <Image source={getMoodImage(editedMood)} style={styles.moodImage} />
        )}
        <TouchableOpacity style={styles.moodSelectButton} onPress={onOpenMoodModal}>
          <Text style={styles.moodSelectText}>{editedMood || "Select Mood"}</Text>
          <Ionicons name="chevron-down" size={20} color="black" />
        </TouchableOpacity>
      </View>
      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowCancelAlert(true)}>
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowSaveAlert(true)}>
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* Integrated Alerts */}
      <CancelAlert 
        visible={showCancelAlert}
        onKeepEditing={() => setShowCancelAlert(false)}
        onDiscard={() => {
          setShowCancelAlert(false);
          onCancelEditing();
        }}
      />
      <SaveAlert 
        visible={showSaveAlert}
        onCancel={() => setShowSaveAlert(false)}
        onConfirm={() => {
          setShowSaveAlert(false);
          onSaveEditing();
        }}
      />
    </ScrollView>
  );
};

export default EditRecipeForm;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageEditContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  imageEditButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  imageEditButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  imageEditButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  moodSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodImage: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  moodSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  moodSelectText: {
    flex: 1,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
