// components/FloatingTimerButton.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TimerModal from './TimerModal';
import TimerFeatureButton from './TimerFeatureButton';

const FloatingTimerButton = ({ timerEnabled = true, mainButtonContent }) => {
  const { width, height } = Dimensions.get('window');
  const pan = useRef(
    new Animated.ValueXY({ x: width - 80, y: height - 160 })
  ).current;

  const [expanded, setExpanded] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const timerRef = useRef(null);

  // PanResponder to drag the button
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const toggleExpand = () => setExpanded(!expanded);

  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          Alert.alert("Timer", "Time is up!");
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

  // If user hasn't provided mainButtonContent, fallback to apps icon
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
              {/* Only show Timer button if timerEnabled is true */}
              {timerEnabled && (
                <TimerFeatureButton
                  onPress={() => {
                    setTimerModalVisible(true);
                    setExpanded(false);
                  }}
                />
              )}
              {/* Additional feature buttons can go here */}
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
    top: -70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
