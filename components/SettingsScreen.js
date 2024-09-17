import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { supabase } from '../supabase'; // Adjust the path to your Supabase client

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from Supabase
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, text')
          .eq('notification', true); // Assume there's a 'notification' column to filter tasks with notifications

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
    // Here you might also handle saving the state to your backend or local storage
  };

  return (
    <ImageBackground
      //source={{ uri: 'https://cdn-iladnmf.nitrocdn.com/GYljxNFGNVuPmaLlSFHIKBSpnXOurDpg/assets/images/optimized/rev-5d47944/www.centeredrecoveryprograms.com/wp-content/uploads/2023/12/goals-1024x576.png' }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.notificationContainer}>
          <Text style={styles.label}>Enable task Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ true: '#1E90FF', false: '#ccc' }}
          />
        </View>

        {tasks.length > 0 && (
          <View style={styles.tasksContainer}>
            <Text style={styles.subHeader}>Tasks with Notifications:</Text>
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#70B0E0', // Ensure background color is transparent
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 38,
    marginRight: 10,
  },
  tasksContainer: {
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
