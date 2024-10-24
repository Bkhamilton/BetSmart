// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect } from 'react';

interface FirebaseContextValue {

}

export const FirebaseContext = createContext<FirebaseContextValue>({

});

interface FirebaseContextValueProviderProps {
  children: ReactNode;
}

export const FirebaseContextProvider = ({ children }: FirebaseContextValueProviderProps) => {
    

    
    const value = {

    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};