import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const EditMoodModal = ({ visible, moods, onSelect, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Mood</Text>
          <View style={styles.moodsContainer}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.moodOption}
                onPress={() => onSelect(m.label)}
              >
                <Image source={m.image} style={styles.moodImage} />
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={onCancel}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditMoodModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  moodOption: {
    alignItems: 'center',
    margin: 10
  },
  moodImage: {
    width: 50,
    height: 50,
    marginBottom: 5
  },
  moodLabel: {
    fontSize: 14
  },
  modalCancelButton: {
    marginTop: 20,
    backgroundColor: '#F8D64E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
