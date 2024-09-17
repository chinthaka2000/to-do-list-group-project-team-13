import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../supabase'; // Import your Supabase client

const categories = ['All', 'Work', 'Personal', 'Shopping'];

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
        />
      ) : (
        <Text style={styles.noTasksText}>No tasks in this category.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#99CC66',
  },
  header: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#1E90FF',
  },
  categoryButtonText: {
    fontSize: 25,
    color: '#333',
  },
  selectedCategoryButtonText: {
    color: '#fff',
    //width :50
  },
  taskListHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  noTasksText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});