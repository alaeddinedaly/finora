import {
  ScrollView,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import GoalCard from "./GoalCard";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchGoals, updateGoal } from "@/services/GoalServices";
import { useUser } from "@clerk/clerk-expo";
import * as Notifications from "expo-notifications";

interface Goal {
  title: string;
  savedAmount: string;
  targetAmount: string;
  dueDate: string;
}

const AllGoals = () => {
  const [mockGoals, setMockGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoalData, setNewGoalData] = useState<Goal | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useUser();
  const userId = user?.id.toString();

  useFocusEffect(
    useCallback(() => {
      async function loadMockGoals() {
        const fetchedMockGoals = await fetchGoals(userId);
        setMockGoals(fetchedMockGoals);
      }
      loadMockGoals();
    }, [userId]),
  );

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoalData({ ...goal });
    setModalVisible(true);
  };

  const handleSaveGoal = async () => {
    if (!userId || !editingGoal || !newGoalData) return;

    if (
      parseFloat(newGoalData.savedAmount) > parseFloat(newGoalData.targetAmount)
    ) {
      Alert.alert(
        "Invalid current amount.",
        "You can't save an amount more than your goal amount.",
      );
      return;
    }

    await updateGoal(userId, editingGoal.title, {
      newTitle: newGoalData.title,
      savedAmount: newGoalData.savedAmount,
      targetAmount: newGoalData.targetAmount,
      dueDate: newGoalData.dueDate,
    });

    if (
      parseFloat(newGoalData.savedAmount) ===
      parseFloat(newGoalData.targetAmount)
    ) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 Goal Achieved!",
          body: `You've fully funded your goal: "${newGoalData.title}"`,
        },
        trigger: null,
      });
    }

    Alert.alert("Success", "Goal updated successfully!", [{ text: "OK" }]);

    setMockGoals((prevGoals) =>
      prevGoals.map((g) => (g.title === editingGoal.title ? newGoalData : g)),
    );

    setModalVisible(false);
    setEditingGoal(null);
  };

  if (mockGoals.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{ paddingVertical: 24, color: "#2c3e50", fontWeight: "600" }}
        >
          No Goals set yet.
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {mockGoals.map((goal, index) => (
          <GoalCard
            key={index}
            title={goal.title}
            savedAmount={goal.savedAmount}
            targetAmount={goal.targetAmount}
            dueDate={goal.dueDate}
            onEditGoal={() => handleEditGoal(goal)}
            onDelete={(title: string) =>
              setMockGoals((prev) => prev.filter((g) => g.title !== title))
            }
          />
        ))}
      </ScrollView>

      {/* Modal for editing goal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-3xl px-8 py-10 shadow-xl">
            {/* Modal Header - Added mb-6 for more space below title */}
            <Text className="text-2xl font-bold text-[#2c3e50] text-center mb-6">
              Edit Goal
            </Text>

            {/* Input Fields - Added space-y-4 and individual mb-4 */}
            <View className="space-y-4">
              <TextInput
                placeholder="Title"
                value={newGoalData?.title}
                onChangeText={(text) =>
                  setNewGoalData((prev) => ({ ...prev!, title: text }))
                }
                className="border border-gray-300 rounded-xl px-5 py-4 text-base bg-gray-50 mb-4"
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Saved Amount"
                value={newGoalData?.savedAmount}
                onChangeText={(text) =>
                  setNewGoalData((prev) => ({ ...prev!, savedAmount: text }))
                }
                keyboardType="numeric"
                className="border border-gray-300 rounded-xl px-5 py-4 text-base bg-gray-50 mb-4"
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Target Amount"
                value={newGoalData?.targetAmount}
                onChangeText={(text) =>
                  setNewGoalData((prev) => ({ ...prev!, targetAmount: text }))
                }
                keyboardType="numeric"
                className="border border-gray-300 rounded-xl px-5 py-4 text-base bg-gray-50 mb-4"
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Due Date"
                value={newGoalData?.dueDate}
                onChangeText={(text) =>
                  setNewGoalData((prev) => ({ ...prev!, dueDate: text }))
                }
                className="border border-gray-300 rounded-xl px-5 py-4 text-base bg-gray-50"
                placeholderTextColor="#999"
              />
            </View>

            {/* Actions - Added mt-8 for more space above buttons and space-x-4 between buttons */}
            <View className="flex-row justify-between space-x-4 mt-8">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingGoal(null);
                }}
                className="flex-1 bg-gray-100 rounded-xl py-4 shadow-sm"
              >
                <Text className="text-center text-gray-700 font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <View className={"w-10"}></View>
              <TouchableOpacity
                onPress={handleSaveGoal}
                className="flex-1 bg-[#2c3e50] rounded-xl py-4 shadow-sm"
              >
                <Text className="text-center text-white font-semibold text-base">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AllGoals;
