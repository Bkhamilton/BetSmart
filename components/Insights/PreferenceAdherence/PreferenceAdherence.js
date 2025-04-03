import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function PreferenceAdherence() {
    const { greenText, redText, yellowText, grayBorder } = useTheme();
    
    // Dummy data - replace with your actual data
    const adherenceData = {
        budgetDiscipline: 78, // Percentage of days within limits
        unitSizeUsage: {
            S: { preferred: 25, actual: 20 }, // Percentage usage
            M: { preferred: 50, actual: 55 },
            L: { preferred: 25, actual: 25 }
        },
        leagueDistribution: {
            preferred: { NBA: 70, NFL: 10, MLB: 10, NHL: 10 },
            actual: { NBA: 90, NFL: 5, MLB: 5, NHL: 0 }
        },
        dailyLimitCompliance: [
            { day: 'Mon', status: 'good' },
            { day: 'Tue', status: 'good' },
            { day: 'Wed', status: 'over' },
            { day: 'Thu', status: 'good' },
            { day: 'Fri', status: 'over' },
            { day: 'Sat', status: 'warning' },
            { day: 'Sun', status: 'good' }
        ]
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'good': return greenText;
            case 'warning': return yellowText;
            case 'over': return redText;
            default: return grayBorder;
        }
    };

    return (
        <ClearView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Preference Adherence</Text>
            
            <View style={styles.grid}>
                {/* Weekly Compliance Heatmap (larger) */}
                <View style={[styles.gridItem, styles.heatmapContainer]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>Daily Compliance</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.legendColor, { backgroundColor: greenText }]} />
                            <Text style={{ fontSize: 10, marginRight: 10 }}>Good</Text>
                            <View style={[styles.legendColor, { backgroundColor: yellowText }]} />
                            <Text style={{ fontSize: 10, marginRight: 10 }}>Warning</Text>
                            <View style={[styles.legendColor, { backgroundColor: redText }]} />
                            <Text style={{ fontSize: 10, marginRight: 4 }}>Over</Text>
                        </View>
                    </View>
                    <View style={styles.heatmap}>
                        {adherenceData.dailyLimitCompliance.map((day, index) => (
                            <View key={index} style={styles.heatmapDayContainer}>
                                <View 
                                    style={[
                                        styles.heatmapDay,
                                        { backgroundColor: getStatusColor(day.status) }
                                    ]}
                                />
                                <Text style={styles.heatmapDayLabel}>{day.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Budget Discipline Score (smaller) */}
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Budget Discipline</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{adherenceData.budgetDiscipline}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill,
                                { 
                                    width: `${adherenceData.budgetDiscipline}%`,
                                    backgroundColor: adherenceData.budgetDiscipline > 75 ? greenText : 
                                                    adherenceData.budgetDiscipline > 50 ? yellowText : redText
                                }
                            ]}
                        />
                    </View>
                </View>

                {/* Unit Size Analysis (smaller) */}
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Unit Size</Text>
                    {Object.entries(adherenceData.unitSizeUsage).map(([size, data]) => (
                        <View key={size} style={styles.unitSizeRow}>
                            <Text style={styles.unitSizeLabel}>{size}:</Text>
                            <View style={styles.unitSizeBarContainer}>
                                <View style={styles.unitSizeBarBackground}>
                                    <View 
                                        style={[
                                            styles.unitSizeBarActual,
                                            { 
                                                width: `${data.actual}%`,
                                                backgroundColor: Math.abs(data.actual - data.preferred) < 10 ? greenText :
                                                                Math.abs(data.actual - data.preferred) < 20 ? yellowText : redText
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* League Concentration (compact) */}
                <View style={[styles.gridItem, styles.leagueContainer]}>
                    <Text style={styles.sectionTitle}>Leagues</Text>
                    {Object.entries(adherenceData.leagueDistribution.actual).map(([league, percent]) => (
                        <View key={league} style={styles.compactLeagueRow}>
                            <Text style={styles.compactLeagueLabel}>{league}</Text>
                            <View style={styles.compactLeagueBarContainer}>
                                <View style={styles.compactLeagueBarBackground}>
                                    <View 
                                        style={[
                                        styles.compactLeagueBarActual,
                                            { 
                                                width: `${percent}%`,
                                                backgroundColor: Math.abs(percent - adherenceData.leagueDistribution.preferred[league]) < 5 ? greenText :
                                                                Math.abs(percent - adherenceData.leagueDistribution.preferred[league]) < 15 ? yellowText : redText
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.compactLeagueText}>{percent}%</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ClearView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  heatmapContainer: {
    width: '100%',
  },
  leagueContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  heatmap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heatmapDayContainer: {
    alignItems: 'center',
  },
  heatmapDay: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 2,
    opacity: 0.8,
  },
  heatmapDayLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  unitSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unitSizeLabel: {
    width: 24,
    fontSize: 12,
    fontWeight: '500',
  },
  unitSizeBarContainer: {
    flex: 1,
  },
  unitSizeBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  unitSizeBarActual: {
    position: 'absolute',
    height: '100%',
    borderRadius: 5,
    opacity: 0.8,
  },
  compactLeagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactLeagueLabel: {
    width: 32,
    fontSize: 12,
    fontWeight: '500',
  },
  compactLeagueBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactLeagueBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 4,
    position: 'relative',
  },
  compactLeagueBarActual: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
    opacity: 0.8,
  },
  compactLeagueText: {
    fontSize: 10,
    opacity: 0.8,
    width: 30,
    textAlign: 'right',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    opacity: 0.8,
  },
});