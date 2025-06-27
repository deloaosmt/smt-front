import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";


const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setAuth] = useState<boolean>(false);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

