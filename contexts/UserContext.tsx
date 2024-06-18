// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getMostRecentActiveUserSession } from '@/db/user-specific/UserSessions';
import { getUser, getUserById } from '@/db/user-specific/Users';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalanceByUser } from '@/db/user-specific/Balance';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
}

interface Balance {
    id: number;
    userId: number;
    bookieId: number;
    balance: number;
}

interface UserContextValue {
    user: User | null;
    setUser: (user: User | null) => void;
    userBalance : Balance[] | null;
    setUserBalance : (userBalance : Balance[] | null) => void;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    setUser: () => {},
    userBalance : null,
    setUserBalance : () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userBalance, setUserBalance] = useState<Balance[] | null>(null);

    const db = useSQLiteContext();

    useEffect(() => {
        const fetchUser = async () => {
            const mostRecentActiveUserSession = await getMostRecentActiveUserSession(db);
            if (mostRecentActiveUserSession) {
                getUserById(db, mostRecentActiveUserSession.userId).then((newUser) => {
                    setUser(newUser);
                });
            } else {
                // No active user session, add default values here
                const defaultUser = {
                    id: 0,
                    name: 'Default User',
                    email: 'default@email.com',
                    username: 'defaultUser',
                    password: 'defaultPassword',
                };
                setUser(defaultUser);                
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUserBalance = async () => {
            const mostRecentActiveUserSession = await getMostRecentActiveUserSession(db);
            if (mostRecentActiveUserSession) {
                getBalanceByUser(db, mostRecentActiveUserSession.userId).then((newUserBalance) => {
                    setUserBalance(newUserBalance);
                });
            } else {
                // No active user session, add default values here
                const defaultUserBalance = [{
                    id: 0,
                    userId: 0,
                    bookieId: 0,
                    balance: 0,
                }];
                setUserBalance(defaultUserBalance);                
            }
        }

        fetchUserBalance();
    }, []);

    const value = {
        user,
        setUser,
        userBalance,
        setUserBalance,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};