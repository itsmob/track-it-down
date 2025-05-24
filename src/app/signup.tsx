import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useAuth, AuthCredentials } from '../utils/AuthContext';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .required()
    .matches(/[A-Z]/, 'Debe contener al menos 1 mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos 1 minúscula')
    .matches(/\d/, 'Debe contener al menos 1 número')
    .matches(
      /[@$!%*?&#]/,
      'Debe contener al menos 1 caracter especial (@$!%*?&#)'
    ),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ name: string; message: string } | null>(
    null
  );
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async ({ email, password }: AuthCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { nextStep } = await signUp({
        email,
        password,
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        router.replace({
          pathname: '/confirmsignupcode',
          params: {
            destination: nextStep.codeDeliveryDetails.destination,
            email,
          },
        });
      }
    } catch (error: any) {
      console.log('signup.tsx onSubmit error:', error);
      if (error.name === 'UsernameExistsException') {
        setError({
          name: error.name,
          message: 'Ya hay existe una cuenta con este correo',
        });
      } else {
        console.log('signup.tsx error', error);
        setError({
          name: 'unknow error in signup.tsx at line 88',
          message: 'check the console',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const scaleValue = new Animated.Value(1); // Valor inicial de escala

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3, // Escala al 130%
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1, // Vuelve al 100%
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Ejecuta la animación cuando el error aparece
  useEffect(() => {
    if (error?.name === 'UsernameExistsException') {
      startAnimation();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>

      {/* Email Input */}
      <Text
        style={[styles.label, (errors.email || error) && styles.errorLabel]}>
        Email
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, (errors.email || error) && styles.errorInput]}
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
      {error && <Text style={styles.errorText}>{error.message}</Text>}

      {/* Password Input */}
      <Text style={[styles.label, errors.password && styles.errorLabel]}>
        Contraseña
      </Text>
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="••••••••"
              placeholderTextColor={errors.password ? '#ff4d4f' : '#999'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
          )}
          name="password"
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={20}
            color={errors.password ? '#ff4d4f' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Text style={[styles.label, errors.password && styles.errorLabel]}>
        Confirmar contraseña
      </Text>
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.errorInput,
              ]}
              placeholder="••••••••"
              placeholderTextColor={errors.confirmPassword ? '#ff4d4f' : '#999'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
          )}
          name="confirmPassword"
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialIcons
            name={showConfirmPassword ? 'visibility-off' : 'visibility'}
            size={20}
            color={errors.confirmPassword ? '#ff4d4f' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      {/* Sign Up Button */}
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
          <Text style={styles.buttonText}>Crear cuenta</Text>
        )}
      </Pressable>

      {/* Links */}
      <Link href="/signin" dismissTo asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>
            ¿Ya tienes una cuenta? Inicia sesión.
          </Text>
        </TouchableOpacity>
      </Link>

      {error?.name === 'UsernameExistsException' && (
        <Animated.View
          style={[
            styles.emojiContainer,
            { transform: [{ scale: scaleValue }] },
          ]}>
          <Text style={styles.emoji}>☝🏻</Text>
        </Animated.View>
      )}
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
  disabledButton: {
    opacity: 0.5,
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
  errorText: {
    color: '#ff4d4f', // Rojo bonito
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  errorInput: {
    borderColor: '#ff4d4f', // Borde rojo
    color: '#ff4d4f',
  },
  errorLabel: {
    color: '#ff4d4f', // Texto rojo
  },
  loadingContainer: {
    flexDirection: 'row', // Alinea en horizontal
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'center',
    gap: 8, // Espacio entre texto y spinner
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 32,
  },
});
