import React, { useState } from 'react';
import { 
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CancelAlert from './CancelAlert';
import SaveAlert from './SaveAlert';

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
        <TouchableOpacity 
          style={styles.moodSelectButton} 
          onPress={onOpenMoodModal}
        >
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
      paddingHorizontal: 16
    },
    imageEditContainer: {
      alignItems: 'center',
      marginBottom: 16
    },
    recipeImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginVertical: 10
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
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    imageEditButtonText: {
      color: '#000',
      fontWeight: 'bold'
    },
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
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
    },
    moodSelectionContainer: {
      marginBottom: 16
    },
    moodSelectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 10,
      borderRadius: 8,
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
    },
    moodSelectText: {
      flex: 1,
      fontSize: 16
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20
    },
    actionButton: {
      backgroundColor: '#F8D64E',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8
    },
    actionButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16
    }
  });
