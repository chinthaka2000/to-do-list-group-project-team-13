import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks !== null) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
          updateMarkedDates(parsedTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever the task list changes
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        updateMarkedDates(tasks);
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    };

    saveTasks(); // Save the tasks even if the list is empty (cleared tasks)
  }, [tasks]);

  // Filter tasks for the selected date
  useEffect(() => {
    if (selectedDate) {
      const filteredTasks = tasks.filter(task => task.deadline === selectedDate);
      setTasksForSelectedDate(filteredTasks);
    }
  }, [selectedDate, tasks]);

  // Handle adding a new task
  const addTask = () => {
    if (newTaskTitle && newTaskDescription && selectedDate) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        deadline: selectedDate,
        saved: false, // Task is not saved yet
      };

      setTasks([...tasks, newTask]); // Add task to the task list

      // Clear input fields
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  // Handle saving a task
  const saveTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, saved: true } : task
    );
    setTasks(updatedTasks);
  };

  // Handle deleting a task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Update marked dates to show red circle on saved task dates with red dot
  const updateMarkedDates = (taskList) => {
    const newMarkedDates = {};

    taskList.forEach(task => {
      if (task.saved) {
        newMarkedDates[task.deadline] = {
          selected: true,
          selectedColor: 'red',  // Red background for selected saved task date
          marked: true,          // Mark the date
          dotColor: 'red',       // Red bullet for task
        };
      }
    });

    setMarkedDates(newMarkedDates);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri:"https://static.vecteezy.com/system/resources/previews/027/105/997/non_2x/bright-adhesive-notes-on-cork-bulletin-board-free-photo.jpg" }}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.4 }} // Adjust transparency here
      >
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, marked: true, selectedColor: '#1E90FF' }, // Blue color for the currently selected date
            }}
            theme={{
              todayTextColor: '#1E90FF',
            }}
            style={styles.calendar}
          />
        </View>

        <Text style={styles.taskListHeader}>Tasks for {selectedDate}:</Text>

        <ScrollView style={styles.taskListContainer}>
          {tasksForSelectedDate.length > 0 ? (
            <FlatList
              data={tasksForSelectedDate}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <View style={styles.taskTextContainer}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text>{item.description}</Text>
                  </View>

                  {!item.saved && (
                    <TouchableOpacity onPress={() => saveTask(item.id)} style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  )}

                  {item.saved && (
                    <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          ) : (
            <Text style={styles.noTasksText}>No tasks for this day. Click the date to add a task.</Text>
          )}
        </ScrollView>

        {selectedDate ? (
          <View style={styles.addTaskForm}>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Task Description"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
            />
            <Button title="Add Task" onPress={addTask} />
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen height
    backgroundColor: 'transparent',
  },
  imageBackground: {
    flex: 1, // Ensures the background image covers the whole screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarWrapper: {
    width: 1200, // Width of the calendar
    height: 430, // Height of the calendar
    marginBottom: 20, // Margin below the calendar
    backgroundColor: 'white', // Semi-transparent background color
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2, // Add border width
    borderColor: 'red', // Add red border color
  },
  calendar: {
    width: '100%', // Full width of the calendar container
    height: '100%', // Full height of the calendar container
  },
  taskListHeader: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  taskListContainer: {
    flex: 1, // Make the task list container take available space
    maxHeight: 300, // Set a maximum height for the task list
    width:300,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  taskTextContainer: {
    flex: 1,
    borderColor:'#00000',

  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noTasksText: {
    fontSize: 35,
    color: '#000000',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
    flexShrink: 1, // Allow the text to shrink to fit within the container
  },
  addTaskForm: {
    marginTop: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10, // Increase padding for more space inside the input box
    marginBottom: 10,
    borderRadius: 5,
    width: '200%', // Make input box full width of the container
    height: 40, // Increase height of the input box
    alignSelf:'center',
    fontWeight: 'bold',
    fontSize:20,
  },
});
