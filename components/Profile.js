import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; 
import { supabase } from '../supabase'; 

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
        const response = await fetch(profileImage);
        const blob = await response.blob();

        const fileName = profileImage.split('/').pop();
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user_profiles')
          .upload(`pics/${fileName}`, blob, {
            contentType: 'image/jpeg', 
          });

        if (uploadError) throw uploadError;

        const { publicURL, error: publicURLError } = supabase
          .storage
          .from('user_profiles')
          .getPublicUrl(`pics/${fileName}`); 

        if (publicURLError) throw publicURLError;

        await AsyncStorage.setItem('profileImage', publicURL);

        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('userEmail', email);
      } else {
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
      setProfileImage(result.assets[0].uri); 
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapercave.com/wp/JDlmniF.jpg' }}
      style={styles.background}
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
    width: '50%',
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
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 58,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 38,
    fontWeight: 'bold',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  editButton: {
    backgroundColor: '#ffff00',
    padding: 15, 
    borderRadius: 8,
    marginBottom: 15,
    width: '30%', 
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#ffff00',
    padding: 15, 
    borderRadius: 8,
    marginBottom: 15,
    width: '100%', 
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15, 
    borderRadius: 8,
    width: '30%', 
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
