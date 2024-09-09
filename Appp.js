import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './supabase'; // Use Supabase client
import Login from './components/Login';
import TodoList from './components/TodoList';
import SplashScreen from './components/SplashScreen';
import SettingsScreen from './components/SettingsScreen';
import TaskCategories from './components/TaskCategories';
import Profile from './components/Profile';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer({ tasks }) {
  return (
    <Drawer.Navigator initialRouteName="TodoList">
      <Drawer.Screen name="TodoList" component={TodoList} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Task Categories">
        {props => <TaskCategories {...props} tasks={tasks} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [delayComplete, setDelayComplete] = useState(false);
  const [tasks, setTasks] = useState([]); // Store tasks in state

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks') // Assuming the table name is 'tasks'
          .select('*');
        if (error) throw error;
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Consider setting an error state here to show to the user
      }
    };

    const delayTimeout = setTimeout(() => {
      setDelayComplete(true);
    }, 3000);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        loadTasks(); // Load tasks only if the user is logged in
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    checkSession();

    return () => clearTimeout(delayTimeout);
  }, []);

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
            {props => <MyDrawer {...props} tasks={tasks} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
