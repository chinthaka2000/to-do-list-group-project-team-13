import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { supabase } from './supabase'; // Ensure the correct path to supabase client
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props) => {
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          Alert.alert('Error', error.message);
          return;
        }
        if (user) {
          setEmail(user.email);
          const profileUrl = user.user_metadata?.profile_image_url || 'https://via.placeholder.com/100';
          setProfileImageUrl(profileUrl);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user'); // Remove user from local storage
      props.navigation.navigate('Login'); // Navigate to login screen
    } catch (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  const handleEditProfile = () => {
    props.navigation.navigate('Profile'); // Navigate to the Profile screen
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: profileImageUrl }} // Profile photo URL from user data
            style={styles.profilePhoto}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileEmail}>{email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  editButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 8,
  },
});

export default CustomDrawerContent;
