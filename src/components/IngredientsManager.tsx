import React, { useState, useEffect } from "react";
import type { Ingredient } from "../types";
import { ingredientsAPI, userIngredientsAPI } from "../services/api";

const IngredientsManager: React.FC = () => {
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allIngredientsData, userIngredientsData] = await Promise.all([
        ingredientsAPI.getAll(),
        userIngredientsAPI.get(),
      ]);

      setAllIngredients(allIngredientsData);
      setUserIngredients(userIngredientsData.availableIngredients);
      setSelectedIngredients(
        userIngredientsData.availableIngredients.map((ing) => ing.id)
      );
    } catch (error: any) {
      setError("Error al cargar ingredientes");
      console.error("Error loading ingredients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleSaveIngredients = async () => {
    try {
      setIsLoading(true);
      await userIngredientsAPI.add(selectedIngredients);

      // Update user ingredients display
      const updatedIngredients = allIngredients.filter((ing) =>
        selectedIngredients.includes(ing.id)
      );
      setUserIngredients(updatedIngredients);
      setError("");
    } catch (error: any) {
      setError("Error al guardar ingredientes");
      console.error("Error saving ingredients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && allIngredients.length === 0) {
    return <div className="loading">Cargando ingredientes...</div>;
  }

  return (
    <div className="ingredients-manager">
      <div className="ingredients-section">
        <h2>Mis Ingredientes Actuales</h2>
        {userIngredients.length > 0 ? (
          <div className="ingredients-grid">
            {userIngredients.map((ingredient) => (
              <div key={ingredient.id} className="ingredient-card selected">
                {ingredient.name}
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes ingredientes seleccionados</p>
        )}
      </div>

      <div className="ingredients-section">
        <h2>Seleccionar Ingredientes</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="ingredients-grid">
          {allIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={`ingredient-card ${
                selectedIngredients.includes(ingredient.id) ? "selected" : ""
              }`}
              onClick={() => handleIngredientToggle(ingredient.id)}
            >
              <input
                type="checkbox"
                checked={selectedIngredients.includes(ingredient.id)}
                onChange={() => handleIngredientToggle(ingredient.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{ingredient.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveIngredients}
          disabled={isLoading}
          className="save-btn"
        >
          {isLoading ? "Guardando..." : "Guardar Ingredientes"}
        </button>
      </div>
    </div>
  );
};

export default IngredientsManager;
