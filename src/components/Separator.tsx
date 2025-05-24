import { StyleSheet, View } from 'react-native';

// Componente Separador mejorado
export const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
});
