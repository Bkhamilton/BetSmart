import React, { createContext, useContext, useEffect, useRef } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, ScrollView, View,
  type TextInput as NativeTextInput, type ScrollViewProps,
} from 'react-native';
import { TextInput, useThemeColor, type TextInputProps } from '@/components/Themed';

const FocusContext = createContext<(input: NativeTextInput | null) => void>(() => {});
const FIELD_MARGIN = 16;

// Android uses its resized activity/modal window; iOS needs a keyboard-aware
// viewport. Measure the actual viewport instead of assuming a keyboard height.
export function SignupKeyboardScroll({ children, style, ...props }: ScrollViewProps) {
  const scroll = useRef<ScrollView>(null);
  const viewport = useRef<View>(null);
  const focused = useRef<NativeTextInput | null>(null);
  const offset = useRef(0);
  const frame = useRef<number | null>(null);
  const backgroundColor = useThemeColor({}, 'background');

  const reveal = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const input = focused.current;
      if (!input || !input.isFocused()) return;
      viewport.current?.measureInWindow((_x, top, _width, height) => {
        input.measureInWindow((_inputX, y, _inputWidth, inputHeight) => {
          if (focused.current !== input || !input.isFocused() || height <= 0 || inputHeight <= 0) return;
          const bottom = Math.min(top + height, Keyboard.metrics()?.screenY ?? Infinity);
          if (bottom <= top) return;
          const delta = y + inputHeight + FIELD_MARGIN > bottom
            ? y + inputHeight + FIELD_MARGIN - bottom
            : y < top + FIELD_MARGIN ? y - top - FIELD_MARGIN : 0;
          if (Math.abs(delta) > 1) {
            scroll.current?.scrollTo({ y: Math.max(0, offset.current + delta), animated: true });
          }
        });
      });
    });
  };

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', reveal),
      Keyboard.addListener('keyboardDidHide', reveal),
      ...(Platform.OS === 'ios' ? [Keyboard.addListener('keyboardDidChangeFrame', reveal)] : []),
    ];
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View ref={viewport} collapsable={false} style={{ flex: 1 }} onLayout={reveal}>
        <FocusContext.Provider value={input => {
          focused.current = input;
          if (Platform.OS !== 'web') reveal();
        }}>
          <ScrollView
            {...props}
            ref={scroll}
            style={[{ backgroundColor, flex: 1 }, style]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            automaticallyAdjustKeyboardInsets={false}
            scrollEventThrottle={16}
            onScroll={event => {
              offset.current = event.nativeEvent.contentOffset.y;
              props.onScroll?.(event);
            }}
          >
            {children}
          </ScrollView>
        </FocusContext.Provider>
      </View>
    </KeyboardAvoidingView>
  );
}

export function SignupInput({ onFocus, ...props }: TextInputProps) {
  const input = useRef<NativeTextInput>(null);
  const focus = useContext(FocusContext);
  return <TextInput {...props} ref={input} onFocus={event => {
    focus(input.current);
    onFocus?.(event);
  }} />;
}
