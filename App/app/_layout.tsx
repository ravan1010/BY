import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
    const [id, setid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const userId = await AsyncStorage.getItem('user_id');
            if (userId) {
                setid(true);
            }
        } catch (e) {
            console.log("Failed to load user_id", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;

        if (id) {
            router.replace('/(tabs)');
        } else {
            router.replace('/(login)/login');
        }
    }, [id, isLoading]);

    return (
        <Stack
            screenOptions={{
                // ✅ This hides the header for ALL screens in this stack
                headerShown: false,
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(login)/login" />
        </Stack>
    );
}