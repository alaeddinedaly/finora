import { useState } from "react";
import {
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type ImagePickerProps = {
  initialImage?: ImageSourcePropType;
  onImageSelected?: (uri: string) => void;
  style?: StyleProp<ImageStyle>;
  buttonStyle?: StyleProp<ImageStyle>;
};

const ImagePicker = ({
  initialImage,
  onImageSelected,
  style,
  buttonStyle,
}: ImagePickerProps) => {
  const [image, setImage] = useState<ImageSourcePropType>(
    initialImage || require("@/assets/images/default-profile.png"),
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const newImage = { uri: result.assets[0].uri };
      setImage(newImage);
      onImageSelected?.(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={buttonStyle}>
      <Image
        source={image}
        style={[
          {
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "#5c9fef",
          },
          style,
        ]}
      />
    </TouchableOpacity>
  );
};

export default ImagePicker;
