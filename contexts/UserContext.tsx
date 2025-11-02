// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getMostRecentSession } from '@/db/user-specific/UserSessions';
import { getUserById } from '@/db/user-specific/Users';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalanceByUser } from '@/db/user-specific/Balance';
import { getPreferences, insertPreference, clearUserPreferences } from '@/db/user-specific/Preferences';
import { verifyLegalLocation } from '@/services/locationService';
import { 
    User, 
    Balance, 
    Bookie, 
    Preference, 
    DBPreference, 
    LocationStatus, 
    UserContextValue 
} from '@/constants/types';

export const UserContext = createContext<UserContextValue>({
    user: null,
    userBalance : null,
    setUserBalance : () => {},
    bookie: null,
    setBookie: () => {},
    trigger: false,
    setTrigger: () => {},
    preferences: {
        bankroll: 0,
        dailyLimit: 0,
        unitSize: '',
        preferredLeagues: [],
        preferredBetTypes: [],
        riskTolerance: 0,
        oddsFormat: '',
    },
    updatePreferences: async () => {},
    signedIn: false,
    setSignedIn: () => {},
    locationStatus: {
        verified: false,
        isLegal: null,
        state: null,
        lastChecked: null,
        error: null
    },
    checkLocation: async () => {
        return {
            isLegal: null,
            state: null,
            coordinates: undefined,
            timestamp: null,
            error: null
        };
    },
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

    const [preferences, setPreferences] = useState<Preference>({
        bankroll: 0,
        dailyLimit: 0,
        unitSize: '',
        preferredLeagues: [],
        preferredBetTypes: [],
        riskTolerance: 0,
        oddsFormat: '',
    });
    const [triggerPreferences, setTriggerPreferences] = useState<boolean>(false);

    const [signedIn, setSignedIn] = useState<boolean>(false);

    const db = useSQLiteContext();

    const [locationStatus, setLocationStatus] = useState<LocationStatus>({
        verified: false,
        isLegal: null,
        state: null,
        lastChecked: null,
        error: null
    });
    
    const checkLocation = async () => {
        const result = await verifyLegalLocation();
        setLocationStatus({
            verified: true,
            isLegal: result.isLegal,
            state: result.state,
            lastChecked: result.timestamp,
            error: result.error
        });
        return result;
    };

    useEffect(() => {
        const checkLocationStatus = async () => {
            const result = await checkLocation();
            setLocationStatus({
                verified: true,
                isLegal: result.isLegal ?? null,
                state: result.state ?? null,
                lastChecked: result.timestamp ?? null,
                error: result.error ?? null,
            });
        };
        checkLocationStatus();
    }, []);
    

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
                        setBookie({ id: 0, name: 'Total' });
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

    const updatePreferences = async (preferences: Preference) => {
        try {
            // Ensure user is signed in
            if (!signedIn || !user) {
                throw new Error('User is not signed in or user data is not available');
            }
            // Ensure all values are defined
            const {
                bankroll = 0,
                dailyLimit = 0,
                unitSize = '',
                preferredLeagues = [],
                preferredBetTypes = [],
                riskTolerance = 0,
                oddsFormat = ''
            } = preferences;
    
            // Clear user preferences
            await clearUserPreferences(db, user.id);
    
            // Insert preferences
            await insertPreference(db, user.id, 'bankroll', bankroll);
            await insertPreference(db, user.id, 'dailyLimit', dailyLimit);
            await insertPreference(db, user.id, 'unitSize', unitSize);
            await insertPreference(db, user.id, 'preferredLeagues', preferredLeagues.filter(league => league !== '').join(','));
            await insertPreference(db, user.id, 'preferredBetTypes', preferredBetTypes.filter(betType => betType !== '').join(','));
            await insertPreference(db, user.id, 'riskTolerance', riskTolerance);
            await insertPreference(db, user.id, 'oddsFormat', oddsFormat);

            setTriggerPreferences(!trigger);
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    useEffect(() => {
        if (signedIn && user) {
            getPreferences(db, user.id)
                .then((result) => {
                    if (result) {
                        const preferences = result as DBPreference;
                        setPreferences({
                            bankroll: preferences.bankroll,
                            dailyLimit: preferences.dailyLimit,
                            unitSize: preferences.unitSize,
                            preferredLeagues: preferences.preferredLeagues.split(','),
                            preferredBetTypes: preferences.preferredBetTypes.split(','),
                            riskTolerance: preferences.riskTolerance,
                            oddsFormat: preferences.oddsFormat,
                        });
                    }
                });
        }
    }, [signedIn, triggerPreferences]);

    // useEffect to fetch user balance data on trigger change
    useEffect(() => {
        if (trigger && signedIn && user) {
            getBalanceByUser(db, user.id).then((newUserBalance) => {
                setUserBalance(newUserBalance);
                setTrigger(prev => !prev);
            });
        }
    }, [trigger, signedIn]);

    const value = {
        user,
        userBalance,
        setUserBalance,
        bookie,
        setBookie,
        trigger,
        setTrigger,
        preferences,
        updatePreferences,
        signedIn,
        setSignedIn,
        locationStatus,
        checkLocation,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};