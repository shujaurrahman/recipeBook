import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = '079106076fdb448fb3abdfa65f70c103';
const BASE_URL = 'https://api.spoonacular.com';

// Type definitions
interface ApiError {
  message: string;
  status?: number;
}

interface ApiResponse {
  recipes: any[];
  data?: {
    message?: string;
  };
}

// Cache implementation
let recipesCache: Recipe[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;
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
    
    if (recipesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return recipesCache;
    }

    if (ongoingRequest) {
      return ongoingRequest;
    }

    try {
      ongoingRequest = axios.get<ApiResponse>(`${BASE_URL}/recipes/random`, {
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

        recipesCache = transformedRecipes;
        lastFetchTime = now;

        return transformedRecipes;
      });

      const result = await ongoingRequest;
      ongoingRequest = null;
      return result;
      
    } catch (error: unknown) {
      ongoingRequest = null;
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          `Failed to fetch recipes: ${
            axiosError.response?.data?.message || 
            axiosError.message || 
            'Unknown API error'
          }`
        );
      }
      
      throw new Error(
        `Failed to fetch recipes: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  async getRecipeById(id: number): Promise<DetailedRecipe> {
    const cachedRecipe = recipesCache.find(r => r.id === id);
    
    try {
      const response = await axios.get<DetailedRecipe>(`${BASE_URL}/recipes/${id}/information`, {
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
    } catch (error: unknown) {
      if (cachedRecipe) {
        return {
          ...cachedRecipe,
          instructions: '',
          extendedIngredients: [],
          analyzedInstructions: []
        } as DetailedRecipe;
      }
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          `Failed to fetch recipe details: ${
            axiosError.response?.data?.message || 
            axiosError.message || 
            'Unknown API error'
          }`
        );
      }
      
      throw new Error(
        `Failed to fetch recipe details: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  async getSimilarRecipes(id: number): Promise<Recipe[]> {
    if (recipesCache.length >= 4) {
      const filtered = recipesCache.filter(r => r.id !== id);
      return filtered.slice(0, 4);
    }

    try {
      const response = await axios.get<Recipe[]>(`${BASE_URL}/recipes/${id}/similar`, {
        params: {
          apiKey: API_KEY,
          number: 4
        },
        timeout: 5000
      });
      
      return response.data.slice(0, 4).map((recipe: Recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg`,
        summary: '',
        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,
        sourceUrl: recipe.sourceUrl || ''
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch similar recipes:', error.message);
      } else if (error instanceof Error) {
        console.error('Failed to fetch similar recipes:', error.message);
      }
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
      } catch (err: unknown) {
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
  }, []);

  return { recipes, loading, error };
};