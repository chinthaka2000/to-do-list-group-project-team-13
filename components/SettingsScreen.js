import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { supabase } from '../supabase'; // Adjust the path to your Supabase client

// Define 5 color options
const colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F4C724'];

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#FF5733'); // Default color

  useEffect(() => {
    // Fetch tasks from Supabase
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, text')
          .eq('notification', true); // Assume there's a 'notification' column

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled(prevState => !prevState);
  };

  const applyColor = (color) => {
    setSelectedColor(color);
    // Save the selected color to local storage or Supabase as needed
    navigation.navigate('LoginScreen', { themeColor: color });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2021/07/01/07/02/laptop-6378451_1280.jpg' }}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }} // Adjust transparency here
    >
      <View style={styles.content}>
        <View style={styles.notificationContainer}>
          <Text style={styles.label}>Enable task notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ true: '#1E90FF', false: '#ccc' }}
          />
        </View>

        {tasks.length > 0 && (
          <View style={styles.tasksContainer}>
            <Text style={styles.subHeader}>Tasks with notifications:</Text>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.taskText}>{item.text}</Text>
                </View>
              )}
            />
          </View>
        )}

        <Text style={styles.subHeader}>Choose login page theme color:</Text>
        <View style={styles.colorOptionsContainer}>
          {colorOptions.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorOption, { backgroundColor: color }]}
              onPress={() => applyColor(color)}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent', // Make content background transparent
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 50,
    marginRight: 20,
    fontWeight: 'bold',
    color: '#000', // Set text color to ensure it's readable on the background
  },
  tasksContainer: {
    marginTop: 50,
  },
  subHeader: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // Set text color to ensure it's readable on the background
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  taskText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  colorOption: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default SettingsScreen;
