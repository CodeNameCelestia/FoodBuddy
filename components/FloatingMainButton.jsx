import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TimerModal = ({ visible, onClose, onStart }) => {
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  const handleStart = () => {
    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      Alert.alert('Invalid Time', 'Please set a valid time.');
      return;
    }
    onStart(totalSeconds);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Set Timer</Text>
          <View style={modalStyles.inputRow}>
            <TextInput
              style={modalStyles.input}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="numeric"
              placeholder="Min"
            />
            <Text style={modalStyles.colon}>:</Text>
            <TextInput
              style={modalStyles.input}
              value={seconds}
              onChangeText={setSeconds}
              keyboardType="numeric"
              placeholder="Sec"
            />
          </View>
          <TouchableOpacity style={modalStyles.startButton} onPress={handleStart}>
            <Text style={modalStyles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FloatingTimerButton = ({ mainButtonContent }) => {
  // Animated position for the floating button.
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 500 })).current;
  const [expanded, setExpanded] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const timerRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          Alert.alert('Timer', 'Time is up!');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Main button now shows the provided mainButtonContent.
  // If no mainButtonContent is provided, fallback to the apps icon.
  const mainContent = mainButtonContent || (
    <Ionicons name="apps-outline" size={28} color="#fff" />
  );

  return (
    <>
      <TimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onStart={startTimer}
      />
      <Animated.View
        style={[styles.floatingButtonContainer, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={toggleExpand} style={styles.mainButton}>
            {remainingTime !== null ? (
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            ) : (
              mainContent
            )}
          </TouchableOpacity>
          {expanded && (
            <View style={styles.expandedButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setTimerModalVisible(true);
                  setExpanded(false);
                }}
                style={styles.expandedButton}
              >
                <Ionicons name="alarm" size={24} color="#fff" />
              </TouchableOpacity>
              {/* Future feature buttons can be added here */}
            </View>
          )}
        </View>
      </Animated.View>
    </>
  );
};

export default FloatingTimerButton;

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 90,
    right: 20,
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#F8D64E',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expandedButtonsContainer: {
    position: 'absolute',
    top: -70, // Positioned above the main button
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  expandedButton: {
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

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 50,
    height: 40,
    textAlign: 'center',
    borderRadius: 5,
  },
  colon: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  startButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#F00',
    fontSize: 16,
  },
});
