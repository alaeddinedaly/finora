import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "@/constants/icons";
import { useFocusEffect, useRouter } from "expo-router";
import { images } from "@/constants/images";
import DataCard from "@/components/DataCard";
import SettingCard from "@/components/SettingCard";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  fetchImage,
  fetchSummary,
  fetchUserData,
  UpdateImage,
} from "@/services/UserServices";
import AddCategoryForm from "@/app/(root)/AddCategoryForm";

const Profile = () => {
  const { user } = useUser();

  const userId = user?.id;

  const router = useRouter();
  const { signOut } = useClerk();
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(
    images.person,
  );

  const [name, setName] = useState(user?.firstName || "No name found");

  useFocusEffect(
    useCallback(() => {
      async function loadProfileData() {
        const data = await fetchUserData(userId);
        if (data && Array.isArray(data) && data.length > 0) {
          const userData = data[0];
          setName(userData.name);
        }
      }

      loadProfileData();
    }, [userId]),
  );

  const [userData, setUserData] = useState({
    card_count: 0,
    transaction_count: 0,
    goal_count: 0,
  });

  useFocusEffect(
    useCallback(() => {
      async function loadUserData() {
        const data = await fetchSummary(userId);
        if (data) {
          setUserData(data);
        }
      }
      loadUserData();
    }, [userId]),
  );

  useFocusEffect(
    useCallback(() => {
      async function loadProfileImage() {
        const imageUrl = await fetchImage(userId);

        if (imageUrl) {
          setProfileImage({ uri: imageUrl });
        }
      }
      loadProfileImage();
    }, [userId]),
  );

  const pickImage = async () => {
    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to change your profile picture",
      );
      return;
    }

    // @ts-ignore
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setProfileImage({ uri });

      try {
        const updatedImageUrl = await UpdateImage(uri, userId);

        if (updatedImageUrl) {
          Alert.alert("Success", "Profile image updated successfully.");
        } else {
          Alert.alert("Update failed", "Could not update profile image");
        }
      } catch (error) {
        console.error("Failed to update profile image:", error);
        Alert.alert("Error", "Failed to update profile image");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="relative flex-row items-center py-5 px-3">
        <Text className="flex-1 text-center text-[#2c3e50] text-3xl font-extrabold">
          Profile
        </Text>
      </View>

      {/* Profile Icon and Name */}
      <View className="flex items-center px-5 mt-4">
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: profileImage?.uri }}
            className="h-28 w-28 rounded-full border-4 border-[#5c9fef] mb-2"
          />
        </TouchableOpacity>
        <Text className="mt-2 text-[#2c3e50] text-lg font-semibold mb-4">
          {name}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-[1px] mx-5 bg-[#2c3e50]" />

      {/* Data Cards */}
      <View className="flex-row justify-between mx-10 my-5">
        <DataCard label="Cards" number={userData.card_count.toString()} />
        <DataCard
          label="Transactions"
          number={userData.transaction_count.toString()}
        />
        <DataCard label="Goals" number={userData.goal_count.toString()} />
      </View>

      {/* Scrollable Setting Cards */}
      <ScrollView
        className="px-5 mt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <SettingCard
          tintColor={"#5c9fef"}
          icon={icons.settings}
          label="Setting"
          onPress={() => router.push("/SettingsScreen")}
        />
        <SettingCard
          tintColor={"#5c9fef"}
          icon={icons.info}
          label="Information"
          onPress={() => router.push("/InfoScreen")}
        />
        <SettingCard
          tintColor={"#5c9fef"}
          icon={icons.support}
          label="Help & Support"
          onPress={() => router.push("/SupportScreen")}
        />

        <SettingCard
          tintColor={"#5c9fef"}
          icon={icons.pallet}
          label="Appearance / Theme"
          onPress={() => router.push("/AppearanceScreen")}
        />
        <SettingCard
          tintColor={"#5c9fef"}
          icon={icons.categories}
          label="Add Category"
          onPress={() => router.push("/AddCategoryForm")}
        />
        <SettingCard
          tintColor={"red"}
          icon={icons.signout}
          label="SignOut"
          onPress={async () => {
            try {
              await signOut();
              router.replace("/(auth)/sign_in");
            } catch (err) {
              Alert.alert("Error", "Failed to sign out");
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
