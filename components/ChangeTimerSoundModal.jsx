// components/ChangeTimerSoundModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const soundOptionsBase = [
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
  // 'custom' will be handled dynamically
};

const CUSTOM_SOUND_KEY = 'customTimerSoundUri';

const ChangeTimerSoundModal = ({ visible, onClose, onSelect }) => {
  const [selectedSound, setSelectedSound] = useState('timer');
  const [initialSound, setInitialSound] = useState(null);
  const [customSoundUri, setCustomSoundUri] = useState(null);
  const [soundOptions, setSoundOptions] = useState(soundOptionsBase);
  const soundSampleRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load saved sound and custom sound from AsyncStorage when the modal becomes visible.
  useEffect(() => {
    const loadSound = async () => {
      try {
        const storedSound = await AsyncStorage.getItem('timerSound');
        const customUri = await AsyncStorage.getItem(CUSTOM_SOUND_KEY);
        setCustomSoundUri(customUri);
        if (customUri) {
          setSoundOptions([
            ...soundOptionsBase,
            { key: 'custom', displayName: 'Custom Sound' },
          ]);
        } else {
          setSoundOptions(soundOptionsBase);
        }
        if (storedSound) {
          setSelectedSound(storedSound);
          setInitialSound(storedSound);
        } else {
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

  // Play sample for custom sound
  useEffect(() => {
    const playSample = async () => {
      await stopSampleSound();
      try {
        let soundObj;
        if (selectedSound === 'custom' && customSoundUri) {
          // Extra check for null/empty URI
          if (!customSoundUri || typeof customSoundUri !== 'string' || customSoundUri.trim() === '') {
            Alert.alert('Custom sound not found', 'The custom sound file is missing or invalid. Reverting to default.');
            await AsyncStorage.removeItem(CUSTOM_SOUND_KEY);
            setCustomSoundUri(null);
            setSoundOptions(soundOptionsBase);
            setSelectedSound('timer');
            return;
          }
          const fileInfo = await FileSystem.getInfoAsync(customSoundUri);
          if (!fileInfo.exists) {
            Alert.alert('Custom sound not found', 'The custom sound file is missing or invalid. Reverting to default.');
            await AsyncStorage.removeItem(CUSTOM_SOUND_KEY);
            setCustomSoundUri(null);
            setSoundOptions(soundOptionsBase);
            setSelectedSound('timer');
            return;
          }
          soundObj = await Audio.Sound.createAsync({ uri: customSoundUri });
        } else {
          soundObj = await Audio.Sound.createAsync(soundMapping[selectedSound]);
        }
        const { sound } = soundObj;
        soundSampleRef.current = sound;
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
        timeoutRef.current = setTimeout(async () => {
          await stopSampleSound();
        }, 10000);
      } catch (error) {
        console.error("Error playing sample sound:", error);
        Alert.alert('Playback Error', 'Unable to play the selected sound.');
      }
    };

    if (
      visible &&
      selectedSound &&
      initialSound &&
      selectedSound !== initialSound
    ) {
      playSample();
    } else {
      stopSampleSound();
    }

    return () => {
      stopSampleSound();
    };
  }, [selectedSound, visible, initialSound, customSoundUri]);

  const handleSelectSound = (soundKey) => {
    // Only play sample if the new selection is different from the currently selected sound.
    if (soundKey !== selectedSound) {
      setSelectedSound(soundKey);
    }
  };

  // Handle uploading a custom sound
  const handleUploadCustomSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets || !result.assets[0]?.uri) return;

      // Only allow one custom sound: remove previous if exists
      if (customSoundUri) {
        try {
          await FileSystem.deleteAsync(customSoundUri, { idempotent: true });
        } catch (e) {
          // ignore
        }
      }

      // Copy the selected file to app's document directory
      const pickedUri = result.assets[0].uri;
      const fileName = 'custom_timer_sound' + pickedUri.substring(pickedUri.lastIndexOf('.'));
      const destUri = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: pickedUri, to: destUri });

      await AsyncStorage.setItem(CUSTOM_SOUND_KEY, destUri);
      setCustomSoundUri(destUri);

      // Add custom option if not present
      setSoundOptions([
        ...soundOptionsBase,
        { key: 'custom', displayName: 'Custom Sound' },
      ]);
      setSelectedSound('custom');
    } catch (error) {
      console.error('Error uploading custom sound:', error);
    }
  };

  const handleSave = async () => {
    await stopSampleSound();
    try {
      // If custom sound is selected but file is missing, fallback to default
      if (selectedSound === 'custom' && customSoundUri) {
        if (!customSoundUri || typeof customSoundUri !== 'string' || customSoundUri.trim() === '') {
          Alert.alert('Custom sound not found', 'The custom sound file is missing or invalid. Reverting to default.');
          await AsyncStorage.removeItem(CUSTOM_SOUND_KEY);
          setCustomSoundUri(null);
          setSoundOptions(soundOptionsBase);
          await AsyncStorage.setItem('timerSound', 'timer');
          if (onSelect) onSelect('timer');
          onClose();
          return;
        }
        const fileInfo = await FileSystem.getInfoAsync(customSoundUri);
        if (!fileInfo.exists) {
          Alert.alert('Custom sound not found', 'The custom sound file is missing or invalid. Reverting to default.');
          await AsyncStorage.removeItem(CUSTOM_SOUND_KEY);
          setCustomSoundUri(null);
          setSoundOptions(soundOptionsBase);
          await AsyncStorage.setItem('timerSound', 'timer');
          if (onSelect) onSelect('timer');
          onClose();
          return;
        }
      }
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
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadCustomSound}
          >
            <Ionicons name="cloud-upload" size={22} color="#555" style={styles.optionIcon} />
            <Text style={styles.uploadButtonText}>
              {customSoundUri ? 'Replace Custom Sound' : 'Upload Custom Sound'}
            </Text>
          </TouchableOpacity>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f6f6f6',
    marginTop: 5,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#555',
  },
});
