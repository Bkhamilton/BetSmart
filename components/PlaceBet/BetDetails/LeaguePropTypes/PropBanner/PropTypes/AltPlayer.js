import React from 'react';
import { View } from '@/components/Themed';
import { AltPlayerComponent } from './ComponentTypes';

export default function AltPlayer({ player, logo, stat }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <AltPlayerComponent player={player} logo={logo} number={4} stat={stat} odds={'-2500'} />
            <AltPlayerComponent player={player} logo={logo} number={5} stat={stat} odds={'-620'} />
            <AltPlayerComponent player={player} logo={logo} number={6} stat={stat} odds={'-260'} />
            <AltPlayerComponent player={player} logo={logo} number={7} stat={stat} odds={'-120'} />
            <AltPlayerComponent player={player} logo={logo} number={8} stat={stat} odds={'+176'} />
        </View>
    )
}