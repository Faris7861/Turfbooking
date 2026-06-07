import { useNavigate } from "react-router-dom";
import "./roleSelectPage.css";

const roles = [
  { label: "Admin", id: 1 },
  { label: "Client", id: 2 },
  { label: "User", id: 3 }
];

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="role-select">
      <h2>Select Role</h2>
      <div className="role-buttons">
        {roles.map((r) => (
          <button
            key={r.id}
            className="role-btn"
            onClick={() => navigate("/login", { state: { role_id: r.id } })}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
