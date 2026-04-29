import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        // ✅ This forces the active icon/label to be Dark
        tabBarActiveTintColor: '#111827', // A nice deep black/gray
        tabBarInactiveTintColor: '#9CA3AF', // Standard gray for inactive
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF', // Keeping the bar white for contrast
        }
      }}>

      {/* Screens remain the same... */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color} // Inherits the #111827 color when active
            />
          ),
        }}
      />
      {/* ... other screens */}
      <Tabs.Screen
        name="booked"
        options={{
          title: 'Booked',
          headerShown: true,
          headerTitle: 'bookings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              // 'calendar-check' is a great fit for bookings
              name={focused ? "calendar-check" : "calendar-check-outline"}
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
              name={focused ? "account" : "account-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}