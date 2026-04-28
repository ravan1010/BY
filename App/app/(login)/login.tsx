import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // ✅ Import useRouter
import api from "../api.js";

export default function LoginScreen() {
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "391356308653-1h9c8q3cfa004as7s197740olh4s5t8k.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error("No ID Token received");

      // ✅ Exchange token with your backend
      const response = await api.post("/auth/app/google/user", {
        token: idToken,
      });

      console.log("Backend Response:", response.data);

      if (response.data.success) {
        // ✅ 1. Save the internal MongoDB User ID
        await AsyncStorage.setItem('user_id', response.data.userId);
        
        // ✅ 2. Redirect to the main app (tabs)
        router.replace("/(tabs)"); 
      } else {
        Alert.alert("Login Failed", "Could not verify account with server.");
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Cancelled", "Login cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Wait", "Login already in progress");
      } else {
        console.log("Error Details:", error.response?.data || error.message);
        Alert.alert("Error", JSON.stringify(error.response?.data || error.message));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2, // Shadow for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});