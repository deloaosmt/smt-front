import { createContext } from "react";
import type { User } from "../types/user";

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    setAuth: (auth: boolean, user?: User | null) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    setAuth: () => {},
    logout: () => {},
});
