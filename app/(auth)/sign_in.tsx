import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import WaveHeader from "@/components/WaveHeader";
import InputField from "@/components/InputField";
import { useState } from "react";
import { icons } from "@/constants/icons";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email.trim(),
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // @ts-ignore
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FFF5F0]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <WaveHeader />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
          >
            <View className="pt-[180px]">
              <Text className="text-[28px] font-bold text-center text-[#333]">
                Welcome Back!
              </Text>
              <Text className="text-base text-center text-[#666] mt-2">
                Please Create your Account below
              </Text>
            </View>

            <View className="mt-6">
              <InputField
                label="Email"
                placeholder="Enter your Email"
                icon={icons.email}
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
              <InputField
                label="Password"
                placeholder="Enter your password"
                icon={icons.lock}
                secureTextEntry={showPassword}
                value={form.password}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={showPassword ? icons.eyeOff : icons.eyeOn}
                      style={{ width: 20, height: 20, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                }
                onChangeText={(value) => setForm({ ...form, password: value })}
              />

              <CustomButton
                className="mt-6"
                onPress={onSignInPress}
                title="Sign In"
              />
              <OAuth />
            </View>
          </ScrollView>

          {/* Fixed Link Footer */}
          <View className="p-5">
            <Link
              className="text-lg text-center text-neutral-300"
              href="/sign_up"
            >
              <Text>Don&#39;t have an account? </Text>
              <Text className="text-[#5c9fef]">Sign Up</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
