import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
};

export function Button({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  loading = false,
}: ButtonProps) {
  const variantStyles = {
    primary: {
      backgroundColor: '#007AFF',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: '#34C759',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#007AFF',
    },
  };

  const textColor = {
    primary: '#fff',
    secondary: '#fff',
    outline: '#007AFF',
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        style,
        loading && styles.loading,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading}>
      {icon && iconPosition === 'left' && !loading && (
        <MaterialIcons
          name={icon}
          size={20}
          color={textColor[variant]}
          style={styles.leftIcon}
        />
      )}

      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <Text
          style={[styles.buttonText, { color: textColor[variant] }, textStyle]}>
          {title}
        </Text>
      )}

      {icon && iconPosition === 'right' && !loading && (
        <MaterialIcons
          name={icon}
          size={20}
          color={textColor[variant]}
          style={styles.rightIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loading: {
    opacity: 0.7,
  },
});
