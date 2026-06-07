import { useNavigate } from "react-router-dom";
import "./header.css";

const  Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Find and Book Football Turfs</h1>
        <p className="header-subtitle">
          Discover nearby turfs, check availability, and secure your slot.
        </p>
        <button
          className="header-btn"
          onClick={() => navigate("/turfs")}
        >
          Search Turfs
        </button>
      </div>
    </header>
  );
}

export default Header;
