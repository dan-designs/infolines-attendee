// File: app/event_feed.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { EventCard, SupabaseEvent } from '../components/EventsCard'; 
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { UserIcon } from '../components/Icons'; 
import { rem } from '../utils/sizing';

export default function EventFeed() {
  const { themeColor, bgMain } = useTheme();
  
  const [events, setEvents] = useState<SupabaseEvent[]>([]);
  const [username, setUsername] = useState<string>('...');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // --- HEADER BLINK ANIMATION ---
  const headerBlinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerBlinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(headerBlinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [headerBlinkAnim]);

  useEffect(() => {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setCurrentTime(`${dateStr} @ ${timeStr}`);

    loadFeedData();
  }, []);

  async function loadFeedData() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        const { data: attendeeData, error: attendeeError } = await supabase
          .from('attendees')
          .select('username')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (!attendeeError && attendeeData) {
          setUsername(attendeeData.username);
        } else {
          setUsername('User');
        }
      } else {
        const isGuest = await AsyncStorage.getItem('isGuest');
        if (isGuest) {
          setUsername('Guest');
        }
      }

      // Capture the exact moment this function runs in ISO format
      const currentIsoTime = new Date().toISOString();

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          id,
          event_name,
          artists,
          venue_name,
          address,
          start_time,
          end_time,
          arrival_instructions,
          event_description,
          ticket_link,
          genres,
          promoters (
            promoter_name
          )
        `)
        .eq('status', 'published')
        // THE FIX: Only fetch events where end_time is Greater Than or Equal to right now
        .gte('end_time', currentIsoTime)
        .order('start_time', { ascending: true });

      if (eventError) throw eventError;
      setEvents(eventData as any);

    } catch (err) {
      console.error('Feed Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelfDestruct = async () => {
    try {
      await AsyncStorage.setItem('last_username', username);
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('isGuest');
      router.replace('/post_logout');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('System Error', 'Failed to initiate self-destruct sequence.');
    }
  };

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Text style={[styles.terminalText, { color: themeColor }]}>{`> Wake Up, ${username}!`}</Text>
      <Text style={[styles.terminalText, { color: themeColor }]}>{`> It is ${currentTime}`}</Text>
      <Text style={[styles.terminalText, styles.spacingBottom, { color: themeColor }]}>{`> Upcoming Events`}</Text>
    </View>
  );

  const renderListFooter = () => (
    <View style={styles.listFooterContainer}>
      <Button 
        title="Tap to Self-Destruct" 
        onPress={handleSelfDestruct} 
        variant="filled" 
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: bgMain, justifyContent: 'center' }]}>
        <ActivityIndicator color={themeColor} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      
      <View style={styles.pinnedHeader}>
        <View style={styles.titleRow}>
          <Text style={[styles.logoText, { color: themeColor }]}>Infolines</Text>
          <Animated.Text style={[styles.logoText, { color: themeColor, opacity: headerBlinkAnim }]}>
            _
          </Animated.Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/user_management')}
        >
          <UserIcon color={themeColor} size={rem(2.5)} /> 
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventCard event={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={events.length > 0 ? renderListFooter : null}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: themeColor }]}>
            {'>'} No live events found_
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pinnedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rem(0.75),
    paddingTop: rem(4), 
    paddingBottom: rem(1),
  },
  titleRow: { flexDirection: 'row' },
  logoText: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  profileButton: {
    width: rem(3), 
    height: rem(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: rem(0.75), paddingTop: rem(1), paddingBottom: rem(4) },
  listHeaderContainer: { marginBottom: rem(0.25), gap: rem(0.4) },
  terminalText: { fontFamily: 'PressStart2P', fontSize: rem(0.85), lineHeight: rem(1.4) },
  spacingBottom: { marginBottom: rem(1) },
  cardWrapper: { marginBottom: rem(0.25) },
  listFooterContainer: { marginTop: rem(1.5), marginBottom: rem(2) },
  emptyText: { fontFamily: 'PressStart2P', fontSize: rem(0.85), textAlign: 'center', marginTop: rem(4) }
});