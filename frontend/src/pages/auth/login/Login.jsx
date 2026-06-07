import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import usePost from "../../../hooks/usePost";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role_id = location.state?.role_id ?? 3;

  const { loading, error, execute } = usePost("/api/auth/login");
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    if (!form.username || !form.password) return;

    const res = await execute({ ...form, role_id });
    if (!res) return;

    localStorage.setItem("user", JSON.stringify({
    id: res.id,
    role_id: res.role_id
  }));

    if (role_id === 1) navigate("/admin");
    if (role_id === 2) navigate("/client");
    if (role_id === 3) navigate("/user");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="auth-btn" onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>

      {error && <p className="auth-error">{error.message || error}</p>}

      <button
        className="auth-link"
        onClick={() => navigate("/register", { state: { role_id } })}
      >
        Register
      </button>
    </div>
  );
}
