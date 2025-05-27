import { View, Text, TouchableOpacity } from "react-native";

type DropdownMenuProps = {
  showMenuToggle: boolean;
  options: string[]; // Array of option strings
  onSelect?: (option: string) => void; // Optional callback when option is selected
};

const DropdownMenu = ({
  showMenuToggle,
  options = [],
  onSelect,
}: DropdownMenuProps) => {
  return (
    <View className="relative">
      {showMenuToggle && (
        <View className="absolute top-9 right-0 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="py-1 px-3"
              onPress={() => onSelect && onSelect(option)}
            >
              <Text className="text-gray-700 text-sm">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
