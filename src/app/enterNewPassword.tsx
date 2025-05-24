import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { confirmResetPassword } from '@aws-amplify/auth';
import { OtpInput } from 'react-native-otp-entry';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';

const schema = yup.object({
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

export default function enterNewPasswordScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const { setAuthToTrue } = useAuth();
  const { email, destination } = useLocalSearchParams<{
    destination?: string;
    email: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleConfirm = async ({ password }: { password: string }) => {
    setIsLoading(true);
    setHasError(true);
    setErrorMessage('');
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      });

      setAuthToTrue();
      router.replace('/');
    } catch (error: any) {
      setHasError(true);
      if (error.name === 'CodeMismatchException') {
        setErrorMessage('Codigo invalido, Intenta de nuevo');
      } else {
        console.log('confirmCodeScreen confirmCode error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Te enviamos un correo electrónico.</Text>
      <Text style={styles.subtitle}>
        Para iniciar sesión, introduce el código que te enviamos a{' '}
        {destination ? destination : email}. Puede tardar un minuto en llegar.
      </Text>

      <OtpInput
        focusColor={hasError ? '#ff4d4f' : '#007AFF'}
        numberOfDigits={6}
        onTextChange={(text) => {
          setCode(text);
          setHasError(false);
        }}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
        }}
        textProps={{
          accessibilityRole: 'text',
          accessibilityLabel: 'OTP digit',
          allowFontScaling: false,
        }}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: {
            ...styles.pinCodeContainer,
            ...(hasError ? styles.errorPinCode : {}), // Aplica estilos condicionales correctamente
          },
        }}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

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

      <Pressable
        style={[
          styles.button,
          (code.length !== 6 || isLoading || hasError || isDisabled) &&
            styles.disabledButton,
        ]}
        onPress={handleSubmit(handleConfirm)}
        disabled={code.length !== 6 || isLoading || hasError || isDisabled}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>Cargando</Text>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          <Text style={styles.buttonText}>Confirmar</Text>
        )}
      </Pressable>

      {/* Links */}
      <Link href="/signin" replace asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Salir</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    marginTop: 40,
    borderRadius: 8,
    minHeight: 50, // Evita cambios de altura
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  otpContainer: {
    marginBottom: 20,
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  errorPinCode: {
    borderColor: '#ff4d4f',
    backgroundColor: '#fff2f0',
  },
  errorText: {
    color: '#ff4d4f',
    textAlign: 'center',
    marginTop: 8,
  },
  link: {
    marginTop: 40,
    marginBottom: 30,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  errorLabel: {
    color: '#ff4d4f', // Texto rojo
  },
  passwordContainer: {
    position: 'relative',
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
  errorInput: {
    borderColor: '#ff4d4f', // Borde rojo
    color: '#ff4d4f',
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
});
