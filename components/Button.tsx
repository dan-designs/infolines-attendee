// File: components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'underline' | 'ghost';
}

export const Button = ({ title, onPress, variant = 'filled' }: ButtonProps) => {
  const { themeColor } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.baseButton,
        variant === 'filled' && { backgroundColor: themeColor },
        variant === 'underline' && { borderBottomWidth: rem(0.125), borderBottomColor: themeColor },
        variant === 'ghost' && { backgroundColor: 'transparent' }
      ]}
    >
      <Text style={[
        styles.text,
        variant === 'filled' ? { color: '#000000' } : { color: themeColor }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: rem(1.25),
    paddingHorizontal: rem(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: rem(0.5),
    width: '100%',
  },
  text: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.85),
    textTransform: 'capitalize',
  }
});