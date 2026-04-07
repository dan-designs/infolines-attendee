// File: components/EventsCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { MoreVerticalIcon } from './Icons';

export interface SupabaseEvent {
  id: string;
  event_name: string;
  artists: string;
  venue_name: string;
  address: string;
  start_time: string;
  end_time: string;
  arrival_instructions: string | null;
  event_description: string | null;
  ticket_link: string | null;
  genres: string | null;
  promoters: {
    promoter_name: string;
  };
}

interface EventCardProps {
  event: SupabaseEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { themeColor, bgMain } = useTheme();
  
  // Existing Details Modal
  const [modalVisible, setModalVisible] = useState(false);

  // New Moderation States
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const genreList = event.genres 
    ? event.genres.split(',').map(g => g.trim()).slice(0, 3) 
    : [];

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear().toString().slice(-2)}`;
  };

  const handleReport = () => {
    const email = 'support@infolines.app';
    const subject = `Report Event`;
    const body = `Reporting Event: ${event.event_name}\nPromoter: ${event.promoters?.promoter_name}`;
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShowOptionsModal(false);
  };

  const handleConfirmBlock = async () => {
    setShowBlockModal(false);
    const promoterName = event.promoters?.promoter_name;
    
    if (!promoterName) {
      Alert.alert('Error', 'Could not identify promoter to block.');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        const { error } = await supabase.from('blocked_promoters').insert({
          user_id: sessionData.session.user.id,
          promoter_name: promoterName
        });
        if (error) throw error;
      } 
      
      // Instantly collapse/hide this specific card from the feed
      setIsBlocked(true);
      Alert.alert('System Update', `You will no longer see events from ${promoterName}.`);

    } catch (err) {
      console.error('Block Error:', err);
      Alert.alert('System Error', 'Unable to process block request.');
    }
  };

  // If the user just blocked this promoter, hide the card entirely
  if (isBlocked) {
    return null;
  }

  return (
    <View style={[styles.cardContainer, { backgroundColor: '#111111' }]}>
      
      {/* --- COLLAPSED CARD VIEW --- */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColor }]}>{`> ${event.event_name}`}</Text>
        
        {/* MODERATION MEATBALL BUTTON */}
        <View style={styles.headerActionContainer}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => setShowOptionsModal(true)}
          >
            <MoreVerticalIcon color={themeColor} size={rem(2.5)} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.infoText, { color: themeColor }]}>{event.artists}</Text>
        <Text style={[styles.infoText, { color: themeColor }]}>{event.venue_name}</Text>
        <Text style={[styles.infoText, { color: themeColor }]}>{event.promoters?.promoter_name}</Text>
        <Text style={[styles.infoText, { color: themeColor }]}>
          {`${formatDate(event.start_time)} / ${formatDateTime(event.start_time)} - ${formatDateTime(event.end_time)}`}
        </Text>
        <Text style={[styles.infoText, { color: themeColor }]}>{event.address}</Text>
      </View>

      {genreList.length > 0 && (
        <View style={styles.genreContainer}>
          {genreList.map((genre, index) => (
            <View key={index} style={[styles.genrePill, { backgroundColor: themeColor }]}>
              <Text style={[styles.genreText, { color: bgMain }]}>{genre}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionContainer}>
        {event.ticket_link && (
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: themeColor }]}
            onPress={() => Linking.openURL(event.ticket_link!)}
          >
            <Text style={[styles.primaryButtonText, { color: bgMain }]}>Tickets</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: bgMain }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7} 
        >
          <Text style={[styles.secondaryButtonText, { color: themeColor }]}>
            More Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- DETAILS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgMain, borderColor: themeColor }]}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Added flex: 0 here so the ScrollView doesn't collapse the text to a height of zero! */}
              <Text style={[styles.title, { color: themeColor, marginTop: rem(0.5), marginBottom: rem(1.5), flex: 0 }]}>
                {`> ${event.event_name}`}
              </Text>

              <View style={styles.modalSection}>
                <Text style={[styles.labelText, { color: themeColor }]}>Artists:</Text>
                <Text style={[styles.infoText, { color: themeColor }]}>{event.artists}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.labelText, { color: themeColor }]}>Venue Name:</Text>
                <Text style={[styles.infoText, { color: themeColor }]}>{event.venue_name}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.labelText, { color: themeColor }]}>Promoter:</Text>
                <Text style={[styles.infoText, { color: themeColor }]}>{event.promoters?.promoter_name}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.labelText, { color: themeColor }]}>Date & Time:</Text>
                <Text style={[styles.infoText, { color: themeColor }]}>
                  {`${formatDate(event.start_time)} / ${formatDateTime(event.start_time)} - ${formatDateTime(event.end_time)}`}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.labelText, { color: themeColor }]}>Address:</Text>
                <Text style={[styles.infoText, { color: themeColor }]}>{event.address}</Text>
              </View>

              {genreList.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={[styles.labelText, { color: themeColor }]}>Genres:</Text>
                  <View style={[styles.genreContainer, { marginTop: 0 }]}>
                    {genreList.map((genre, index) => (
                      <View key={index} style={[styles.genrePill, { backgroundColor: themeColor }]}>
                        <Text style={[styles.genreText, { color: bgMain }]}>{genre}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {event.event_description && (
                <View style={styles.modalSection}>
                  <Text style={[styles.labelText, { color: themeColor }]}>Description:</Text>
                  <Text style={[styles.infoText, { color: themeColor }]}>
                    {event.event_description}
                  </Text>
                </View>
              )}
              
              {event.arrival_instructions && (
                <View style={styles.modalSection}>
                  <Text style={[styles.labelText, { color: themeColor }]}>Arrival Instructions:</Text>
                  <Text style={[styles.infoText, { color: themeColor }]}>
                    {event.arrival_instructions}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: themeColor, marginTop: rem(1.5) }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.primaryButtonText, { color: bgMain }]}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* --- MODERATION MODAL 1: REPORT OR BLOCK --- */}
      <Modal visible={showOptionsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { borderColor: themeColor, backgroundColor: bgMain }]}>
            <Text style={[styles.modalTitle, { color: themeColor }]}>{event.promoters?.promoter_name || 'Event Options'}</Text>
            
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
                color="#FF0033" 
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

      {/* --- MODERATION MODAL 2: CONFIRM BLOCK --- */}
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
                color="#FF0033" 
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
  cardContainer: { 
    width: '100%', 
    padding: rem(1.25), 
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(0.5) 
  },
  title: { 
    flex: 1, 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1.2), 
    lineHeight: rem(1.5),
    marginRight: rem(1)
  },
  headerActionContainer: {
    width: rem(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionButton: {
    width: rem(3),
    height: rem(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: { 
    marginVertical: rem(0.5), 
    gap: rem(0.85) 
  },
  infoText: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.85), 
    lineHeight: rem(1.2) 
  },
  genreContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: rem(0.5), 
    marginTop: rem(0.5), 
    marginBottom: rem(1) 
  },
  genrePill: { 
    paddingVertical: rem(0.25), 
    paddingHorizontal: rem(0.5) 
  },
  genreText: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.75) 
  },
  actionContainer: { 
    gap: rem(0.5) 
  },
  primaryButton: { 
    minHeight: rem(3.5), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  primaryButtonText: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1) 
  },
  secondaryButton: { 
    minHeight: rem(3.5), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  secondaryButtonText: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1) 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(1.5),
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    padding: rem(1.5),
  },
  modalSection: {
    marginTop: rem(0.5),
    marginBottom: rem(0.5),
  },
  labelText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.65), 
    opacity: 0.7, 
    marginBottom: rem(0.35),
  },
  modalBox: { 
    width: '100%', 
    borderWidth: 2, 
    padding: rem(1.5) 
  },
  modalTitle: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1), 
    marginBottom: rem(1.5), 
    lineHeight: rem(1.4) 
  },
  modalSub: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.7), 
    marginBottom: rem(2), 
    lineHeight: rem(1.4), 
    opacity: 0.8 
  },
  modalButtonContainer: { 
    gap: rem(0.75) 
  }
});