import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../api/AuthService";
import type { User } from "../types/user";
import { CircularLoader } from "../components/CircularLoader";

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userInfo = await authService.getUserInfo();
                    setUser(userInfo.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Clear invalid token
                authService.clearToken();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const setAuth = (auth: boolean, userData?: User | null) => {
        setIsAuthenticated(auth);
        setUser(userData || null);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuth(false, null);
        }
    };

    if (isLoading) {
        return <CircularLoader/>
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

