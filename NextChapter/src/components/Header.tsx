import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

//Header-sektion med navigation
const Header = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav-container">

        {/* Logo och Logga ut ligger på rad över menyn*/}
        <div className="top-row">
          <div className="logo">
            <NavLink to="/"><span>Next</span>Chapter</NavLink>
          </div>

          {token && (
            <button className="logout-btn" onClick={logout}>
              Logga ut
            </button>
          )}
        </div>

        {/*Navigationsmenyn*/}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Hem
            </NavLink>
          </li>

          {/* Olika länkar beroende på om man är inloggad eller inte*/}
          {token ? (
            <li>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                Profil
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                  Logga in
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
                  Registrera
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