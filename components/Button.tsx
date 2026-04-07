// File: components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'underline' | 'ghost';
  color?: string;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'filled', color, style }: ButtonProps) {
  const { themeColor, bgMain } = useTheme();

  const activeColor = color || themeColor;

  let containerStyle: ViewStyle = {};
  let textStyle: TextStyle = { color: activeColor };

  if (variant === 'filled') {
    containerStyle = { backgroundColor: activeColor };
    textStyle = { color: bgMain };
  } else if (variant === 'underline') {
    // FIX: Applies a solid line to the bottom of the button container
    containerStyle = { 
      borderBottomWidth: 2, 
      borderBottomColor: activeColor,
      borderRadius: 0 // Ensures crisp terminal corners
    };
    textStyle = { color: activeColor };
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
    minHeight: rem(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rem(1.5),
  },
  baseText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.9),
  }
});