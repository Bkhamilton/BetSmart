import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getPreferences, insertPreference, clearUserPreferences } from '@/db/user-specific/Preferences';

const useHookBetPreferences = () => {

    const { user, signedIn } = useContext(UserContext);
    const { db } = useContext(DBContext);

    const [preferences, setPreferences] = useState({
        bankroll: 0,
        dailyLimit: 0,
        unitSize: '',
        preferredLeagues: [],
        preferredBetTypes: [],
        riskTolerance: 0,
        oddsFormat: '',
    });

    const updatePreferences = async (preferences) => {
        try {
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
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    useEffect(() => {
        if (signedIn) {
            getPreferences(db, user.id)
                .then((result) => {
                    if (result) {
                        const preferences = result;
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
    }, [signedIn]);

    return {
        preferences,
        setPreferences,
        updatePreferences,
    };
};

export default useHookBetPreferences;