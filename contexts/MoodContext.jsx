// contexts/MoodContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MoodContext = createContext({
  moodFolder: 'Emoji', // default folder
  setMoodFolder: () => {},
});

export const MoodProvider = ({ children }) => {
  const [moodFolder, setMoodFolderState] = useState('Emoji');

  useEffect(() => {
    const loadMoodFolder = async () => {
      try {
        const folder = await AsyncStorage.getItem('moodFolder');
        if (folder) {
          setMoodFolderState(folder);
        }
      } catch (error) {
        console.error("Error loading mood folder", error);
      }
    };
    loadMoodFolder();
  }, []);

  const setMoodFolder = async (folder) => {
    try {
      setMoodFolderState(folder);
      await AsyncStorage.setItem('moodFolder', folder);
    } catch (error) {
      console.error("Error saving mood folder", error);
    }
  };

  return (
    <MoodContext.Provider value={{ moodFolder, setMoodFolder }}>
      {children}
    </MoodContext.Provider>
  );
};
