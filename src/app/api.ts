import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = '8c43c4a6516d4130a56fa6a92034ddcd';
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
  async connectUser(): Promise<any> {
    try {
      const response = await axios.post(`${BASE_URL}/users/connect`, {
        username: "Shujaurrahman",
        firstName: "Shuja",
        lastName: "ur Rahman",
        email: "Shujaurrehman210@gmail.com"
      }, {
        params: {
          apiKey: API_KEY
        }
      });
      console.log('User connected:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error connecting user:', error);
      return null;
    }
  },

  async getRandomRecipes(number: number = 12): Promise<Recipe[]> {
    try {
      console.log('🔄 Fetching random recipes...');
      
      const response = await axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: API_KEY,
          number: number,
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ API Response received:', {
        status: response.status,
        recipesCount: response.data?.recipes?.length || 0
      });
      
      if (!response.data || !response.data.recipes || response.data.recipes.length === 0) {
        throw new Error('No recipes returned from API');
      }
      
      const transformedRecipes = response.data.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary || '',
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl
      }));

      console.log('✅ Recipes transformed:', transformedRecipes.length);
      return transformedRecipes;
      
    } catch (error) {
      console.error('❌ Error in getRandomRecipes:', error);
      
      // Fallback to popular recipes if random fails
      try {
        console.log('🔄 Trying fallback: popular recipes...');
        return await this.getPopularRecipes(number);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw new Error(`Failed to fetch recipes: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  async getPopularRecipes(number: number = 12): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
        params: {
          apiKey: API_KEY,
          number: number,
          sort: 'popularity',
          addRecipeInformation: true,
          fillIngredients: true
        },
        timeout: 10000
      });
      
      console.log('✅ Popular recipes response:', {
        status: response.status,
        resultsCount: response.data?.results?.length || 0
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('No popular recipes found');
      }
      
      return response.data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary || '',
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl
      }));
    } catch (error) {
      console.error('❌ Error fetching popular recipes:', error);
      throw error;
    }
  },

  async getRecipeById(id: number): Promise<DetailedRecipe> {
    try {
      console.log(`🔄 Fetching recipe with ID: ${id}`);
      
      const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
        params: {
          apiKey: API_KEY,
          includeNutrition: false
        },
        timeout: 10000
      });
      
      console.log('✅ Recipe details received:', response.status);
      
      const recipe = response.data;
      
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary || '',
        instructions: recipe.instructions || '',
        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,
        extendedIngredients: recipe.extendedIngredients || [],
        analyzedInstructions: recipe.analyzedInstructions || [],
        sourceUrl: recipe.sourceUrl
      };
    } catch (error) {
      console.error(`❌ Error fetching recipe ${id}:`, error);
      throw new Error(`Failed to fetch recipe details: ${error.response?.data?.message || error.message}`);
    }
  },

  async searchRecipes(query: string, number: number = 20): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
        params: {
          apiKey: API_KEY,
          query,
          number,
          addRecipeInformation: true,
          fillIngredients: true
        },
        timeout: 10000
      });
      
      return response.data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary || '',
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl
      }));
    } catch (error) {
      console.error('❌ Error searching recipes:', error);
      throw error;
    }
  },

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing API connection...');
      const response = await axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: API_KEY,
          number: 1
        },
        timeout: 5000
      });
      console.log('✅ API test successful:', response.status);
      return true;
    } catch (error) {
      console.error('❌ API test failed:', error.response?.status, error.response?.data);
      return false;
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
        console.log('🚀 useRecipes: Starting to fetch recipes...');
        
        const data = await api.getRandomRecipes(12);
        console.log('🎉 useRecipes: Recipes fetched successfully:', data.length);
        setRecipes(data);
        
      } catch (err) {
        console.error('💥 useRecipes: Error occurred:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
        setRecipes([]); // Ensure recipes is empty on error
      } finally {
        setLoading(false);
        console.log('✅ useRecipes: Loading complete');
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
};