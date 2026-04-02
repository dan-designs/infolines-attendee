// File: app/user_management.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { CloseIcon } from '../components/Icons';
import { rem } from '../utils/sizing';

export default function UserManagementScreen() {
  const { themeColor, bgMain, setThemeColor } = useTheme();

  const colors = ['#FF4C4C', '#FF9900', '#FFFF00', '#24FF00', '#3366FF', '#CC00FF', '#FF00CC'];

  const headerBlinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerBlinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(headerBlinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [headerBlinkAnim]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('isGuest');
      router.replace('/post_logout');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('System Error', 'Failed to log out.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.logoText, { color: themeColor }]}>Config</Text>
            <Animated.Text style={[styles.logoText, { color: themeColor, opacity: headerBlinkAnim }]}>
              _
            </Animated.Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon color={themeColor} size={rem(2.5)} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.back()}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Event Feed'}</Text>
        </TouchableOpacity>

        <View style={styles.colorSection}>
          <Text style={[styles.menuText, { color: themeColor, marginBottom: rem(1.5) }]}>{'> Color Settings'}</Text>
          
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity 
                key={c} 
                style={[styles.colorSwatch, { backgroundColor: c }]} 
                onPress={() => setThemeColor(c)}
                activeOpacity={0.8}
              >
                {themeColor === c && <CloseIcon color={bgMain} size={rem(1.5)} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/promoter_list')}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Promoters'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { opacity: 0.7 }]} activeOpacity={0.7}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Receive NFC'}</Text>
          <Text style={[styles.subText, { color: themeColor }]}>[Coming Soon!]</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { opacity: 0.7 }]} activeOpacity={0.7}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Scan QR'}</Text>
          <Text style={[styles.subText, { color: themeColor }]}>[Coming Soon!]</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuText, { color: themeColor }]}>{'> Log Out'}</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        {/* Reverted to variant="filled" for "Close" */}
        <Button title="Close" onPress={() => router.back()} variant="filled" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: rem(1.5), paddingBottom: rem(8) },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: rem(4), 
    marginBottom: rem(3) 
  },
  titleRow: { flexDirection: 'row' },
  logoText: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  closeButton: { 
    width: rem(3), 
    height: rem(3), 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  menuItem: { 
    minHeight: rem(3.5), // Guaranteed 56px tap area for comfort
    justifyContent: 'center', 
    paddingVertical: rem(1) // Increased spacing between items
  },
  menuText: { fontFamily: 'PressStart2P', fontSize: rem(0.9), lineHeight: rem(1.4) },
  subText: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.65), 
    marginTop: rem(0.4), 
    marginLeft: rem(1.2) 
  },
  colorSection: { paddingVertical: rem(2) }, // More breathing room for color grid
  colorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, 
  colorSwatch: { 
    width: rem(2.25), 
    height: rem(2.25), 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  footer: { position: 'absolute', bottom: rem(2), left: rem(1.5), right: rem(1.5) }
});