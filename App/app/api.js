import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api.byslot.online',
});

// ✅ Automatically add token to headers before request is sent
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('user_id');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;