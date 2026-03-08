import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    //Sparar token i localstorage vid inloggning
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    //Tar bort token i localstorage vid utloggning
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    //Gör user, login och logout tillgängliga globalt i hela appen
    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};