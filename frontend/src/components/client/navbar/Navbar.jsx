import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navbar.css";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [pathname]); // re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", {
        state : {role_id: 2}
    });
  };

  const navItems = [
    { path: "/client", label: "Home" },
    { path: "/myturf", label: "Myturf" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">TurfBook</div>

      <ul className="navbar-links">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}

        <li className="logout-btn" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
