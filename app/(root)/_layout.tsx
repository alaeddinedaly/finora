import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="InfoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="CreditCardFormScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="GoalFormScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AiBotScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="TransactionFormScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddCategoryForm" options={{ headerShown: false }} />
      <Stack.Screen name="AppearanceScreen" options={{ headerShown: false }} />
      <Stack.Screen name="SupportScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
