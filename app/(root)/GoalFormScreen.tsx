import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { fetchAPI } from "@/lib/fetch";
import { icons } from "@/constants/icons";
import { useUser } from "@clerk/clerk-expo";

const GoalFormScreen = () => {
  const { user } = useUser();

  const userId = user?.id.toString();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep open on iOS, close on Android after select
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!title || !targetAmount || !dueDate) {
      Alert.alert("Please fill all required fields");
      return;
    }

    try {
      await fetchAPI("/(api)/goal", {
        method: "POST",
        body: JSON.stringify({
          title,
          targetAmount,
          savedAmount,
          dueDate: dueDate.toISOString().split("T")[0], // format: "YYYY-MM-DD"
          userId,
        }),
      });

      Alert.alert("Goal Added Successfully!");
      navigation.goBack();
    } catch (error) {
      // @ts-ignore
      Alert.alert(
        "Failed to add goal",
        error.errors?.[0]?.longMessage || String(error),
      );
    }
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

      <Text className="flex-1 text-center text-[#2c3e50] text-3xl font-extrabold">
        Create Goal
      </Text>

      <ScrollView className="mx-4 mb-5">
        <InputField
          label="Goal Title"
          icon={icons.person}
          placeholder="e.g. Vacation Fund"
          value={title}
          onChangeText={setTitle}
        />
        <InputField
          label="Target Amount"
          icon={icons.person}
          placeholder="e.g. 5000"
          value={targetAmount}
          keyboardType="numeric"
          onChangeText={setTargetAmount}
        />
        <InputField
          label="Saved Amount"
          icon={icons.person}
          placeholder="e.g. 1000"
          value={savedAmount}
          keyboardType="numeric"
          onChangeText={setSavedAmount}
        />

        {/* Due Date picker touchable */}
        <Text className="text-lg font-semibold mb-3 ">Due Date</Text>
        <TouchableOpacity
          className="py-3 px-4 border border-gray-300 rounded-md"
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            className={`text-base ${dueDate ? "text-black" : "text-gray-400"}`}
          >
            {dueDate ? dueDate.toISOString().split("T")[0] : "Select Due Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <CustomButton
          className={"mt-6"}
          onPress={handleSubmit}
          title="Save Goal"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalFormScreen;
