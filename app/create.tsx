// File: app/create.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { CloseIcon } from '../components/Icons';
import { rem } from '../utils/sizing';
import { supabase } from '../lib/supabase';

const ERROR_COLOR = '#FF0033';

// --- CUSTOM TERMINAL INPUT COMPONENT ---
const TerminalInput = React.memo(({ 
  label, 
  value, 
  onChangeText, 
  secureTextEntry, 
  fieldKey, 
  keyboardType = 'default',
  focusedField,
  onFocus,
  themeColor,
  bgMain,
  hasError,
  inputRef,
  onSubmitEditing,
  returnKeyType
}: any) => {
  const isFocused = focusedField === fieldKey;
  const activeColor = hasError ? ERROR_COLOR : themeColor;

  const [showCursor, setShowCursor] = useState(false);
  const cursorTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const startBlinking = () => {
    if (cursorTimer.current) clearInterval(cursorTimer.current);
    setShowCursor(true);
    cursorTimer.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
  };

  useEffect(() => {
    if (isFocused) {
      startBlinking();
    } else {
      if (cursorTimer.current) clearInterval(cursorTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setShowCursor(false);
    }
    return () => {
      if (cursorTimer.current) clearInterval(cursorTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [isFocused]);

  const handleTextChange = (text: string) => {
    onChangeText(text);
    setShowCursor(true);
    if (cursorTimer.current) clearInterval(cursorTimer.current);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      startBlinking();
    }, 500);
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: activeColor }]}>{`> ${label}`}</Text>
      <View style={[styles.inputContainer, { backgroundColor: activeColor }]}>
        <View style={styles.visibleTextContainer} pointerEvents="none">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            contentContainerStyle={styles.scrollOverlayContent}
          >
            <Text style={[styles.visibleText, { color: bgMain }]}>
              {value.length === 0 ? '\u200B' : secureTextEntry ? '*'.repeat(value.length) : value}
              {isFocused && showCursor && (
                <Text style={{ color: bgMain }}>_</Text>
              )}
            </Text>
          </ScrollView>
        </View>

        <TextInput
          ref={inputRef}
          style={[styles.hiddenInput, { color: 'transparent' }]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => onFocus(fieldKey)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          caretHidden={true}
          selectionColor="transparent"
          keyboardAppearance="dark"      
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={returnKeyType === 'done'}
        />
      </View>
    </View>
  );
});

export default function CreateScreen() {
  const { themeColor, bgMain } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const clearError = (fieldKey: string) => {
    if (errors.includes(fieldKey)) {
      setErrors((prev) => prev.filter((key) => key !== fieldKey));
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
    clearError(fieldKey); 
  };

  const handleChangeText = (fieldKey: string, setter: React.Dispatch<React.SetStateAction<string>>, text: string) => {
    setter(text);
    clearError(fieldKey); 
  };

  const handleCreate = async () => {
    if (isLoading) return; 

    const newErrors: string[] = [];
    
    if (!username.trim()) newErrors.push('username');
    if (!email.trim()) newErrors.push('email');
    if (!password) newErrors.push('password');
    if (!confirmPassword || password !== confirmPassword) newErrors.push('confirmPassword');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return; 
    }

    setIsLoading(true);

    try {
      // Step 1: Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('User creation failed.');
      }

      // Step 2: Insert into attendees table
      const { error: dbError } = await supabase
        .from('attendees')
        .insert({
          id: authData.user.id,
          username: username.trim(),
          is_guest: false,
        });

      if (dbError) throw dbError;

      // Step 3: Alert Success and route to Login
      Alert.alert(
        'Success_',
        'Account created successfully. Please log in.',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/login') 
          }
        ]
      );

    } catch (err: any) {
      console.error('Sign up error:', err);
      Alert.alert('System Error', err.message || 'Something went wrong during creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgMain }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: themeColor }]}>Create</Text>
          <Animated.Text style={[styles.title, { color: themeColor, opacity: headerBlinkAnim }]}>
            _
          </Animated.Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <CloseIcon color={themeColor} size={rem(2.5)} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TerminalInput
            label="Username"
            value={username}
            onChangeText={(text: string) => handleChangeText('username', setUsername, text)}
            fieldKey="username"
            focusedField={focusedField}
            onFocus={handleFocus}
            hasError={errors.includes('username')}
            themeColor={themeColor}
            bgMain={bgMain}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <TerminalInput
            label="Email"
            inputRef={emailRef}
            value={email}
            onChangeText={(text: string) => handleChangeText('email', setEmail, text)}
            fieldKey="email"
            keyboardType="email-address"
            focusedField={focusedField}
            onFocus={handleFocus}
            hasError={errors.includes('email')}
            themeColor={themeColor}
            bgMain={bgMain}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TerminalInput
            label="Password"
            inputRef={passwordRef}
            value={password}
            onChangeText={(text: string) => handleChangeText('password', setPassword, text)}
            fieldKey="password"
            secureTextEntry
            focusedField={focusedField}
            onFocus={handleFocus}
            hasError={errors.includes('password')}
            themeColor={themeColor}
            bgMain={bgMain}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <TerminalInput
            label="Confirm Password"
            inputRef={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={(text: string) => handleChangeText('confirmPassword', setConfirmPassword, text)}
            fieldKey="confirmPassword"
            secureTextEntry
            focusedField={focusedField}
            onFocus={handleFocus}
            hasError={errors.includes('confirmPassword')}
            themeColor={themeColor}
            bgMain={bgMain}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()} 
          />
        </View>
      </ScrollView>

      <View style={[styles.actionContainer, isKeyboardVisible && styles.actionContainerKeyboardOpen]}>
        <View style={styles.buttonWrapper}>
          <Button 
            title={isLoading ? "Processing..." : "Create"} 
            onPress={handleCreate} 
            variant="filled" 
          />
        </View>
        {!isKeyboardVisible && (
          <>
            <View style={styles.spacer} />
            <View style={styles.buttonWrapper}>
              <Button title="Back" onPress={() => router.back()} variant="ghost" />
            </View>
            <View style={[styles.bottomLine, { backgroundColor: themeColor }]} />
          </>
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
  title: { fontFamily: 'PressStart2P', fontSize: rem(1.5) },
  closeButton: {
    width: rem(3),
    height: rem(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: rem(1.5),
    paddingBottom: rem(2), 
  },
  formContainer: { flex: 1, marginTop: rem(1) },
  inputWrapper: { marginBottom: rem(2) },
  inputLabel: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.85),
    marginBottom: rem(0.75),
  },
  inputContainer: {
    height: rem(3.5),
    justifyContent: 'center',
    position: 'relative',
  },
  visibleTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: rem(1),
  },
  scrollOverlayContent: {
    flexGrow: 1,
    alignItems: 'center', 
  },
  visibleText: {
    fontFamily: 'PressStart2P',
    fontSize: rem(0.85),
    lineHeight: rem(1.5), 
  },
  hiddenInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: rem(1),
    fontFamily: 'PressStart2P',
    fontSize: rem(0.85),
  },
  actionContainer: {
    paddingHorizontal: rem(1.5),
    paddingBottom: rem(2),
    paddingTop: rem(1),
  },
  actionContainerKeyboardOpen: {
    paddingBottom: rem(1),
  },
  buttonWrapper: {
    marginVertical: rem(0.1),
    minHeight: rem(4),
  },
  spacer: { height: rem(1) },
  bottomLine: {
    height: 2,
    width: '100%',
    marginTop: rem(0.5),
  }
});