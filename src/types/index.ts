export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  dietary_restrictions?: string[];
  cooking_level?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dietary_restrictions?: string[];
  cooking_level?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Ingredient
export interface Ingredient {
  id: string;
  name: string;
  category?: string;
}

// Recipe
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  instructions?: string[];
  preparationTimeMinutes?: number;
  cookingTimeMinutes?: number;
  totalTime?: number;
  difficulty?: string;
  ingredients?: RecipeIngredient[];
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: string;
  unit?: string;
}

export interface RecipeInstructions {
  recipe: Recipe;
  totalTime: number;
  instructions: string[];
}

export interface SuggestedRecipe {
  recipe: Recipe;
  matchPercentage: number;
  missingIngredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  availableUserIngredientsUsed: string[];
}

export interface SuggestRecipesResponse {
  suggestedRecipes: SuggestedRecipe[];
  totalAvailableIngredients: number;
  totalFoundRecipes: number;
}

// Edit Recipe
export interface EditRecipeRequest {
  title?: string;
  description?: string;
  steps?: string[];
  totalTime?: number;
  difficulty?: string;
}
