import axios, { type AxiosResponse } from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Ingredient,
  Recipe,
  RecipeInstructions,
  SuggestRecipesResponse,
  EditRecipeRequest,
} from "../types";

// API Base URL - adjust this to match your backend URL
const API_BASE_URL = "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/login",
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/register",
      data
    );
    return response.data;
  },
};

// Ingredients API calls
export const ingredientsAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    const response: AxiosResponse<Ingredient[]> = await api.get("/ingredients");
    return response.data;
  },
};

// User Ingredients API calls
export const userIngredientsAPI = {
  get: async (): Promise<{ availableIngredients: Ingredient[] }> => {
    const response = await api.get("/users/ingredients");
    return response.data;
  },

  add: async (ingredientIds: string[]): Promise<void> => {
    await api.post("/users/ingredients", { ingredientIds });
  },
};

// Recipes API calls
export const recipesAPI = {
  suggestByInventory: async (): Promise<SuggestRecipesResponse> => {
    const response: AxiosResponse<SuggestRecipesResponse> = await api.post(
      "/recipes/suggest-by-my-inventory-detailed"
    );
    return response.data;
  },

  getInstructions: async (recipeId: string): Promise<RecipeInstructions> => {
    const response: AxiosResponse<RecipeInstructions> = await api.get(
      `/recipes/${recipeId}/instructions`
    );
    return response.data;
  },
  editRecipe: async (
    recipeId: string,
    data: EditRecipeRequest
  ): Promise<Recipe> => {
    // Transform the data to match UpdateRecipeDto structure
    const updateData = {
      title: data.title,
      description: data.description,
      // Convert single totalTime back to separate times (split evenly if provided)
      preparationTimeMinutes: data.totalTime
        ? Math.floor(data.totalTime / 2)
        : undefined,
      cookingTimeMinutes: data.totalTime
        ? Math.ceil(data.totalTime / 2)
        : undefined,
      // Use steps instead of instructions
      steps: data.steps,
    };

    const response: AxiosResponse<Recipe> = await api.patch(
      `/recipes/${recipeId}`,
      updateData
    );
    return response.data;
  },
};

export default api;
