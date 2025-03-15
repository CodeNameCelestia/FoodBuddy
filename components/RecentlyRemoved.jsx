import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecentlyRemoved = ({ 
  hiddenRecipes, 
  onRestore, 
  onDelete, 
  onBack, 
  setSelectedRecipe 
}) => {
  return (
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
                    onRestore();
                  }}
                >
                  <Text style={styles.buttonText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setSelectedRecipe(recipe);
                    onDelete();
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.backToSettingsButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backToSettingsText}>Back to Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  removedContainer: {
    padding: 16,
    paddingBottom: 100, // Space for the navbar
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backToSettingsText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});

export default RecentlyRemoved;
