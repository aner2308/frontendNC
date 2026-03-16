import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Form.css";


const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        //Logga in
        try {
            const res = await fetch("https://backendnc.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Något gick fel.");
                return;
            }

            //Lägger till token
            login(data.token);

            //Skickas till startsida vid lyckad inloggning
            navigate("/");
        } catch (err) {
            setError("Kunde inte nå servern.");
        }
    };

    //Utseende på logga in- sidan
    return (
        <div className="form-container">
            <h2>Logga in</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Lösenord</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Logga in</button>
            </form>
        </div>
    );
};

export default Login;