import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Något gick fel.");
        return;
      }

      setSuccess("Registrering lyckades! Du kan nu logga in.");
      // Töm formuläret
      setUsername("");
      setEmail("");
      setPassword("");

      // Skicka användaren till login efter 2 sek
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError("Kunde inte nå servern.");
    }
  };

  return (
    <div className="form-container">
      <h2>Skapa användare</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Användarnamn</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Lösenord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrera</button>
      </form>
    </div>
  );
};

export default Register;