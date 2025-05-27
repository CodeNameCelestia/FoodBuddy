// components/ChangeMoodImage.jsx
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { MoodContext } from '../contexts/MoodContext';

const moodImages = {
  Anime: {
    happy: require("../assets/images/Moods/Anime/happy.png"),
    sad: require("../assets/images/Moods/Anime/sad.png"),
    hungry: require("../assets/images/Moods/Anime/hungry.png"),
    cool: require("../assets/images/Moods/Anime/cool.png"),
    stressed: require("../assets/images/Moods/Anime/stressed.png"),
  },
  Cats: {
    happy: require("../assets/images/Moods/Cats/happy.png"),
    sad: require("../assets/images/Moods/Cats/sad.png"),
    hungry: require("../assets/images/Moods/Cats/hungry.png"),
    cool: require("../assets/images/Moods/Cats/cool.png"),
    stressed: require("../assets/images/Moods/Cats/stressed.png"),
  },
  Dogs: {
    happy: require("../assets/images/Moods/Dogs/happy.png"),
    sad: require("../assets/images/Moods/Dogs/sad.png"),
    hungry: require("../assets/images/Moods/Dogs/hungry.png"),
    cool: require("../assets/images/Moods/Dogs/cool.png"),
    stressed: require("../assets/images/Moods/Dogs/stressed.png"),
  },
  Emoji: {
    happy: require("../assets/images/Moods/Emoji/happy.png"),
    sad: require("../assets/images/Moods/Emoji/sad.png"),
    hungry: require("../assets/images/Moods/Emoji/hungry.png"),
    cool: require("../assets/images/Moods/Emoji/cool.png"),
    stressed: require("../assets/images/Moods/Emoji/stressed.png"),
  },
  Pepe: {
    happy: require("../assets/images/Moods/Pepe/happy.png"),
    sad: require("../assets/images/Moods/Pepe/sad.png"),
    hungry: require("../assets/images/Moods/Pepe/hungry.png"),
    cool: require("../assets/images/Moods/Pepe/cool.png"),
    stressed: require("../assets/images/Moods/Pepe/stressed.png"),
  },
  Tiktok: {
    happy: require("../assets/images/Moods/Tiktok/happy.png"),
    sad: require("../assets/images/Moods/Tiktok/sad.png"),
    hungry: require("../assets/images/Moods/Tiktok/hungry.png"),
    cool: require("../assets/images/Moods/Tiktok/cool.png"),
    stressed: require("../assets/images/Moods/Tiktok/stressed.png"),
  },
  Melody: {
    happy: require("../assets/images/Moods/Melody/happy.png"),
    sad: require("../assets/images/Moods/Melody/sad.png"),
    hungry: require("../assets/images/Moods/Melody/hungry.png"),
    cool: require("../assets/images/Moods/Melody/cool.png"),
    stressed: require("../assets/images/Moods/Melody/stressed.png"),
  },
  Kuromi: {
    happy: require("../assets/images/Moods/Kuromi/happy.png"),
    sad: require("../assets/images/Moods/Kuromi/sad.png"),
    hungry: require("../assets/images/Moods/Kuromi/hungry.png"),
    cool: require("../assets/images/Moods/Kuromi/cool.png"),
    stressed: require("../assets/images/Moods/Kuromi/stressed.png"),
  },
};

const ChangeMoodImage = ({ mood, style }) => {
  const { moodFolder } = useContext(MoodContext);
  if (!moodFolder || !mood) return null;
  const key = mood.toLowerCase();
  const imageSource = moodImages[moodFolder]?.[key];
  if (!imageSource) return null;
  return <Image source={imageSource} style={style} />;
};

export default ChangeMoodImage;
