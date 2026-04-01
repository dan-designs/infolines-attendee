// File: app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { rem } from '../utils/sizing';

export default function LoginScreen() {
  const { themeColor, bgMain } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bgMain }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColor }]}>Login_</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBox, { borderColor: themeColor }]}>
            <Text style={[styles.closeText, { color: themeColor }]}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: themeColor }]}>{'> Username'}</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColor }]} value={username} onChangeText={setUsername} autoCapitalize="none" />

          <Text style={[styles.label, { color: themeColor }]}>{'> Password'}</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColor }]} value={password} onChangeText={setPassword} secureTextEntry />
          
          <TouchableOpacity onPress={() => router.push('/password_reset')}>
            <Text style={[styles.forgotText, { color: themeColor }]}>Forgot password ?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button title="Login" onPress={() => console.log('Login')} variant="filled" />
          <Button title="Create User" onPress={() => router.push('/create')} variant="underline" />
          <View style={styles.spacer} />
          <Button title="Continue As Guest" onPress={() => router.replace('/event_feed')} variant="ghost" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: rem(1.5) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: rem(4), marginBottom: rem(3) },
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  closeBox: { borderWidth: rem(0.125), width: rem(2.5), height: rem(2.5), alignItems: 'center', justifyContent: 'center' },
  closeText: { fontFamily: 'PressStart2P', fontSize: rem(1), marginTop: Platform.OS === 'ios' ? rem(0.25) : 0 },
  form: { flex: 1 },
  label: { fontFamily: 'PressStart2P', fontSize: rem(0.75), marginBottom: rem(0.5), marginTop: rem(1.5) },
  input: { padding: rem(1), fontFamily: 'PressStart2P', fontSize: rem(0.75), color: '#000000', marginBottom: rem(1) },
  forgotText: { fontFamily: 'PressStart2P', fontSize: rem(0.625), marginTop: rem(0.5) },
  footer: { paddingBottom: rem(3), paddingTop: rem(2) },
  spacer: { height: rem(1) }
});