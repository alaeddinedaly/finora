import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useClerk, useUser } from "@clerk/clerk-expo";
import {
  DeleteProfile,
  fetchImage,
  fetchUserData,
  UpdateProfile,
} from "@/services/UserServices";

export default function SettingsScreen() {
  const { user } = useUser();

  const userId = user?.id;

  const { signOut } = useClerk();

  const [name, setName] = useState(user?.firstName);
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress);
  const [image, setImage] = useState<{ uri: string } | null>(images.person);

  useFocusEffect(
    useCallback(() => {
      async function loadProfileData() {
        const data = await fetchUserData(userId);
        const imageUrl = await fetchImage(userId);

        if (imageUrl) {
          setImage({ uri: imageUrl });
        }

        if (data && Array.isArray(data) && data.length > 0) {
          const userData = data[0];
          setName(userData.name);
        }
      }

      loadProfileData();
    }, [userId]),
  );

  const navigation = useNavigation();

  async function pickImage() {
    try {
      // @ts-ignore
      const result = await ImagePicker.launchImageLibraryAsync({
        // @ts-ignore
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage({ uri: result.assets[0].uri });
      }
    } catch (e) {
      console.warn("ImagePicker error:", e);
    }
  }

  async function handleSave() {
    const imageUrl = image?.uri || image;
    const updatedProfile = await UpdateProfile(name, email, imageUrl, userId);
    if (updatedProfile) {
      Alert.alert("Success", "You have successfully updated your profile.");
    } else {
      Alert.alert("Error", "An issue occured");
    }
  }

  async function handleDelete() {
    const deletedProfile = await DeleteProfile(userId);
    if (!deletedProfile) {
      Alert.alert("Error", "An issue occured deleting account");
      return;
    }

    Alert.alert("Success", "You have successfully deleted your account.");
    try {
      await signOut();
      router.replace("/(auth)/sign_up");
    } catch (err) {
      // @ts-ignore
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }

  return (
    <SafeAreaView className={"flex-1 bg-neutral-100"}>
      <ScrollView className={"flex-1 bg-neutral-100"}>
        <View className="relative flex-row items-center py-5 px-4 mx-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="left-5"
          >
            <Image
              source={icons.back}
              className="w-10 h-10"
              tintColor="#2c3e50"
            />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-[#2c3e50] text-2xl font-extrabold">
            Settings
          </Text>
        </View>
        <TouchableOpacity
          onPress={pickImage}
          className="self-center mt-2 mb-10 items-center"
        >
          <Image
            source={image ? { uri: image.uri } : images.person}
            className="w-28 h-28 rounded-full border-4 border-[#5c9fef]"
          />
          <Text className="mt-2 text-blue-600 font-semibold">Change Photo</Text>
        </TouchableOpacity>

        <View className={"flex-1 flex justify-center mx-4"}>
          <InputField
            label={"Name"}
            icon={icons.person}
            placeholder={"Change name"}
            value={name}
            keyboardType={"numeric"}
            onChangeText={(newName) => setName(newName)}
          />
          <InputField
            label={"Email"}
            icon={icons.email}
            placeholder={"Change email"}
            value={email}
            keyboardType={"numeric"}
            onChangeText={(newEmail) => setEmail(newEmail)}
          />
        </View>
        <View className={"mx-4 mt-10"}>
          <CustomButton
            onPress={handleSave}
            title={"Save"}
            bgVariant={"success"}
          />
          <CustomButton
            onPress={handleDelete}
            title={"Delete"}
            bgVariant={"danger"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
