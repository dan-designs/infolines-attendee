// File: app/delete_account.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { CloseIcon } from '../components/Icons';
import { rem } from '../utils/sizing';

const DANGER_COLOR = '#FF0033'; // Forces red theme for this page

export default function DeleteAccountScreen() {
  const { bgMain } = useTheme();
  
  const [confirmationText, setConfirmationText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const headerBlinkAnim = useRef(new Animated.Value(1)).current;

  // Header Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerBlinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(headerBlinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [headerBlinkAnim]);

  // Keyboard Listeners for UI adjustment
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleDelete = async () => {
    // Only allow if they typed exactly "Delete"
    if (confirmationText !== 'Delete') return;
    
    setIsDeleting(true);

    try {
      // 1. Call the custom Supabase RPC function we made in SQL
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;

      // 2. Clear out local storage
      await AsyncStorage.removeItem('isGuest');
      await AsyncStorage.setItem('last_username', 'User'); // Generic name for the goodbye screen
      
      // 3. Ensure the active session is killed locally
      await supabase.auth.signOut();

      // 4. Send them to the void
      router.replace('/post_logout');

    } catch (err: any) {
      console.error('Delete Error:', err);
      Alert.alert('System Error', 'Could not delete user at this time.');
      setIsDeleting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgMain }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: DANGER_COLOR }]}>Delete User</Text>
          <Animated.Text style={[styles.title, { color: DANGER_COLOR, opacity: headerBlinkAnim }]}>
            _
          </Animated.Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <CloseIcon color={DANGER_COLOR} size={rem(2.5)} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        
        {/* --- WARNING COPY --- */}
        <View style={styles.warningBlock}>
          <Text style={[styles.warningText, { color: DANGER_COLOR }]}>
            {'> WARNING:'}
          </Text>
          <Text style={[styles.warningText, { color: DANGER_COLOR }]}>
            {'> This action is immediate and permanent.'}
          </Text>
          <Text style={[styles.warningText, { color: DANGER_COLOR }]}>
            {'> You will lose access to all Promoters and Events.'}
          </Text>
        </View>

        <Text style={[styles.instructionText, { color: DANGER_COLOR }]}>
          Type "Delete" below to confirm:
        </Text>

        {/* --- DANGER INPUT --- */}
        <View style={[styles.inputContainer, { borderColor: DANGER_COLOR }]}>
          <Text style={[styles.inputPrefix, { color: DANGER_COLOR }]}>{'>'}</Text>
          <TextInput
            style={[styles.textInput, { color: DANGER_COLOR }]}
            value={confirmationText}
            onChangeText={setConfirmationText}
            placeholder="Type here..."
            placeholderTextColor="rgba(255, 0, 51, 0.3)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>

      </View>

      {/* --- FOOTER ACTION --- */}
      <View style={[styles.footer, isKeyboardVisible && styles.footerKeyboardOpen]}>
        
        {/* Only show the Confirm button if they typed "Delete" exactly */}
        {confirmationText === 'Delete' ? (
          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: DANGER_COLOR }]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={[styles.dangerButtonText, { color: bgMain }]}>
              {isDeleting ? 'Erasing...' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}

        {!isKeyboardVisible && (
          <View style={styles.cancelWrapper}>
            {/* The standard Button component forced to red */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.cancelText, { color: DANGER_COLOR }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rem(1.5),
    marginTop: rem(4),
    marginBottom: rem(2),
  },
  titleRow: { flexDirection: 'row' },
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.2), lineHeight: rem(1.5) },
  closeButton: { width: rem(3), height: rem(3), justifyContent: 'center', alignItems: 'center' },
  
  content: {
    flex: 1,
    paddingHorizontal: rem(1.5),
    paddingTop: rem(2),
  },
  warningBlock: {
    marginBottom: rem(3),
    gap: rem(1),
  },
  warningText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.85),
    lineHeight: rem(1.4),
  },
  instructionText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.75),
    marginBottom: rem(1),
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    height: rem(4),
    paddingHorizontal: rem(1),
  },
  inputPrefix: {
    fontFamily: 'PressStart2P',
    fontSize: rem(1),
    marginRight: rem(0.75),
  },
  textInput: {
    flex: 1,
    fontFamily: 'PressStart2P',
    fontSize: rem(1),
    height: '100%',
  },

  footer: {
    paddingHorizontal: rem(1.5),
    paddingBottom: rem(2),
    paddingTop: rem(1),
  },
  footerKeyboardOpen: {
    paddingBottom: rem(1),
  },
  dangerButton: {
    height: rem(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rem(1.5),
  },
  dangerButtonText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(1),
  },
  buttonPlaceholder: {
    height: rem(3.5),
    marginBottom: rem(1.5),
  },
  cancelWrapper: {
    alignItems: 'center',
    paddingVertical: rem(1),
  },
  cancelText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.9),
    textDecorationLine: 'underline',
  }
});