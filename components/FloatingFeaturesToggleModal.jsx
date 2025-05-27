// components/FloatingFeaturesToggleModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FloatingFeaturesToggleModal = ({
  visible,
  onClose,
  onToggleUpdate, // callback to notify parent of changes
}) => {
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [howToCookChecklistEnabled, setHowToCookChecklistEnabled] = useState(true);

  // Load saved toggles whenever modal becomes visible
  useEffect(() => {
    const loadToggles = async () => {
      try {
        const floatVal = await AsyncStorage.getItem('floatingEnabled');
        const timerVal = await AsyncStorage.getItem('timerEnabled');
        const checklistVal = await AsyncStorage.getItem('howToCookChecklistEnabled');
        setFloatingEnabled(floatVal !== 'false'); // default to true if not set
        setTimerEnabled(timerVal !== 'false');    // default to true if not set
        setHowToCookChecklistEnabled(checklistVal !== 'false');
      } catch (error) {
      }
    };
    if (visible) {
      loadToggles();
    }
  }, [visible]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('floatingEnabled', floatingEnabled ? 'true' : 'false');
      await AsyncStorage.setItem('timerEnabled', timerEnabled ? 'true' : 'false');
      await AsyncStorage.setItem('howToCookChecklistEnabled', howToCookChecklistEnabled ? 'true' : 'false');
      if (onToggleUpdate) {
        onToggleUpdate({ floatingEnabled, timerEnabled, howToCookChecklistEnabled });
      }
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Recipe Features</Text>

          <View style={styles.toggleRow}>
            <Text style={styles.label}>Floating Button</Text>
            <Switch
              value={floatingEnabled}
              onValueChange={setFloatingEnabled}
              thumbColor={floatingEnabled ? '#F8D64E' : '#ccc'}
              trackColor={{ true: '#ffe299', false: '#ddd' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.label}>Timer</Text>
            <Switch
              value={timerEnabled}
              onValueChange={setTimerEnabled}
              thumbColor={timerEnabled ? '#F8D64E' : '#ccc'}
              trackColor={{ true: '#ffe299', false: '#ddd' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.label}>How to Cook Checklist</Text>
            <Switch
              value={howToCookChecklistEnabled}
              onValueChange={setHowToCookChecklistEnabled}
              thumbColor={howToCookChecklistEnabled ? '#F8D64E' : '#ccc'}
              trackColor={{ true: '#ffe299', false: '#ddd' }}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FloatingFeaturesToggleModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#F00',
    fontWeight: 'bold',
  },
});
