import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabase'; // Ensure this path is correct

WebBrowser.maybeCompleteAuthSession();

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const validateForm = () => {
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
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      await handleLogin();
    } catch (err) {
      setError('Signup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (authentication) => {
    setLoading(true);
    try {
      const { session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      const user = session.user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      setError('Google login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

 

  const GradientButton = ({ onPress, text, style, colors, disabled }) => (
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

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>To-do list App</Text>
      <Text style={styles.subtitle}>Organize Your Life One Task At a Time</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="#6C63FF" />
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
        <Ionicons name="lock-closed-outline" size={24} color="#6C63FF" />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity onPress={() => {/* Handle forgot password */}}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <GradientButton 
          onPress={handleLogin} 
          text={loading ? "Logging in..." : "Login"} 
          style={styles.loginButton} 
          disabled={loading}
        />
        {loading && <ActivityIndicator size="small" color="#6C63FF" style={styles.loadingIndicator} />}
      </View>

      <Text style={styles.orText}>Or Login Using</Text>
      
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton} disabled={loading}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4d9de0',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4d9de0',
  },
  slogan: {
    fontSize: 12,
    color: '#7f8fa6',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 15,
    width: '100%',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
  },
  forgotPassword: {
    color: '#6C63FF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButton: {
    width: '80%',
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  orText: {
    marginVertical: 20,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    marginHorizontal: 10,
  },
  signupContainer: {
    flexDirection: 'row',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  disabledText: {
    opacity: 0.7,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,     
    padding: 10,
    marginHorizontal: 5,
  },
  socialIcon: {
    width: 5,
    height: 5,
  },
});
