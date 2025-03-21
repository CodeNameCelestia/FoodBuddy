// app/settings.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import database from '../database/database';
import RestoreAlert from '../components/alerts/RestoreAlert';
import DeleteAlert from '../components/alerts/DeleteAlert';
import BottomNavbar from '../components/BottomNavbar';
import RecentlyRemoved from '../components/RecentlyRemoved';
import LayoutSelection from '../components/LayoutSelection';
import FloatingFeaturesToggleModal from '../components/FloatingFeaturesToggleModal';
import ChangeEmojiModal from '../components/ChangeEmojiModal';
import AboutUsModal from '../components/AboutUsModal';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';
import CollaboratorsModal from '../components/CollaboratorsModal';
import ChangeTimerSoundModal from '../components/ChangeTimerSoundModal';
import SpecialTanksModal from '../components/SpecialTanksModal';
import { LayoutContext } from '../contexts/LayoutContext';

const Settings = () => {
  const router = useRouter();
  const [showRecentlyRemoved, setShowRecentlyRemoved] = useState(false);
  const [showLayoutSelection, setShowLayoutSelection] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showChangeEmojiModal, setShowChangeEmojiModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [showTimerSoundModal, setShowTimerSoundModal] = useState(false);
  const [showSpecialTanksModal, setShowSpecialTanksModal] = useState(false);
  const [hiddenRecipes, setHiddenRecipes] = useState([]);
  const [restoreAlertVisible, setRestoreAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Global layout state
  const { layout, setLayout } = useContext(LayoutContext);

  // Fetch hidden recipes when needed
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

  const handleDelete = async (recipe) => {
    try {
      await database.deleteRecipe(recipe.id);
      fetchHiddenRecipes();
      Alert.alert('Deleted', 'Recipe permanently deleted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete recipe.');
    }
  };

  const handleExitApp = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
  };

  // Render main settings as two floating sections.
  const renderMainSettings = () => (
    <ScrollView contentContainerStyle={styles.settingsContainer}>
      {/* Content & Display Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content & Display</Text>
        <View style={styles.settingsOptions}>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowRecentlyRemoved(true)}>
            <Ionicons name="remove-circle" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Recently Removed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowLayoutSelection(true)}>
            <Ionicons name="grid" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Change Layout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowChangeEmojiModal(true)}>
            <Ionicons name="happy" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Change Emoji</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowTimerSoundModal(true)}>
            <Ionicons name="volume-high" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Change Timer Sound</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowToggleModal(true)}>
            <Ionicons name="toggle" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Toggle Floating & Timer</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Support & About Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.settingsOptions}>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowAboutUsModal(true)}>
            <Ionicons name="information-circle" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowSpecialTanksModal(true)}>
            <Ionicons name="heart" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Special Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowCollaboratorsModal(true)}>
            <Ionicons name="people-circle" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Collaborators</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowTermsModal(true)}>
            <Ionicons name="document-text" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => setShowPrivacyModal(true)}>
            <Ionicons name="lock-closed" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={handleExitApp}>
            <Ionicons name="exit-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.settingButtonText}>Exit App</Text>
          </TouchableOpacity>
        </View>
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
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>
      {/* Render either the main settings or Recently Removed view */}
      {showRecentlyRemoved ? (
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
      {/* Modals / Overlays */}
      {showLayoutSelection && (
        <LayoutSelection
          visible={showLayoutSelection}
          selectedLayout={layout}
          setSelectedLayout={setLayout}
          onClose={() => setShowLayoutSelection(false)}
        />
      )}
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
      <FloatingFeaturesToggleModal
        visible={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onToggleUpdate={(states) => {
          console.log('Updated toggles:', states);
        }}
      />
      <ChangeEmojiModal
        visible={showChangeEmojiModal}
        onClose={() => setShowChangeEmojiModal(false)}
      />
      <AboutUsModal visible={showAboutUsModal} onClose={() => setShowAboutUsModal(false)} />
      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <CollaboratorsModal visible={showCollaboratorsModal} onClose={() => setShowCollaboratorsModal(false)} />
      <ChangeTimerSoundModal
        visible={showTimerSoundModal}
        onClose={() => setShowTimerSoundModal(false)}
        onSelect={(sound) => console.log('Selected timer sound:', sound)}
      />
      <SpecialTanksModal visible={showSpecialTanksModal} onClose={() => setShowSpecialTanksModal(false)} />
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
  /* Settings Container */
  settingsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginVertical: 10,
    elevation: 5,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingsOptions: {
    alignItems: 'center',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#F8D64E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 8,
    justifyContent: 'flex-start',
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
  },
  buttonIcon: {
    marginRight: 10,
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  /* Bottom Navbar Container */
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
