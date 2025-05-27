import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/icons";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AllGoals from "@/components/AllGoals";

export default function GoalScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className={"relative flex-row justify-between items-center py-5 px-5"}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={"flex justify-start items-start ml-5"}
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor={"#2c3e50"}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
        <Text
          className={"flex text-[#2c3e50] text-2xl font-extrabold text-center"}
        >
          Savings Goals
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(root)/GoalFormScreen")}
          className={"flex justify-start items-start mr-5"}
        >
          <Image
            source={icons.plus1}
            className="w-10 h-10"
            tintColor={"#2c3e50"}
          />
        </TouchableOpacity>
      </View>
      <AllGoals />
    </SafeAreaView>
  );
}
