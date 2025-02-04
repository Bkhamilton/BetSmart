import React from 'react';
import { StyleSheet, SectionList, Image } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { bookieImages } from '@/constants/bookieConstants';

export default function BetSlipList({ betSlips }) {

    const { grayBackground, grayBorder, backgroundColor, redText, greenText } = useTheme();

    // Function to group transactions by month
    const groupBetSlipByMonths = (betslips) => {
        const grouped = betslips.reduce((acc, betslip) => {
            const date = new Date(betslip.date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const monthYear = `${month} ${year}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(betslip);
            return acc;
        }, {});

        return Object.keys(grouped).map((monthYear) => ({
            title: monthYear,
            data: grouped[monthYear],
        }));
    };

    const groupedBetSlips = groupBetSlipByMonths(betSlips);

    const BetSlipComponent = ({ betSlip }) => {
        return (
            <View style={[styles.transactionContainer, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View
                        style={styles.iconContainer}
                    >
                        <Text style={{ fontSize: 32, color: betSlip.result === '1' ? greenText : redText }}>{betSlip.result === '1' ? 'W' : 'L'}</Text>
                    </View>
                    <ClearView style={{ justifyContent: 'center', marginLeft: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 2 }}>{betSlip.formatName}</Text>
                        <Text style={{ fontSize: 16, opacity: 0.7, marginTop: 2 }}>${betSlip.betAmount.toFixed(2)}</Text>
                    </ClearView>
                </ClearView>
                <ClearView style={{ justifyContent: 'center' }}>
                    <View style={[styles.transactionAmount, { backgroundColor: grayBorder, borderColor: grayBorder }]}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>${betSlip.result === '1' ? betSlip.winnings.toFixed(2) : '0.00'}</Text>
                    </View>
                </ClearView>
            </View>
        );
    };

    const OpenBetSlipComponent = ({ betSlip }) => {
        return (
            <View style={[styles.transactionContainer, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={bookieImages[betSlip.bookieName]}
                        style={styles.iconContainer}
                    />
                    <ClearView style={{ justifyContent: 'center', marginLeft: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 2 }}>{betSlip.formatName}</Text>
                        <Text style={{ fontSize: 16, opacity: 0.7, marginTop: 2 }}>{betSlip.odds}</Text>
                    </ClearView>
                </ClearView>
                <ClearView style={{ justifyContent: 'center' }}>
                    <View style={[styles.transactionAmount, { backgroundColor: grayBorder, borderColor: grayBorder }]}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>${betSlip.winnings ? betSlip.winnings.toFixed(2) : '0.00'}</Text>
                    </View>
                </ClearView>
            </View>
        );
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.header}>
            <Text style={[styles.headerText]}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={groupedBetSlips}
                renderItem={({ item }) => (
                    item.result ? <BetSlipComponent betSlip={item} /> : <OpenBetSlipComponent betSlip={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
                renderSectionHeader={renderSectionHeader}
                renderSectionFooter={() => <View style={{ height: 10 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12
    },
    header: {
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
    },
    transactionAmount: {
        borderWidth: 1, 
        borderRadius: 4, 
        padding: 4,
    }
});