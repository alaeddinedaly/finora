import React, { useCallback, useEffect, useState } from "react";

import VerticalCardSlider from "@/components/VerticalCardSlider";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { fetchCards } from "@/services/CardServices";
import { useUser } from "@clerk/clerk-expo";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const { user } = useUser();
  const userId = user?.id.toString();

  useFocusEffect(
    useCallback(() => {
      async function loadCards() {
        const fetchedCards = await fetchCards(userId);
        setCards(fetchedCards);
      }
      loadCards();
    }, [userId]),
  );

  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className={"relative flex-row justify-between items-center py-5 px-5"}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={"flex justify-start items-start ml-5"}
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            tintColor={"#2c3e50"}
          />
        </TouchableOpacity>
        <Text
          className={"flex text-[#2c3e50] text-2xl font-extrabold text-center"}
        >
          All Cards
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(root)/CreditCardFormScreen");
          }}
          className={"flex justify-start items-start mr-5"}
        >
          <Image
            source={icons.plus1}
            className="w-10 h-10"
            tintColor={"#2c3e50"}
          />
        </TouchableOpacity>
      </View>
      {cards.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              paddingVertical: 24,
              color: "#2c3e50",
              fontWeight: "600",
            }}
          >
            No Cards set yet.
          </Text>
        </View>
      ) : (
        <VerticalCardSlider
          cards={cards}
          onDeleteCard={(title: string) =>
            setCards((prev) => prev.filter((g) => g.name !== title))
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Cards;
