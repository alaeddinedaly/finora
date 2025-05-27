// utils/notifications.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Setup notification handler globally (only once)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask permission + configure Android channel
export async function registerForNotifications() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission for notifications not granted!");
    }

    console.log("Notification permission granted");
  } catch (err) {
    console.error("Failed to register for notifications:", err);
  }
}

// Schedule a local notification
export async function sendLocalNotification({ title, body, delayInSeconds }) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: delayInSeconds },
    });
    console.log("Scheduled notification");
  } catch (err) {
    console.error("Failed to schedule notification:", err);
  }
}
