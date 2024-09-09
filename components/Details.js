import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Details({ route }) {
  const { task } = route.params; // The task object passed from the TodoList
  const navigation = useNavigation();

  // Handler for deleting a task
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          // Implement the deletion logic here
          navigation.goBack(); // Go back to the task list after deletion
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.deadline}>Deadline: {task.deadline}</Text>
      <Text style={styles.status}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditTask', { task })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Task List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  deadline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: task.completed ? '#4CAF50' : '#FF6347',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 18,
  },
});
