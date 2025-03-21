import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native';

// Array of all mood images from various folders (ensure these paths are correct)
const allMoodImages = [
  // Anime
  require('../assets/images/Moods/Anime/happy.png'),
  require('../assets/images/Moods/Anime/sad.png'),
  require('../assets/images/Moods/Anime/hungry.png'),
  require('../assets/images/Moods/Anime/cool.png'),
  require('../assets/images/Moods/Anime/stressed.png'),
  // Cats
  require('../assets/images/Moods/Cats/happy.png'),
  require('../assets/images/Moods/Cats/sad.png'),
  require('../assets/images/Moods/Cats/hungry.png'),
  require('../assets/images/Moods/Cats/cool.png'),
  require('../assets/images/Moods/Cats/stressed.png'),
  // Dogs
  require('../assets/images/Moods/Dogs/happy.png'),
  require('../assets/images/Moods/Dogs/sad.png'),
  require('../assets/images/Moods/Dogs/hungry.png'),
  require('../assets/images/Moods/Dogs/cool.png'),
  require('../assets/images/Moods/Dogs/stressed.png'),
  // Emoji
  require('../assets/images/Moods/Emoji/happy.png'),
  require('../assets/images/Moods/Emoji/sad.png'),
  require('../assets/images/Moods/Emoji/hungry.png'),
  require('../assets/images/Moods/Emoji/cool.png'),
  require('../assets/images/Moods/Emoji/stressed.png'),
  // Kuromi
  require('../assets/images/Moods/Kuromi/happy.png'),
  require('../assets/images/Moods/Kuromi/sad.png'),
  require('../assets/images/Moods/Kuromi/hungry.png'),
  require('../assets/images/Moods/Kuromi/cool.png'),
  require('../assets/images/Moods/Kuromi/stressed.png'),
  // Melody
  require('../assets/images/Moods/Melody/happy.png'),
  require('../assets/images/Moods/Melody/sad.png'),
  require('../assets/images/Moods/Melody/hungry.png'),
  require('../assets/images/Moods/Melody/cool.png'),
  require('../assets/images/Moods/Melody/stressed.png'),
  // Pepe
  require('../assets/images/Moods/Pepe/happy.png'),
  require('../assets/images/Moods/Pepe/sad.png'),
  require('../assets/images/Moods/Pepe/hungry.png'),
  require('../assets/images/Moods/Pepe/cool.png'),
  require('../assets/images/Moods/Pepe/stressed.png'),
  // Tiktok
  require('../assets/images/Moods/Tiktok/happy.png'),
  require('../assets/images/Moods/Tiktok/sad.png'),
  require('../assets/images/Moods/Tiktok/hungry.png'),
  require('../assets/images/Moods/Tiktok/cool.png'),
  require('../assets/images/Moods/Tiktok/stressed.png'),
];

// List of names to thank
const names = [
  "Arabella",
  "Thonjen",
  "Pearl",
  "Ricky",
  "Kean",
  "Laurence",
  "Prince",
  "Kent",
  "Lesley",
  "Fairy",
];

// Function to pick a random mood image from the list
const getRandomMoodImage = () => {
  const randomIndex = Math.floor(Math.random() * allMoodImages.length);
  return allMoodImages[randomIndex];
};

const SpecialTanksModal = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.modalTitle}>Special Thanks</Text>
          <Text style={styles.modalText}>
            FoodBuddy is made possible thanks to the incredible support and motivation from our friends.
            We extend our heartfelt gratitude to:
          </Text>
          <View style={styles.namesContainer}>
            {names.map((name, index) => (
              <View key={index} style={styles.nameItem}>
                <Image source={getRandomMoodImage()} style={styles.moodIcon} />
                <Text style={styles.nameText}>{name}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SpecialTanksModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 10,
  },
  namesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 15,
  },
  nameItem: {
    width: '45%', // Two columns
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  moodIcon: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  nameText: {
    fontSize: 17,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
