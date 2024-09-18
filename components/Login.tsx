import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, Alert, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabase';
import { Session, User } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

const { width, height } = Dimensions.get('window');

const Login: React.FC<LoginProps> = ({ route, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '756581067417-d6oik28q886mr6kseqa5fe2l08gc5j0j.apps.googleusercontent.com',
    iosClientId: '756581067417-ijkvf1lli9c5t1saate0q3jjtdopqr1h.apps.googleusercontent.com',
    androidClientId: '756581067417-ia3nl78tfoo7idtrn34p5osmsv6oc69i.apps.googleusercontent.com',
    webClientId: '756581067417-d6oik28q886mr6kseqa5fe2l08gc5j0j.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleLoginSuccess(response.authentication);
    }
  }, [response]);

  useEffect(() => {
    // Fade in animation when the component loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const validateForm = (): boolean => {
    if (!EmailValidator.validate(email)) {
      setError('Invalid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user as User);
    } catch (err: any) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      await handleLogin(); // Auto login after signup
    } catch (err: any) {
      setError('Signup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (authentication: any) => {
    setLoading(true);
    try {
      const { session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      const user = session?.user as User;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setError('Google login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  interface GradientButtonProps {
    onPress: () => void;
    text: string;
    style?: any;
    colors?: string[];
    disabled?: boolean;
  }

  const GradientButton: React.FC<GradientButtonProps> = ({ onPress, text, style, colors, disabled }) => (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <LinearGradient
        colors={colors || ['#6C63FF', '#4C46B3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, { opacity: disabled ? 0.7 : 1 }]}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Retrieve the theme color from route params or use a default value
  const themeColor = route.params?.themeColor || '#ffffff';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: themeColor }]}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>To-do List App</Text>
      <Text style={styles.subtitle}>Organize Your Life One Task At a Time</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color={themeColor} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color={themeColor} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Redirect to forgot password screen')}>
        <Text style={[styles.forgotPassword, { color: themeColor }]}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <GradientButton
          onPress={handleLogin}
          text={loading ? "Logging in..." : "Login"}
          style={styles.loginButton}
          colors={[themeColor, '#4C46B3']}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="small" color={themeColor} style={styles.loadingIndicator} />}
      </View>

      <Text style={styles.orText}>Or Login Using</Text>
      
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity onPress={() => promptAsync()} style={styles.socialButton} disabled={loading}>
          <Image source={require('../assets/google-icon.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} disabled={loading}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignup} disabled={loading}>
          <Text style={[styles.signupLink, loading && styles.disabledText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.25,  // Scale the logo based on screen width
    height: width * 0.1,
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.06,  // Responsive font size
    fontWeight: 'bold',
    color: '#4d9de0',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#7f8fa6',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  forgotPassword: {
color: '#6C63FF',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  gradientButton: {
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 15,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  socialButton: {
    padding: 10,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#6C63FF',
  },
  disabledText: {
    opacity: 0.5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default Login;
