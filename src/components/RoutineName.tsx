import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoutine, useRoutineDispatch } from '../utils/RoutineProvider';

export const RoutineName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const routine = useRoutine();
  const dispatch = useRoutineDispatch();

  const handleStartEditing = () => {
    setEditingName(routine?.name || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = editingName.trim();

    if (trimmedName === '') {
      // Si está vacío, usar "Rutina 1" y mostrar advertencia
      Alert.alert(
        'Nombre inválido',
        'El nombre no puede estar vacío. Se usará "Rutina 1" como nombre predeterminado.',
        [{ text: 'OK' }]
      );

      dispatch({
        type: 'ROUTINE_NAME_CHANGED',
        payload: { routineName: 'Rutina 1' },
      });
    } else {
      dispatch({
        type: 'ROUTINE_NAME_CHANGED',
        payload: { routineName: trimmedName },
      });
    }

    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <>
          <View>
            <TouchableOpacity
              style={styles.viewContainer}
              onPress={handleStartEditing}>
              <Text style={styles.title}>{routine?.name}</Text>
              <MaterialIcons name="edit" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Rutina 1"
            value={editingName}
            onChangeText={setEditingName}
            onBlur={handleSave}
            placeholderTextColor="#999"
            autoFocus
          />
          <TouchableOpacity onPress={handleSave}>
            <MaterialIcons name="check-circle" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Los estilos se mantienen igual que en tu versión anterior
const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 50, // Altura mínima garantizada
    includeFontPadding: true, // Mejor alineación de texto en Android
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 50, // Altura mínima garantizada
    includeFontPadding: true, // Mejor alineación de texto en Android
  },
});
