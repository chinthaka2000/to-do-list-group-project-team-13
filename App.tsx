import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './lib/supabase'; // Ensure the correct path to supabase client
import Login from './components/Login';
import TodoList from './components/TodoList';
import SplashScreen from './components/SplashScreen';
import SettingsScreen from './components/SettingsScreen';
import TaskCategories from './components/TaskCategories';
import Profile from './components/Profile';
import CalendarScreen from './components/CalendarScreen'; // Import CalendarScreen
import { Session } from '@supabase/supabase-js';
import { View } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';

// Stack and Drawer navigator initialization
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer({ tasks }: { tasks: any[] }) {
    return (
      <Drawer.Navigator
        initialRouteName="TodoList"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="TodoList">
          {(props) => <TodoList {...props} tasks={tasks} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Task Categories">
          {(props) => <TaskCategories {...props} tasks={tasks} />}
        </Drawer.Screen>
        <Drawer.Screen name="Calendar">
          {(props) => <CalendarScreen {...props} tasks={tasks} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }
  

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [delayComplete, setDelayComplete] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // Storing tasks in state

  // Fetch tasks from Supabase
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks') // Assuming table name is 'tasks'
        .select('*');
      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setDelayComplete(true);
    }, 3000);

    // Check for existing session and handle authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsLoggedIn(true);
        loadTasks(); // Load tasks when logged in
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsLoggedIn(true);
        loadTasks();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => clearTimeout(delayTimeout);
  }, []);

  // Render SplashScreen if still loading
  if (loading || !delayComplete) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => <Login {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {(props) => <MyDrawer {...props} tasks={tasks} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
