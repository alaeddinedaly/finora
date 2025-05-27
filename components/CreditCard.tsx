import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
interface CreditCardProps {
  card: {
    name: string;
    balance: string;
    number: string;
    expiry: string;
    type: any;
    backgroundImage: any;
  };
  style?: any;
  height?: string;
  width?: string;
}

const CreditCard = ({ card, height = "44", width = "72" }: CreditCardProps) => {
  const formatCardNumber = (num?: string) => {
    if (!num) return "0000 0000 0000 0000";
    return num.replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <ImageBackground
      source={card.backgroundImage}
      className={`w-72 h-44 rounded-2xl overflow-hidden`}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
        className="h-full p-5 justify-between"
      >
        {/* Top Section */}
        <View className="flex-row justify-between">
          <Text className="text-white text-2xl font-bold">{card.name}</Text>
        </View>

        {/* Middle Section */}
        <View>
          <Text className="text-white/80 text-xs">Total Balance</Text>
          <Text className="text-white text-2xl font-bold">{card.balance}</Text>
        </View>

        {/* Bottom Section */}
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-white/80 text-xs">Card Number</Text>
            <Text className="text-white text-base font-mono tracking-wider">
              {formatCardNumber(card.number)}
            </Text>
          </View>
          <Text className="text-white text-sm bg-black/30 px-2 py-1 rounded">
            {card.expiry}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default CreditCard;
