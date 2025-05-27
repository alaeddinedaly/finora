import { TouchableOpacity, Text } from "react-native";
interface ButtonProps {
  onPress: () => void;
  title: string;
  className?: string;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  bgVariant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "outline"
    | "green";
  textVariant?: "default" | "white" | "black" | "primary";
}
const getBgVariantStyle = (variant: string) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#5c9fef]";
  }
};
const getTextVariantStyle = (variant: string) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return " text-green-100";

    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  className,
  IconLeft,
  IconRight,
  bgVariant = "primary",
  textVariant = "default",
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-full p-3 my-2 rounded-full flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
  >
    {IconLeft && <IconLeft />}
    <Text
      className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}
      {...props}
    >
      {title}
    </Text>
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CustomButton;
