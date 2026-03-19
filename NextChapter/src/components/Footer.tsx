import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

//Footer
const Footer = () => {
    const { token } = useContext(AuthContext);

    return (
        <footer className="footer">
            <div className="footer-content">

                <p className="footer-title">
                    NextStory
                </p>

                <nav className="footer-links">
                    {token ? (
                        <>
                            <NavLink to="/">
                                Hem
                            </NavLink>
                            |
                            <NavLink to="/profile">
                                Profil
                            </NavLink>
                        </>
                    ) : (
                        <NavLink to="/">
                            Hem
                        </NavLink>
                    )}
                </nav>

                <p className="footer-tech">
                    • Byggd med React •
                </p>

                <p className="footer-copy">
                    © {new Date().getFullYear()} Anton Eriksson
                </p>

            </div>
        </footer>
    );
};

export default Footer;
