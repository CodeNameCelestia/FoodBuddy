import React from 'react';
import { ScrollView, Image, Text, View, StyleSheet } from 'react-native';

const RecipeDetailContent = ({
  recipeData,
  formatDate,
  renderBulletList,
  renderNumberedList,
  getMoodImage,
}) => {
  return (
    <ScrollView style={styles.contentContainer}>
      <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
      <View style={styles.titleRow}>
        <Text style={styles.recipeName}>{recipeData.name}</Text>
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
      <View style={styles.dateContainer}>
        {recipeData.date && (
          <Text style={styles.recipeDate}>
            Created on: {formatDate(recipeData.date)}
          </Text>
        )}
        {recipeData.lastEdited && (
          <Text style={styles.recipeDate}>
            Updated on: {formatDate(recipeData.lastEdited)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

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

export default RecipeDetailContent;
