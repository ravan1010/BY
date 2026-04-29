import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import api from "../api";

// Define your vendor type
interface Vendor {
  _id: string;
  eventName: string;
}

const Home = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch vendors from your API
  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/user/app/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ Render Item for the list
  const renderVendor = ({ item }: { item: Vendor }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`../components/${item._id}`)}
    >
      <FontAwesome5 name="birthday-cake" size={30} color="#EAB308" />
      
      <Text style={styles.vendorName}>{item.eventName}</Text>
      <Text style={styles.subtitle}>Click to view details</Text>
      
      <MaterialIcons name="celebration" size={30} color="#EAB308" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Vendors</Text>
      
      <FlatList
        data={vendors}
        keyExtractor={(item) => item._id}
        renderItem={renderVendor}
        contentContainerStyle={styles.listContent}
        numColumns={2} // Grid layout
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 20,
    borderBottomWidth: 2,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
});

export default Home;