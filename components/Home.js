import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [userName, setUserName] = useState('User');
  const [taskCount, setTaskCount] = useState(0); // Placeholder for task count
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user data (e.g., from AsyncStorage)
    const fetchUserData = async () => {
      const storedUserName = await AsyncStorage.getItem('user');
      if (storedUserName) {
        setUserName(JSON.parse(storedUserName));
      }

      // Fetch tasks data (this would normally come from a backend or state management)
      const storedTaskCount = await AsyncStorage.getItem('taskCount');
      setTaskCount(storedTaskCount ? JSON.parse(storedTaskCount) : 0);
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome, {userName}!</Text>
      <Text style={styles.taskOverview}>You have {taskCount} tasks for today</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TodoList')}>
        <Text style={styles.buttonText}>Go to Todo List</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.buttonText}>Go to Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  welcomeMessage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  taskOverview: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
