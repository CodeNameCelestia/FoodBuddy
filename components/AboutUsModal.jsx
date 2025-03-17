import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutUsModal = ({ visible, onClose }) => {
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
          <Text style={styles.modalTitle}>About Us</Text>
          <ScrollView contentContainerStyle={styles.modalContentContainer}>
            <Text style={styles.modalText}>
              FoodBuddy is a personal recipe management app designed to simplify meal planning.
              Users can create, update, and manage their own collection of recipes, and even get
              mood-based suggestions.
            </Text>


          <View style={styles.creatorCard}>
            <Image
              source={require('../assets/images/Moods/Melody/hungry.png')}
              style={styles.profileImage}
            />
            <Text style={styles.creatorName}>Alejandro A. Cayasa</Text>
            <Text style={styles.creatorNickname}>Code_Celestia</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity onPress={() => openLink('https://www.facebook.com/AlejandroACayasa')}>
                <Ionicons name="logo-facebook" size={30} color="#3b5998" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://github.com/CodeNameCelestia')}>
                <Ionicons name="logo-github" size={30} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://www.instagram.com/ale_c.mp4/')}>
                <Ionicons name="logo-instagram" size={30} color="#C13584" />
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AboutUsModal;

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
  modalContentContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  creatorCard: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 15,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
  },
  creatorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  creatorNickname: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
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
