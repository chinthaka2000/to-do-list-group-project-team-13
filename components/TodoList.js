import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import { supabase } from '../supabase'; // Supabase client initialization
import RNPickerSelect from 'react-native-picker-select'; // For category dropdown

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [category, setCategory] = useState('All');
  const [taskCategory, setTaskCategory] = useState('Work'); // Default category for new task
  const [isInputVisible, setIsInputVisible] = useState(false);

  // Fetch tasks from Supabase database when the component mounts
  useEffect(() => {
    fetchTasks();
  }, [category]); // Refetch tasks when category changes

  // Fetch all tasks from Supabase based on category
  const fetchTasks = async () => {
    try {
      let query = supabase.from('tasks').select('*');

      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTask = async () => {
    if (!text.trim()) return; // Ensure the task has text

    try {
      if (isEditing) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({ text, category: taskCategory })
          .eq('id', editTaskId);
        if (error) throw error;
      } else {
        // Add a new task
        const { data, error } = await supabase
          .from('tasks')
          .insert([{ text, category: taskCategory, completed: false }]); // Insert the task with category
        if (error) throw error;
      }

      // Task successfully added/updated, update the state
      setText('');
      setTaskCategory('Work');
      setIsEditing(false); // Exit editing mode
      setIsInputVisible(false); // Hide the input field
      fetchTasks(); // Refresh tasks after adding/updating
    } catch (error) {
      console.error('Error adding/updating task:', error.message);
    }
  };

  // Delete a task from Supabase
  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion
  const toggleCompleted = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id);
      if (error) throw error;

      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete all completed tasks
  const deleteCompletedTasks = async () => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('completed', true);
      if (error) throw error;

      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
    }
  };

  // Edit a task
  const editTask = (task) => {
    setText(task.text);
    setTaskCategory(task.category);
    setIsEditing(true);
    setEditTaskId(task.id);
    setIsInputVisible(true); // Show input field when editing
  };

  // Toggle the input visibility (Plus button action)
  const toggleInput = () => {
    setIsInputVisible(!isInputVisible);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapercave.com/wp/JDlmniF.jpg' }}
      style={styles.background}
      //imageStyle={{ opacity: 0.4 }} // Adjust transparency here
    >
      <View style={styles.container}>
        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          {['All', 'Work', 'Personal', 'Shopping'].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={category === cat ? styles.activeCategory : styles.categoryButton}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              task={item}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
              editTask={editTask}
            />
          )}
        />

        {/* Plus Button and Input for Adding Task */}
        {!isInputVisible ? (
          <TouchableOpacity style={styles.plusButton} onPress={toggleInput}>
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="New Task"
              placeholderTextColor="#999"
            />

            {/* Category Selector for Adding Task */}
            <RNPickerSelect
              onValueChange={(value) => setTaskCategory(value)}
              items={[
                { label: 'Work', value: 'Work' },
                { label: 'Personal', value: 'Personal' },
                { label: 'Shopping', value: 'Shopping' },
              ]}
              value={taskCategory}
              style={pickerStyles}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleTask}>
              <Text style={styles.addButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={toggleInput}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Button to Delete All Completed Tasks */}
        <TouchableOpacity style={styles.deleteAllButton} onPress={deleteCompletedTasks}>
          <Text style={styles.deleteAllButtonText}>Delete All Completed</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// TodoItem Component with icons for Edit and Delete
const TodoItem = ({ task, deleteTask, toggleCompleted, editTask }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleCompleted(task.id, task.completed)}>
        <Text style={[styles.itemText, task.completed && styles.completed]}>{task.text}</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => editTask(task)} style={styles.editButton}>
          <Ionicons name="create-outline" size={46} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(task.id)} >
          <Ionicons name="trash-outline" size={46} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryButton: {
    padding: 7,
    backgroundColor: '#ffff00',
    borderRadius: 8,
    color:'#000000',
  },
  activeCategory: {
    padding: 7,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  categoryText: {
    color: '#000000',
    fontSize:36,
    fontWeight:'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 1200,
    alignSelf:'center',
  },
  itemText: {
    fontSize: 36,
    color:'#ffffff',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 30,
  },
  editButton: {
    color: '#1E90FF',
    marginRight: 10,
    justifyContent: 'flex start',
  },
  deleteButton: {
    color: 'red',
  },
  plusButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
    alignSelf: 'flex-end',
    margin: 10,
    marginBottom: 0,
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    padding: 0,
    borderWidth: 0,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  plusButtonText: {
    color: '#000000',
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    alignSelf:'center',
    backgroundColor:'white',

  },
  textInput: {
    flex: 1,
    height: 80,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color:'#000000',
    fontWeight:'bold',
    fontSize:30,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
    color:'#ffffff',
  },
  addButtonText: {
    color: '#fff',
    width:70,
    height:25,
  },
  closeButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    width:90,
    height:45,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight:'bold',
  },
  deleteAllButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 400,
    height: 100,
    marginBottom: 20,
  },
  deleteAllButtonText: {
    color: '#fffaf0',
    fontWeight: 'bold',
    fontSize: 36,
  },
});

const pickerStyles = StyleSheet.create({
  // Styles for iOS Picker
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 10,
  },
  // Styles for Android Picker
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
    width: '100%',
    marginVertical: 10,
  },
  // Styles for Web Picker (if applicable)
  inputWeb: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 10,
  },
  // Container style to ensure proper alignment
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Style for picker items
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  // Style for the arrow icon
  iconContainer: {
    top: 12,
    right: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
});

export default TodoList;
