import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function TodoItem({ task, deleteTask, toggleCompleted, editTask }) {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleCompleted(task.id)}>
        <Text style={[styles.itemText, task.completed && styles.completed]}>
          {task.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => editTask(task)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(task.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
