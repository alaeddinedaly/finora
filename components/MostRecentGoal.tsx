import React, { useState } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { fetchMostRecentGoal } from "@/services/GoalServices";
import { useUser } from "@clerk/clerk-expo";

export default function MostRecentGoal() {
  const { user } = useUser();
  const userId = user?.id.toString();

  const [mostRecentGoal, setMostRecentGoal] = useState<{
    title: string;
    savedAmount: string;
    targetAmount: string;
    dueDate: string;
  } | null>(null);

  const [reached, setReached] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      async function loadData() {
        const fetchedMockGoals = await fetchMostRecentGoal(userId);
        if (!isActive) return;

        const goal = fetchedMockGoals.length > 0 ? fetchedMockGoals[0] : null;
        setMostRecentGoal(goal);

        if (
          goal &&
          parseFloat(goal.savedAmount) >= parseFloat(goal.targetAmount)
        ) {
          setReached(true);
        } else {
          setReached(false);
        }
      }

      loadData();

      return () => {
        isActive = false;
      };
    }, [userId]),
  );

  const progress = mostRecentGoal
    ? Math.min(
        parseFloat(mostRecentGoal.savedAmount) /
          parseFloat(mostRecentGoal.targetAmount),
        1,
      )
    : 0;

  if (mostRecentGoal === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{ paddingVertical: 24, color: "#2c3e50", fontWeight: "600" }}
        >
          No Recent Goals available.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#f3f4f6",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        padding: 16,
        width: "100%",
        maxWidth: 448,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: "#6b7280",
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        Most Recent Goal
      </Text>

      <Text
        style={{
          color: "#2c3e50",
          fontWeight: "700",
          fontSize: 18,
          marginBottom: 8,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {mostRecentGoal.title}
      </Text>

      {/* Progress Bar */}
      <View
        style={{
          width: "100%",
          height: 12,
          borderRadius: 9999,
          backgroundColor: "#e5e7eb",
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <LinearGradient
          colors={["#5c9fef", "#2c3e50"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{ height: "100%", width: `${progress * 100}%` }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#374151", fontWeight: "500", fontSize: 14 }}>
          ${mostRecentGoal.savedAmount} / ${mostRecentGoal.targetAmount}
        </Text>
        <Text style={{ color: "#6b7280", fontSize: 14 }}>
          Due: {mostRecentGoal.dueDate}
        </Text>
      </View>

      {reached && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
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
            <Text style={{ color: "#22c55e" }}>Achieved</Text>
          </View>
        </View>
      )}
    </View>
  );
}
