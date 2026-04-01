// File: app/create.tsx
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Text, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

export default function CreateScreen() {
  const { themeColor, bgMain } = useTheme();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (authError) {
      Alert.alert('Creation Failed', authError.message);
      setLoading(false);
      return;
    }

    // 2. Create their public profile in the attendees table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('attendees')
        .insert({
          id: authData.user.id,
          username: username.toLowerCase().trim(),
          theme_color_hex: themeColor, // Save their default color
          is_guest: false,
        });

      if (profileError) {
        Alert.alert('Profile Error', profileError.message);
      } else {
        // Success! Route them to the feed
        router.replace('/event_feed');
      }
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: bgMain }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColor }]}>Create_</Text>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.closeBox, { borderColor: themeColor }]}
          >
            <Text style={[styles.closeText, { color: themeColor }]}>X</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: themeColor }]}>{'> Username'}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeColor }]}
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[styles.label, { color: themeColor }]}>{'> Email'}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeColor }]}
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: themeColor }]}>{'> Password'}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeColor }]}
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />

          <Text style={[styles.label, { color: themeColor }]}>{'> Confirm Password'}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeColor }]}
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry
          />
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <Button 
            title={loading ? "Processing..." : "Create"} 
            onPress={handleCreate} 
            variant="filled" 
          />
          <View style={styles.spacer} />
          <Button 
            title="Back" 
            onPress={() => router.back()} 
            variant="underline" 
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: rem(1.5), // 24px
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: rem(4), // 64px
    marginBottom: rem(3), // 48px
  },
  title: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(1.5), // 24px
  },
  closeBox: { 
    borderWidth: rem(0.125), // 2px
    width: rem(2.5), // 40px
    height: rem(2.5), 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  closeText: {
    fontFamily: 'PressStart2P', 
    fontSize: rem(1), // 16px
    marginTop: Platform.OS === 'ios' ? rem(0.25) : 0, // Font alignment tweak
  },
  form: { 
    flex: 1 
  },
  label: { 
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.75), // 12px
    marginBottom: rem(0.5), // 8px
    marginTop: rem(1.5), // 24px
  },
  input: { 
    padding: rem(1), // 16px
    fontFamily: 'PressStart2P', 
    fontSize: rem(0.75), // 12px
    color: '#000000', // Black text on neon background per your design
  },
  footer: { 
    paddingBottom: rem(3), // 48px
    paddingTop: rem(2), // 32px
  },
  spacer: {
    height: rem(1),
  }
});