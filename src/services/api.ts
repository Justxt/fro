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

const API_BASE_URL = "https://mvc-recipes-api-ukkt.onrender.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const ingredientsAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    const response: AxiosResponse<Ingredient[]> = await api.get("/ingredients");
    return response.data;
  },
};

export const userIngredientsAPI = {
  get: async (): Promise<{ availableIngredients: Ingredient[] }> => {
    const response = await api.get("/users/ingredients");
    return response.data;
  },

  add: async (ingredientIds: string[]): Promise<void> => {
    await api.post("/users/ingredients", { ingredientIds });
  },
};

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
    const updateData = {
      title: data.title,
      description: data.description,
      preparationTimeMinutes: data.totalTime
        ? Math.floor(data.totalTime / 2)
        : undefined,
      cookingTimeMinutes: data.totalTime
        ? Math.ceil(data.totalTime / 2)
        : undefined,
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
