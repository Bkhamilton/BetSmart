import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HistorySyncContext } from '@/contexts/HistorySyncContext';
import useTheme from '@/hooks/useTheme';

const labels = {
    unavailable: 'History sync unavailable',
    pending: 'History sync pending',
    syncing: 'Syncing history…',
    synced: 'Last history sync completed',
    failed: 'History sync failed',
};

export default function HistorySyncStatus() {
    const { status, retry, hasHistoryWarning, warningStorageUnavailable } = useContext(HistorySyncContext);
    const theme = useTheme();
    return (
        <View style={[styles.container, { borderColor: theme.grayBorder, backgroundColor: theme.grayBackground }]}>
            <View style={styles.message}>
                <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>
                    {labels[status]}
                </Text>
                <Text style={{ color: theme.text }}>
                    Sync includes betting history only. Balances and transactions are not synced.
                </Text>
                {hasHistoryWarning && (
                    <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>
                        Some betting history may be missing historical details, such as game, team, league or sportsbook information.
                    </Text>
                )}
                {warningStorageUnavailable && (
                    <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>
                        History notices could not be saved or loaded on this device.
                    </Text>
                )}
                {status === 'failed' && (
                    <Text style={{ color: theme.text }}>
                        Check your connection and retry. Changes saved on this device are retained.
                    </Text>
                )}
            </View>
            {(status === 'failed' || status === 'pending') && (
                <Pressable accessibilityRole="button" accessibilityLabel="Retry history sync"
                    onPress={retry} style={styles.button}>
                    <Text style={{ color: theme.text, fontWeight: '600' }}>Retry</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 12,
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    message: { flex: 1, paddingVertical: 8 },
    button: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
});
