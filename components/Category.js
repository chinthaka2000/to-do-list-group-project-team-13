import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';

const Category = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');

      if (error) {
        throw error;
      }

      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Tasks', { categoryId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item.id)}>
            <Text style={styles.categoryItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your styling
});

export default Category;