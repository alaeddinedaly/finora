import { router, Tabs } from "expo-router";
import { Image, View } from "react-native";
import { icons } from "@/constants/icons";
import FloatingActionButton from "@/components/FloatingActionButton";

const TabIcon = ({
  focused,
  source,
  width,
  height,
}: {
  focused: boolean;
  source: any;
  width?: number;
  height?: number;
}) => {
  // @ts-ignore
  return (
    <View
      className={`flex justify-center items-center rounded-full ${
        focused ? "bg-white" : ""
      }`}
    >
      <View
        className={`rounded-full w-10 h-10 items-center justify-center ${
          focused ? "bg-white" : "bg-transparent"
        }`}
      >
        <Image
          source={source}
          tintColor={focused ? "#2c3e50" : "#68BBE3"}
          resizeMode="contain"
          style={{
            width: focused ? width + 5 : width,
            height: focused ? height + 5 : height,
            tintColor: focused ? "#2c3e50" : "#68BBE3",
          }} // ~ w-5.5 h-5.5
        />
      </View>
    </View>
  );
};

const Layout = () => {
  return (
    <View className="flex-1">
      <Tabs
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            overflow: "hidden",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingBottom: 25,
            height: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.housie}
                height={25}
                width={25}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Cards"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.card}
                height={26}
                width={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Transactions"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.transaction}
                height={26}
                width={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Dashboard"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.graph}
                height={28}
                width={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Goal"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.goal}
                height={28}
                width={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={icons.person2}
                height={35}
                width={35}
              />
            ),
          }}
        />
      </Tabs>
      <FloatingActionButton
        onPress={() => router.push("/(root)/AiBotScreen")}
        iconSize={120}
      />
    </View>
  );
};
export default Layout;
