import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState<any>(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    //Sparar token och användare i localstorage vid inloggning
    const login = (newToken: string, userData: any) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);
    };

    //Tar bort token och anvädare från localstorage vid utloggning
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    //Gör user, login och logout tillgängliga globalt i hela appen
    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 