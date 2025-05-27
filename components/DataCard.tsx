import React from "react";
import { View, Text } from "react-native";

type DataCardProps = {
  number: string;
  label: string;
};

const DataCard = ({ number, label }: DataCardProps) => {
  return (
    <View className="flex flex-col justify-between items-center">
      <Text className="text-[#2c3e50] font-bold text-2xl">{number}</Text>
      <Text className="text-gray-300 font-semibold text-xl">{label}</Text>
    </View>
  );
};

export default DataCard;
