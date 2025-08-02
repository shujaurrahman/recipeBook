import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = 'be1072c4410843daabd69776ffc3006f';
const BASE_URL = 'https://api.spoonacular.com';

// Enhanced cache implementation
let recipesCache: Recipe[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add request deduplication
let ongoingRequest: Promise<Recipe[]> | null = null;

export interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
}

export interface DetailedRecipe extends Recipe {
  instructions: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
  analyzedInstructions?: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: any[];
      equipment: any[];
    }[];
  }[];
}

export const api = {
  async getRandomRecipes(number: number = 8): Promise<Recipe[]> {
    const now = Date.now();
    
    // Return cache if valid
    if (recipesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return recipesCache;
    }

    // Return ongoing request if exists
    if (ongoingRequest) {
      return ongoingRequest;
    }

    try {
      // Create new request and store it
      ongoingRequest = axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: API_KEY,
          number: 8,
          tags: 'main course,dinner,lunch,breakfast',
        },
        timeout: 8000
      }).then(response => {
        if (!response.data?.recipes?.length) {
          throw new Error('No recipes returned from API');
        }
        
        const transformedRecipes = response.data.recipes.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image 
            ? `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg` 
            : '/placeholder-recipe.jpg',
          summary: recipe.summary || '',
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
          sourceUrl: recipe.sourceUrl
        }));

        // Update cache
        recipesCache = transformedRecipes;
        lastFetchTime = now;

        return transformedRecipes;
      });

      const result = await ongoingRequest;
      ongoingRequest = null; // Clear ongoing request
      return result;
      
    } catch (error) {
      ongoingRequest = null; // Clear ongoing request on error
      throw new Error(`Failed to fetch recipes: ${error.response?.data?.message || error.message}`);
    }
  },

  async getRecipeById(id: number): Promise<DetailedRecipe> {
    // Check if recipe exists in cache first
    const cachedRecipe = recipesCache.find(r => r.id === id);
    
    try {
      const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
        params: {
          apiKey: API_KEY,
          includeNutrition: false
        },
        timeout: 8000
      });
      
      const recipe = response.data;
      
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image 
          ? `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg`
          : '/placeholder-recipe.jpg',
        summary: recipe.summary || '',
        instructions: recipe.instructions || '',
        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,
        extendedIngredients: recipe.extendedIngredients || [],
        analyzedInstructions: recipe.analyzedInstructions || [],
        sourceUrl: recipe.sourceUrl
      };
    } catch (error) {
      if (cachedRecipe) {
        // Return partial data from cache if API fails
        return {
          ...cachedRecipe,
          instructions: '',
          extendedIngredients: [],
          analyzedInstructions: []
        };
      }
      throw new Error(`Failed to fetch recipe details: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update getSimilarRecipes to be more efficient
  async getSimilarRecipes(id: number): Promise<Recipe[]> {
    // First check if we have enough recipes in cache
    if (recipesCache.length >= 4) {
      const filtered = recipesCache.filter(r => r.id !== id);
      return filtered.slice(0, 4);
    }

    try {
      const response = await axios.get(`${BASE_URL}/recipes/${id}/similar`, {
        params: {
          apiKey: API_KEY,
          number: 4
        },
        timeout: 5000
      });
      
      return response.data.slice(0, 4).map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg`,
        summary: '',
        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,
        sourceUrl: recipe.sourceUrl || ''
      }));
    } catch (error) {
      return [];
    }
  }
};

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => recipesCache);
  const [loading, setLoading] = useState(!recipesCache.length);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecipes = async () => {
      // Don't fetch if we already have cached data
      if (recipesCache.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await api.getRandomRecipes(8);
        if (mounted) {
          setRecipes(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
          setRecipes([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array

  return { recipes, loading, error };
};