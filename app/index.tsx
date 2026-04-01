// File: app/index.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

// Import your new stable native SVG component
import { Logo } from '../components/Logo';

export default function LandingScreen() {
  const { themeColor, bgMain } = useTheme();
  
  // --- ANIMATION REFS ---
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Terminal Cursor Pulse (500ms blink)
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [cursorOpacity]);

  // --- HANDLERS ---
  async function handleGuestAccess() {
    await AsyncStorage.setItem('isGuest', 'true');
    router.replace('/event_feed');
  }

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      
      {/* Header with Pulsing Terminal Cursor */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: themeColor }]}>Infolines</Text>
          <Animated.Text style={[styles.title, { color: themeColor, opacity: cursorOpacity }]}>
            _
          </Animated.Text>
        </View>
      </View>

      {/* Center Static Logo Assembly */}
      <View style={styles.centerContent}>
        
        {/* Your new bulletproof SVG component */}
        <Logo color={themeColor} size={rem(16)} />
        
        <Text style={[styles.greeting, { color: themeColor, marginTop: rem(1.5) }]}>
          {'>'} Welcome to Infolines
        </Text>
      </View>

      {/* Bottom Actions - Production Sizing Baselines */}
      <View style={styles.actionContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Login" 
            onPress={() => router.push('/login')} 
            variant="filled" 
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Create User" 
            onPress={() => router.push('/create')} 
            variant="underline" 
          />
        </View>
        <View style={styles.spacer} />
        <View style={styles.buttonWrapper}>
          <Button 
            title="Continue As Guest" 
            onPress={handleGuestAccess} 
            variant="ghost" 
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rem(1.5), 
  },
  header: {
    marginTop: rem(5), 
  },
  titleRow: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: rem(1.5), 
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.95), 
    textAlign: 'center',
    lineHeight: rem(1.5), 
  },
  actionContainer: {
    paddingBottom: rem(1), 
  },
  buttonWrapper: {
    marginVertical: rem(0.1),
    minHeight: rem(4), 
  },
  spacer: {
    height: rem(1), 
  }
});