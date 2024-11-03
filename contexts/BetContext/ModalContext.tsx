// app/contexts/BetContext/ModalContext.tsx
import React, { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { DBContext } from '../DBContext';
import { getPlayersByTeamName } from '@/db/general/Players';

interface ModalContextValue {
    playerModal: boolean;
    openPlayerModal: (players: any) => void;
    closePlayerModal: () => void;
    players: any;
    valueModal: boolean;
    openValueModal: (values: any) => void;
    closeValueModal: () => void;
    values: any;
}

export const ModalContext = createContext<ModalContextValue>({
    playerModal: false,
    openPlayerModal: () => {},
    closePlayerModal: () => {},
    players: [],
    valueModal: false,
    openValueModal: () => {},
    closeValueModal: () => {},
    values: []
});

interface ModalContextValueProviderProps {
  children: ReactNode;
}

export const ModalContextProvider = ({ children }: ModalContextValueProviderProps) => {

    const { db } = useContext(DBContext);

    const [playerModal, setPlayerModal] = useState(false);
    const [valueModal, setValueModal] = useState(false);

    const [players, setPlayers] = useState([]);
    const [values, setValues] = useState([]);

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);

    const openPlayerModal = (team) => {
        getPlayersByTeamName(db, team).then((res) => {
            setPlayers(res);
        });
        setPlayerModal(true);
    }

    const closePlayerModal = () => {
        setPlayerModal(false);
    }

    const openValueModal = (values) => {
        setValues(values);
        setValueModal(true);
    }

    const closeValueModal = () => {
        setValueModal(false);
    }

    const selectPlayer = (player) => {
        setSelectedPlayer(player);
        closePlayerModal();
    }

    const selectValue = (value) => {
        setSelectedValue(value);
        closeValueModal();
    }

    const value = {
        playerModal,
        openPlayerModal,
        closePlayerModal,
        players,
        valueModal,
        openValueModal,
        closeValueModal,
        values,
        selectPlayer,
        selectedPlayer,
        selectValue,
        selectedValue
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};
