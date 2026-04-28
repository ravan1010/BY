import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
   // 1. Change the import to MaterialCommunityIcons

<Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'l'].tint,
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  }}>
  
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color, focused }) => (
        <MaterialCommunityIcons 
          // ✅ Standardized naming in Community Icons
          name={focused ? "home" : "home"} 
          size={28} 
          color={color} 
        />
      ),
    }}
  />

  <Tabs.Screen
    name="profile"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color, focused }) => (
        <MaterialCommunityIcons 
          // ✅ Standardized naming in Community Icons
          name={focused ? "account" : "account"} 
          size={28} 
          color={color} 
        />
      ),
    }}
  />
</Tabs>
  );
}