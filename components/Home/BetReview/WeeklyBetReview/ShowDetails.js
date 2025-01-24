import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import StatCounter from './StatCounter';

export default function ShowDetails({ betSlips, betsWon, totalBets, marketTypes }) {

    const { text, greenText, redText } = useTheme();

    // Function to chunk the array into groups of 4
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const chunkedMarketTypes = chunkArray(marketTypes, 4);    

    return (
        <>
            <ClearView style={styles.headerContainer}>
                <Text style={styles.smallText}>Main Info</Text>
                <ClearView style={{ width: 58, alignItems: 'flex-start' }}>
                    <Text style={[styles.smallText, { color: greenText }]}>Show Less</Text>
                </ClearView>
            </ClearView>
            <ClearView style={[styles.spreadContainer, { paddingHorizontal: 12 }]}>
                <ClearView style={[styles.detailsContainer, { flex: 0.3 }]}>
                    <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}> bets</Text>
                </ClearView>
                <ClearView style={[styles.detailsContainer, { marginBottom: 6, marginTop: 20, flex: 0.35, marginLeft: 16 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Bet:</Text>
                    <ClearView>
                        {betSlips.map(bet => (
                            <Text key={bet.id} style={{ fontSize: 18, fontWeight: bet.result === '1' ? '500' : '700', color: bet.result === '1' ? text : redText }}>{`$${bet.betAmount.toFixed(2)}`}</Text>
                        ))}
                    </ClearView>
                </ClearView>
                <ClearView style={[styles.detailsContainer, { marginBottom: 6, marginTop: 20, flex: 0.35, marginLeft: 16 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Won:</Text>
                    <ClearView>
                        {betSlips.map(bet => (
                            <Text key={bet.id} style={{ fontSize: 18, fontWeight: bet.result === '1' ? '700' : '500', color: bet.result === '1' ? greenText : text }}>{`$${bet.winnings.toFixed(2)}`}</Text>
                        ))}
                    </ClearView>
                </ClearView>
            </ClearView>
            <ClearView style={{ paddingHorizontal: 4, paddingTop: 8, opacity: 0.4 }}>
                <Text style={styles.smallText}>Details</Text>
            </ClearView>
            <View style={styles.divider} />
            {chunkedMarketTypes.map((chunk, index) => (
                <ClearView key={index} style={styles.spreadContainer}>
                    {chunk.map((marketType, idx) => (
                        <StatCounter
                            key={idx}
                            title={marketType.marketType}
                            won={marketType.won}
                            total={marketType.total}
                        />
                    ))}
                </ClearView>
            ))}           
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        opacity: 0.4, 
        paddingHorizontal: 4, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingBottom: 2,
    },
    container: {
        paddingVertical: 16,   
        backgroundColor: 'transparent',
        paddingHorizontal: 10,  
      },
      mainInfo: {
        borderWidth: 1,
        paddingTop: 4,
        paddingBottom: 8,
        borderRadius: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
      },
      infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
      },
      detailsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      divider: {
        height: 1,
        marginHorizontal: 4,
        borderTopWidth: 1,
        opacity: 0.2,
        marginBottom: 6,
      },
      spreadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallText: {
        fontSize: 10,
        fontWeight: '500'
      }
});