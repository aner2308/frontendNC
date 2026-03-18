

//Footer
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                <p className="footer-title">
                    NextStory
                </p>

                <nav className="footer-links">
                    <a href="/">Hem</a>
                    |
                    <a href="/profile">Profil</a>
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
