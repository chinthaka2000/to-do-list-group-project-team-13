import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons if you need

export default function AddTask() {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleTask = () => {
    // Handle add/update task logic here
    console.log('Task:', text);
    setText(''); // Clear the input field after adding/updating
    setIsEditing(false); // Hide the input field
  };

  const toggleInput = () => {
    setIsEditing(!isEditing); // Toggle the input field visibility
  };

  return (
    <View style={styles.container}>
      {/* Plus Icon Button to Show Input Field */}
      {!isEditing ? (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={toggleInput}
        >
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
          <TouchableOpacity style={styles.addButton} onPress={handleTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleInput}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Add styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#1E90FF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
  },
  closeButton: {
    marginLeft: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
  },
});
