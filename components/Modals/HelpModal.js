import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View, Modal } from '@/components/Themed';
import Disclosure from '../Helpers/Disclosure';

export default function HelpModal({ visible, close }) {

    const helpText = [
        {
            title: 'What is BetSmarter?',
            content: 'BetSmarter is a sports betting app that helps you track your bets and analyze your betting history. You can view your betting performance, track your bankroll, and analyze your betting trends.'
        },
        {
            title: 'How do I add a bet?',
            content: 'To get started, first create an account and add a bookie of your choosing, then click the Plus button in the bottom middle of the screen. From there, you can find a game and a market to bet on'
        },
        {
            title: 'How do I add a bookie?',
            content: 'You can add a bookie from the Home screen or the Profile screen by pressing the Add Bookie button. You can add a bookie by entering the bookie name, the bookie website, and the bookie logo.'
        }
    ]

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    {helpText.map((item, index) => (
                        <Disclosure key={index} title={item.title} content={item.content} />
                    ))}
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});