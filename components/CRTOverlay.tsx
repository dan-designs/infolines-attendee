// File: components/CRTOverlay.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';

export function CRTOverlay() {
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fast, erratic opacity changes to simulate CRT voltage flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.92, duration: 40, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 0.96, duration: 60, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
      ])
    ).start();
  }, [flickerAnim]);

  return (
    // pointerEvents="none" is CRITICAL so users can tap buttons through the overlay!
    <Animated.View style={[styles.overlay, { opacity: flickerAnim }]} pointerEvents="none">
      
      <Svg height="100%" width="100%">
        <Defs>
          {/* This creates a 4x4 pixel box with a dark line at the top, repeating infinitely */}
          <Pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
            <Rect width="4" height="4" fill="transparent" />
            <Line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#scanlines)" />
      </Svg>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    zIndex: 9999, // Forces it to the very top layer
  },
});