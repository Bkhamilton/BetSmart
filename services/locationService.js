import * as Location from 'expo-location';
import { LEGAL_SPORTS_BETTING_STATES } from '../constants/legalStates';

export const verifyLegalLocation = async () => {
    try {
        // 1. Check permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return { isLegal: null, error: 'Permission denied' };
        }

        // 2. Get current position
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        // 3. Reverse geocode to get state
        const geocode = await Location.reverseGeocodeAsync(location.coords);
        if (!geocode || geocode.length === 0) {
            return { isLegal: null, error: 'Could not determine location' };
        }

        const state = geocode[0].region;
        const isLegal = LEGAL_SPORTS_BETTING_STATES.has(state);

        return {
            isLegal,
            state,
            coordinates: location.coords,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Location verification error:', error);
        return { isLegal: null, error: error.message };
    }
};