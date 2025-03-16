// components/RecipeDetailContent.jsx
import React, { useContext } from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodContext } from '../contexts/MoodContext';

// Preload all mood images by folder
const moodImages = {
  Anime: {
    happy: require("../assets/images/Moods/Anime/happy.png"),
    sad: require("../assets/images/Moods/Anime/sad.png"),
    hungry: require("../assets/images/Moods/Anime/hungry.png"),
    cool: require("../assets/images/Moods/Anime/cool.png"),
    stressed: require("../assets/images/Moods/Anime/stressed.png"),
  },
  // Cats: {
  //   happy: require("../assets/images/Moods/Cats/happy.png"),
  //   sad: require("../assets/images/Moods/Cats/sad.png"),
  //   hungry: require("../assets/images/Moods/Cats/hungry.png"),
  //   cool: require("../assets/images/Moods/Cats/cool.png"),
  //   stressed: require("../assets/images/Moods/Cats/stressed.png"),
  // },
  // Dogs: {
  //   happy: require("../assets/images/Moods/Dogs/happy.png"),
  //   sad: require("../assets/images/Moods/Dogs/sad.png"),
  //   hungry: require("../assets/images/Moods/Dogs/hungry.png"),
  //   cool: require("../assets/images/Moods/Dogs/cool.png"),
  //   stressed: require("../assets/images/Moods/Dogs/stressed.png"),
  // },
  Emoji: {
    happy: require("../assets/images/Moods/Emoji/happy.png"),
    sad: require("../assets/images/Moods/Emoji/sad.png"),
    hungry: require("../assets/images/Moods/Emoji/hungry.png"),
    cool: require("../assets/images/Moods/Emoji/cool.png"),
    stressed: require("../assets/images/Moods/Emoji/stressed.png"),
  },
  // Memes: {
  //   happy: require("../assets/images/Moods/Memes/happy.png"),
  //   sad: require("../assets/images/Moods/Memes/sad.png"),
  //   hungry: require("../assets/images/Moods/Memes/hungry.png"),
  //   cool: require("../assets/images/Moods/Memes/cool.png"),
  //   stressed: require("../assets/images/Moods/Memes/stressed.png"),
  // },
};

const RecipeDetailContent = ({
  recipeData,
  formatDate,
  renderBulletList,
  renderNumberedList,
  toggleFavorite,
  isFavorite,
}) => {
  // Get the selected mood folder from context.
  const { moodFolder } = useContext(MoodContext);

  // Use the selected folder to retrieve the appropriate mood image.
  const getMoodImage = (mood) => {
    if (!moodImages[moodFolder]) return null;
    // Assuming the mood text in recipeData matches the key in lowercase.
    const key = mood.toLowerCase();
    return moodImages[moodFolder][key];
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
      <View style={styles.titleRow}>
        <Text style={styles.recipeName}>{recipeData.name}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          {isFavorite ? (
            <Text style={styles.favIcon}>★</Text>
          ) : (
            <Text style={styles.favIconOutline}>☆</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.recipeDescription}>{recipeData.description}</Text>
      {recipeData.mood && (
        <View style={styles.moodContainer}>
          <Text style={styles.moodLabel}>Mood: {recipeData.mood}</Text>
          {getMoodImage(recipeData.mood) && (
            <Image source={getMoodImage(recipeData.mood)} style={styles.moodImage} />
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
      <View style={styles.dateContainer}>
        {recipeData.date && (
          <Text style={styles.recipeDate}>Created on: {formatDate(recipeData.date)}</Text>
        )}
        {recipeData.lastEdited && (
          <Text style={styles.recipeDate}>Updated on: {formatDate(recipeData.lastEdited)}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipeDetailContent;

const styles = StyleSheet.create({
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
    fontSize: 30,
    fontWeight: "bold",
  },
  favIcon: {
    fontSize: 30,
    color: "gold",
  },
  favIconOutline: {
    fontSize: 30,
    color: "gray",
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
});
