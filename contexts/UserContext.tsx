// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
}

interface UserContextValue {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    setUser: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const value = {
        user,
        setUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};