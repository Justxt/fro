import React, { useState, useEffect } from "react";
import type {
  SuggestedRecipe,
  RecipeInstructions,
  EditRecipeRequest,
} from "../types";
import { recipesAPI } from "../services/api";

interface RecipeDetailProps {
  suggestedRecipe: SuggestedRecipe;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  suggestedRecipe,
  onBack,
}) => {
  const [instructions, setInstructions] = useState<RecipeInstructions | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditRecipeRequest>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadInstructions();
  }, [suggestedRecipe.recipe.id]);

  const loadInstructions = async () => {
    try {
      setIsLoading(true);
      const data = await recipesAPI.getInstructions(suggestedRecipe.recipe.id);
      setInstructions(data);
    } catch (error: any) {
      setError("Error al cargar instrucciones de la receta");
      console.error("Error loading recipe instructions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      title: suggestedRecipe.recipe.title,
      description: suggestedRecipe.recipe.description,
      steps: instructions?.instructions || [],
      difficulty: suggestedRecipe.recipe.difficulty,
    });
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      await recipesAPI.editRecipe(suggestedRecipe.recipe.id, editForm);
      setIsEditing(false);
      setError("");
      await loadInstructions();
    } catch (error: any) {
      setError("Error al guardar cambios de la receta");
      console.error("Error editing recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleFormChange = (field: keyof EditRecipeRequest, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleInstructionChange = (index: number, value: string) => {
    const updatedSteps = [...(editForm.steps || [])];
    updatedSteps[index] = value;
    handleFormChange("steps", updatedSteps);
  };

  const addInstruction = () => {
    const updatedSteps = [...(editForm.steps || []), ""];
    handleFormChange("steps", updatedSteps);
  };

  const removeInstruction = (index: number) => {
    const updatedSteps = (editForm.steps || []).filter(
      (_: string, i: number) => i !== index
    );
    handleFormChange("steps", updatedSteps);
  };

  if (isLoading && !instructions) {
    return <div className="loading">Cargando detalles de la receta...</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <button onClick={onBack} className="back-btn">
          ← Volver a sugerencias
        </button>
        <div className="recipe-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn">
              Editar Receta
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="save-btn"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={handleCancelEdit} className="cancel-btn">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recipe-content">
        {!isEditing ? (
          <>
            <div className="recipe-info">
              <h1>{suggestedRecipe.recipe.title}</h1>
              <p className="description">
                {suggestedRecipe.recipe.description}
              </p>

              <div className="recipe-stats">
                <span className="match-percentage">
                  {Math.round(suggestedRecipe.matchPercentage)}% compatibilidad
                </span>
                {suggestedRecipe.recipe.difficulty && (
                  <span className="difficulty">
                    🔥 {suggestedRecipe.recipe.difficulty}
                  </span>
                )}
              </div>
            </div>

            <div className="ingredients-section">
              <h3>Ingredientes</h3>
              <div className="ingredients-lists">
                <div className="available-ingredients">
                  <h4>✓ Tienes disponibles:</h4>
                  <ul>
                    {suggestedRecipe.availableUserIngredientsUsed.map(
                      (ingredientName, index) => (
                        <li key={index} className="available">
                          {ingredientName}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {suggestedRecipe.missingIngredients.length > 0 && (
                  <div className="missing-ingredients">
                    <h4>⚠ Te faltan:</h4>
                    <ul>
                      {suggestedRecipe.missingIngredients.map(
                        (ingredient, index) => (
                          <li key={index} className="missing">
                            {ingredient.name} ({ingredient.quantity}{" "}
                            {ingredient.unit})
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {instructions && (
              <div className="instructions-section">
                <h3>Instrucciones</h3>
                <ol className="instructions-list">
                  {instructions.instructions.map((instruction, index) => (
                    <li key={index} className="instruction-step">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        ) : (
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                value={editForm.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={editForm.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Dificultad</label>
              <select
                id="difficulty"
                value={editForm.difficulty || ""}
                onChange={(e) => handleFormChange("difficulty", e.target.value)}
              >
                <option value="">Seleccionar dificultad</option>
                <option value="Fácil">Fácil</option>
                <option value="Medio">Medio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <div className="instructions-header">
                <label>Instrucciones</label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="add-instruction-btn"
                >
                  + Agregar paso
                </button>
              </div>
              {(editForm.steps || []).map((instruction, index) => (
                <div key={index} className="instruction-input">
                  <span className="step-number">{index + 1}.</span>
                  <textarea
                    value={instruction}
                    onChange={(e) =>
                      handleInstructionChange(index, e.target.value)
                    }
                    placeholder={`Paso ${index + 1}`}
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="remove-instruction-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
