import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/icons";

const SettingCard = ({
  icon,
  label,
  onPress,
  tintColor,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  tintColor?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white rounded-2xl px-5 py-4 mb-4 shadow-md"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
    }}
  >
    <View className="flex-row items-center space-x-4">
      <View className="bg-neutral-100 p-3 rounded-lg mr-5">
        <Image
          source={icon}
          className="w-6 h-6"
          resizeMode="contain"
          tintColor={tintColor}
        />
      </View>
      <Text className="text-[#2c3e50] text-lg font-semibold">{label}</Text>
    </View>
    <Image
      source={icons.arrow_right}
      className={"w-6 h-6"}
      resizeMode={"contain"}
      tintColor={"#2c3e50"}
    />
  </TouchableOpacity>
);

export default SettingCard;
