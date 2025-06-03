import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error: any) {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 6,
          width: 300,
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: 22, marginBottom: 20 }}>
          Login
        </h2>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {isLoading ? "Cargando..." : "Entrar"}
        </button>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
