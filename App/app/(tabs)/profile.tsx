import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Linking,
  ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Native icons
import api from "../api.js";

const Profile = () => {
  const [userMail, setUserMail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      // Your Axios interceptor will automatically attach the token
      const response = await api.get("/api/user/app/profile");
      setUserMail(response.data.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const userLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              
              // 2. Clear Local Storage
              await AsyncStorage.removeItem("user_id");
              
              // 3. Navigate to Login
              router.replace("/(login)/login");
            } catch (error) {
              console.log(error);
              // Even if the backend fails, clear local data
              await AsyncStorage.clear();
              router.replace("/(login)/login");
            }
          },
        },
      ]
    );
  };

  const openVendorSite = () => {
    Linking.openURL("https://vendor.byslot.online/").catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <Text style={styles.emailText}>{userMail || "Not available"}</Text>
          )}
        </View>

        <TouchableOpacity onPress={openVendorSite}>
          <Text style={styles.linkText}>Visit Vendor Site</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={userLogout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: "#4b5563",
    fontSize: 14,
    marginBottom: 4,
  },
  emailText: {
    color: "#2563eb",
    fontWeight: "500",
    textAlign: "center",
  },
  linkText: {
    color: "#2563eb",
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Profile;