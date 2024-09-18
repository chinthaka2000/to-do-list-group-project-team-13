import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Use expo-image-picker for Expo
import { supabase } from '../supabase'; // Adjust the path to your Supabase client

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedProfileImage = await AsyncStorage.getItem('profileImage');

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedProfileImage) setProfileImage(storedProfileImage);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      if (profileImage) {
        // Convert image URI to Blob
        const response = await fetch(profileImage);
        const blob = await response.blob();

        // Upload the image to Supabase Storage
        const fileName = profileImage.split('/').pop();
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user_profiles')
          .upload(`pics/${fileName}`, blob, {
            contentType: 'image/jpeg', // Adjust content type if necessary
          });

        if (uploadError) throw uploadError;

        const { publicURL, error: publicURLError } = supabase
          .storage
          .from('user_profiles')
          .getPublicUrl(`profile_images/${fileName}`);

        if (publicURLError) throw publicURLError;

        await AsyncStorage.setItem('profileImage', publicURL);

        // Save profile data to AsyncStorage
        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('userEmail', email);
      } else {
        // Save profile data to AsyncStorage without updating the image
        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('userEmail', email);
      }

      setEditing(false);
      Alert.alert('Profile updated!');
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need permission to access your camera roll.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapercave.com/wp/JDlmniF.jpg' }}
      style={styles.background}
      //imageStyle={{ opacity: 0.4 }} // Adjust the opacity for transparency
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSelectImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : { uri: 'https://via.placeholder.com/150' }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  profileImage: {
    width: 400,
    height: 400,
    borderRadius: 200,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
