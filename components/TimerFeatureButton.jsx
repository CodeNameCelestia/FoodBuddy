import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TimerFeatureButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name="alarm" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default TimerFeatureButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFA500',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5,
  },
});
