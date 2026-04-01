// File: app/event_feed.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';
import { Image } from 'expo-image'; // Will use this for the user icon

export default function EventFeedScreen() {
  const { themeColor, bgMain } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColor }]}>Infolines_</Text>
        <TouchableOpacity onPress={() => router.push('/user_management')} style={[styles.profileBox, { borderColor: themeColor }]}>
          {/* Placeholder for User Icon */}
          <View style={[styles.iconPlaceholder, { backgroundColor: themeColor }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.feed}>
        <Text style={[styles.greeting, { color: themeColor }]}>{'> Wake Up, Dan_D!'}</Text>
        <Text style={[styles.subText, { color: themeColor }]}>{'> Loading Transmissions...'}</Text>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: rem(4), paddingHorizontal: rem(1.5), paddingBottom: rem(2) },
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.25) },
  profileBox: { borderWidth: rem(0.125), width: rem(2.5), height: rem(2.5), alignItems: 'center', justifyContent: 'center', padding: rem(0.25) },
  iconPlaceholder: { width: '100%', height: '100%' },
  feed: { paddingHorizontal: rem(1.5), paddingTop: rem(2) },
  greeting: { fontFamily: 'PressStart2P', fontSize: rem(0.75), marginBottom: rem(1.5), lineHeight: rem(1.5) },
  subText: { fontFamily: 'PressStart2P', fontSize: rem(0.75), lineHeight: rem(1.5) },
});