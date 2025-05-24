import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPassword } from '@aws-amplify/auth';

const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El correo es obligatorio'),
});

export default function resetPasswordScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ name: string; message: string } | null>(
    null
  );
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { nextStep } = await resetPassword({ username: email });

      switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
          const { destination } = nextStep.codeDeliveryDetails;
          router.replace({
            pathname: '/enterNewPassword',
            params: {
              destination,
              email,
            },
          });
          break;
        case 'DONE':
          console.log('Successfully reset password.');
          Alert.alert(
            'Error inesperado',
            'Entra en contacto con el equipo de soporte'
          );
          break;
      }
    } catch (error: any) {
      console.log('reset.tsx error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resetear contraseña</Text>

      {/* Email Input */}
      <Text style={[styles.label, errors.email && styles.errorLabel]}>
        Correo
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="tu@email.com"
            placeholderTextColor={errors.email ? '#ff4d4f' : '#999'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      {/* Continue  Button */}
      <Pressable
        disabled={isLoading}
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isLoading && styles.disabledButton, // Efecto al presionar o cargar
        ]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>Cargando</Text>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          <Text style={styles.buttonText}>Continuar</Text>
        )}
      </Pressable>

      {/* Mensaje de error destacado */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={20}
            color="#ff4d4f"
            style={styles.errorIcon}
          />
          <Text style={{ color: '#ff4d4f' }}>{error.message}</Text>
        </View>
      )}

      {/* Links */}

      <Link href="/signin" dismissTo asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Volver</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 40, // Espacio para el ícono
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    top: -7,
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 40,
  },
  buttonPressed: {
    backgroundColor: '#005BB8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginBottom: 30,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorLabel: {
    color: '#ff4d4f', // Texto rojo
  },
  errorInput: {
    borderColor: '#ff4d4f', // Borde rojo
    color: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f', // Rojo bonito
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row', // Alinea en horizontal
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'center',
    gap: 8, // Espacio entre texto y spinner
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 40,
    marginTop: -20,
  },
  errorIcon: {
    marginRight: 8,
  },
});
