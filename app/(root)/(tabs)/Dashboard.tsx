import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  LineChart,
  BarChart,
  ProgressChart,
  PieChart,
} from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { fetchTotalCardBalance } from "@/services/CardServices";
import { useUser } from "@clerk/clerk-expo";
import {
  fetchCategoryData,
  fetchExpensesData,
  fetchIncomeData,
} from "@/services/CategoryServices";
import { fetchGoals } from "@/services/GoalServices";
import { fetchWeeklySpending } from "@/services/TransactionServices";
import * as Notifications from "expo-notifications";

const screenWidth = Dimensions.get("window").width;

async function checkAndNotify(goals, balance) {
  const now = new Date();
  for (const goal of goals) {
    if (!goal.dueDate) continue; // skip if no dueDate

    const dueDate = new Date(goal.dueDate);
    const diffDays =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 2 && diffDays > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Goal Reminder",
          body: `Your goal "${goal.title}" is due on ${goal.dueDate}`,
        },
        trigger: null, // send immediately
      });
    }
  }

  if (balance && Number(balance) < 50) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Low Balance Alert",
        body: "Your account balance is below $50. Consider reviewing your expenses.",
      },
      trigger: null,
    });
  }
}

const normalizeWeeklyData = (rawData: { day: string; total: any }[]) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const map: Record<string, number> = {};

  rawData.forEach((entry) => {
    map[entry.day.toUpperCase()] = Number(entry.total); // force number
  });

  return days.map((day) => map[day] ?? 0);
};

interface Goal {
  title: string;
  savedAmount: string;
  targetAmount: string;
  dueDate: string;
}

const commonChartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(92, 159, 239, ${opacity})`,
  labelColor: () => "#7f8c8d",
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#5c9fef",
  },
  propsForLabels: {
    fontSize: 10,
  },
};

const Dashboard = () => {
  const { user } = useUser();

  const userId = user?.id.toString();

  const [selectedTab, setSelectedTab] = useState("income");
  const [totalBalance, setTotalBalance] = useState("");
  const [mockGoals, setMockGoals] = useState<Goal[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadTotalBalance() {
        const data = await fetchTotalCardBalance(userId);
        if (data) {
          setTotalBalance(data);
        }
      }
      loadTotalBalance();
    }, [userId]),
  );

  useFocusEffect(
    useCallback(() => {
      async function loadMockGoals() {
        const fetchedMockGoals = await fetchGoals(userId);
        setMockGoals(fetchedMockGoals);
      }
      loadMockGoals();
    }, [userId]),
  );

  // Run notification checks when goals or balance change
  useFocusEffect(
    useCallback(() => {
      if (mockGoals.length === 0 || !totalBalance) return;

      checkAndNotify(mockGoals, totalBalance).catch((e) =>
        console.error("Notification error:", e),
      );
    }, [mockGoals, totalBalance]),
  );

  const progressData = mockGoals.map((goal) => {
    const saved = parseFloat(goal.savedAmount) || 0;
    const target = parseFloat(goal.targetAmount) || 1;
    return saved / target;
  });

  const labels = mockGoals.map((goal) => goal.title);

  const [incomeData, setIncomeData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useFocusEffect(
    useCallback(() => {
      async function loadIncomeData() {
        const raw = await fetchIncomeData(userId);
        const formatted = normalizeWeeklyData(raw);
        setIncomeData(formatted);
      }
      loadIncomeData();
    }, [userId]),
  );

  const [expenseData, setExpenseData] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  useFocusEffect(
    useCallback(() => {
      async function loadExpensesData() {
        const raw = await fetchExpensesData(userId);
        const formatted = normalizeWeeklyData(raw);
        setExpenseData(formatted);
      }
      loadExpensesData();
    }, [userId]),
  );

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadCategoryData() {
        if (!userId) return;
        const { categories, categoryData } = await fetchCategoryData(userId);
        setCategories(categories);
        setCategoryData(categoryData);
      }
      loadCategoryData();
    }, [userId]),
  );

  const [barLabels, setBarLabels] = useState<string[]>([]);
  const [barData, setBarData] = useState<number[]>([]);
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        if (!user?.id) return;
        const { labels, amounts } = await fetchWeeklySpending(userId);
        setBarLabels(labels);
        setBarData(amounts);
      }
      loadData();
    }, [userId]),
  );

  return (
    <SafeAreaView className="flex-1 bg-white mb-9">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        className="px-5 py-6"
      >
        <Text className="text-center text-3xl font-bold text-[#2c3e50] mb-1">
          Statistics
        </Text>
        <View className={"flex-1 flex-row justify-center items-center mx-7"}>
          <Text className="text-center text-2xl font-extrabold text-neutral-400 mb-6">
            Total Balance:
          </Text>
          <Text className="text-center text-2xl font-extrabold text-[#2c3e50] mb-6">
            {" "}
            ${totalBalance}
          </Text>
        </View>

        {/* Toggle Tabs */}
        <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            onPress={() => setSelectedTab("income")}
            className={`px-6 py-2 rounded-full mr-2 ${
              selectedTab === "income" ? "bg-[#5c9fef]" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedTab === "income" ? "text-white" : "text-gray-700"
              }`}
            >
              income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("expense")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "expense" ? "bg-[#5c9fef]" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedTab === "expense" ? "text-white" : "text-gray-700"
              }`}
            >
              expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Line Chart - Perfectly fitted */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2 px-2">
            {selectedTab === "income" ? "Income Overview" : "Expense Overview"}
          </Text>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: selectedTab === "income" ? incomeData : expenseData,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 44}
            height={200}
            chartConfig={commonChartConfig}
            bezier
            style={{
              borderRadius: 16,
              marginVertical: 4,
              left: -5,
            }}
            withVerticalLabels={false}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>

        {/* Bar Chart - Perfectly fitted */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2 px-2">
            Weekly Spending
          </Text>
          <BarChart
            data={{
              labels: barLabels.length
                ? barLabels
                : ["S", "M", "T", "W", "T", "F", "S"],
              datasets: [
                {
                  data: barData,
                },
              ],
            }}
            width={screenWidth - 44}
            height={200}
            chartConfig={{
              ...commonChartConfig,
              barPercentage: 0.5,
            }}
            style={{
              borderRadius: 16,
              marginVertical: 4,
              left: -5,
            }}
            withVerticalLabels={false}
            fromZero={true}
            yAxisLabel={""}
            yAxisSuffix={""}
          />
        </View>

        <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2 px-2">
            Savings Goals
          </Text>
          {progressData.length === 0 ? (
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
                No Recent Goals available.
              </Text>
            </View>
          ) : (
            <ProgressChart
              data={{
                labels: labels,
                data: progressData,
              }}
              width={screenWidth + 30}
              height={140}
              strokeWidth={5}
              radius={28}
              chartConfig={{ ...commonChartConfig, paddingRight: 0 }}
              style={{
                borderRadius: 16,
                marginVertical: 4,
                marginLeft: -100,
                overflow: "hidden",
              }}
              hideLegend={false}
            />
          )}
        </View>

        <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2 px-2">
            Expense Categories
          </Text>
          {categories.length === 0 ? (
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
                No Categories available.
              </Text>
            </View>
          ) : (
            <PieChart
              data={categories.map((category, index) => ({
                name: category,
                population: categoryData[index],
                color: `rgba(92, 159, 225, ${0.2 + index * 0.19})`,
                legendFontColor: "#7f8c8d",
                legendFontSize: 12,
              }))}
              width={screenWidth - 60}
              height={180}
              chartConfig={commonChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              style={{
                borderRadius: 16,
                marginVertical: 6,
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
