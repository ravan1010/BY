import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL : "https://api.byslot.online"
  withCredentials: true, // 🔥 important for cookies
});

export default api;