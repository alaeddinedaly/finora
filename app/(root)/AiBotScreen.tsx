import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { twMerge } from "tailwind-merge";
import { getFinoraAIResponse } from "@/lib/ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchTransactionsForAi } from "@/services/TransactionServices";
import { useUser } from "@clerk/clerk-expo";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
};

const AIBotScreen = () => {
  const { user } = useUser();

  const userId = user?.id.toString();

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const [messages, setMessages] = useState<Message[]>([]);

  const [transcations, setTransactions] = useState([]);
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        if (!userId) return;
        const { data } = await fetchTransactionsForAi(userId);
        setTransactions(data);
      }
      loadData();
    }, [userId]),
  );

  // Load messages from storage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(
          "finora_chat_messages",
        );
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Default welcome message if no history exists
          setMessages([
            {
              id: 1,
              text: "Hello! 👋 I'm your Finora AI assistant. Ask me anything about saving or investing!",
              isUser: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    loadMessages();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem(
          "finora_chat_messages",
          JSON.stringify(messages),
        );
      } catch (error) {
        console.error("Failed to save messages", error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Add typing indicator
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 0.5,
          text: "Typing...",
          isUser: false,
          isTyping: true,
        },
      ]);

      const aiResponse = await getFinoraAIResponse(
        trimmedMessage,
        transcations,
      );

      // Update messages (remove typing indicator, add response)
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          id: Date.now() + 1,
          text: "Finora AI is currently unavailable. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem("finora_chat_messages");
      setMessages([
        {
          id: Date.now(),
          text: "Hello again! How can I help you today?",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to clear chat", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <LinearGradient
        colors={["#0f172a", "#1e293b"]}
        className="flex-1 p-6"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-slate-700/50"
          >
            <Ionicons name="chevron-back" size={24} color="#5c9fef" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Finora AI</Text>
          <TouchableOpacity
            onPress={clearChat}
            className="p-2 rounded-full bg-slate-700/50"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={(ref) => {
            if (ref) {
              setTimeout(() => ref.scrollToEnd({ animated: true }), 500);
            }
          }}
        >
          {/* Animated AI Bot */}
          <Animated.View
            className="items-center mb-10"
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View className="relative">
              <Image source={icons.aibot} className="w-40 h-40" />
              <View className="absolute -inset-2 border-2 border-[#5c9fef]/30 rounded-full" />
            </View>
            <Text className="mt-6 text-lg text-[#5c9fef] font-medium text-center max-w-[80%]">
              Your personal financial assistant
            </Text>
          </Animated.View>

          {/* Chat Messages */}
          <View className="mb-4 px-2">
            {messages.map((msg) => (
              <View
                key={msg.id}
                className={twMerge(
                  "p-4 mb-3",
                  msg.isUser
                    ? "bg-[#5c9fef] ml-16 self-end rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr-none"
                    : "bg-slate-700 mr-16 self-start rounded-br-2xl rounded-bl-2xl rounded-tr-2xl rounded-tl-none",
                )}
                style={{ maxWidth: "80%" }}
              >
                <Text className="text-white">{msg.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Input Area */}
        <View
          style={{ marginBottom: keyboardHeight > 0 ? keyboardHeight - 30 : 0 }}
        >
          <View className="flex-row items-center p-2 bg-slate-700 rounded-full">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask about savings, investments..."
              placeholderTextColor="#94a3b8"
              className="flex-1 px-4 text-white"
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              className="p-3 rounded-full bg-[#5c9fef]"
              disabled={message.trim() === "" || isTyping}
            >
              <Ionicons
                name="send"
                size={20}
                color={message.trim() === "" ? "#ffffff80" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AIBotScreen;
