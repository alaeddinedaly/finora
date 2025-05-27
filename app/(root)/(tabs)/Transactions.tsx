import { View, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CreditCard from "@/components/CreditCard";
import { images } from "@/constants/images";
import React, { useCallback, useEffect, useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import ActivityList from "@/components/ActivityList";
import { fetchTransactions } from "@/services/TransactionServices";
import { useUser } from "@clerk/clerk-expo";
import { fetchCardNames, fetchSelectedCard } from "@/services/CardServices";
import { fetchSummary } from "@/services/UserServices";

const Transactions = () => {
  const [activities, setActivities] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();
  const { user } = useUser();

  const userId = user?.id.toString();

  const [dropdownOptions, setDropdownOptions] = useState([]);

  const [activeCards, setActiveCards] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function loadActiveCardsNumber() {
        const data = await fetchSummary(userId);
        const number = data.card_count;
        if (number) {
          setActiveCards(number);
        }
      }
      loadActiveCardsNumber();
    }, [userId]),
  );

  useFocusEffect(
    useCallback(() => {
      async function loadCardNames() {
        const cardObjects = await fetchCardNames(userId);
        const cardNames = cardObjects.map((card: any) => card.name);
        setDropdownOptions(cardNames);
      }
      loadCardNames();
    }, [userId]),
  );

  const [currentCard, setCurrentCard] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (dropdownOptions.length > 0) {
      setCurrentCard(dropdownOptions[0]);
    }
  }, [dropdownOptions]);

  useFocusEffect(
    useCallback(() => {
      async function loadTransactions() {
        if (!userId || !currentCard) return;

        const transactions = await fetchTransactions(userId, currentCard);

        const mappedActivities = transactions.map((t: any) => ({
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
          moneyValue: (t.type === "income" ? "+" : "") + t.amount + "$",
          date: t.date,
        }));

        setActivities(mappedActivities);
      }

      loadTransactions();
    }, [userId, currentCard]),
  );

  const [selectedCard, setSelectedCard] = useState({
    name: "",
    balance: "",
    number: "",
    expiry: "",
    type: "",
    backgroundImage: images.mastercard,
  });

  useEffect(() => {
    async function loadSelectedCard() {
      if (!userId || !currentCard) return;

      try {
        // Fetch selected card data
        const card = await fetchSelectedCard(userId, currentCard);

        if (!card) {
          console.warn("Card not found:", currentCard);
          return;
        }

        setSelectedCard(card);
      } catch (error) {
        console.error("loadSelectedCard error:", error);
      }
    }

    loadSelectedCard();
  }, [userId, currentCard]);

  const handleSelect = (option: string) => {
    setShowMenu(false);
    setCurrentCard(option);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative flex-row justify-between items-center py-5 px-5">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex justify-start items-start ml-5"
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor="#2c3e50"
          />
        </TouchableOpacity>
        <Text className="flex text-[#2c3e50] text-2xl font-extrabold text-center">
          Transactions
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(root)/TransactionFormScreen")}
          className="flex justify-start items-start mr-5"
        >
          <Image
            source={icons.plus1}
            className="w-10 h-10"
            tintColor="#2c3e50"
          />
        </TouchableOpacity>
      </View>

      <View className="my-2 mx-2 px-3">
        <Text className="font-bold text-[#2c3e50] text-2xl pb-2">
          Your Cards
        </Text>
        <Text className="text-sm text-gray-500">{`You have ${activeCards} Active Cards`}</Text>
      </View>

      <View className="my-2 mx-2 px-2 flex-row justify-start items-center">
        <View className="my-2 mx-2 px-3">
          {selectedCard.name === "" ? (
            <Text className="text-gray-500 text-base">
              No Cards to select{"\n"}create one in the card tab.
            </Text>
          ) : (
            <CreditCard card={selectedCard} />
          )}
        </View>
        <View className="my-2 mx-2 px-2 py-2 flex-col justify-start items-center">
          <Text className="text-sm text-gray-500 justify-center pb-2">
            Change
          </Text>
          <TouchableOpacity
            className="w-7 h-7 rounded-full bg-[#5c9fef] items-center justify-center"
            onPress={() => setShowMenu(!showMenu)}
          >
            <Image
              source={icons.down}
              tintColor="white"
              style={{ width: 10, height: 10, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
        <DropdownMenu
          showMenuToggle={showMenu}
          options={dropdownOptions}
          onSelect={handleSelect}
        />
      </View>

      <View className="my-2 mx-2 px-3 flex-1">
        <Text className="font-bold text-[#2c3e50] text-2xl pb-2">
          Your Transactions
        </Text>
        <ScrollView
          className="mt-4 flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {activities.length === 0 ? (
            <Text className={"text-gray-500 text-base text-center"}>
              No Transactions made on this card.
            </Text>
          ) : (
            <ActivityList activities={activities} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Transactions;
