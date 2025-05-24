import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../utils/AuthContext';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="signin"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="confirmsignupcode"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="enterNewPassword"
          options={{ headerShown: false, animation: 'none' }}
        />
      </Stack>
    </AuthProvider>
  );
}
