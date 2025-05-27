import { View, Text, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { deleteGoal } from "@/services/GoalServices";
import { useUser } from "@clerk/clerk-expo";

interface GoalCardProps {
  title: string;
  savedAmount: string | "0";
  targetAmount: string;
  dueDate: string;
  onEditGoal: () => void;
  onAddSavings?: () => void;
  onDelete?: (title: string) => void; // Added this prop
}

const GoalCard = ({
  title,
  savedAmount,
  targetAmount,
  dueDate,
  onEditGoal,
  onDelete,
}: GoalCardProps) => {
  const progress = parseFloat(savedAmount) / parseFloat(targetAmount);
  const { user } = useUser();
  const userId = user?.id.toString();

  const [reached, setReached] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (parseFloat(savedAmount) >= parseFloat(targetAmount)) {
        setReached(true);
      } else {
        setReached(false);
      }
    }, [savedAmount, targetAmount]),
  );

  const handleDelete = async () => {
    if (!userId) {
      Alert.alert("User not authenticated");
      return;
    }

    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete the goal "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteGoal(userId, title);
              if (result) {
                Alert.alert("Success", "Goal deleted successfully");
                if (onDelete) onDelete(title); // Notify parent to remove this goal card
              } else {
                Alert.alert("Error", "Failed to delete goal");
              }
            } catch (error) {
              Alert.alert("Error", "An error occurred while deleting the goal");
              console.error(error);
            }
          },
        },
      ],
    );
  };

  return (
    <View className="bg-white rounded-2xl shadow-md p-5 w-full max-w-md mx-auto mb-4 border border-gray-100">
      {/* Top Row */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-3">
          <Text className="text-gray-400 text-xs uppercase font-semibold">
            Goal
          </Text>
          <Text
            className="text-[#2c3e50] font-bold text-xl mt-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        <Pressable
          onPress={onEditGoal}
          className="rounded-full p-1"
          android_ripple={{ color: "#e0e7ff" }}
        >
          <MaterialIcons name="edit" size={22} color="#5c9fef" />
        </Pressable>
      </View>

      {/* Progress Section */}
      <View className="mb-3">
        <View className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <LinearGradient
            colors={["#5c9fef", "#2c3e50"]}
            start={[0, 0]}
            end={[1, 0]}
            className="h-full"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-sm text-gray-700 font-semibold">
            ${savedAmount}
          </Text>
          <Text className="text-sm text-gray-500">/${targetAmount}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-400">Due: {dueDate}</Text>
        {reached && (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#22c55e",
              backgroundColor: "white",
              borderRadius: 9999,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text className={"text-green-500"}>Achieved</Text>
          </View>
        )}
        <Pressable
          onPress={handleDelete}
          className="rounded-full p-1"
          android_ripple={{ color: "#fecaca" }}
        >
          <MaterialIcons name="delete" size={20} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
};

export default GoalCard;
