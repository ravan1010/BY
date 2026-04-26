// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.byslot.online",
  // baseURL: "http://localhost:5000",
  withCredentials: true
});

export default api;

