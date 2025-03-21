// components/ChangeTimerSoundModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const soundOptions = [
  { key: 'timer', displayName: 'Default' },
  { key: 'Bell', displayName: 'Bell' },
  { key: 'Maxwell', displayName: 'Maxwell' },
  { key: 'Happy', displayName: 'Happy' },
  { key: 'Chipi-chipi', displayName: 'Chipi-chipi' },
  { key: 'Megalovania', displayName: 'Megalovania' },
  { key: 'CarelessWhisper', displayName: 'Careless Whisper' },
];

const soundMapping = {
  timer: require('../assets/sfx/timer.mp3'),
  Bell: require('../assets/sfx/Bell.mp3'),
  Maxwell: require('../assets/sfx/Maxwell.mp3'),
  Happy: require('../assets/sfx/Happy.mp3'),
  'Chipi-chipi': require('../assets/sfx/Chipi-chipi.mp3'),
  Megalovania: require('../assets/sfx/Megalovania.mp3'),
  CarelessWhisper: require('../assets/sfx/CarelessWhisper.mp3'),
};

const ChangeTimerSoundModal = ({ visible, onClose, onSelect }) => {
  const [selectedSound, setSelectedSound] = useState('timer');
  const [initialSound, setInitialSound] = useState(null);
  const soundSampleRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load saved sound from AsyncStorage when the modal becomes visible.
  useEffect(() => {
    const loadSound = async () => {
      try {
        const storedSound = await AsyncStorage.getItem('timerSound');
        if (storedSound) {
          setSelectedSound(storedSound);
          setInitialSound(storedSound);
        } else {
          // If nothing is stored, use default.
          setSelectedSound('timer');
          setInitialSound('timer');
        }
      } catch (error) {
        console.error('Error loading timer sound', error);
      }
    };
    if (visible) {
      loadSound();
    }
  }, [visible]);

  // Function to stop any currently playing sample.
  const stopSampleSound = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (soundSampleRef.current) {
      try {
        await soundSampleRef.current.stopAsync();
        await soundSampleRef.current.unloadAsync();
      } catch (error) {
        console.error("Error stopping sample sound:", error);
      }
      soundSampleRef.current = null;
    }
  };

  // When selectedSound changes and is different from the initial sound, play a 10-second sample.
  useEffect(() => {
    const playSample = async () => {
      await stopSampleSound();
      try {
        const { sound } = await Audio.Sound.createAsync(soundMapping[selectedSound]);
        soundSampleRef.current = sound;
        // Loop the sound sample.
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
        // Stop the sample after 10 seconds.
        timeoutRef.current = setTimeout(async () => {
          await stopSampleSound();
        }, 10000);
      } catch (error) {
        console.error("Error playing sample sound:", error);
      }
    };

    // Only play sample if the modal is visible and the selected sound is different from the initial one.
    if (visible && selectedSound && initialSound && selectedSound !== initialSound) {
      playSample();
    } else {
      // Otherwise, ensure no sample is playing.
      stopSampleSound();
    }

    return () => {
      stopSampleSound();
    };
  }, [selectedSound, visible, initialSound]);

  const handleSelectSound = (soundKey) => {
    // Only play sample if the new selection is different from the currently selected sound.
    if (soundKey !== selectedSound) {
      setSelectedSound(soundKey);
    }
  };

  const handleSave = async () => {
    await stopSampleSound();
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
