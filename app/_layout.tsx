// File: app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '../context/ThemeContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { CRTOverlay } from '../components/CRTOverlay'; // <-- IMPORTED OVERLAY

export default function RootLayout() {
  // Load the custom font before rendering the app
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  // Show a brutalist loading state while the font loads
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#222222', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#24FF00" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      {/* We wrap the Stack and the Overlay in a flex: 1 container 
        so they stack on top of each other correctly.
      */}
      <View style={styles.container}>
        
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#222222' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="create" />
          <Stack.Screen name="password_reset" />
          <Stack.Screen name="event_feed" />
          <Stack.Screen name="user_management" />
          <Stack.Screen name="promoter_list" />
          <Stack.Screen name="post_logout" />
          <Stack.Screen name="delete_account" />
        </Stack>
        
        {/* GLOBAL OVERLAY SITS ON TOP OF EVERYTHING */}
        <CRTOverlay />

      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222', 
  }
});