// components/ChangeMoodImage.jsx
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { MoodContext } from '../contexts/MoodContext';

const ChangeMoodImage = ({ mood, style }) => {
  const { moodFolder } = useContext(MoodContext);

  // Mapping for mood images for each folder.
  const moodImages = {
    Anime: {
        Happy: require("../assets/images/Moods/Anime/happy.png"),
        Sad: require("../assets/images/Moods/Anime/sad.png"),
        Hungry: require("../assets/images/Moods/Anime/hungry.png"),
        Cool: require("../assets/images/Moods/Anime/cool.png"),
        Stressed: require("../assets/images/Moods/Anime/stressed.png"),
      },
      Cats: {
        Happy: require("../assets/images/Moods/Cats/happy.png"),
        Sad: require("../assets/images/Moods/Cats/sad.png"),
        Hungry: require("../assets/images/Moods/Cats/hungry.png"),
        Cool: require("../assets/images/Moods/Cats/cool.png"),
        Stressed: require("../assets/images/Moods/Cats/stressed.png"),
      },
      Dogs: {
        Happy: require("../assets/images/Moods/Dogs/happy.png"),
        Sad: require("../assets/images/Moods/Dogs/sad.png"),
        Hungry: require("../assets/images/Moods/Dogs/hungry.png"),
        Cool: require("../assets/images/Moods/Dogs/cool.png"),
        Stressed: require("../assets/images/Moods/Dogs/stressed.png"),
      },
      Emoji: {
        Happy: require("../assets/images/Moods/Emoji/happy.png"),
        Sad: require("../assets/images/Moods/Emoji/sad.png"),
        Hungry: require("../assets/images/Moods/Emoji/hungry.png"),
        Cool: require("../assets/images/Moods/Emoji/cool.png"),
        Stressed: require("../assets/images/Moods/Emoji/stressed.png"),
      },
      Pepe: {
        Happy: require("../assets/images/Moods/Pepe/happy.png"),
        Sad: require("../assets/images/Moods/Pepe/sad.png"),
        Hungry: require("../assets/images/Moods/Pepe/hungry.png"),
        Cool: require("../assets/images/Moods/Pepe/cool.png"),
        Stressed: require("../assets/images/Moods/Pepe/stressed.png"),
      },
      Tiktok: {
        Happy: require("../assets/images/Moods/Tiktok/happy.png"),
        Sad: require("../assets/images/Moods/Tiktok/sad.png"),
        Hungry: require("../assets/images/Moods/Tiktok/hungry.png"),
        Cool: require("../assets/images/Moods/Tiktok/cool.png"),
        Stressed: require("../assets/images/Moods/Tiktok/stressed.png"),
      },
      Melody: {
        Happy: require("../assets/images/Moods/Melody/happy.png"),
        Sad: require("../assets/images/Moods/Melody/sad.png"),
        Hungry: require("../assets/images/Moods/Melody/hungry.png"),
        Cool: require("../assets/images/Moods/Melody/cool.png"),
        Stressed: require("../assets/images/Moods/Melody/stressed.png"),
      },
      Kuromi: {
        Happy: require("../assets/images/Moods/Kuromi/happy.png"),
        Sad: require("../assets/images/Moods/Kuromi/sad.png"),
        Hungry: require("../assets/images/Moods/Kuromi/hungry.png"),
        Cool: require("../assets/images/Moods/Kuromi/cool.png"),
        Stressed: require("../assets/images/Moods/Kuromi/stressed.png"),
      },

    // Add other folders (Cats, Dogs, Memes) as needed.
  };

  if (!moodImages[moodFolder] || !moodImages[moodFolder][mood]) {
    return null;
  }
  
  return <Image source={moodImages[moodFolder][mood]} style={style} />;
};

export default ChangeMoodImage;
