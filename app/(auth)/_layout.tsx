import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";
import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  const { isSignedIn } = useAuth();

  // Conditional rendering should be done like this:
  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/Home"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign_in" options={{ headerShown: false }} />
      <Stack.Screen name="sign_up" options={{ headerShown: false }} />
    </Stack>
  );
}
