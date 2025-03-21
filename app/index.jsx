// app/index.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import database from "../database/database";
import MoodModal from "../components/MoodModal";
import RecipeCard from "../components/RecipeCard";
import MediumRecipeCard from "../components/MediumRecipeCard";
import ListRecipeCard from "../components/ListRecipeCard";
import BottomNavbar from "../components/BottomNavbar";
import NoMoodRecipeAlert from "../components/alerts/NoMoodRecipeAlert";
import { LayoutContext } from "../contexts/LayoutContext";
import { MoodContext } from "../contexts/MoodContext";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [noMoodAlertVisible, setNoMoodAlertVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [scaleValue] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;

  // Access the global layout value
  const { layout } = useContext(LayoutContext);
  // Access the global mood folder from MoodContext
  const { moodFolder } = useContext(MoodContext);

  // Create a mapping for mood images based on folder
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
  };

  // Build the moods array based on the current moodFolder
  const moods = [
    { label: "Happy", image: moodImages[moodFolder]["Happy"] },
    { label: "Sad", image: moodImages[moodFolder]["Sad"] },
    { label: "Hungry", image: moodImages[moodFolder]["Hungry"] },
    { label: "Cool", image: moodImages[moodFolder]["Cool"] },
    { label: "Stressed", image: moodImages[moodFolder]["Stressed"] },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        const visibleRecipes = data.filter((recipe) => !recipe.hidden);
        setRecipes(visibleRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (moodModalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [moodModalVisible]);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: "clamp",
  });

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  const handleMoodSelect = async (mood) => {
    setMoodModalVisible(false);
    try {
      const moodRecipes = await database.getRecipesByMood(mood);
      const visibleMoodRecipes = moodRecipes.filter((recipe) => !recipe.hidden);
      if (visibleMoodRecipes.length > 0) {
        const randomRecipe =
          visibleMoodRecipes[
            Math.floor(Math.random() * visibleMoodRecipes.length)
          ];
        router.push(`/recipeDetail?id=${randomRecipe.id}`);
      } else {
        setSelectedMood(mood);
        setNoMoodAlertVisible(true);
      }
    } catch (error) {
      console.error("Error selecting mood:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[styles.header, { transform: [{ scale: headerScale }] }]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>FoodBuddy</Text>
        </View>
      </Animated.View>

      {/* Search Bar & Add Recipe Button */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => router.push("/createRecipe")}
        >
          <Ionicons name="add-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Recipes */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 5 }}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== "web" }
        )}
        scrollEventThrottle={16}
      >
        <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
          Recent Recipes
        </Text>
        {layout === "medium" ? (
          <View style={styles.gridContainer}>
            {filteredRecipes.map((item) => (
              <MediumRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />
            ))}
          </View>
        ) : (
          filteredRecipes.map((item) => {
            if (layout === "default") {
              return <RecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            } else if (layout === "list") {
              return <ListRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            }
          })
        )}
      </Animated.ScrollView>

      {/* Bottom Navbar with Mood Button visible on Home */}
      <BottomNavbar
        showMoodButton={true}
        onMoodPress={() => setMoodModalVisible(true)}
      />

      {/* Mood Selection Modal */}
      <MoodModal
        visible={moodModalVisible}
        moods={moods}
        onSelect={handleMoodSelect}
        onCancel={() => setMoodModalVisible(false)}
      />

      {/* Custom Alert for No Recipes Found for Mood */}
      <NoMoodRecipeAlert
        visible={noMoodAlertVisible}
        mood={selectedMood}
        onClose={() => setNoMoodAlertVisible(false)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#F8D64E",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F8D64E",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    marginRight: 8,
  },
  addButtonContainer: {
    backgroundColor: "#f0c209",
    borderRadius: 50,
    padding: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});
