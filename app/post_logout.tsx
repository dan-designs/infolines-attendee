// File: app/post_logout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { DownloadIcon } from '../components/Icons'; 
import { rem } from '../utils/sizing';

export default function PostLogoutScreen() {
  const { themeColor, bgMain } = useTheme();
  const [username, setUsername] = useState('User');

  // --- 1. HEADER BLINK ANIMATION (Matching Index) ---
  const cursorLow = 0.2;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fetch the last known username for a personalized goodbye
    const getSavedName = async () => {
      const savedName = await AsyncStorage.getItem('last_username');
      if (savedName) setUsername(savedName);
    };
    getSavedName();

    // Start Cursor Blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: cursorLow, duration: 500, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.linear }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      
      {/* --- CENTER LOGO SECTION --- */}
      <View style={styles.centerContent}>
        {/* Replacement Icon: DownloadIcon */}
        <DownloadIcon color={themeColor} size={rem(16)} />
        
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: themeColor }]}>Infolines</Text>
          <Animated.Text style={[styles.titleText, { color: themeColor, opacity: blinkAnim }]}>
            _
          </Animated.Text>
        </View>

        {/* Dynamic Goodbye Message - Matched to Index Welcome size */}
        <Text style={[styles.welcomeText, { color: themeColor }]}>
          {`> Goodbye For Now`}
        </Text>
      </View>

      {/* --- BOTTOM ACTION SECTION --- */}
      <View style={styles.footer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Return to Terminal" 
            onPress={() => router.replace('/')} 
            variant="filled" 
          />
        </View>
        <View style={[, { backgroundColor: themeColor }]} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: rem(2),
    marginBottom: rem(1),
  },
  titleText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(1.5),
  },
  welcomeText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.9), // Matched to the "Welcome" line on index
    marginTop: rem(1),
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingHorizontal: rem(1.5),
    paddingBottom: rem(2),
  },
  buttonWrapper: {
    marginBottom: rem(1),
    minHeight: rem(4),
  },
  bottomLine: {
    height: 2,
    width: '100%',
    marginTop: rem(0.5),
  },
});