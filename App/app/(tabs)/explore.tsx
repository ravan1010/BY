import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { useEffect } from 'react';


export default function Explore() {
// Replace with your actual Web Client ID from Google Cloud Console
const WEB_CLIENT_ID = '391356308653-1r1p6repasceu09418srbmp609br814b.apps.googleusercontent.com';

// Use your computer's local IP address (e.g., 192.168.1.5) 
// or 10.0.2.2 for the Android Emulator
const API_BASE_URL = 'https://api.byslot.online/auth/google/user'; 

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true, 
});

const signIn = async () => {
  try {
    // 1. Check for Play Services
    await GoogleSignin.hasPlayServices();
    
    // 2. Trigger Google Sign-In
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data.idToken;

    if (!idToken) {
      throw new Error("No ID Token received from Google");
    }

    // 3. Send to Express Backend using Axios
    // Axios automatically handles JSON.stringify(body) and headers
    const response = await axios.post(`https://api.byslot.online/auth/google/user`, {
      token: idToken,
    });

    // Axios stores the response body in 'data'
    console.log("Backend Success:", response.data);
    return response.data;

  } catch (error) {
    // Handle specific Google Sign-In errors
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("User cancelled the login flow");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Sign in is already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Play services not available or outdated");
    } else {
      // Handle Axios/Network errors
      console.error("Login Error Details:", error.response?.data || error.message);
    }
  }
}};