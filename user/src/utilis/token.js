import { getToken } from "firebase/messaging";
import { messaging } from "./firebase.js";
import api from "../api.js";

export const generateAndSaveFCMToken = async () => {

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    if(permission === "granted"){
    const token = await getToken(messaging, {
      vapidKey: "BPcWN5bCGY7dJTyDkF3aGeIGfd2iKO3B__dV2htnXtTegOG1crO2gBl9WQ-jCqs6gjbDRLubaTMFjeaGgBwM8NM",
    });
    
    if (token) {
      await api.put("/api/user/notifications/fcmToken", { fcmToken: token });
      console.log("FCM token saved");
    }
}
  } catch (err) {
    console.error("FCM error:", err);
  }

  return 
};
