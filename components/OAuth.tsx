import { Image, Text, View, Alert } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { useSSO } from "@clerk/clerk-expo";
import { useCallback } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";

// Required for Google OAuth to work in Expo
WebBrowser.maybeCompleteAuthSession();

const OAuth = () => {
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        native: "finora://oauth", // Must match your app scheme
        path: "oauth",
      });

      console.log("Using redirect URL:", redirectUrl); // Debugging

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        // Small delay to ensure smooth transition
        setTimeout(() => router.replace("/(root)/(tabs)/Home"), 100);
      } else {
        Alert.alert("Complete Sign In", "Please finish the sign-in process");
      }
    } catch (err) {
      console.error("OAuth error:", err);
      Alert.alert("Error", "Failed to sign in with Google");
    }
  }, []);
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-neutral-300" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-neutral-300" />
      </View>

      <CustomButton
        className="mt-5 shadow-none w-full"
        title="Continue with Google"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
