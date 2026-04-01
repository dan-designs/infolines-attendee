// File: app/promoter_list.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

export default function PromoterListScreen() {
  const { themeColor, bgMain } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColor }]}>Promoters_</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBox, { borderColor: themeColor }]}>
            <Text style={[styles.closeText, { color: themeColor }]}>X</Text>
          </TouchableOpacity>
        </View>

        {/* Dummy data to match your design */}
        {['LOSO', 'Party Liberation Foundation', 'Little Giant Society'].map((promoter) => (
          <View key={promoter} style={styles.promoterRow}>
            <Text style={[styles.promoterText, { color: themeColor }]}>{`> ${promoter}`}</Text>
            <View style={styles.actionRow}>
              <View style={[styles.iconBox, { borderColor: themeColor }]} />
              <View style={[styles.iconBox, { borderColor: themeColor }]} />
            </View>
          </View>
        ))}

      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={() => router.back()} variant="filled" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: rem(1.5), paddingBottom: rem(6) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: rem(4), marginBottom: rem(4) },
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.25) },
  closeBox: { borderWidth: rem(0.125), width: rem(2.5), height: rem(2.5), alignItems: 'center', justifyContent: 'center' },
  closeText: { fontFamily: 'PressStart2P', fontSize: rem(1), marginTop: Platform.OS === 'ios' ? rem(0.25) : 0 },
  promoterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: rem(1.5) },
  promoterText: { flex: 1, fontFamily: 'PressStart2P', fontSize: rem(0.625), lineHeight: rem(1) },
  actionRow: { flexDirection: 'row', gap: rem(0.5), marginLeft: rem(1) },
  iconBox: { borderWidth: rem(0.125), width: rem(2), height: rem(2) },
  footer: { position: 'absolute', bottom: rem(2), left: rem(1.5), right: rem(1.5) }
});