import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import database from '../database/database';

const moods = ['Happy', 'Sad', 'Hungry', 'Cool', 'Stressed'];

const CreateRecipe = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [howToCook, setHowToCook] = useState('');
  const [mood, setMood] = useState(moods[0]);
  const [image, setImage] = useState(null);

  const pickImage = async (source) => {
    let result;
    // Use fallback: on web or if ImagePicker.MediaType is undefined, use MediaTypeOptions.Images
    const mediaType = (Platform.OS === 'web' || !ImagePicker.MediaType)
      ? ImagePicker.MediaTypeOptions.Images
      : ImagePicker.MediaType.Images;

    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaType,
        quality: 1
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        quality: 1
      });
    }
    // Use the newer API response format (canceled and assets array)
    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      image
    };
    await database.addRecipe(newRecipe);
    Alert.alert('Success', 'Recipe added successfully!');
    router.push('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Name of Recipe"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Recipe"
        value={recipeContent}
        onChangeText={setRecipeContent}
        multiline
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="How to Cook"
        value={howToCook}
        onChangeText={setHowToCook}
        multiline
      />
      <Text style={styles.label}>Select Mood:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={mood}
          style={styles.picker}
          onValueChange={(itemValue) => setMood(itemValue)}>
          {moods.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Select Image:</Text>
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('camera')}>
          <Text style={styles.imageButtonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('gallery')}>
          <Text style={styles.imageButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateRecipe;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12
  },
  picker: {
    height: 50,
    width: '100%'
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  imageButtonText: {
    color: '#fff'
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 5,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
