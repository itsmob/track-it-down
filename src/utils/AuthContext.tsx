import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen, useRouter } from 'expo-router';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  signUp as amplifySignUp,
  SignUpOutput,
  signOut as amplifySignOut,
  signIn as amplifySignIn,
  SignInOutput,
} from 'aws-amplify/auth';

SplashScreen.preventAutoHideAsync();

export type AuthCredentials = {
  email: string;
  password: string;
};

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  signUp: (credentials: AuthCredentials) => Promise<SignUpOutput>;
  signIn: (credentials: AuthCredentials) => Promise<SignInOutput>;
  signOut: () => void;
  setAuthToTrue: () => void;
};

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  signUp: () =>
    Promise.resolve({
      isSignUpComplete: false,
      nextStep: {
        signUpStep: 'DONE',
        codeDeliveryDetails: undefined,
      },
    }),
  signIn: () =>
    Promise.resolve({
      isSignedIn: false,
      nextStep: {
        signInStep: 'DONE',
      },
    }),
  signOut: () => Promise.resolve(),
  setAuthToTrue: () => {},
});

const authStorageKey = 'auth-key';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log('Error saving', error);
    }
  };

  const signUp = async ({
    email,
    password,
  }: AuthCredentials): Promise<SignUpOutput> => {
    try {
      const AmplifySignUpOutput = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      return AmplifySignUpOutput;
    } catch (error) {
      console.log('AuthContext.tsx signup error', error);
      throw error;
    }
  };

  const signIn = async ({
    email,
    password,
  }: AuthCredentials): Promise<SignInOutput> => {
    try {
      const AmplifySignInOutput = await amplifySignIn({
        username: email,
        password,
      });
      return AmplifySignInOutput;
    } catch (error) {
      console.log('AuthContext.tsx signIn error', error);
      throw error;
    }
  };

  const signOut = async () => {
    await amplifySignOut({ global: true });
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
  };

  const setAuthToTrue = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
  };

  // Load the session from the storege
  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log('Error fetching from storage', error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isReady,
        signUp,
        signIn,
        signOut,
        setAuthToTrue,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within the AuthProvider');
  return context;
};
