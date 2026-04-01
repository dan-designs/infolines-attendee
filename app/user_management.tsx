// File: app/user_management.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

export default function UserManagementScreen() {
  const { themeColor, bgMain, setThemeColor } = useTheme();

  // Temporary list of colors for the UI mock
  const colors = ['#FF4C4C', '#FF9900', '#FFFF00', '#24FF00', '#3366FF', '#CC00FF', '#FF00CC'];

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColor }]}>Config...</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBox, { borderColor: themeColor }]}>
            <Text style={[styles.closeText, { color: themeColor }]}>X</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.back()}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Event Feed'}</Text>
        </TouchableOpacity>

        <View style={styles.colorSection}>
          <Text style={[styles.menuText, { color: themeColor, marginBottom: rem(1) }]}>{'> Color Settings'}</Text>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity 
                key={c} 
                style={[styles.colorSwatch, { backgroundColor: c }]} 
                onPress={() => setThemeColor(c)}
              >
                {themeColor === c && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/promoter_list')}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Promoters'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Receive NFC'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Scan Code'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/post_logout')}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Log Out'}</Text>
        </TouchableOpacity>

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
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  closeBox: { borderWidth: rem(0.125), width: rem(2.5), height: rem(2.5), alignItems: 'center', justifyContent: 'center' },
  closeText: { fontFamily: 'PressStart2P', fontSize: rem(1), marginTop: Platform.OS === 'ios' ? rem(0.25) : 0 },
  menuItem: { paddingVertical: rem(1.5) },
  menuText: { fontFamily: 'PressStart2P', fontSize: rem(0.75) },
  colorSection: { paddingVertical: rem(1.5) },
  colorRow: { flexDirection: 'row', gap: rem(0.5) },
  colorSwatch: { width: rem(2), height: rem(2), alignItems: 'center', justifyContent: 'center' },
  checkmark: { fontFamily: 'PressStart2P', fontSize: rem(0.75), color: '#000' },
  footer: { position: 'absolute', bottom: rem(2), left: rem(1.5), right: rem(1.5) }
});