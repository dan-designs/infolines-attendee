// File: components/EventsCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { rem } from '../utils/sizing';

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
  
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <View style={[styles.cardContainer, { backgroundColor: '#1A1A1A' }]}>
      
      {/* --- COLLAPSED CARD VIEW --- */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColor }]}>{`> ${event.event_name}`}</Text>
      </View>

      <View style={styles.infoBlock}>
        {/* Stripped the ">" off to match the original mockup cleanly */}
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

      {/* --- THE MODAL OVERLAY --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgMain, borderColor: themeColor }]}>
            
            <Text style={[styles.title, { color: themeColor, marginBottom: rem(1) }]}>
              {`> ${event.event_name}`}
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Labeled Information Blocks */}
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

              {/* Genres */}
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

              {/* Description */}
              {event.event_description && (
                <View style={styles.modalSection}>
                  <Text style={[styles.labelText, { color: themeColor }]}>Description:</Text>
                  <Text style={[styles.infoText, { color: themeColor }]}>
                    {event.event_description}
                  </Text>
                </View>
              )}
              
              {/* Arrival Instructions */}
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

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { 
    width: '100%', 
    padding: rem(1.25), 
  },
  header: { 
    marginBottom: rem(0.5) 
  },
  title: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1.2), 
    lineHeight: rem(1.5) 
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
  // --- MODAL STYLES ---
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
    fontSize: rem(0.65), // Hint smaller than the infoText
    opacity: 0.7, // Muted style
    marginBottom: rem(0.35),
  }
});