import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

const ToDoListAppLogo = () => {
  return (
    <View style={styles.container}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        {/* Rounded Square */}
        <Rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="15"
          fill="url(#grad)"
        />
        {/* Gradient */}
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4d9de0" stopOpacity="1" />
            <Stop offset="100%" stopColor="#5670ff" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Circles and Lines */}
        <Circle cx="30" cy="30" r="5" fill="white" />
        <Line x1="40" y1="30" x2="70" y2="30" stroke="white" strokeWidth="4" />
        
        <Circle cx="30" cy="50" r="5" fill="white" />
        <Line x1="40" y1="50" x2="70" y2="50" stroke="white" strokeWidth="4" />
        
        <Circle cx="30" cy="70" r="5" fill="white" />
        <Line x1="40" y1="70" x2="70" y2="70" stroke="white" strokeWidth="4" />
      </Svg>
      
      {/* App Name */}
      <Text style={styles.appName}>TO-DO LIST APP</Text>
      {/* Slogan */}
      <Text style={styles.slogan}>Organize Your Life One Task at a Time</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4d9de0'
  },
  slogan: {
    fontSize: 12,
    color: '#7f8fa6',
    marginTop: 5
  }
});

export default ToDoListAppLogo;
