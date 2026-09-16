import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../services/auth.api';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}


// Context is used here so that data about the user session can be passed to every component in the
// app, shared as a react state so we don't have to constantly refetch current user
// This is better than threading props.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Authprovider wraps App to track if user is logged in, enables components inside to pull values
// from AuthContext
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On first load, the access-token cookie (if any) tells us whether there's already a session
    useEffect(() => {
        let isMounted = true;

        fetchCurrentUser()
            .then((current) => {
                if (isMounted) setUser(current);
            })
            .catch(() => {
                if (isMounted) setUser(null);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // wrappers to the other wrappers in auth.api.ts to change user session state
    const login = useCallback(async (payload: LoginPayload) => {
        const loggedInUser = await loginUser(payload);
        setUser(loggedInUser);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const newUser = await registerUser(payload);
        setUser(newUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    }, []);

    // useMemo poops out all these values as one object, so components consuming AuthContext don't
    // rerender on every provider render, only when something in 'value' changes
    const value = useMemo(
        () => ({ user, isLoading, login, register, logout }),
        [user, isLoading, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Components use this hook to get the user session values from provider -> context, with a check
// to ensure the hook is called inside the provider component
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
