import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen({ tasks }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  // Filter tasks for the selected date
  useEffect(() => {
    if (selectedDate) {
      const filteredTasks = tasks.filter(task => task.deadline === selectedDate);
      setTasksForSelectedDate(filteredTasks);
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#1E90FF' },
        }}
        theme={{
          todayTextColor: '#1E90FF',
        }}
      />
      
      <Text style={styles.taskListHeader}>Tasks for {selectedDate}:</Text>

      {tasksForSelectedDate.length > 0 ? (
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTasksText}>No tasks for this day.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  taskListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTasksText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
