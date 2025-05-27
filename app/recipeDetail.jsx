// app/recipeDetail.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import database from "../database/database";

// Modular components
import RecipeDetailHeader from "../components/RecipeDetailHeader";
import RecipeDetailContent from "../components/RecipeDetailContent";
import RecipeDetailBottomBar from "../components/RecipeDetailBottomBar";
import FloatingTimerButton from "../components/FloatingTimerButton";
import EditMoodModal from "../components/EditMoodModal";
import EditRecipeForm from "../components/EditRecipeForm";
import RemoveAlert from "../components/alerts/RemoveAlert";
import ChangeMoodImage from "../components/ChangeMoodImage";
import { MoodContext } from "../contexts/MoodContext";

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Recipe data and loading state
  const [recipeData, setRecipeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit mode state and fields
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedRecipe, setEditedRecipe] = useState("");
  const [editedHowToCook, setEditedHowToCook] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedImage, setEditedImage] = useState("");

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);

  // Modal states for mood selection and remove alert
  const [editMoodModalVisible, setEditMoodModalVisible] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  // Timer state for FloatingTimerButton
  const [remainingTime, setRemainingTime] = useState(null);
  const timerRef = useRef(null);

  // Floating features toggles (loaded from AsyncStorage)
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [howToCookChecklistEnabled, setHowToCookChecklistEnabled] = useState(true);

  // Get the current mood folder from global context
  const { moodFolder } = useContext(MoodContext);

  // Build a mapping for mood images (for edit mode if needed)
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
    // Additional folders can be added here.
  };

  // Build available moods for the EditMoodModal
  const availableMoods = [
    { label: "Happy", image: moodImages[moodFolder]["Happy"] },
    { label: "Sad", image: moodImages[moodFolder]["Sad"] },
    { label: "Hungry", image: moodImages[moodFolder]["Hungry"] },
    { label: "Cool", image: moodImages[moodFolder]["Cool"] },
    { label: "Stressed", image: moodImages[moodFolder]["Stressed"] },
  ];

  // Load floating features settings
  useEffect(() => {
    const loadFloatingSettings = async () => {
      try {
        const floatVal = await AsyncStorage.getItem("floatingEnabled");
        const timerVal = await AsyncStorage.getItem("timerEnabled");
        setFloatingEnabled(floatVal !== "false");
        setTimerEnabled(timerVal !== "false");
      } catch (error) {
        console.error("Error reading floating settings", error);
      }
    };
    loadFloatingSettings();
  }, []);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const rec = await database.getRecipeById(id);
        if (rec) {
          setRecipeData(rec);
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

  useEffect(() => {
    const loadChecklistSetting = async () => {
      try {
        const val = await AsyncStorage.getItem("howToCookChecklistEnabled");
        setHowToCookChecklistEnabled(val !== "false");
      } catch (error) {
        // ignore
      }
    };
    loadChecklistSetting();
  }, []);

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

  const toggleFavorite = async () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    const updatedRecipe = { ...recipeData, favorite: newFavorite };
    setRecipeData(updatedRecipe);
    try {
      await database.updateRecipe(updatedRecipe);
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

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
    } catch (error) {
      // Handle error accordingly
    }
  };

  // Timer logic for the floating button
  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          Alert.alert("Timer", "Time is up!");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Helper function for formatting date
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return d.toLocaleDateString();
  };

  // Helper functions for rendering lists
  const renderBulletList = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return null;
      return (
        <View key={i} style={contentStyles.bulletItem}>
          <Text style={contentStyles.bulletText}>- {line.trim()}</Text>
        </View>
      );
    });
  };

  const renderNumberedList = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return null;
      return (
        <View key={i} style={contentStyles.numberedItem}>
          <Text style={contentStyles.numberedText}>
            {i + 1}. {line.trim()}
          </Text>
        </View>
      );
    });
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

  // Main floating button content: if timer is active, show countdown.
  const mainFloatingButtonContent = remainingTime !== null ? (
    <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
  ) : null;

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle={isEditing ? "Edit Recipe" : "FoodBuddy"} />
      {isEditing ? (
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
      ) : (
        <RecipeDetailContent
          recipeData={recipeData}
          formatDate={formatDate}
          renderBulletList={renderBulletList}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          howToCookChecklistEnabled={howToCookChecklistEnabled}
        />
      )}
      <RecipeDetailBottomBar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setShowRemoveAlert={setShowRemoveAlert}
      />
      <EditMoodModal
        visible={editMoodModalVisible}
        moods={availableMoods}
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
      {/* Only render the floating timer button if not editing and floatingEnabled is true */}
      {!isEditing && floatingEnabled && (
        <FloatingTimerButton
          timerEnabled={timerEnabled}
          mainButtonContent={mainFloatingButtonContent}
        />
      )}
    </View>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  timerText: {
    color: "#fff",
    fontWeight: "bold",
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
});

const contentStyles = StyleSheet.create({
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
});
