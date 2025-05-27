import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import HorizontalCardSlider from "@/components/HorizontalCardSlider";
import { useAuth, useUser } from "@clerk/clerk-expo";
import MostRecentGoal from "@/components/MostRecentGoal";
import { router, useFocusEffect } from "expo-router";
import { fetchCards } from "@/services/CardServices";
import { fetchImage, fetchUserData } from "@/services/UserServices";
import {
  registerForNotifications,
  sendLocalNotification,
} from "@/utils/notification";
import ActivityList from "@/components/ActivityList";
import { fetchRecentTransactions } from "@/services/TransactionServices";
import { icons } from "@/constants/icons";
const Home = () => {
  const { user } = useUser();

  const userId = user?.id.toString();
  const email = user?.primaryEmailAddress?.emailAddress || "No email found";

  const [cards, setCards] = useState([]);

  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(
    images.person,
  );
  const [name, setName] = useState(user?.firstName || "No name found");

  useEffect(() => {
    async function setupNotifications() {
      try {
        await registerForNotifications();
      } catch (err) {
        console.warn("Notification permission denied:", err);
      }
    }
    setupNotifications();
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      async function loadCards() {
        const fetchedCards = await fetchCards(userId);
        setCards(fetchedCards);
      }
      loadCards();
    }, [userId]),
  );

  const [recentTransactions, setRecentTransactions] = useState([]);
  useFocusEffect(
    useCallback(() => {
      async function loadTransactions() {
        if (!userId) return;

        const transactions = await fetchRecentTransactions(userId);

        let mostRecentTransactions: any;
        mostRecentTransactions = transactions.map((t: any) => ({
          source: t.title.toLowerCase().includes("amazon")
            ? images.amazon
            : t.title.toLowerCase().includes("apple")
              ? images.apple
              : t.title.toLowerCase().includes("netflix")
                ? icons.netflix
                : t.title.toLowerCase().includes("spotify")
                  ? icons.spotify
                  : icons.coins,
          type: t.type,
          title: t.title,
          moneyValue: (t.type === "income" ? "+" : "-") + "$" + t.amount,
          date: t.date,
        }));

        setRecentTransactions(mostRecentTransactions);
      }
      loadTransactions();
    }, [userId]),
  );

  return (
    <View className="bg-white flex-1 pt-12 ">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 px-4">
        <TouchableOpacity onPress={() => router.replace("/Profile")}>
          <View className="flex-row items-center">
            <Image
              source={{ uri: profileImage?.uri }}
              className="w-10 h-10 rounded-full"
            />

            <Text className="ml-2 font-bold text-gray-700">
              Hello, {name}
              {"\n"}
              <Text className="font-normal">Welcome Back!</Text>
            </Text>
          </View>
        </TouchableOpacity>
        <Ionicons
          name="notifications-outline"
          size={26}
          color="gray"
          onPress={() =>
            sendLocalNotification({
              title: "🚀 New Message!",
              body: "You have something new waiting.",
              delayInSeconds: 0, // immediate
            })
          }
        />
      </View>

      <View className="mb-5">
        <View className="flex-row justify-between mb-2 px-4">
          <Text className="text-2xl font-bold text-[#2c3e50]">Cards</Text>
          <Text className="text-sm text-gray-500">{cards.length} pieces</Text>
        </View>
        {cards.length === 0 ? (
          <Text className="text-gray-500 text-base text-center">
            No cards set yet. You Can add a card in the cards tab!
          </Text>
        ) : (
          <HorizontalCardSlider cards={cards} />
        )}
      </View>

      <View className={"mx-4"}>
        <MostRecentGoal />
      </View>

      <View className="flex-1 mb-24 px-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Recent Transactions
          </Text>
        </View>
        <View className="flex-1">
          {recentTransactions.length === 0 ? (
            <Text className="text-gray-500 text-base text-center">
              No recent transactions yet. Start spending or saving to see
              activity here!
            </Text>
          ) : (
            <ActivityList activities={recentTransactions} />
          )}
        </View>
      </View>
    </View>
  );
};

export default Home;
