import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import database from '../database/database';
import RestoreAlert from '../components/RestoreAlert';
import DeleteAlert from '../components/DeleteAlert';
import BottomNavbar from '../components/BottomNavbar';

const Settings = () => {
  const router = useRouter();
  const [showRecentlyRemoved, setShowRecentlyRemoved] = useState(false);
  const [hiddenRecipes, setHiddenRecipes] = useState([]);
  const [restoreAlertVisible, setRestoreAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch hidden recipes
  const fetchHiddenRecipes = async () => {
    try {
      const data = await database.getRecipes();
      const hidden = data.filter((recipe) => recipe.hidden);
      setHiddenRecipes(hidden);
    } catch (error) {
      console.error('Error fetching hidden recipes:', error);
    }
  };

  useEffect(() => {
    if (showRecentlyRemoved) {
      fetchHiddenRecipes();
    }
  }, [showRecentlyRemoved]);

  // Restore a hidden recipe
  const handleRestore = async (recipe) => {
    const updatedRecipe = { ...recipe, hidden: false };
    try {
      await database.updateRecipe(updatedRecipe);
      fetchHiddenRecipes();
      Alert.alert('Restored', 'Recipe has been restored.');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore recipe.');
    }
  };

  // Permanently delete a recipe
  const handleDelete = async (recipe) => {
    try {
      await database.deleteRecipe(recipe.id);
      fetchHiddenRecipes();
      Alert.alert('Deleted', 'Recipe permanently deleted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete recipe.');
    }
  };

  // Main settings view
  const renderMainSettings = () => (
    <ScrollView contentContainerStyle={styles.settingsContainer}>
      <View style={styles.settingsOptions}>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setShowRecentlyRemoved(true)}
        >
          <Text style={styles.settingButtonText}>Recently Removed</Text>
        </TouchableOpacity>
        {/* Additional settings options here */}
      </View>
    </ScrollView>
  );

  // Recently removed view
  const renderRecentlyRemoved = () => (
    <ScrollView contentContainerStyle={styles.removedContainer}>
      <Text style={styles.removedTitle}>Recently Removed Recipes</Text>
      {hiddenRecipes.length === 0 ? (
        <Text style={styles.noRemovedText}>No hidden recipes.</Text>
      ) : (
        hiddenRecipes.map((recipe) => (
          <View key={recipe.id} style={styles.removedCard}>
            {recipe.image ? (
              <Image source={{ uri: recipe.image }} style={styles.removedImage} />
            ) : (
              <View style={styles.removedImagePlaceholder}>
                <Ionicons name="image" size={40} color="#ccc" />
              </View>
            )}
            <View style={styles.removedContent}>
              <Text style={styles.removedName}>{recipe.name}</Text>
              <View style={styles.removedButtonsRow}>
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={() => {
                    setSelectedRecipe(recipe);
                    setRestoreAlertVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setSelectedRecipe(recipe);
                    setDeleteAlertVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.backToSettingsButton}
        onPress={() => setShowRecentlyRemoved(false)}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backToSettingsText}>Back to Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>
      {/* Content */}
      {showRecentlyRemoved ? renderRecentlyRemoved() : renderMainSettings()}

      {/* Fixed Bottom Navbar */}
      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>

      {/* Alerts */}
      <RestoreAlert
        visible={restoreAlertVisible}
        onCancel={() => setRestoreAlertVisible(false)}
        onConfirm={() => {
          handleRestore(selectedRecipe);
          setRestoreAlertVisible(false);
        }}
      />
      <DeleteAlert
        visible={deleteAlertVisible}
        onCancel={() => setDeleteAlertVisible(false)}
        onConfirm={() => {
          handleDelete(selectedRecipe);
          setDeleteAlertVisible(false);
        }}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  /* Header Styles */
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  headerBackButton: {
    position: 'absolute',
    left: 16,
    top: 15,
    zIndex: 11,
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
  /* Main Settings Options */
  settingsContainer: {
    padding: 16,
    paddingBottom: 100, // Enough space for the navbar
  },
  settingsOptions: {
    marginTop: 20,
    alignItems: 'center',
  },
  settingButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /* Recently Removed */
  removedContainer: {
    padding: 16,
    paddingBottom: 100, // Enough space for the navbar
  },
  removedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8D64E',
    textAlign: 'center',
    marginBottom: 16,
  },
  noRemovedText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  removedCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    boxShadow: '0px 2px 3px rgba(0,0,0,0.2)',
  },
  removedImage: {
    width: 100,
    height: 100,
  },
  removedImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removedContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  removedName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removedButtonsRow: {
    flexDirection: 'row',
  },
  restoreButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.3)',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.3)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backToSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D64E',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.3)',
  },
  backToSettingsText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  /* Bottom Navbar Container */
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
