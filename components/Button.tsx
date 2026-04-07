// File: components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'underline' | 'ghost';
  color?: string; // Optional override color
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'filled', color, style }: ButtonProps) {
  const { themeColor, bgMain } = useTheme();

  // Core Logic: If a specific color is passed, use it. Otherwise, default to the user's theme.
  const activeColor = color || themeColor;

  let containerStyle: ViewStyle = {};
  let textStyle: TextStyle = { color: activeColor };

  if (variant === 'filled') {
    containerStyle = { backgroundColor: activeColor };
    textStyle = { color: bgMain }; // Text becomes background color to pop out
  } else if (variant === 'underline') {
    textStyle = { color: activeColor, textDecorationLine: 'underline' };
  } else if (variant === 'ghost') {
    textStyle = { color: activeColor };
  }

  return (
    <TouchableOpacity 
      style={[styles.baseButton, containerStyle, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.baseText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    minHeight: rem(3.5), // Guarantees Apple's minimum hit area
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rem(1.5),
  },
  baseText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.9),
  }
});