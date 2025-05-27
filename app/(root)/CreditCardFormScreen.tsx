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
import { icons } from "@/constants/icons";
import { useNavigation } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreditCardFormScreen = () => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const { user } = useUser();
  const userId = user?.id.toString();

  const year = String(dueDate?.getFullYear()).slice(-2); // e.g., "25"
  const month = String(dueDate?.getMonth() + 1).padStart(2, "0"); // e.g., "05"
  const expiryDate = `${year}/${month}`;

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name || !balance || !number || !type || !dueDate) {
      Alert.alert("Please fill all fields");
      return;
    }

    await fetchAPI("/(api)/card", {
      method: "POST",
      body: JSON.stringify({
        name,
        totalBalance: balance,
        cardNumber: number,
        cardType: type,
        expiryDate: expiryDate,
        userId,
      }),
    });

    Alert.alert("Card Added Successfully!");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="relative flex-row items-center py-5 px-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" left-5"
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor="#2c3e50"
          />
        </TouchableOpacity>
      </View>
      <Text className="flex-1 text-center text-[#2c3e50] text-3xl font-extrabold">
        Create card
      </Text>
      <ScrollView className={"mx-4 mb-5"}>
        <InputField
          label={"Name"}
          icon={icons.person}
          placeholder={"e.g. Groceries"}
          value={name}
          onChangeText={setName}
        />
        <InputField
          label={"Balance"}
          icon={icons.person}
          placeholder={"e.g. 999"}
          value={balance}
          keyboardType={"numeric"}
          onChangeText={setBalance}
        />
        <InputField
          label={"Number"}
          icon={icons.person}
          placeholder={"e.g. 5245 5214 5639 8789"}
          value={number}
          keyboardType={"numeric"}
          onChangeText={setNumber}
        />

        {/* Replace Card Type InputField with Picker */}
        <View className="my-3">
          <Text className="text-lg font-semibold mb-3">Card Type</Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              mode="dropdown" // optional
            >
              <Picker.Item label="Visa" value="visa" />
              <Picker.Item label="Mastercard" value="mastercard" />
              <Picker.Item label="American Express" value="amex" />
              <Picker.Item label="Discover" value="discover" />
              <Picker.Item label="Apple Card" value="apple" />
            </Picker>
          </View>
        </View>

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
          onPress={handleSubmit}
          title={"Save"}
          className={"mt-6"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditCardFormScreen;
