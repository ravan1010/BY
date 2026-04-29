import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api';

const Booked = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/user/app/get/booking');
      setBookingData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    // Native replacement for window.confirm
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await api.post(`/api/user/cancel/booking/${id}`);
              Alert.alert("Success", res.data.message);
              fetchData();
            } catch (error) {
              console.log(error);
            }
          } 
        }
      ]
    );
  };

  const renderBookingItem = ({ item }: any) => {
    // Helper to find the correct variant
    const variant = item.EventPostID?.variants?.find((v: any) => v._id === item.VariantID);

    return (
      <View style={styles.card}>
        <Text style={styles.eventName}>{item.EventPostID?.eventName || "Event"}</Text>
        <Text style={styles.variantName}>{variant?.name || "Standard"}</Text>

        {variant?.images?.[0] && (
          <Image source={{ uri: variant.images[0] }} style={styles.image} />
        )}

        <Text style={styles.price}>₹{variant?.price}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>📅 Date: {item.date}</Text>
          <Text style={styles.detailText}>📞 Mobile: {item.UserMobile}</Text>
        </View>

        <View style={styles.otpRow}>
          <Text style={styles.vendorText}>Vendor: {item.VendorId?.eventName}</Text>
          {item.ProgressOTP > 0 && <Text style={styles.otpText}>OTP: {item.ProgressOTP}</Text>}
          {item.completeOTP > 0 && <Text style={styles.otpText}>OTP: {item.completeOTP}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.viewButton]} 
            onPress={() => router.push(`../components/${item.EventPostID._id}/${item.VendorId._id}`)}
          >
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          {item.status === "pending" ? (
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => handleCancel(item._id)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          ) : item.status === "cancel" ? (
            <View style={[styles.button, styles.disabledButton]}>
              <Text style={styles.buttonText}>Canceled</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookingData}
        keyExtractor={(item) => item._id}
        renderItem={renderBookingItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no booked events at the moment.</Text>
        }
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listPadding: { padding: 16, paddingTop: 60 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  variantName: { fontSize: 14, color: '#4B5563', marginBottom: 8 },
  image: { width: '100%', height: 180, borderRadius: 8, marginVertical: 10 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  detailsRow: { marginBottom: 8 },
  detailText: { fontSize: 13, color: '#4B5563' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  vendorText: { fontSize: 13, color: '#6B7280' },
  otpText: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
  buttonContainer: { flexDirection: 'row', gap: 10, marginTop: 12 },
  button: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  viewButton: { backgroundColor: '#3B82F6' },
  cancelButton: { backgroundColor: '#EF4444' },
  disabledButton: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 100, color: '#9CA3AF' }
});

export default Booked;