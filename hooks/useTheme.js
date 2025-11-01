import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function useTheme() {
    const colorScheme = useColorScheme();

    const themeColors = {
        tint: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint,
        text: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        tabBar: colorScheme === 'dark' ? Colors.dark.tabBar : Colors.light.tabBar,
        grayText: colorScheme === 'dark' ? '#dedede' : '#1f1f1f',
        borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
        iconColor: colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon,
        backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        mainGreen: colorScheme === 'dark' ? Colors.dark.mainGreen : Colors.light.mainGreen,
        accentGreen: colorScheme === 'dark' ? Colors.dark.accentGreen : Colors.light.accentGreen,
        mainBlue: colorScheme === 'dark' ? Colors.dark.mainBlue : Colors.light.mainBlue,
        accentBlue: colorScheme === 'dark' ? Colors.dark.accentBlue : Colors.light.accentBlue,
        greenText: colorScheme === 'dark' ? Colors.dark.greenText : Colors.light.greenText,
        grayBackground: colorScheme === 'dark' ? Colors.dark.grayBackground : Colors.light.grayBackground,
        grayBorder: colorScheme === 'dark' ? Colors.dark.grayBorder : Colors.light.grayBorder,
        redText: colorScheme === 'dark' ? Colors.dark.redText : Colors.light.redText,
        betMGM: colorScheme === 'dark' ? Colors.dark.betMGM : Colors.light.betMGM,
        caesars: colorScheme === 'dark' ? Colors.dark.caesars : Colors.light.caesars,
        pointsbet: colorScheme === 'dark' ? Colors.dark.pointsbet : Colors.light.pointsbet,
        barstool: colorScheme === 'dark' ? Colors.dark.barstool : Colors.light.barstool,
        yellowText: colorScheme === 'dark' ? Colors.dark.yellowText : Colors.light.yellowText,
        buttonGreen: colorScheme === 'dark' ? Colors.dark.buttonGreen : Colors.light.buttonGreen,
        // Add other color definitions here...
    }

    const bookieColors = {
        'DraftKings': themeColors.mainGreen,
        'FanDuel': themeColors.mainBlue,
        'BetMGM': themeColors.betMGM,
        'Caesars': themeColors.caesars,
        'PointsBet': themeColors.pointsbet,
        'Barstool': themeColors.barstool,
        'Total': themeColors.mainGreen,
        'Default' : themeColors.mainGreen,
    };

    const bookieBorderColors = {
        'DraftKings': themeColors.accentGreen,
        'FanDuel': themeColors.accentBlue,
        'BetMGM': themeColors.betMGM,
        'Caesars': themeColors.caesars,
        'PointsBet': themeColors.pointsbet,
        'Barstool': themeColors.barstool,
        'Total': themeColors.mainGreen,
        'Default' : themeColors.accentGreen,
    };

    return {
        ...themeColors,
        bookieColors,
        bookieBorderColors,
    };
}