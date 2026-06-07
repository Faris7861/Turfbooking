import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";
import usePost from "../../../hooks/usePost";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const role_id = location.state?.role_id ?? 3;

  const { loading, error, execute } = usePost("/api/auth/register");
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) return;

    const res = await execute({ ...form, role_id });
    if (!res) return;

    navigate("/login", { state: { role_id } });
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="auth-btn" onClick={handleRegister} disabled={loading}>
        {loading ? "Loading..." : "Register"}
      </button>

      {error && <p className="auth-error">{error.message || error}</p>}

      <button className="auth-link" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
