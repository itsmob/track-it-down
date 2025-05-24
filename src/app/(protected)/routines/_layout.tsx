import { RoutineProvider } from '@/src/utils/RoutineProvider';
import { Stack } from 'expo-router';

export default function RoutinesLayout() {
  return (
    <RoutineProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: 'Mis Rutinas',
          }}
        />
        <Stack.Screen
          name="editroutine"
          options={{
            headerShown: true,
            title: 'Detalles de la rutina',
          }}
        />
      </Stack>
    </RoutineProvider>
  );
}
