import { useAuth } from '@/src/utils/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();

  if (!isReady) return null;

  if (!isLoggedIn) return <Redirect href="/signin" />;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen
        name="routines"
        options={{ headerShown: false, animation: 'none' }}
      />
    </Stack>
  );
}
