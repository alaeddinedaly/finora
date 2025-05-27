import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { icons } from "@/constants/icons"; // For back arrow
import { images } from "@/constants/images"; // Optional: app logo

const InfoScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor="#2c3e50"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#2c3e50]">About Finora</Text>
        <View className="w-6 h-6" />
      </View>

      <ScrollView className="px-6 py-4">
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={icons.logo} // Replace with your actual logo
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-3xl font-extrabold text-center text-[#2c3e50] mb-2">
          Welcome to Finora! 💸
        </Text>

        {/* Subheading */}
        <Text className="text-center text-base text-gray-500 mb-6">
          Your all-in-one personal finance tracker
        </Text>

        {/* Features */}
        <View className="space-y-5">
          <Text className="text-base text-gray-800 leading-6">
            🏦{" "}
            <Text className="font-bold text-[#5c9fef]">
              Add and manage cards
            </Text>{" "}
            to keep all your finances in one place. Monitor your balances, and
            switch between cards effortlessly.
          </Text>

          <Text className="text-base text-gray-800 leading-6">
            📊{" "}
            <Text className="font-bold text-[#5c9fef]">
              Track your transactions
            </Text>{" "}
            in real time. Know where your money goes and stay on top of your
            spending habits.
          </Text>

          <Text className="text-base text-gray-800 leading-6">
            🎯{" "}
            <Text className="font-bold text-[#5c9fef]">
              Set financial goals
            </Text>{" "}
            — from saving for a trip to building an emergency fund — and watch
            your progress grow!
          </Text>

          <Text className="text-base text-gray-800 leading-6">
            🤖{" "}
            <Text className="font-bold text-[#5c9fef]">
              AI insights coming soon!
            </Text>{" "}
            Finora will soon use smart AI to give you spending advice, saving
            suggestions, and predictive budgeting tools.
          </Text>

          <Text className="text-base text-gray-800 leading-6">
            🌈 Beautiful design, easy to use, and built with care — Finora helps
            you feel in control of your money, every single day.
          </Text>
        </View>

        {/* Footer */}
        <View className="mt-10 mb-6">
          <Text className="text-center text-gray-400 text-xs">
            🚀 Start your journey to smarter spending with Finora!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfoScreen;
