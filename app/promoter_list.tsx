// File: app/promoter_list.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator, Modal, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { CloseIcon, MoreVerticalIcon } from '../components/Icons'; 
import { rem } from '../utils/sizing';

export default function PromoterListScreen() {
  const { themeColor, bgMain } = useTheme();
  
  const [promoters, setPromoters] = useState<{ promoter_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePromoter, setActivePromoter] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

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

  const openOptions = (promoterName: string) => {
    setActivePromoter(promoterName);
    setShowOptionsModal(true);
  };

  const handleReport = () => {
    if (!activePromoter) return;
    const email = 'support@infolines.app'; 
    const subject = `Report`;
    const body = `Reporting Promoter: ${activePromoter}`;
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShowOptionsModal(false);
  };

  const handleConfirmBlock = async () => {
    if (!activePromoter) return;
    setShowBlockModal(false);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        await supabase.from('blocked_promoters').insert({
          user_id: sessionData.session.user.id,
          promoter_name: activePromoter
        });
      } 
      setPromoters(prev => prev.filter(p => p.promoter_name !== activePromoter));
      Alert.alert('System Update', `${activePromoter} has been blocked.`);
    } catch (err) {
      console.error('Block Error:', err);
      Alert.alert('System Error', 'Unable to process block request.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.logoText, { color: themeColor }]}>Promoters</Text>
            <Animated.Text style={[styles.logoText, { color: themeColor, opacity: headerBlinkAnim }]}>_</Animated.Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon color={themeColor} size={rem(2.5)} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={themeColor} style={{ marginTop: rem(4) }} />
        ) : (
          <View style={styles.listWrapper}>
            {promoters.map((item) => (
              <View key={item.promoter_name} style={styles.promoterRow}>
                {/* Text is allowed to wrap automatically */}
                <Text style={[styles.promoterText, { color: themeColor }]}>
                  {`> ${item.promoter_name}`}
                </Text>
                
                <View style={styles.actionContainer}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openOptions(item.promoter_name)}
                  >
                    <MoreVerticalIcon color={themeColor} size={rem(2.5)} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Close" onPress={() => router.back()} variant="filled" />
      </View>

      {/* MODAL 1: REPORT OR BLOCK */}
      <Modal visible={showOptionsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { borderColor: themeColor, backgroundColor: bgMain }]}>
            <Text style={[styles.modalTitle, { color: themeColor }]}>{activePromoter}</Text>
            
            <View style={styles.modalButtonContainer}>
              <Button 
                title="Report" 
                onPress={handleReport} 
                variant="filled" 
              />
              <Button 
                title="Block" 
                onPress={() => { setShowOptionsModal(false); setShowBlockModal(true); }} 
                variant="filled"
                color="#FF0033" // Direct red override
              />
              <Button 
                title="Cancel" 
                onPress={() => setShowOptionsModal(false)} 
                variant="ghost" 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CONFIRM BLOCK */}
      <Modal visible={showBlockModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { borderColor: themeColor, backgroundColor: bgMain }]}>
            <Text style={[styles.modalTitle, { color: '#FF0033' }]}>Block Promoter?</Text>
            <Text style={[styles.modalSub, { color: themeColor }]}>Confirming will permanently hide their events from your feed.</Text>
            
            <View style={styles.modalButtonContainer}>
              <Button 
                title="Confirm" 
                onPress={handleConfirmBlock} 
                variant="filled" 
                color="#FF0033" // Direct red override
              />
              <Button 
                title="Cancel" 
                onPress={() => setShowBlockModal(false)} 
                variant="ghost" 
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: rem(1.5), paddingBottom: rem(8) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: rem(4), marginBottom: rem(3) },
  titleRow: { flexDirection: 'row' },
  logoText: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  closeButton: { width: rem(3), height: rem(3), alignItems: 'center', justifyContent: 'center' },
  listWrapper: { width: '100%' },
  promoterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    minHeight: rem(4), 
    paddingVertical: rem(1),
    width: '100%' 
  },
  promoterText: { 
    flex: 1, // Allows text to wrap dynamically 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.9), 
    lineHeight: rem(1.6), 
    marginRight: rem(1) 
  },
  actionContainer: { width: rem(3), alignItems: 'center', justifyContent: 'center' },
  actionButton: { width: rem(3), height: rem(3), alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: rem(2), left: rem(1.5), right: rem(1.5) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: rem(1.5) },
  modalBox: { width: '100%', borderWidth: 2, padding: rem(1.5) },
  modalTitle: { fontFamily: 'PressStart2P', fontSize: rem(1), marginBottom: rem(1.5), lineHeight: rem(1.4) },
  modalSub: { fontFamily: 'PressStart2P', fontSize: rem(0.7), marginBottom: rem(2), lineHeight: rem(1.4), opacity: 0.8 },
  modalButtonContainer: { gap: rem(0.75) } // Adds consistent spacing between the stacked buttons
});