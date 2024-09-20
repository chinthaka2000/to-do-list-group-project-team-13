import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { supabase } from '../supabase'; // Import your Supabase client

const categories = ['All', 'Work', 'Personal', 'Shopping'];

// Get the screen's width
const { width } = Dimensions.get('window');

export default function TaskCategories() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory]);

  // Fetch tasks from Supabase based on the selected category
  const fetchTasks = async () => {
    try {
      let query = supabase.from('tasks').select('*');

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Filter tasks based on the selected category
  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapercave.com/wp/JDlmniF.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Left side for Categories */}
        <View style={styles.categoryContainer}>
          <Text style={styles.header}>Task Categories</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Right side for Tasks */}
        <View style={styles.taskContainer}>
          <Text style={styles.taskListHeader}>Tasks in {selectedCategory}</Text>

          {filteredTasks.length > 0 ? (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={styles.taskListContainer}
            />
          ) : (
            <Text style={styles.noTasksText}>No tasks in this category.</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row', // Make the main container a row
    padding: 20,
  },
  header: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#ffffff',
  },
  categoryContainer: {
    width: width * 0.4, // 30% of screen width
    paddingRight: 60, // Add some spacing between categories and tasks
    borderRadius: 8,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  selectedCategoryButton: {
    backgroundColor: 'yellow',
  },
  categoryButtonText: {
    fontSize: 30,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: '#000000', // White text for selected category button
    textAlign: 'center',
  },
  taskContainer: {
    width: width * 0.5, // 70% of screen width
    paddingLeft: 60, // Add some spacing
    borderRadius: 8,
  },
  taskListHeader: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#ffffff',
  },
  taskListContainer: {
    alignItems: 'center',
    borderRadius: 8,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ffff00',
    borderRadius: 8,
    width: width * 0.6, // Set width relative to task container
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  noTasksText: {
    fontSize: 30,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontWeight:'bold',
  },
});
