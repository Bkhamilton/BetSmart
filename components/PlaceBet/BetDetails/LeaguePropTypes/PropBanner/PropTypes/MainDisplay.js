import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from '@/components/Themed';
import { MainLineDisplay } from './ComponentTypes';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getBookieNamesWithBalance } from '@/db/user-specific/Balance';

export default function MainDisplay({ stat, homeTeam, awayTeam }) {

    const { user, signedIn } = useContext(UserContext);

    const { db } = useContext(DBContext);

    const [bookieNames, setBookieNames] = useState([]);

    useEffect(() => {
        if (!user) return;
        if (signedIn) {
            getBookieNamesWithBalance(db, user.id).then((names) => setBookieNames(names));
        } else {
            setBookieNames([]);
        }
    }, [user, signedIn]);

    // function to generate 3 digit number with a plus or minus sign in front
    const generateOdds = () => {
        const sign = Math.random() > 0.5 ? '+' : '-';
        const num = Math.floor(Math.random() * 1000);
        return `${sign}${num}`;
    }

    return (
        <View style={{ paddingHorizontal: 8 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, alignItems: 'center' }}>{stat.toUpperCase()}</Text>
            </View>
            {bookieNames.map((bookie) => (
                <MainLineDisplay 
                    key={bookie}
                    stat={stat}
                    bookie={bookie}
                    odds1={generateOdds()}
                    odds2={generateOdds()}
                    homeTeam={homeTeam} 
                    awayTeam={awayTeam} 
                />
            ))}
        </View>
    )
}