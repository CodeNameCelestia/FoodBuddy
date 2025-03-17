// components/alerts/TimerAlert.jsx
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const TimerAlert = ({ visible, onClose }) => {
  const soundRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sfx/timer.mp3')
        );
        soundRef.current = sound;
        // Set the sound to loop continuously.
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing timer sound:', error);
      }
    };

    if (visible) {
      playSound();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [visible]);

  const handleClose = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Timer</Text>
          <Text style={styles.alertMessage}>Time is up!</Text>
          <TouchableOpacity style={styles.okButton} onPress={handleClose}>
            <Text style={styles.okButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimerAlert;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  okButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
