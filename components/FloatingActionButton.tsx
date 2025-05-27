import React from "react";
import { TouchableOpacity, Image, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { icons } from "@/constants/icons";

interface FloatingButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  iconSize?: number;
}

const FloatingActionButton = ({
  onPress,
  style,
  iconSize = 56,
}: FloatingButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        style,
        {
          position: "absolute",
          bottom: 50, // Increased from bottom-10 (~40px) to 90
          right: 0, // Increased from right-3 (~12px) to 20
          zIndex: 10, // Ensures it stays above other elements
        },
      ]}
      className={twMerge("shadow-md shadow-black", "active:scale-95")}
    >
      <Image
        source={icons.aibot}
        style={{
          width: iconSize,
          height: iconSize,
          resizeMode: "contain",
        }}
        className="rounded-full"
      />
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
