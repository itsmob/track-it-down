import { StyleSheet, Text, View } from 'react-native';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  backgroundColor?: string;
};

export const Section = ({
  title,
  children,
  backgroundColor = '#E6F2FF', // Azul claro por defecto
}: SectionProps) => (
  <View
    style={[
      styles.section,
      { backgroundColor }, // Estilo dinámico
    ]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
    padding: 16, // Añadido padding para mejor espaciado
    borderRadius: 8, // Bordes redondeados
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
});
