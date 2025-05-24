import { AddRoutine, Card } from '@/src/components';
import { View } from 'react-native';

export default function Routines() {
  return (
    <View style={{ padding: 16 }}>
      <Card
        title="Push"
        description="5 ejercicios de empuje"
        duration="01:15:00"
        dificulty="Baja"
        href="/push"
        icon="fitness-center"
        color="#FF9500"
      />
      <Card
        title="Pull"
        description="6 ejercicios de tracción"
        dificulty="Media"
        duration="01:30:00"
        href="/push"
        icon="sports-gymnastics"
        color="#34C759"
      />
      <Card
        title="Piernas"
        description="7 ejercicios para piernas"
        dificulty="Alta"
        duration="01:45:00"
        href="/legs"
        icon="directions-run"
        color="#AF52DE"
      />
      <AddRoutine />
    </View>
  );
}
