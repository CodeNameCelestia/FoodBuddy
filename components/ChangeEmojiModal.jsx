// components/ChangeEmojiModal.jsx
import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MoodContext } from '../contexts/MoodContext';

const emojiOptions = [
  { label: 'Emoji', folder: 'Emoji', sample: require('../assets/images/Moods/Emoji/happy.png') },
  { label: 'Anime', folder: 'Anime', sample: require('../assets/images/Moods/Anime/happy.png') },
  { label: 'Cats', folder: 'Cats', sample: require('../assets/images/Moods/Cats/happy.png') },
  { label: 'Dogs', folder: 'Dogs', sample: require('../assets/images/Moods/Dogs/happy.png') },
  { label: 'Pepe', folder: 'Pepe', sample: require('../assets/images/Moods/Pepe/happy.png') },
  { label: 'Tiktok', folder: 'Tiktok', sample: require('../assets/images/Moods/Tiktok/happy.png') },
  { label: 'Melody', folder: 'Melody', sample: require('../assets/images/Moods/Melody/happy.png') },
  { label: 'Kuromi', folder: 'Kuromi', sample: require('../assets/images/Moods/Kuromi/happy.png') },
];

const ChangeEmojiModal = ({ visible, onClose }) => {
  const { setMoodFolder } = useContext(MoodContext);

  const handleSelect = (folder) => {
    setMoodFolder(folder);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Choose Mood Style</Text>
          <View style={styles.optionsContainer}>
            {emojiOptions.map((option) => (
              <TouchableOpacity
                key={option.folder}
                style={styles.optionButton}
                onPress={() => handleSelect(option.folder)}
              >
                <Image source={option.sample} style={styles.optionImage} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeEmojiModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionButton: {
    alignItems: 'center',
    margin: 10,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F00',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
