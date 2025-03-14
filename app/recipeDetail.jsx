import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import database from "../database/database";
import EditMoodModal from "../components/EditMoodModal";
import EditRecipeForm from "../components/EditRecipeForm";
import RemoveAlert from "../components/RemoveAlert";

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // State for recipe data and loading
  const [recipeData, setRecipeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit mode state and edit fields
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedRecipe, setEditedRecipe] = useState("");
  const [editedHowToCook, setEditedHowToCook] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedImage, setEditedImage] = useState("");

  // Additional state: Favorite flag
  const [isFavorite, setIsFavorite] = useState(false);

  // Modal states for mood selection and remove alert
  const [editMoodModalVisible, setEditMoodModalVisible] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  // Define available moods
  const moods = [
    { label: "Happy", image: require("../assets/images/happy.png") },
    { label: "Sad", image: require("../assets/images/sad.png") },
    { label: "Hungry", image: require("../assets/images/hungry.png") },
    { label: "Cool", image: require("../assets/images/cool.png") },
    { label: "Stressed", image: require("../assets/images/stressed.png") },
  ];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const rec = await database.getRecipeById(id);
        if (rec) {
          setRecipeData(rec);
          // Initialize edit fields from fetched recipe
          setEditedName(rec.name);
          setEditedDescription(rec.description);
          setEditedRecipe(rec.recipe);
          setEditedHowToCook(rec.howToCook);
          setEditedMood(rec.mood);
          setEditedImage(rec.image);
          setIsFavorite(rec.favorite || false);
        } else {
          setRecipeData(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Image picker function
  const pickImage = async (source) => {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permission is required!");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Gallery permission is required!");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    }
    if (!result.canceled) {
      setEditedImage(result.assets[0].uri);
    }
  };

  // Helper: render bullet list for Recipe (ingredients)
  const renderBulletList = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
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
    return text.split("\n").map((line, index) => {
      if (!line.trim()) return null;
      return (
        <View key={index} style={styles.numberedItem}>
          <Text style={styles.numberedText}>
            {index + 1}. {line.trim()}
          </Text>
        </View>
      );
    });
  };

  // Helper: get mood image based on label
  const getMoodImage = (mood) => {
    switch (mood) {
      case "Happy":
        return require("../assets/images/happy.png");
      case "Sad":
        return require("../assets/images/sad.png");
      case "Hungry":
        return require("../assets/images/hungry.png");
      case "Cool":
        return require("../assets/images/cool.png");
      case "Stressed":
        return require("../assets/images/stressed.png");
      default:
        return null;
    }
  };

  // Format date values
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return d.toLocaleDateString();
  };

  // Toggle favorite state (without updating lastEdited)
  const toggleFavorite = async () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    const updatedRecipe = {
      ...recipeData,
      favorite: newFavorite,
      // Do not update lastEdited on favorite toggle
    };
    setRecipeData(updatedRecipe);
    try {
      await database.updateRecipe(updatedRecipe);
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

  // Callbacks passed to EditRecipeForm
  const handleCancelEditing = () => {
    setEditedName(recipeData.name);
    setEditedDescription(recipeData.description);
    setEditedRecipe(recipeData.recipe);
    setEditedHowToCook(recipeData.howToCook);
    setEditedMood(recipeData.mood);
    setEditedImage(recipeData.image);
    setIsEditing(false);
  };

  const handleSaveEditing = async () => {
    const updatedRecipe = {
      ...recipeData,
      name: editedName,
      description: editedDescription,
      recipe: editedRecipe,
      howToCook: editedHowToCook,
      mood: editedMood,
      image: editedImage,
      lastEdited: new Date().toISOString(),
    };
    try {
      await database.updateRecipe(updatedRecipe);
      setRecipeData(updatedRecipe);
      setIsEditing(false);
      Alert.alert("Success", "Recipe updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update recipe");
    }
  };

  // Render header (for view mode or edit mode)
  const renderHeader = () => {
    if (isEditing) {
      return (
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Edit Recipe</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>FoodBuddy</Text>
        </View>
      </View>
    );
  };

  // Render content: if editing, show EditRecipeForm; else show recipe details.
  const renderContent = () => {
    if (isEditing) {
      return (
        <EditRecipeForm
          editedImage={editedImage}
          onPickImage={pickImage}
          editedName={editedName}
          setEditedName={setEditedName}
          editedDescription={editedDescription}
          setEditedDescription={setEditedDescription}
          editedRecipe={editedRecipe}
          setEditedRecipe={setEditedRecipe}
          editedHowToCook={editedHowToCook}
          setEditedHowToCook={setEditedHowToCook}
          editedMood={editedMood}
          onOpenMoodModal={() => setEditMoodModalVisible(true)}
          onCancelEditing={handleCancelEditing}
          onSaveEditing={handleSaveEditing}
        />
      );
    }
    return (
      <ScrollView style={styles.contentContainer}>
        <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
        <View style={styles.titleRow}>
          <Text style={styles.recipeName}>{recipeData.name}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "gold" : "gray"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.recipeDescription}>{recipeData.description}</Text>
        {recipeData.mood && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>Mood: {recipeData.mood}</Text>
            {getMoodImage(recipeData.mood) && (
              <Image
                source={getMoodImage(recipeData.mood)}
                style={styles.moodImage}
              />
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
        {/* Moved the date info to the bottom */}
        <View style={styles.dateContainer}>
          {recipeData.date && (
            <Text style={styles.recipeDate}>
              Created on: {formatDate(recipeData.date)}
            </Text>
          )}
          {recipeData.lastEdited && (
            <Text style={styles.recipeDate}>
              Updated On: {formatDate(recipeData.lastEdited)}
            </Text>
          )}
        </View>
      </ScrollView>
    );
  };

  // Render bottom tab bar for Back, Edit, Remove
  const renderBottomBar = () => {
    if (!isEditing) {
      return (
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
            onPress={() => setShowRemoveAlert(true)}
          >
            <Ionicons name="trash" size={24} color="black" />
            <Text style={styles.tabText}>Remove</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading Recipe...</Text>
      </View>
    );
  }
  if (!recipeData) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderBottomBar()}
      <EditMoodModal
        visible={editMoodModalVisible}
        moods={moods}
        onSelect={(mood) => {
          setEditedMood(mood);
          setEditMoodModalVisible(false);
        }}
        onCancel={() => setEditMoodModalVisible(false)}
      />
      <RemoveAlert
        visible={showRemoveAlert}
        onCancel={() => setShowRemoveAlert(false)}
        onConfirm={async () => {
          try {
            const updatedRecipe = {
              ...recipeData,
              hidden: true,
              lastEdited: new Date().toISOString(),
            };
            await database.updateRecipe(updatedRecipe);
            setRecipeData(updatedRecipe);
            setShowRemoveAlert(false);
            router.push("/");
          } catch (error) {
            console.error("Error updating recipe to hidden:", error);
          }
        }}
      />
    </View>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  /* Header Styles */
  header: {
    backgroundColor: "#F8D64E",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
    zIndex: 10,
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
  /* Content Styles */
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  recipeDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    textAlign: "justify",
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  moodImage: {
    width: 30,
    height: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  bulletText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  numberedItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  numberedText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  dateContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  recipeDate: {
    fontSize: 14,
    color: "#888",
  },
  /* Bottom Tab Bar for RecipeDetail */
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8D64E",
    paddingVertical: 8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
});
