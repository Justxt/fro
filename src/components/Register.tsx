import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dietary_restrictions: [] as string[],
    cooking_level: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const cookingLevels = [
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
  ];

  const dietaryOptions = [
    "Vegetariano",
    "Vegano",
    "Sin gluten",
    "Sin lactosa",
    "Keto",
    "Paleo",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDietaryChange = (option: string) => {
    const updated = formData.dietary_restrictions.includes(option)
      ? formData.dietary_restrictions.filter((item) => item !== option)
      : [...formData.dietary_restrictions, option];

    setFormData({
      ...formData,
      dietary_restrictions: updated,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cooking_level">Nivel de cocina</label>
            <select
              id="cooking_level"
              name="cooking_level"
              value={formData.cooking_level}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Selecciona tu nivel</option>
              {cookingLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Restricciones alimentarias (opcional)</label>
            <div className="checkbox-group">
              {dietaryOptions.map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.dietary_restrictions.includes(option)}
                    onChange={() => handleDietaryChange(option)}
                    disabled={isLoading}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? "Cargando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
