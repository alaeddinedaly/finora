import React, { useState } from "react";
import { View, Text } from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";

const ColorPickerScreen = () => {
  const [color, setColor] = useState("#ff0000");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Selected Color: {color}</Text>
      <WheelColorPicker
        color={color}
        onColorChange={(newColor) => setColor(newColor)}
      />
    </View>
  );
};

export default ColorPickerScreen;
