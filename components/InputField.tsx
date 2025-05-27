import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface InputFieldProps {
  label: string;
  labelStyle?: string;
  icon?: any;
  secureTextEntry?: boolean;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  placeholder?: string;
  value?: string | null;
  onChangeText?: (text: string) => void;
  keyboardType?: string;
  rightIcon?: React.ReactNode; // ✅ New prop for eye/eye-cross or any custom element
}

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  placeholder,
  value,
  onChangeText,
  rightIcon, // ✅ Destructure here
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-semibold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row items-center justify-between relative bg-neutral-100 rounded-full border ${isFocused ? "border-[#5c9fef]" : "border-neutral-300"} ${containerStyle}`}
          >
            {icon && (
              <Image
                source={icon}
                className={`ml-4 ${iconStyle}`}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            )}

            <TextInput
              className={`flex-1 rounded-full p-4 font-semibold text-[15px] text-left ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {rightIcon && <View className="mr-4">{rightIcon}</View>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
