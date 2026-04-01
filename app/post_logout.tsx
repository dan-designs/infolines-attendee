// File: app/post_logout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

export default function PostLogoutScreen() {
  const { themeColor, bgMain } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColor }]}>Infolines_</Text>
      </View>

      <View style={styles.centerContent}>
        {/* Placeholder for Tombstone SVG */}
        <View style={[styles.tombstone, { backgroundColor: themeColor }]} />
        <Text style={[styles.greeting, { color: themeColor }]}>
          {'>'} Goodbye for now, Dan
        </Text>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Back to Login" 
          onPress={() => router.replace('/login')} 
          variant="filled" 
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: rem(1.5) },
  header: { marginTop: rem(4) },
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tombstone: { width: rem(8), height: rem(10), marginBottom: rem(2) },
  greeting: { fontFamily: 'PressStart2P', fontSize: rem(0.75), textAlign: 'center' },
  footer: { paddingBottom: rem(3) }
});