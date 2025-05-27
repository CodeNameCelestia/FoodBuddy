// components/RecipeDetailContent.jsx
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodContext } from '../contexts/MoodContext';
import ChangeMoodImage from './ChangeMoodImage';

const RecipeDetailContent = ({
  recipeData,
  formatDate,
  renderBulletList,
  toggleFavorite,
  isFavorite,
  howToCookChecklistEnabled = true,
}) => {
  // Get the selected mood folder from context.
  const { moodFolder } = useContext(MoodContext);

  // Step checklist state
  const [checkedSteps, setCheckedSteps] = useState([]);

  // Reset checklist when recipe changes
  useEffect(() => {
    if (recipeData && recipeData.howToCook) {
      const steps = recipeData.howToCook.split('\n').filter(line => line.trim());
      setCheckedSteps(Array(steps.length).fill(false));
    }
  }, [recipeData]);

  // Handler for toggling step checkboxes
  const toggleStep = (idx) => {
    setCheckedSteps(prev =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
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
          <ChangeMoodImage mood={recipeData.mood} style={styles.moodImage} />
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Recipe:</Text>
        {renderBulletList(recipeData.recipe)}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>How to Cook:</Text>
        {recipeData.howToCook &&
          recipeData.howToCook
            .split('\n')
            .filter(line => line.trim())
            .map((line, i) => (
              howToCookChecklistEnabled ? (
                <View key={i} style={styles.stepRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleStep(i)}
                  >
                    {checkedSteps[i] ? (
                      <Text style={styles.checkboxMark}>✓</Text>
                    ) : (
                      <Text style={styles.checkboxMark}></Text>
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.stepText,
                      checkedSteps[i] && styles.stepTextChecked,
                    ]}
                  >
                    {i + 1}. {line.trim()}
                  </Text>
                </View>
              ) : (
                <View key={i} style={styles.stepRow}>
                  <Text style={styles.stepText}>
                    {i + 1}. {line.trim()}
                  </Text>
                </View>
              )
            ))}
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
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#F8D64E",
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxMark: {
    fontSize: 18,
    color: "#F8D64E",
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  stepTextChecked: {
    textDecorationLine: "line-through",
    color: "#bbb",
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
