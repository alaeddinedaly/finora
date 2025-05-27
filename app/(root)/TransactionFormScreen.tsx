import React, { useCallback, useState } from "react";
import { icons } from "@/constants/icons";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { fetchCards, updateBalance } from "@/services/CardServices";
import { useUser } from "@clerk/clerk-expo";
import { fetchCategoryNames } from "@/services/CategoryServices";
import { fetchAPI } from "@/lib/fetch";

interface Card {
  id: string;
  number: string;
  type: string;
  name?: string;
}
interface Category {
  id: string;
  label: string;
  value: string;
  color: string;
}

const CARD_TYPE_COLORS: Record<string, string> = {
  visa: "#1a73e8",
  mastercard: "#eb001b",
  apple: "black",
};

const TransactionFormScreen = () => {
  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id.toString();

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadCards() {
        if (!userId) return;
        try {
          const fetchedCards = await fetchCards(userId);
          setCards(fetchedCards);
          if (fetchedCards.length > 0) {
            setSelectedCard(fetchedCards[0].id);
          }
        } catch (error) {
          console.error("Failed to load cards:", error);
        }
      }
      loadCards();
    }, [userId]),
  );
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [category, setCategory] = useState("shopping");
  const [note, setNote] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const categories = [
    { id: 1, label: "Shopping", value: "shopping", color: "#f59e0b" },
    { id: 2, label: "Food & Dining", value: "food", color: "#ef4444" },
    { id: 3, label: "Transportation", value: "transport", color: "#3b82f6" },
    { id: 4, label: "Entertainment", value: "entertainment", color: "#8b5cf6" },
    { id: 5, label: "Utilities", value: "utilities", color: "#10b981" },
    { id: 6, label: "Other", value: "other", color: "#6b7280" },
  ];

  useFocusEffect(
    useCallback(() => {
      async function loadCategoryNames() {
        if (!userId) return;

        try {
          const fetchedCategoryNames = await fetchCategoryNames(userId);

          // Normalize fetched categories to match { id, label, value }
          const normalizedFetched = fetchedCategoryNames.map((cat: any) => ({
            id: cat.id,
            label: cat.name,
            value: cat.name,
            color: cat.color,
          }));

          // Combine with default categories
          const combinedCategories = [...normalizedFetched, ...categories];

          // Deduplicate by value
          const uniqueCategoriesMap = new Map();
          combinedCategories.forEach((cat) => {
            uniqueCategoriesMap.set(cat.value, cat);
          });

          const uniqueCategories = Array.from(uniqueCategoriesMap.values());

          setCategoryList(uniqueCategories);

          // Optionally set default selected category if not set
          if (!category && uniqueCategories.length > 0) {
            setCategory(uniqueCategories[0].value);
          }
        } catch (error) {
          console.error("Failed to load Category Names:", error);
        }
      }

      loadCategoryNames();
    }, [userId]),
  );

  const handleSubmit = async () => {
    if (!selectedCardData || !amount || !recipient) {
      alert("Please fill all required fields.");
      return;
    }
    await fetchAPI("/(api)/transaction", {
      method: "POST",
      body: JSON.stringify({
        id: selectedCardData?.id,
        reason: recipient,
        amount: amount,
        type: parseFloat(amount) > 0 ? "income" : "expense",
        date: new Date(),
        category: selectedCategoryData?.label,
        userId: userId,
      }),
    });

    await updateBalance(
      userId,
      selectedCardData.name?.toString() || "",
      parseFloat(amount),
    );

    alert("Transaction completed successfully!");
    setAmount("");
    setRecipient("");
    setNote("");
    setCategory("shopping");
  };

  const selectedCardData =
    cards.find((card: any) => card.name === selectedCard) || null;
  const selectedCategoryData = categoryList.find(
    (cat) => cat.value === category,
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-8 px-4">
      <View className="relative flex-row justify-between items-center py-5 px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex justify-start items-start ml-5"
        >
          <Image
            source={icons.back}
            className="w-10 h-10"
            style={{ tintColor: "#2c3e50" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="flex text-[#2c3e50] text-2xl font-extrabold text-center">
          Make Transaction
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Method */}
        <View className="bg-white rounded-xl p-6 mb-7 shadow-md">
          <Text className="text-gray-700 text-lg font-semibold mb-5">
            Payment Method
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white"
            onPress={() => setShowCardModal(true)}
          >
            <View
              className="w-4 h-4 rounded-full mr-3"
              style={{
                backgroundColor:
                  CARD_TYPE_COLORS[selectedCardData?.type || "visa"] || "#ccc",
              }}
            />
            <Text className="text-gray-700 text-base">
              {selectedCardData
                ? `${selectedCardData.type.toUpperCase()} ${selectedCardData.number}`
                : "Select Card"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Details */}
        <View className="bg-white rounded-xl p-6 mb-10 shadow-md">
          <Text className="text-gray-700 text-lg font-semibold mb-5">
            Transaction Details
          </Text>

          <View className="mb-5">
            <Text className="text-gray-600 font-semibold mb-2">Amount</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg bg-white text-gray-900"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#999"
            />
          </View>

          <View className="mb-5">
            <Text className="text-gray-600 font-semibold mb-2">Reason</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg bg-white text-gray-900"
              placeholder="Enter reason"
              value={recipient}
              onChangeText={setRecipient}
              placeholderTextColor="#999"
            />
          </View>

          <View className="mb-5">
            <Text className="text-gray-600 font-semibold mb-2">Category</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white"
              onPress={() => setShowCategoryModal(true)}
            >
              <View
                className="w-4 h-4 rounded-full mr-3"
                style={{
                  backgroundColor: selectedCategoryData?.color || "#6b7280",
                }}
              />
              <Text className="text-gray-700 text-base">
                {selectedCategoryData?.label || "Select Category"}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-gray-600 font-semibold mb-2">
              Note (Optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg bg-white text-gray-900 h-20"
              placeholder="Add a note"
              multiline
              value={note}
              onChangeText={setNote}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={1}
          className={"rounded-xl py-4 items-center bg-[#5c9fef] shadow-lg"}
          onPress={handleSubmit}
        >
          <Text className="text-white text-xl font-bold">Make Transaction</Text>
        </TouchableOpacity>

        {/* Card Selection Modal */}
        <Modal
          visible={showCardModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCardModal(false)}
        >
          <View className="flex-1 justify-center items-center  bg-opacity-30 px-5">
            <View className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
              <Text className="text-2xl font-bold text-center mb-6 text-gray-900">
                Select Payment Method
              </Text>
              {cards.length > 0 ? (
                cards.map((card: any) => (
                  <Pressable
                    key={card.name}
                    className={`flex-row items-center px-4 py-3 rounded-lg mb-3 ${
                      selectedCard === card.name ? "bg-blue-100" : ""
                    }`}
                    onPress={() => {
                      setSelectedCard(card.name);
                      setShowCardModal(false);
                    }}
                  >
                    <View
                      className="w-5 h-5 rounded-full mr-4"
                      style={{ backgroundColor: CARD_TYPE_COLORS[card.type] }}
                    />
                    <Text className="text-gray-800 text-lg">
                      {card.name
                        ? `${card.name} (${card.type?.toUpperCase()} ${card.number})`
                        : `${card.type?.toUpperCase()} ${card.number}`}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text className="text-center text-gray-500">
                  No cards available.
                </Text>
              )}

              <Pressable
                className="mt-4 py-3 rounded-lg bg-gray-100"
                onPress={() => setShowCardModal(false)}
              >
                <Text className="text-center text-[#5c9fef] text-lg font-semibold">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategoryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View className="flex-1 justify-center items-center  bg-opacity-30 px-5">
            <View className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
              <Text className="text-2xl font-bold text-center mb-6 text-gray-900">
                Select Category
              </Text>
              {categoryList.map((cat) => (
                <Pressable
                  key={cat.value}
                  className={`flex-row items-center px-4 py-3 rounded-lg mb-3 ${
                    category === cat.value ? "bg-blue-100" : ""
                  }`}
                  onPress={() => {
                    setCategory(cat.value);
                    setShowCategoryModal(false);
                  }}
                >
                  <View
                    className="w-5 h-5 rounded-full mr-4"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text className="text-gray-800 text-lg">{cat.label}</Text>
                </Pressable>
              ))}

              <Pressable
                className="mt-4 py-3 rounded-lg bg-gray-100"
                onPress={() => setShowCategoryModal(false)}
              >
                <Text className="text-center text-[#5c9fef] text-lg font-semibold">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionFormScreen;
