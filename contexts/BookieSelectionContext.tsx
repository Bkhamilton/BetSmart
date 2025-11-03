// app/contexts/BookieSelectionContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { BookieSelectionContextValue } from '@/constants/types';

export const BookieSelectionContext = createContext<BookieSelectionContextValue>({
    bookie: null,
    setBookie: () => {},
    bookieId: null,
    setBookieId: () => {},
});

interface BookieSelectionContextProviderProps {
    children: ReactNode;
}

export const BookieSelectionContextProvider = ({ children }: BookieSelectionContextProviderProps) => {
    const [bookie, setBookie] = useState<string | null>('DraftKings');
    const [bookieId, setBookieId] = useState<Number | null>(1);

    const value = {
        bookie,
        setBookie,
        bookieId,
        setBookieId,
    };

    return (
        <BookieSelectionContext.Provider value={value}>
            {children}
        </BookieSelectionContext.Provider>
    );
};
