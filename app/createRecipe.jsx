// app/createRecipe.jsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import database from '../database/database';
import EditMoodModal from '../components/EditMoodModal';
import CancelAlert from '../components/alerts/CancelAlert';
import BottomNavbar from '../components/BottomNavbar';
import ChangeEmojiModal from '../components/ChangeEmojiModal';
import { MoodContext } from '../contexts/MoodContext';

const HEADER_HEIGHT = 70;

const CreateRecipe = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [howToCook, setHowToCook] = useState('');
  // Instead of using a static moods array, we get the current mood folder from context
  const { moodFolder } = useContext(MoodContext);
  // Define mood images mapping for each folder
  const moodImages = {
    Anime: {
      Happy: require("../assets/images/Moods/Anime/happy.png"),
      Sad: require("../assets/images/Moods/Anime/sad.png"),
      Hungry: require("../assets/images/Moods/Anime/hungry.png"),
      Cool: require("../assets/images/Moods/Anime/cool.png"),
      Stressed: require("../assets/images/Moods/Anime/stressed.png"),
    },
    Cats: {
      Happy: require("../assets/images/Moods/Cats/happy.png"),
      Sad: require("../assets/images/Moods/Cats/sad.png"),
      Hungry: require("../assets/images/Moods/Cats/hungry.png"),
      Cool: require("../assets/images/Moods/Cats/cool.png"),
      Stressed: require("../assets/images/Moods/Cats/stressed.png"),
    },
    Dogs: {
      Happy: require("../assets/images/Moods/Dogs/happy.png"),
      Sad: require("../assets/images/Moods/Dogs/sad.png"),
      Hungry: require("../assets/images/Moods/Dogs/hungry.png"),
      Cool: require("../assets/images/Moods/Dogs/cool.png"),
      Stressed: require("../assets/images/Moods/Dogs/stressed.png"),
    },
    Emoji: {
      Happy: require("../assets/images/Moods/Emoji/happy.png"),
      Sad: require("../assets/images/Moods/Emoji/sad.png"),
      Hungry: require("../assets/images/Moods/Emoji/hungry.png"),
      Cool: require("../assets/images/Moods/Emoji/cool.png"),
      Stressed: require("../assets/images/Moods/Emoji/stressed.png"),
    },
    Pepe: {
      Happy: require("../assets/images/Moods/Pepe/happy.png"),
      Sad: require("../assets/images/Moods/Pepe/sad.png"),
      Hungry: require("../assets/images/Moods/Pepe/hungry.png"),
      Cool: require("../assets/images/Moods/Pepe/cool.png"),
      Stressed: require("../assets/images/Moods/Pepe/stressed.png"),
    },
    Tiktok: {
      Happy: require("../assets/images/Moods/Tiktok/happy.png"),
      Sad: require("../assets/images/Moods/Tiktok/sad.png"),
      Hungry: require("../assets/images/Moods/Tiktok/hungry.png"),
      Cool: require("../assets/images/Moods/Tiktok/cool.png"),
      Stressed: require("../assets/images/Moods/Tiktok/stressed.png"),
    },
    Melody: {
      Happy: require("../assets/images/Moods/Melody/happy.png"),
      Sad: require("../assets/images/Moods/Melody/sad.png"),
      Hungry: require("../assets/images/Moods/Melody/hungry.png"),
      Cool: require("../assets/images/Moods/Melody/cool.png"),
      Stressed: require("../assets/images/Moods/Melody/stressed.png"),
    },
    Kuromi: {
      Happy: require("../assets/images/Moods/Kuromi/happy.png"),
      Sad: require("../assets/images/Moods/Kuromi/sad.png"),
      Hungry: require("../assets/images/Moods/Kuromi/hungry.png"),
      Cool: require("../assets/images/Moods/Kuromi/cool.png"),
      Stressed: require("../assets/images/Moods/Kuromi/stressed.png"),
    },
  };

  // Build moods array based on the current moodFolder
  const moods = [
    { label: "Happy", image: moodImages[moodFolder]["Happy"] },
    { label: "Sad", image: moodImages[moodFolder]["Sad"] },
    { label: "Hungry", image: moodImages[moodFolder]["Hungry"] },
    { label: "Cool", image: moodImages[moodFolder]["Cool"] },
    { label: "Stressed", image: moodImages[moodFolder]["Stressed"] },
  ];

  const [mood, setMood] = useState(moods[0].label);
  const [image, setImage] = useState(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
  // New state for Change Emoji modal
  const [changeEmojiModalVisible, setChangeEmojiModalVisible] = useState(false);

  const pickImage = async (source) => {
    let result;
    const mediaType = ImagePicker.MediaTypeOptions.Images;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaType,
        quality: 0.7,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        quality: 0.7,
      });
    }
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const isFormDirty = () => {
    return name || description || recipeContent || howToCook || image;
  };

  const handleCancel = () => {
    if (isFormDirty()) {
      setCancelAlertVisible(true);
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !recipeContent || !howToCook || !mood || !image) {
      Alert.alert('Incomplete Data', 'Please fill out all fields and select an image.');
      return;
    }
    const newRecipe = {
      name,
      description,
      recipe: recipeContent,
      howToCook,
      mood,
      image,
    };
    await database.addRecipe(newRecipe);
    router.push('/');
  };

  const selectedMoodObj = moods.find((m) => m.label === mood);

  return (
    <>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Image
              source={require('../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Create Recipe</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Form Content */}
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: HEADER_HEIGHT + 20, paddingBottom: 0 }]}
      >
        <Text style={styles.formTitle}>Recipe Details</Text>
        <View style={styles.form}>
          <Text style={styles.fieldTitle}>Recipe Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipe name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter a short description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.fieldTitle}>Ingredients</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List ingredients, each on a new line"
            placeholderTextColor="#888"
            value={recipeContent}
            onChangeText={setRecipeContent}
            multiline
          />

          <Text style={styles.fieldTitle}>How to Cook</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Step-by-step instructions"
            placeholderTextColor="#888"
            value={howToCook}
            onChangeText={setHowToCook}
            multiline
          />

          <Text style={styles.fieldTitle}>Select Mood</Text>
          <TouchableOpacity
            style={styles.moodButton}
            onPress={() => setMoodModalVisible(true)}
          >
            {selectedMoodObj && (
              <Image source={selectedMoodObj.image} style={styles.moodImage} />
            )}
            <Text style={styles.moodButtonText}>{mood}</Text>
            <Ionicons name="chevron-down" size={20} color="black" />
          </TouchableOpacity>
          <EditMoodModal
            visible={moodModalVisible}
            moods={moods}
            onSelect={(selectedMood) => {
              setMood(selectedMood);
              setMoodModalVisible(false);
            }}
            onCancel={() => setMoodModalVisible(false)}
          />

          {/* New Change Emoji Button */}
          <TouchableOpacity
            style={styles.changeEmojiButton}
            onPress={() => setChangeEmojiModalVisible(true)}
          >
            <Text style={styles.changeEmojiButtonText}>Change Emoji</Text>
          </TouchableOpacity>
          
          <Text style={styles.fieldTitle}>Select Image</Text>
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="images" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={50} color="#ccc" />
              <Text style={styles.imagePlaceholderText}>No Image Selected</Text>
            </View>
          )}

          {/* Inline Save and Cancel Buttons */}
          <View style={styles.formButtonsContainer}>
            <TouchableOpacity style={styles.saveButtonInline} onPress={handleSubmit}>
              <Text style={styles.formButtonText}>Save Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButtonInline} onPress={handleCancel}>
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomNavbar />
      <CancelAlert
        visible={cancelAlertVisible}
        onKeepEditing={() => setCancelAlertVisible(false)}
        onDiscard={() => {
          setCancelAlertVisible(false);
          router.push('/');
        }}
      />
      {/* Change Emoji Modal */}
      <ChangeEmojiModal
        visible={changeEmojiModalVisible}
        onClose={() => setChangeEmojiModalVisible(false)}
      />
    </>
  );
};

export default CreateRecipe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 0,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 25,
    zIndex: 21,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
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
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#F8D64E',
  },
  form: {
    paddingHorizontal: 16,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  moodButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  moodImage: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  changeEmojiButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 12,
    alignSelf: 'center',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  changeEmojiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 12,
  },
  imageButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  previewImage: {
    width: '100%',
    height: 250,
    marginBottom: 12,
    borderRadius: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#ccc',
    marginTop: 8,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  saveButtonInline: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  cancelButtonInline: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  formButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
