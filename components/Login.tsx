import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, Alert, Animated, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

const { width } = Dimensions.get('window');

const Login: React.FC<LoginProps> = ({ route, onLoginSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: 'YOUR_EXPO_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleLoginSuccess(response.authentication);
        }
    }, [response]);

    useEffect(() => {
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
        setError(null); // Clear previous errors
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            onLoginSuccess(user);
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
            const { error } = await supabase.auth.signUp({ email, password });
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
            const { session, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) throw error;
            const user = session?.user;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            onLoginSuccess(user);
        } catch (err: any) {
            setError('Google login failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const GradientButton = ({ onPress, text, disabled }) => (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <LinearGradient
                colors={['#6C63FF', '#4C46B3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientButton, { opacity: disabled ? 0.7 : 1 }]}
            >
                <Text style={styles.buttonText}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const themeColor = route.params?.themeColor || '#ffffff';

    return (
        <ImageBackground
            source={{ uri: 'https://wallpapercave.com/wp/JDlmniF.jpg' }}
            style={styles.background}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        margin: 20,
    },
    logo: {
        width: width * 0.15,
        height: width * 0.15,
        marginBottom: 20,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: 20,
        fontFamily:'oblique',
  
    },
    subtitle: {
        fontSize: width * 0.03,
        color: '#FFFFFF',
        marginBottom: 30,
        fontFamily:'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '50%',
        backgroundColor:'#ffffff',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 30,
        color:'#000000',
        fontFamily:'bold',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        color:'red',
        fontSize:20,

    },
    buttonContainer: {
        width: '50%',
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
        color: '#FFFFFF',
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
        borderColor: '#FFFFFF',
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
        color: '#FFFFFF',
    },
    signupLink: {
        color: '#FFFFFF',
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
