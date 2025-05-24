import { View, ScrollView, StyleSheet } from 'react-native';
import {
  AddExercise,
  Button,
  ExerciseItem,
  RoutineName,
  Section,
  Separator,
} from '@/src/components';

export default function EditRoutine() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <RoutineName />
        </View>

        {/* Sección de Calentamiento */}
        <Section title="Calentamiento">
          <ExerciseItem name="Estiramientos" duration="5 min" />
          <ExerciseItem name="Movilidad articular" duration="5 min" />
          <AddExercise />
        </Section>

        <Separator />

        {/* Sección de Entrenamiento */}
        <Section title="Fase media">
          <ExerciseItem name="Press banca" sets="4x8" rest="90s" />
          <ExerciseItem name="Dominadas" sets="3x10" rest="60s" />
          <AddExercise />
        </Section>

        <Separator />

        {/* Sección de Vuelta a la calma */}
        <Section title="Vuelta a la calma">
          <ExerciseItem name="Estiramientos" duration="10 min" />
          <AddExercise />
        </Section>
      </ScrollView>

      {/* Footer con botón de guardar */}
      <View style={styles.footer}>
        <Button title="Guardar Rutina" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Espacio para el footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
