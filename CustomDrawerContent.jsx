import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { supabase } from './lib/supabase'; // Ensure the correct path to supabase client

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Navigate to login screen or handle post-logout actions
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const handleEditProfile = () => {
    // Navigate to Edit Profile screen or handle edit profile functionality
    props.navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile photo URL
            style={styles.profilePhoto}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileText}>{}</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
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
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
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
