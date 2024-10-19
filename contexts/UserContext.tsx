// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getMostRecentActiveUserSession, getMostRecentSession } from '@/db/user-specific/UserSessions';
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
    bookieName: string;
}

interface Bookie {
    id: number;
    name: string;
}

interface UserContextValue {
    user: User | null;
    setUser: (user: User | null) => void;
    userBalance : Balance[] | null;
    setUserBalance : (userBalance : Balance[] | null) => void;
    bookie: Bookie | null;
    setBookie: (bookie: Bookie | null) => void;
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    setUser: () => {},
    userBalance : null,
    setUserBalance : () => {},
    bookie: null,
    setBookie: () => {},
    trigger: false,
    setTrigger: () => {},
    signedIn: false,
    setSignedIn: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userBalance, setUserBalance] = useState<Balance[] | null>(null);
    const [bookie, setBookie] = useState<Bookie | null>({ id: 0, name: 'Default' });

    const [trigger, setTrigger] = useState<boolean>(false);
    const [fetchBalance, setFetchBalance] = useState<boolean>(false);

    const [signedIn, setSignedIn] = useState<boolean>(false);

    const db = useSQLiteContext();

    useEffect(() => {
        const fetchUserData = async () => {
            const mostRecentActiveUserSession = await getMostRecentSession(db);
            if (mostRecentActiveUserSession) {
                getUserById(db, mostRecentActiveUserSession.userId).then((newUser) => {
                    setUser(newUser)
                    getBalanceByUser(db, newUser.id).then((newUserBalance) => {
                        setUserBalance(newUserBalance);
                        setFetchBalance(true);
                        setSignedIn(true);
                    });
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
                const defaultUserBalance = {
                    id: 0,
                    userId: 0,
                    bookieId: 0,
                    balance: 0,
                    bookieName: 'Default',
                };
                setUser(defaultUser);
                setUserBalance([defaultUserBalance]);                
            }
        };

        fetchUserData();
    }, [signedIn]);

    useEffect(() => {
        if (fetchBalance) {
            const fetchBookie = async () => {
                const mostRecentActiveUserSession = await getMostRecentSession(db);
                if (mostRecentActiveUserSession) {
                    getBalanceByUser(db, mostRecentActiveUserSession.userId).then((newUserBalance) => {
                        setBookie({ id: newUserBalance[0].bookieId, name: newUserBalance[0].bookieName });
                    });
                } else {
                    // No active user session, add default values here
                    const defaultBookie = {
                        id: 0,
                        name: 'Default Bookie',
                    };
                    setBookie(defaultBookie);
                }
            }
    
            fetchBookie();
        }

    }, [fetchBalance]);

    const value = {
        user,
        setUser,
        userBalance,
        setUserBalance,
        bookie,
        setBookie,
        trigger,
        setTrigger,
        signedIn,
        setSignedIn,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};