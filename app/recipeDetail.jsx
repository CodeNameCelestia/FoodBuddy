// RecipeDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import database from "../database/database";
import EditMoodModal from "../components/EditMoodModal";
import EditRecipeForm from "../components/EditRecipeForm";
import RemoveAlert from "../components/alerts/RemoveAlert";
import RecipeDetailHeader from "../components/RecipeDetailHeader";
import RecipeDetailContent from "../components/RecipeDetailContent";
import RecipeDetailBottomBar from "../components/RecipeDetailBottomBar";
import FloatingTimerButton from "../components/FloatingTimerButton";

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Recipe data and loading state
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

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);

  // Modal states for mood selection and remove alert
  const [editMoodModalVisible, setEditMoodModalVisible] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  // Timer state for FloatingTimerButton
  const [remainingTime, setRemainingTime] = useState(null);
  const timerRef = useRef(null);

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

  // Timer functions
  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
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

  // Helper functions passed to RecipeDetailContent
  const renderBulletList = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
      if (!line.trim()) return null;
      return (
        <View key={index} style={contentStyles.bulletItem}>
          <Text style={contentStyles.bulletText}>- {line.trim()}</Text>
        </View>
      );
    });
  };

  const renderNumberedList = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
      if (!line.trim()) return null;
      return (
        <View key={index} style={contentStyles.numberedItem}>
          <Text style={contentStyles.numberedText}>
            {index + 1}. {line.trim()}
          </Text>
        </View>
      );
    });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return d.toLocaleDateString();
  };

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
  const mainButtonContent = remainingTime !== null ? (
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
          renderNumberedList={renderNumberedList}
          getMoodImage={getMoodImage}
        />
      )}
      <RecipeDetailBottomBar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setShowRemoveAlert={setShowRemoveAlert}
      />
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
      {/* Only show the floating timer button when not editing */}
      {!isEditing && <FloatingTimerButton mainButtonContent={mainButtonContent} />}
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
});

// Additional helper styles used by RecipeDetailContent
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
