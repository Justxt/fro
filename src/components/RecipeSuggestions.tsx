import React, { useState, useEffect } from "react";
import type {
  SuggestRecipesResponse,
  SuggestedRecipe,
  Ingredient,
} from "../types";
import { recipesAPI, userIngredientsAPI } from "../services/api";
import RecipeDetail from "./RecipeDetail";

const RecipeSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SuggestRecipesResponse | null>(
    null
  );
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<SuggestedRecipe | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [suggestionsData, userIngredientsData] = await Promise.all([
        recipesAPI.suggestByInventory(),
        userIngredientsAPI.get(),
      ]);

      setSuggestions(suggestionsData);
      setUserIngredients(userIngredientsData.availableIngredients);
    } catch (error: any) {
      setError("Error al cargar sugerencias de recetas");
      console.error("Error loading recipe suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeSelect = (suggestedRecipe: SuggestedRecipe) => {
    setSelectedRecipe(suggestedRecipe);
  };

  const handleBackToSuggestions = () => {
    setSelectedRecipe(null);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetail
        suggestedRecipe={selectedRecipe}
        onBack={handleBackToSuggestions}
      />
    );
  }

  if (isLoading) {
    return <div className="loading">Cargando sugerencias...</div>;
  }

  return (
    <div className="recipe-suggestions">
      <div className="suggestions-header">
        <h2>Sugerencias de Recetas</h2>
        <button onClick={loadSuggestions} className="refresh-btn">
          Actualizar Sugerencias
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {suggestions && (
        <div className="suggestions-content">
          <div className="user-ingredients">
            <h3>Tus ingredientes disponibles ({userIngredients.length}):</h3>
            <div className="ingredients-list">
              {userIngredients.map((ingredient) => (
                <span key={ingredient.id} className="ingredient-tag">
                  {ingredient.name}
                </span>
              ))}
            </div>
          </div>

          <div className="suggested-recipes">
            <h3>Recetas sugeridas ({suggestions.totalFoundRecipes}):</h3>
            {(suggestions.suggestedRecipes || []).length > 0 ? (
              <div className="recipes-grid">
                {(suggestions.suggestedRecipes || []).map(
                  (suggestedRecipe) => (
                    <div
                      key={suggestedRecipe.recipe.id}
                      className="recipe-card"
                      onClick={() => handleRecipeSelect(suggestedRecipe)}
                    >
                      <div className="recipe-info">
                        <h4>{suggestedRecipe.recipe.title}</h4>
                        <p>{suggestedRecipe.recipe.description}</p>

                        <div className="recipe-stats">
                          <div className="match-percentage">
                            <span className="percentage">
                              {Math.round(
                                suggestedRecipe.matchPercentage
                              )}
                              % match
                            </span>
                          </div>

                          {(suggestedRecipe.recipe.preparationTimeMinutes ||
                            suggestedRecipe.recipe.totalTime) && (
                            <div className="preparation-time">
                              <span>
                                🕐{" "}
                                {suggestedRecipe.recipe
                                  .preparationTimeMinutes ||
                                  suggestedRecipe.recipe.totalTime}{" "}
                                min prep
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="ingredients-info">
                          <div className="available-ingredients">
                            <span className="count">
                              ✓{" "}
                              {
                                suggestedRecipe.availableUserIngredientsUsed
                                  .length
                              }{" "}
                              ingredientes disponibles
                            </span>
                          </div>

                          {suggestedRecipe.missingIngredients.length > 0 && (
                            <div className="missing-ingredients">
                              <span className="count">
                                ⚠ {suggestedRecipe.missingIngredients.length}{" "}
                                ingredientes faltantes
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>
                No se encontraron recetas con tus ingredientes actuales. Agrega
                más ingredientes para ver sugerencias.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
