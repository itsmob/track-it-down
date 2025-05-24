import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { autoSignIn, confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';
import { OtpInput } from 'react-native-otp-entry';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'expo-router';

export default function ConfirmSignUpCodeScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [code, setCode] = useState('');
  const [count, setCount] = useState(60);
  const router = useRouter();
  const { setAuthToTrue } = useAuth();
  const { email, destination } = useLocalSearchParams<{
    destination?: string;
    email: string;
  }>();

  //countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResendDisabled && count > 0) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else if (count === 0) {
      setIsResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResendDisabled, count]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setHasError(true);
    setErrorMessage('');
    try {
      const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (confirmSignUpNextStep.signUpStep === 'DONE') {
        setAuthToTrue();
        router.replace('/');
      } else if (confirmSignUpNextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        const { nextStep } = await autoSignIn();
        if (nextStep.signInStep === 'DONE') {
          setAuthToTrue();
          router.replace('/');
        }
      }
    } catch (error: any) {
      setHasError(true);
      if (error.name === 'CodeMismatchException') {
        setErrorMessage('Código incorrecto. Inténtalo nuevamente.');
      } else if (error.name === 'LimitExceededException') {
        setErrorMessage(
          'Excedió el límite de intentos, por favor intente en 5 minutos.'
        );
        setIsDisabled(true);
      } else {
        console.log('confirmCodeScreen confirmCode error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    setIsResendDisabled(true);
    try {
      await resendSignUpCode({ username: email });
      Alert.alert('Éxito', 'Se ha reenviado el código de verificación');
    } catch (error: any) {
      if (error.name === 'LimitExceededException') {
        Alert.alert('Error', 'Limites de reenvios alcanzados');
      } else {
        console.log(error);
        Alert.alert('Error', 'No se pudo reenviar el código');
      }
    } finally {
      setCount(60);
      setIsResending(false);
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

      <Pressable
        style={[
          styles.button,
          (code.length !== 6 || isLoading || hasError || isDisabled) &&
            styles.disabledButton,
        ]}
        onPress={handleConfirm}
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

      <Pressable
        style={[
          styles.button,
          (isResendDisabled || isResending) && styles.disabledButton,
        ]}
        onPress={resendCode}
        disabled={isResendDisabled || isResending}>
        {isResendDisabled || isResending ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>
              {isResending
                ? 'Reenviando'
                : `Reenviar código en: ${count} segundos`}
            </Text>
            {isResending && <ActivityIndicator color="white" />}
          </View>
        ) : (
          <Text style={styles.buttonText}>Reenviar código</Text>
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
});
