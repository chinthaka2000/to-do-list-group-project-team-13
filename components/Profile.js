import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
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
        // Upload the image to Supabase Storage
        const fileName = profileImage.split('/').pop();
        const fileExtension = fileName.split('.').pop();
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user_profiles')
          .upload(`profile_images/${fileName}`, { uri: profileImage }, {
            contentType: `image/${fileExtension}`,
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

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setProfileImage(selectedImage);
      }
    });
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
