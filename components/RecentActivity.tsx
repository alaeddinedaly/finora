import { Image, Text, View } from "react-native";
import React from "react";

const RecentActivity = ({
  source,
  title,
  date,
  moneyValue,
  type,
}: {
  source: any;
  title: string;
  date: string;
  moneyValue: any;
  type: "expense" | "income";
}): React.JSX.Element => {
  return (
    <View className="bg-gray-100 p-4 rounded-xl mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Image
          source={source}
          className="w-10 h-10  mr-3"
          tintColor={"#2c3e50"}
        />
        <View>
          <Text className="font-semibold text-gray-800">{title}</Text>
          <Text className="text-gray-500 text-sm">{date}</Text>
        </View>
      </View>
      <Text
        className={`font-bold ${type === "expense" ? "text-red-500" : "text-green-500"}`}
      >
        {moneyValue}
      </Text>
    </View>
  );
};

export default RecentActivity;
