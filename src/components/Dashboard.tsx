import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RecipeSuggestions from "./RecipeSuggestions";
import IngredientsManager from "./IngredientsManager";
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ingredients" | "recipes">(
    "ingredients"
  );
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>App de Recetas</h1>
          <div className="user-info">
            <span>Hola, {user?.name}</span>
            <button onClick={logout} className="logout-btn">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "ingredients" ? "active" : ""}`}
            onClick={() => setActiveTab("ingredients")}
          >
            Mis Ingredientes
          </button>
          <button
            className={`nav-btn ${activeTab === "recipes" ? "active" : ""}`}
            onClick={() => setActiveTab("recipes")}
          >
            Buscar Recetas
          </button>
        </nav>

        <main className="dashboard-main">
          {activeTab === "ingredients" && <IngredientsManager />}
          {activeTab === "recipes" && <RecipeSuggestions />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
