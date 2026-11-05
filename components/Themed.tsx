import type { ComponentProps } from 'react';
/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { 
  Text as DefaultText, 
  View as DefaultView, 
  ScrollView as DefaultScrollView, 
  SafeAreaView as DefaultSafeAreaView, 
  TouchableOpacity as DefaultTouchableOpacity,
  TextInput as DefaultTextInput,
  Pressable as DefaultPressable,
  Modal as DefaultModal,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & ComponentProps<typeof DefaultText>;
export type ViewProps = ThemeProps & ComponentProps<typeof DefaultView>;
export type TouchableOpacityProps = ThemeProps & ComponentProps<typeof DefaultTouchableOpacity>;
export type ScrollViewProps = ThemeProps & ComponentProps<typeof DefaultScrollView>;
export type SafeAreaViewProps = ThemeProps & ComponentProps<typeof DefaultSafeAreaView>;
export type TextInputProps = ThemeProps & ComponentProps<typeof DefaultTextInput>;
export type PressableProps = ThemeProps & ComponentProps<typeof DefaultPressable>;
export type ModalProps = ThemeProps & ComponentProps<typeof DefaultModal>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultText style={[{ color, borderColor }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultView style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}

export function ClearView(props: ViewProps) {
  const { style, ...otherProps } = props;
  return <DefaultView style={[{ backgroundColor: 'transparent' }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultTouchableOpacity style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultScrollView style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultSafeAreaView style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultTextInput style={[{ backgroundColor, borderColor, color }, style]} {...otherProps} />;
}

export function Pressable(props: PressableProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultPressable style={(state) => [{ backgroundColor, borderColor }, typeof style === 'function' ? style(state) : style]} {...otherProps} />;
}

export function Modal(props: ModalProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');

  return <DefaultModal style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}