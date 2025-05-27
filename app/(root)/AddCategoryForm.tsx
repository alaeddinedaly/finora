import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";
import { fetchAPI } from "@/lib/fetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import WheelColorPicker from "react-native-wheel-color-picker";

const AddCategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ff0000");

  const navigation = useNavigation();
  const { user } = useUser();
  const userId = user?.id.toString();

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Please fill all fields");
      return;
    }

    await fetchAPI("/(api)/categories", {
      method: "POST",
      body: JSON.stringify({
        name,
        userId,
        color,
      }),
    });

    Alert.alert("Category Added Successfully!");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="relative flex-row items-center py-5 px-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="left-5"
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor="#2c3e50"
          />
        </TouchableOpacity>
      </View>

      <Text className="text-center text-[#2c3e50] text-3xl font-extrabold mb-2">
        Add Category
      </Text>

      <ScrollView
        className="mx-4 mb-5"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <InputField
          label={"Name"}
          icon={icons.person}
          placeholder={"e.g. Groceries"}
          value={name}
          keyboardType={"default"}
          onChangeText={(newName) => setName(newName)}
        />

        <InputField
          label={"Description"}
          icon={icons.person}
          placeholder={"e.g. Shopping expenses"}
          value={description}
          keyboardType={"default"}
          onChangeText={(newDescription) => setDescription(newDescription)}
        />

        <Text className="text-lg font-semibold text-neutral-700 mt-4 mb-2 ml-1">
          Choose color:
        </Text>

        <View className="w-40 h-40 self-center mb-6">
          <WheelColorPicker
            color={color}
            onColorChange={(newColor) => setColor(newColor)}
          />
        </View>
      </ScrollView>
      <View className={"mb-5 px-5"}>
        <CustomButton onPress={handleSubmit} title={"Save"} />
      </View>
    </SafeAreaView>
  );
};

// @ts-ignore
export default AddCategoryForm;
