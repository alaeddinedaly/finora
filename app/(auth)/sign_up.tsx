import * as React from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

import WaveHeader from "@/components/WaveHeader";
import InputField from "@/components/InputField";
import { useState } from "react";
import { icons } from "@/constants/icons";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { ReactNativeModal } from "react-native-modal";
import { images } from "@/constants/images";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      console.log("Sign Up not loaded");
      return;
    }

    try {
      await signUp.create({
        firstName: form.name.split(" ")[0],
        emailAddress: form.email.trim(),
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.longMessage || "Sign up error");
    }
  };

  // Modified to return a boolean indicating success/failure
  const onVerifyPress = async (): Promise<boolean> => {
    if (!isLoaded) return false;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      console.log("Sign Up Attempt:", signUpAttempt);

      if (signUpAttempt.status === "complete") {
        // Create new user in database once clerk user is created
        const { createdUserId } = signUpAttempt;
        console.log("Created User ID:", createdUserId);
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: createdUserId,
          }),
        });

        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
        return true; // success
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed.",
        });
        return false; // failed
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors?.[0]?.longMessage || "Verification error",
      });
      return false;
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
                Welcome To <Text className="text-[#5c9fef]">Finora</Text>
              </Text>
              <Text className="text-base text-center text-[#666] mt-2">
                Please Create your Account below
              </Text>
            </View>

            <View className="mt-6">
              <InputField
                label="Name"
                placeholder="Enter your name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
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
                onChangeText={(value) => setForm({ ...form, password: value })}
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
              />
              <CustomButton
                className="mt-6"
                onPress={async () => {
                  await onSignUpPress();
                  setShowVerificationModal(true);
                }}
                title="Sign Up"
              />
              <OAuth />
            </View>
          </ScrollView>

          {/* Fixed Link Footer */}
          <View className="p-5">
            <Link
              className="text-lg text-center text-neutral-300"
              href="/sign_in"
            >
              <Text>Already have an account? </Text>
              <Text className="text-[#5c9fef]">Log In</Text>
            </Link>
          </View>

          {/* Verification Modal */}
          <ReactNativeModal isVisible={showVerificationModal}>
            <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
              <Text className={"text-2xl font-extrabold mb-2"}>
                Verification
              </Text>
              <Text className={"font-semibold mb-5"}>
                We&#39;ve sent a verification code to {form.email}
              </Text>
              <InputField
                label={"Code"}
                icon={icons.lock}
                placeholder={"12345"}
                value={verification.code}
                keyboardType={"numeric"}
                onChangeText={(code) =>
                  setVerification({
                    ...verification,
                    code,
                    error: "", // Clear error on change
                  })
                }
              />
              {verification.error ? (
                <Text className={"text-red-500 text-sm mt-1"}>
                  {verification.error}
                </Text>
              ) : null}
              <CustomButton
                onPress={async () => {
                  const success = await onVerifyPress();
                  if (success) {
                    setShowSuccessModal(true);
                    setShowVerificationModal(false);
                  }
                }}
                title={"Verify Email"}
              />
            </View>
          </ReactNativeModal>

          {/* Success Modal */}
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
              <Image
                source={images.check}
                className={"w-[110px] h-[110px] mx-auto my-5"}
              />
              <Text className={"text-3xl font-semibold text-center"}>
                Verified
              </Text>
              <Text
                className={
                  "text-base text-gray-400 font-semibold text-center mt-2"
                }
              >
                You have successfully verified your account.
              </Text>
              <CustomButton
                onPress={() => {
                  router.replace("/(root)/(tabs)/Home");
                  setShowSuccessModal(false);
                }}
                title={"Browse Home"}
              />
            </View>
          </ReactNativeModal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
