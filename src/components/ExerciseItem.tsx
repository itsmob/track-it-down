import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ExerciseItem = ({
  name,
  duration,
  sets,
  rest,
}: {
  name: string;
  duration?: string;
  sets?: string;
  rest?: string;
}) => (
  <View style={styles.exerciseCard}>
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseName}>{name}</Text>
      {duration && (
        <Text style={styles.exerciseDetail}>Duración: {duration}</Text>
      )}
      {sets && <Text style={styles.exerciseDetail}>Series: {sets}</Text>}
      {rest && <Text style={styles.exerciseDetail}>Descanso: {rest}</Text>}
    </View>
    <View style={styles.exerciseActions}>
      <TouchableOpacity style={styles.actionButton}>
        <MaterialIcons name="edit" size={20} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <MaterialIcons name="delete" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
});
