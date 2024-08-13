import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.black,
        tabBarLabelStyle: {
          fontFamily: "aeonik",
          paddingBottom: 3,
          lineHeight: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          headerShown: false,
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          headerShown: false,
          tabBarLabel: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
