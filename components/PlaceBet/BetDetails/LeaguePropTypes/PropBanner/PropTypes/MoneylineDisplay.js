import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from '@/components/Themed';
import { MainLineDisplay, LineDisplay } from './ComponentTypes';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getValidBookies } from '@/db/user-specific/Balance';

export default function MoneylineDisplay({ stat, homeTeam, awayTeam, data }) {

    const { user, signedIn } = useContext(UserContext);

    const { db } = useContext(DBContext);

    const [validBookies, setValidBookies] = useState([]);

    useEffect(() => {
        if (!user) return;
        if (signedIn) {
            getValidBookies(db, user.id).then((bookies) => setValidBookies(bookies));
        } else {
            setValidBookies([]);
        }
    }, [user, signedIn]);

    // function to generate 3 digit number with a plus or minus sign in front
    const generateOdds = () => {
        const sign = Math.random() > 0.5 ? '+' : '-';
        const num = Math.floor(Math.random() * 400);
        return `${sign}${num}`;
    }

    return (
        <View style={{ paddingHorizontal: 8 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, alignItems: 'center' }}>{stat.toUpperCase()}</Text>
            </View>
            {validBookies.map((bookie) => {
                const bookieData = data ? data.filter(item => item.bookieId === bookie.bookieId) : Array.from({ length: 1 }, () => ({ homeOdds: generateOdds(), awayOdds: generateOdds() }));

                return bookieData.map((item, index) => (
                    <LineDisplay
                        key={`${bookie.name}-${index}`}
                        type="moneyline"
                        bookie={bookie.name}
                        left={item.away}
                        right={item.home}
                        leftTeam={awayTeam}
                        rightTeam={homeTeam}
                    />
                ));
            })}
        </View>
    )
}