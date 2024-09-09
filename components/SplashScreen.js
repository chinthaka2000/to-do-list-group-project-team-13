import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ToDoListAppLogo from './ToDoListAppLogo'; // Import your logo component

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ToDoListAppLogo />
      <ActivityIndicator size="large" color="#4d9de0" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SplashScreen;
