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
      //imageStyle={{ opacity: 0.4 }} // Adjust transparency here
    >
      <View style={styles.container}>
        <Text style={styles.header}>Task Categories</Text>
        
        <View style={styles.categoryContainer}>
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
            contentContainerStyle={styles.taskListContainer} // Center the entire task list
          />
        ) : (
          <Text style={styles.noTasksText}>No tasks in this category.</Text>
        )}
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
    padding: 20,
    //backgroundColor: 'transparent', // Make container transparent to show the background image
  },
  header: {
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10, // Adjust space between buttons
  },
  selectedCategoryButton: {
    backgroundColor: 'red',
  },
  categoryButtonText: {
    fontSize: 38,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: '#ffffff', // White text for selected category button
    textAlign: 'center',
  },
  taskListHeader: {
    fontSize: 65,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 100,
    color: 'red',
    textAlign: 'center', // Center the task list header
  },
  taskListContainer: {
    alignItems: 'center', // Center all task items horizontally
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#000000',
    borderRadius: 8,
    width: width * 0.5, // Set width to 90% of screen width for uniformity
    alignItems: 'center', // Center content of each task item
  },
  taskTitle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center', // Center the task title
  },
  noTasksText: {
    fontSize: 36,
    color: '#000000',
    marginTop: 10,
    textAlign: 'center', // Center the "No tasks" message
  },
});
