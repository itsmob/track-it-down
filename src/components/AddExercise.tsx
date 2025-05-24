import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function AddExercise() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.buttonContent}>
        <MaterialIcons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.buttonText}>Agregar ejercicio</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
