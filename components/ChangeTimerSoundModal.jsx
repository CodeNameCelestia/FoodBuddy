// components/ChangeTimerSoundModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const soundOptions = [
  { key: 'timer', displayName: 'Default' },
  { key: 'Bell', displayName: 'Bell' },
  { key: 'Maxwell', displayName: 'Maxwell' },
  { key: 'Happy', displayName: 'Happy' },
  { key: 'Chipi-chipi', displayName: 'Chipi-chipi' },
  { key: 'Megalovania', displayName: 'Megalovania' },
];

const ChangeTimerSoundModal = ({ visible, onClose, onSelect }) => {
  const [selectedSound, setSelectedSound] = useState('timer');

  useEffect(() => {
    const loadSound = async () => {
      try {
        const storedSound = await AsyncStorage.getItem('timerSound');
        if (storedSound) {
          setSelectedSound(storedSound);
        }
      } catch (error) {
        console.error('Error loading timer sound', error);
      }
    };
    if (visible) {
      loadSound();
    }
  }, [visible]);

  const handleSelectSound = (soundKey) => {
    setSelectedSound(soundKey);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('timerSound', selectedSound);
      if (onSelect) {
        onSelect(selectedSound);
      }
      onClose();
    } catch (error) {
      console.error('Error saving timer sound', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Timer Sound</Text>
          {soundOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                selectedSound === option.key && styles.selectedOption,
              ]}
              onPress={() => handleSelectSound(option.key)}
            >
              <Ionicons
                name="musical-notes"
                size={24}
                color={selectedSound === option.key ? "#F8D64E" : "#555"}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedSound === option.key && styles.selectedOptionText,
                ]}
              >
                {option.displayName}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeTimerSoundModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#F8D64E',
    backgroundColor: '#ffe299',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  selectedOptionText: {
    color: '#F8D64E',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#F00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
