import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../api";

const { width } = Dimensions.get("window");

const VendorDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/api/user/vendor/${id}`);
        setVendor(res.data);
      } catch (err) {
        setError("Failed to load vendor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading vendor...</Text>
      </View>
    );
  }

  if (error || !vendor) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "No vendor found"}</Text>
      </View>
    );
  }

  const firstEvent = vendor.eventPosts?.[0];
  const firstVariant = firstEvent?.variants?.[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Top Banner / Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2563eb" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.p6}>
          <Text style={styles.title}>{vendor.eventName}</Text>
          <Text style={styles.description}>{vendor.description}</Text>

          <Text style={styles.sectionHeader}>Events</Text>

          {firstEvent ? (
            <TouchableOpacity 
              activeOpacity={0.9}
            //   onPress={() => 
            //     router.push(`/event/${firstEvent._id}/${vendor._id}/${firstVariant?._id}`)
            //   }
              style={styles.eventItem}
            >
              <Text style={styles.eventTitle}>{firstEvent.eventName}</Text>

              {firstVariant && (
                <View style={styles.variantCard}>
                  <Image 
                    source={{ uri: firstVariant.images?.[0] }} 
                    style={styles.eventImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.variantContent}>
                    <Text style={styles.variantName}>{firstVariant.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.mrp}>₹ {firstVariant.mrp}</Text>
                      <Text style={styles.price}>₹ {firstVariant.price}</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.emptyText}>No event available.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#4b5563" },
  errorText: { color: "#ef4444", fontSize: 16 },
  backButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    marginTop: 40 
  },
  backText: { marginLeft: 8, color: "#2563eb", fontWeight: "500" },
  card: { 
    backgroundColor: "#fff", 
    marginHorizontal: 16, 
    borderRadius: 16, 
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  p6: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  description: { fontSize: 16, color: "#4b5563", marginBottom: 24, lineHeight: 22 },
  sectionHeader: { fontSize: 20, fontWeight: "600", color: "#1f2937", marginBottom: 16 },
  eventItem: { 
    borderWidth: 1, 
    borderColor: "#e5e7eb", 
    borderRadius: 12, 
    padding: 12,
    backgroundColor: "#fff"
  },
  eventTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
  variantCard: { 
    borderRadius: 8, 
    overflow: "hidden", 
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f4f6"
  },
  eventImage: { width: "100%", height: 180 },
  variantContent: { padding: 12 },
  variantName: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 4 },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  mrp: { fontSize: 14, color: "#9ca3af", textDecorationLine: "line-through" },
  price: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  emptyText: { color: "#6b7280", fontStyle: "italic" }
});

export default VendorDetails;