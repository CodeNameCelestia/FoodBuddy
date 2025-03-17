// components/CollaboratorsModal.jsx
import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';

const CollaboratorsModal = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      // Optionally reset scale for next open
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.modalTitle}>Collaborators</Text>
          <Text style={styles.modalText}>
            FoodBuddy is built with the help of innovative technologies and valuable contributions.
            We extend our gratitude to the following collaborators:
          </Text>
          <View style={styles.collaboratorsContainer}>
            <View style={styles.collaborator}>
              <Image
                source={require('../assets/images/expo-go-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.collaboratorName}>Expo Go</Text>
            </View>
            <View style={styles.collaborator}>
              <Image
                source={require('../assets/images/chatgpt-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.collaboratorName}>ChatGPT</Text>
            </View>
            <View style={styles.collaborator}>
              <Image
                source={require('../assets/images/react-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.collaboratorName}>React Native</Text>
            </View>
          </View>
          <Text style={styles.modalText}>
            Their platforms and tools have empowered us to create a seamless recipe management experience.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CollaboratorsModal;

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
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  collaboratorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
  collaborator: {
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  collaboratorName: {
    fontSize: 14,
    fontWeight: '500',
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
