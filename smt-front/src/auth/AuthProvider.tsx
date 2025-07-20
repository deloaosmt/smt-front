import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../api/AuthService";
import type { User } from "../types/user";
import { CircularLoader } from "../components/CircularLoader";
import useNotification from "../notifications/hook";
import { getErrorMessage } from "../common/OnError";

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { notifyError } = useNotification();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        let isMounted = true;
        
        const checkAuth = async () => {
            try {
                // First check if we have any cookies at all
                const hasCookies = authService.getAccessToken() !== null;
                
                if (!hasCookies) {
                    // No cookies, definitely not authenticated
                    if (isMounted) {
                        setIsAuthenticated(false);
                        setUser(null);
                        setIsLoading(false);
                    }
                    return;
                }
                
                // We have cookies, verify they're valid
                const isAuth = await authService.isAuthenticated();
                if (isMounted) {
                    if (isAuth) {
                        try {
                            const userInfo = await authService.getUserInfo();
                            setUser(userInfo.user);
                            setIsAuthenticated(true);
                        } catch (userError) {
                            console.error('❌ AuthProvider: Failed to get user info:', userError);
                            authService.clearToken();
                            setIsAuthenticated(false);
                            setUser(null);
                        }
                    } else {
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('❌ AuthProvider: Authentication check failed:', error);
                if (isMounted) {
                    // Clear invalid token
                    authService.clearToken();
                    setIsAuthenticated(false);
                    setUser(null);
                    
                    // Only show error notification if we're not on the login page
                    if (!window.location.pathname.includes('/login')) {
                        notifyError(getErrorMessage(error));
                    }
                }
            } finally {
                if (isMounted) {
                    console.log('🔍 AuthProvider: Authentication check completed. isAuthenticated:', isAuthenticated);
                    setIsLoading(false);
                }
            }
        };

        checkAuth();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
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
            notifyError(getErrorMessage(error));
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

