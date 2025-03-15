import React, { useState, useEffect, useContext } from 'react';
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
import RestoreAlert from '../components/alerts/RestoreAlert';
import DeleteAlert from '../components/alerts/DeleteAlert';
import BottomNavbar from '../components/BottomNavbar';
import RecentlyRemoved from '../components/RecentlyRemoved';
import LayoutSelection from '../components/LayoutSelection';
import { LayoutContext } from '../contexts/LayoutContext'; // Import the context

const Settings = () => {
  const router = useRouter();
  const [showRecentlyRemoved, setShowRecentlyRemoved] = useState(false);
  const [showLayoutSelection, setShowLayoutSelection] = useState(false);
  const [hiddenRecipes, setHiddenRecipes] = useState([]);
  const [restoreAlertVisible, setRestoreAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Use the global layout state
  const { layout, setLayout } = useContext(LayoutContext);

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
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setShowLayoutSelection(true)}
        >
          <Text style={styles.settingButtonText}>Layout</Text>
        </TouchableOpacity>
        {/* Additional settings options here */}
      </View>
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
      {showLayoutSelection ? (
        <LayoutSelection 
          visible={showLayoutSelection}
          selectedLayout={layout}
          setSelectedLayout={setLayout}
          onClose={() => setShowLayoutSelection(false)}
        />
      ) : showRecentlyRemoved ? (
        <RecentlyRemoved 
          hiddenRecipes={hiddenRecipes}
          onRestore={() => setRestoreAlertVisible(true)}
          onDelete={() => setDeleteAlertVisible(true)}
          onBack={() => setShowRecentlyRemoved(false)}
          setSelectedRecipe={setSelectedRecipe}
        />
      ) : (
        renderMainSettings()
      )}

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
    zIndex: 10,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
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
    paddingBottom: 100,
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
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 18,
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
