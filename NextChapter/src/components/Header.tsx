import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css"; // separat CSS-fil

const Header = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <NavLink to="/">NextChapter</NavLink>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>

          {token ? (
            <>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;