import AsyncStorage from '@react-native-async-storage/async-storage';

const RECIPES_KEY = 'recipes';

const getRecipes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(RECIPES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading recipes:', e);
    return [];
  }
};

const saveRecipes = async (recipes) => {
  try {
    const jsonValue = JSON.stringify(recipes);
    await AsyncStorage.setItem(RECIPES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving recipes:', e);
  }
};

const addRecipe = async (recipe) => {
  const recipes = await getRecipes();
  recipe.id = Date.now().toString();
  recipes.push(recipe);
  await saveRecipes(recipes);
};

const updateRecipe = async (updatedRecipe) => {
  let recipes = await getRecipes();
  recipes = recipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe));
  await saveRecipes(recipes);
};

const deleteRecipe = async (id) => {
  let recipes = await getRecipes();
  recipes = recipes.filter((recipe) => recipe.id !== id);
  await saveRecipes(recipes);
};

const getRecipeById = async (id) => {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.id === id);
};

const getRecipesByMood = async (mood) => {
  const recipes = await getRecipes();
  return recipes.filter((recipe) => recipe.mood === mood);
};

export default {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesByMood
};
