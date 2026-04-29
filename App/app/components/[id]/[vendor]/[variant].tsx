import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CalendarPicker from "../../../../components/CalendarPicker"
import api from "../../../api"; // Adjust path as needed
// Note: You will likely need a native calendar library like 'react-native-calendars'
// For now, I'll assume your CalendarPicker is converted to Native.

const EventPage = () => {
    const { id, vendor, variant } = useLocalSearchParams();
    const router = useRouter();

    const [activeVariant, setActiveVariant] = useState(variant);
    const [eventPost, setEventPost] = useState<any>(null);
    const [dates, setDates] = useState([]);
    const [mobile, setMobile] = useState("");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventPost = async () => {
            try {
                const res = await api.get(`/api/user/app/vendorPost/${id}/${vendor}`);
                setEventPost(res.data.eventPosts);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const formattedDates = res.data.vendor.availableDates
                    .map((date: string) => new Date(date))
                    .filter((date: Date) => date >= today)
                    .map((date: Date) => date.toISOString().split("T")[0]);

                setDates(formattedDates);
                setActiveVariant(variant);
            } catch (err) {
                setError("Failed to load event post details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventPost();
    }, [id, vendor]);

    const bookSubmit = async () => {
        if (!mobile || mobile.length !== 10 || !selectedDate) {
            return Alert.alert("Error", "Please enter a valid 10-digit mobile number and select a date.");
        }

        try {
            const res = await api.post(`/api/user/app/booking/${id}/${vendor}/${activeVariant}`, {
                mobile,
                selectedDate
            });
            if (res.data.success) {
                Alert.alert("Success", "Booking successful!");
                setMobile('');
                setSelectedDate(null);
                router.push("/(tabs)/booked");
            }
        } catch (error) {
            Alert.alert("Error", "Booking failed. Please try again.");
        }
    };

    const selectedVariantData = eventPost?.variants?.find(
        (v: any) => v._id === activeVariant
    );

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#2563eb" /></View>;
    if (error || !eventPost) return <View style={styles.centered}><Text style={styles.errorText}>{error || "Not found"}</Text></View>;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.contentCard}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#2563eb" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{eventPost.eventName}</Text>
                <Text style={styles.subtitle}>{eventPost.EventType}</Text>

                {/* Variants Horizontal Scroll */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.variantsScroll}>
                    {eventPost?.variants?.map((v: any) => (
                        <TouchableOpacity
                            key={v._id}
                            onPress={() => {
                                setActiveVariant(v._id);
                                // In Expo Router, you can update the URL or just state
                                setActiveVariant(v._id);
                            }}
                            style={[
                                styles.variantItem,
                                activeVariant === v._id ? styles.activeVariantItem : styles.inactiveVariantItem
                            ]}
                        >
                            {v.images?.[0] && <Image source={{ uri: v.images[0] }} style={styles.variantThumb} />}
                            <Text style={styles.variantName} numberOfLines={1}>{v.name}</Text>
                            <Text style={styles.variantPrice}>₹ {v.price}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {selectedVariantData && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.sectionHeader}>Event Details</Text>

                        {/* Image Gallery */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                            {selectedVariantData.images?.map((img: string, i: number) => (
                                <Image key={i} source={{ uri: img }} style={styles.galleryImage} />
                            ))}
                        </ScrollView>

                        <Text style={styles.selectedName}>{selectedVariantData.name}</Text>

                        <View style={styles.priceRow}>
                            <Text style={styles.mrp}>₹ {selectedVariantData.mrp}</Text>
                            <Text style={styles.priceHighlight}>₹ {selectedVariantData.price}</Text>
                        </View>

                        {/* List Sections */}
                        {['why', 'includes'].map((key) => (
                            selectedVariantData[key]?.length > 0 && (
                                <View key={key} style={styles.listSection}>
                                    <Text style={styles.listTitle}>{key === 'why' ? 'Why' : 'Includes'}</Text>
                                    {selectedVariantData[key].map((item: string, i: number) => (
                                        <Text key={i} style={styles.listItem}>{i + 1}. {item}</Text>
                                    ))}
                                </View>
                            )
                        ))}

                        {/* Calendar Placeholder - Replace with your Native Calendar component */}
                        <View style={styles.calendarContainer}>
                            <Text style={styles.label}>Select Date</Text>
                            <CalendarPicker
                                availableDates={dates}
                                onDateSelect={(d) => {
                                    console.log("Date selected in parent:", d);
                                    setSelectedDate(d);
                                }}
                            />

                            {selectedDate && (
                                <Text style={{ marginTop: 20, color: 'blue' }}>
                                    You have selected: {selectedDate}
                                </Text>
                            )}
                        </View>

                        {/* Booking Form */}
                        <View style={styles.bookingForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter mobile number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobile}
                                onChangeText={setMobile}
                            />
                            <TouchableOpacity
                                style={[styles.bookButton, (!mobile || mobile.length !== 10) && styles.disabledButton]}
                                onPress={bookSubmit}
                                disabled={!mobile || mobile.length !== 10}
                            >
                                <Text style={styles.bookButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    contentCard: { padding: 16, marginTop: 40 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backText: { color: "#2563eb", marginLeft: 4 },
    title: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
    subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 16 },
    variantsScroll: { paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#e5e7eb" },
    variantItem: { width: 120, p: 10, borderRadius: 12, marginRight: 12, alignItems: "center", borderWidth: 1 },
    activeVariantItem: { backgroundColor: "#dbeafe", borderColor: "#2563eb" },
    inactiveVariantItem: { backgroundColor: "#fff", borderColor: "#e5e7eb" },
    variantThumb: { width: 100, height: 60, borderRadius: 8, marginBottom: 5 },
    variantName: { fontSize: 12, color: "#374151" },
    variantPrice: { fontSize: 14, fontWeight: "bold", color: "#059669" },
    detailsContainer: { marginTop: 20 },
    sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    gallery: { marginBottom: 15 },
    galleryImage: { width: 200, height: 130, borderRadius: 12, marginRight: 10 },
    selectedName: { fontSize: 18, fontWeight: "600", textAlign: "center", marginVertical: 10 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 },
    mrp: { textDecorationLine: "line-through", color: "#9ca3af" },
    priceHighlight: { fontSize: 20, fontWeight: "bold", color: "#059669" },
    listSection: { marginTop: 15, paddingHorizontal: 10 },
    listTitle: { fontWeight: "bold", borderBottomWidth: 1, borderColor: "#e5e7eb", marginBottom: 5 },
    listItem: { fontSize: 14, color: "#4b5563", marginBottom: 2 },
    calendarContainer: { marginVertical: 20 },
    label: { fontWeight: "bold", marginBottom: 5 },
    dummyCalendar: { height: 150, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center", borderRadius: 12 },
    bookingForm: { marginTop: 10 },
    input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, marginBottom: 12 },
    bookButton: { backgroundColor: "#2563eb", padding: 15, borderRadius: 8, alignItems: "center" },
    disabledButton: { backgroundColor: "#93c5fd" },
    bookButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    errorText: { color: "#ef4444" }
});

export default EventPage;