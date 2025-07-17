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
            console.log('🔍 AuthProvider: Starting authentication check...');
            try {
                const hasCookies = authService.isAuthenticated();
                if (hasCookies) {
                    const userInfo = await authService.getUserInfo();
                    setUser(userInfo.user);
                    setIsAuthenticated(true);
                } else {
                    console.log('🔍 AuthProvider: No cookies found');
                }
            } catch (error) {
                console.error('❌ AuthProvider: Auth check failed:', error);
                // Clear invalid token
                authService.clearToken();
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                console.log('🔍 AuthProvider: Authentication check completed. isAuthenticated:', isAuthenticated);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const setAuth = (auth: boolean, userData?: User | null) => {
        console.log('🔍 AuthProvider: setAuth called with:', { auth, userData });
        setIsAuthenticated(auth);
        setUser(userData || null);
    };

    const logout = async () => {
        console.log('🔍 AuthProvider: Logout called');
        try {
            await authService.logout();
        } catch (error) {
            console.error('❌ AuthProvider: Logout error:', error);
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

