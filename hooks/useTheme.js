import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function useTheme() {
  const colorScheme = useColorScheme();

  return {
    text: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
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
    // Add other color definitions here...
  };
}