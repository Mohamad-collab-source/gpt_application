
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ChatContext } from "./MyContext.jsx";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const { setUser } = useContext(ChatContext);
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const action = isSignup ? "signup" : "login";

      const response = await fetch(
        `${VITE_API_URL}/api/auth/${action}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(isSignup ? { name: name.trim() } : {}),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (!data.user) {
        throw new Error(
          "Authentication succeeded, but the user was not returned by the server."
        );
      }

      setUser(data.user);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1>SigmaGPT</h1>

        <p>
          {isSignup ? "Create your account" : "Welcome back"}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              isSignup ? "new-password" : "current-password"
            }
            minLength={8}
            required
          />

          {error && (
            <p className="authError" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create account"
              : "Log in"}
          </button>
        </form>

        <p>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setIsSignup((previous) => !previous);
            setError("");
          }}
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
