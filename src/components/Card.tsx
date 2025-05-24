import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CardProps = {
  title: string;
  description: string;
  href: string;
  dificulty: string;
  duration: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
};

export function Card({
  title,
  description,
  href,
  icon = 'fitness-center',
  color = '#007AFF',
  dificulty,
  duration,
}: CardProps) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={`${title}, ${description}`}
        accessibilityRole="button"
        activeOpacity={0.7}>
        <View style={[styles.card, { backgroundColor: `${color}20` }]}>
          <MaterialIcons
            name={icon}
            size={24}
            color={color}
            style={{ marginRight: 10 }}
          />

          <View style={styles.textContainer}>
            <Text
              style={styles.title}
              ellipsizeMode="tail" // ... si el texto es muy largo
            >
              {title}
            </Text>
            <Text style={styles.description} ellipsizeMode="tail">
              {description}
            </Text>
            <Text style={styles.description} ellipsizeMode="tail">
              Duracion: {duration}
            </Text>
            <Text style={styles.description} ellipsizeMode="tail">
              Dificultad: {dificulty}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 12,
    minHeight: 80, // Altura mínima garantizada
    flexShrink: 1, // Permite que se encoja si es necesario
    overflow: 'hidden', // Evita que el contenido se desborde
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1, // Permite que el texto se ajuste
    marginRight: 8, // Espacio antes del icono de flecha
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
    flexWrap: 'wrap', // Permite múltiples líneas
    flexShrink: 1, // Ajusta el texto
  },
  description: {
    fontSize: 14,
    color: '#666',
    flexWrap: 'wrap', // Permite múltiples líneas
    flexShrink: 1, // Ajusta el texto
  },
});
