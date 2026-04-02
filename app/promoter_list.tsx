// File: app/promoter_list.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { CloseIcon, NfcIcon, QrIcon } from '../components/Icons'; 
import { rem } from '../utils/sizing';

export default function PromoterListScreen() {
  const { themeColor, bgMain } = useTheme();
  
  const [promoters, setPromoters] = useState<{ promoter_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const headerBlinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerBlinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(headerBlinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    fetchPromoters();
  }, []);

  async function fetchPromoters() {
    try {
      const { data, error } = await supabase
        .from('promoters')
        .select('promoter_name')
        .order('promoter_name', { ascending: true });

      if (error) throw error;
      setPromoters(data || []);
    } catch (err) {
      console.error('Promoter Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.logoText, { color: themeColor }]}>Promoters</Text>
            <Animated.Text style={[styles.logoText, { color: themeColor, opacity: headerBlinkAnim }]}>
              _
            </Animated.Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon color={themeColor} size={rem(2.5)} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={themeColor} style={{ marginTop: rem(4) }} />
        ) : (
          <>
            {promoters.map((item) => (
              <View key={item.promoter_name} style={styles.promoterRow}>
                <Text style={[styles.promoterText, { color: themeColor }]}>
                  {`> ${item.promoter_name}`}
                </Text>
                
                <View style={styles.actionRow}>
                  {/* NFC Icon - Size matched to Close X (rem 2.5) */}
                  <TouchableOpacity 
                    style={[styles.actionButton, { opacity: 0.7 }]}
                    disabled={true}
                  >
                     <NfcIcon color={themeColor} size={rem(2.5)} />
                  </TouchableOpacity>

                  {/* QR Icon - Size matched to Close X (rem 2.5) */}
                  <TouchableOpacity 
                    style={[styles.actionButton, { opacity: 0.7 }]}
                    disabled={true}
                  >
                    <QrIcon color={themeColor} size={rem(2.5)} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

      </ScrollView>

      <View style={styles.footer}>
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
  promoterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    minHeight: rem(4), 
    paddingVertical: rem(1),
  },
  promoterText: { 
    flex: 1, 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.9), 
    lineHeight: rem(1.4) 
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: rem(0.25), 
    marginLeft: rem(1) 
  },
  actionButton: { 
    width: rem(3), 
    height: rem(3),
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: { 
    position: 'absolute', 
    bottom: rem(2), 
    left: rem(1.5), 
    right: rem(1.5) 
  }
});