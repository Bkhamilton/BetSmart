// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore"; 

interface FirebaseContextValue {
    cloudDB?: any;
}

interface League {
    id: number;
    leagueName: string;
    sport: string;
    description: string;
}

export const FirebaseContext = createContext<FirebaseContextValue>({
    cloudDB: undefined,
});

interface FirebaseContextValueProviderProps {
  children: ReactNode;
}

export const FirebaseContextProvider = ({ children }: FirebaseContextValueProviderProps) => {
    
    const firebaseConfig = {
        apiKey: "AIzaSyDCb2aaP_MmUsKbwzma1_78i1PgA6Gx-cM",
        authDomain: "hamdev-betsmart.firebaseapp.com",
        projectId: "hamdev-betsmart",
        storageBucket: "hamdev-betsmart.firebasestorage.app",
        messagingSenderId: "993014393856",
        appId: "1:993014393856:web:8b00851721c2587ca2fce5",
        measurementId: "G-6BBZB1FS2E"
    };
      
    const app = initializeApp(firebaseConfig);
    const cloudDB = getFirestore(app);

    const [leagues, setLeagues] = useState<League[]>([]);

    useEffect(() => {
        const leaguesQuery = getDocs(collection(cloudDB, "Leagues"));
        leaguesQuery.then((querySnapshot) => {
            const leaguesData: League[] = [];
            querySnapshot.forEach((doc) => {
                leaguesData.push(doc.data() as League);
            });
            setLeagues(leaguesData.sort((a, b) => a.id - b.id));
        });
    }, [cloudDB]);

    const value = {
        cloudDB,
        leagues,
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};