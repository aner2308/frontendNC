const API_URL = "http://localhost:5000/api";

//Logga in användafre
export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    return res.json();
};


//Hämta bokstatistik
export const getReadingStats = async (token: string) => {
    const res = await fetch(`${API_URL}/books/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.json();
};