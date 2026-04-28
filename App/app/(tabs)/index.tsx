import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import axios from "axios";

export default function HomeScreen() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "391356308653-1h9c8q3cfa004as7s197740olh4s5t8k.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      console.log('google')

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No ID Token received");
      }

      const response = await axios.get(
        "https://api.byslot.online/auth/google/user"
      );

      console.log("Login Success:");
      Alert.alert("Success", "Google Login Successful");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Cancelled", "Login cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Wait", "Login already in progress");
      } else if (
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        Alert.alert("Error", "Play Services not available");
      } else {
        console.log(error.response?.data || error.message );
Alert.alert(
  "Error",
  JSON.stringify(error.response?.data || error.message)
);      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
  },
button: {
  backgroundColor: "#4285F4",
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 10,
  flexDirection: "row",
  alignItems: "center",
},
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});