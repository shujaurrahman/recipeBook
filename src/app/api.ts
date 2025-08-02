import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = 'be1072c4410843daabd69776ffc3006f';
const BASE_URL = 'https://api.spoonacular.com';

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
    try {
      const response = await axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: API_KEY,
          number: 8, // Force exactly 8 recipes
          // Add tags to get better variety of recipes
          tags: 'main course,dinner,lunch,breakfast',
        },
        timeout: 8000
      });
      
      if (!response.data || !response.data.recipes || response.data.recipes.length === 0) {
        throw new Error('No recipes returned from API');
      }
      
      // Update the transformedRecipes mapping in getRandomRecipes
      const transformedRecipes = response.data.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        // Fix the image URL format
        image: recipe.image 
          ? `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg` 
          : '/placeholder-recipe.jpg',
        summary: recipe.summary || '',
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl
      }));

      return transformedRecipes;
      
    } catch (error) {
      try {
        return await this.getPopularRecipes(number);
      } catch (fallbackError) {
        throw new Error(`Failed to fetch recipes: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  async getPopularRecipes(number: number = 20): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
        params: {
          apiKey: API_KEY,
          number: number,
          sort: 'popularity',
          addRecipeInformation: true,
          fillIngredients: true
        },
        timeout: 8000
      });
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('No popular recipes found');
      }
      
      // Also update the getPopularRecipes mapping
      return response.data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        // Fix the image URL format
        image: recipe.image 
          ? `https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg`
          : '/placeholder-recipe.jpg',
        summary: recipe.summary || '',
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl
      }));
    } catch (error) {
      throw error;
    }
  },

  async getRecipeById(id: number): Promise<DetailedRecipe> {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
        params: {
          apiKey: API_KEY,
          includeNutrition: false
        },
        timeout: 8000
      });
      
      const recipe = response.data;
      
      // Update getRecipeById return
      return {
        id: recipe.id,
        title: recipe.title,
        // Fix the image URL format
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
      throw new Error(`Failed to fetch recipe details: ${error.response?.data?.message || error.message}`);
    }
  },

  async getSimilarRecipes(id: number): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/${id}/similar`, {
        params: {
          apiKey: API_KEY,
          number: 4
        },
        timeout: 5000
      });
      
      const similarRecipes = await Promise.all(
        response.data.slice(0, 4).map(async (recipe: any) => {
          try {
            const detailResponse = await axios.get(`${BASE_URL}/recipes/${recipe.id}/information`, {
              params: {
                apiKey: API_KEY,
                includeNutrition: false
              },
              timeout: 3000
            });
            
            return {
              id: detailResponse.data.id,
              title: detailResponse.data.title,
              image: detailResponse.data.image || '/placeholder-recipe.jpg',
              summary: detailResponse.data.summary || '',
              readyInMinutes: detailResponse.data.readyInMinutes,
              servings: detailResponse.data.servings,
              sourceUrl: detailResponse.data.sourceUrl
            };
          } catch (err) {
            return {
              id: recipe.id,
              title: recipe.title,
              image: '/placeholder-recipe.jpg',
              summary: '',
              readyInMinutes: 0,
              servings: 0,
              sourceUrl: ''
            };
          }
        })
      );
      
      return similarRecipes;
    } catch (error) {
      return [];
    }
  }
};

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Change to fetch 8 recipes
        const data = await api.getRandomRecipes(8);
        setRecipes(data);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
};