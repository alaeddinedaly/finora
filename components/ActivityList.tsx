import React from "react";
import { View } from "react-native";
import RecentActivity from "./RecentActivity";

type Activity = {
  source: any;
  title: string;
  moneyValue: string;
  date: string;
  type: "expense" | "income";
};

type ActivityListProps = {
  activities: Activity[];
};

const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <View>
      {activities.map((activity, index) => (
        <RecentActivity
          key={index}
          source={activity.source}
          title={activity.title}
          type={activity.type}
          moneyValue={activity.moneyValue}
          date={activity.date}
        />
      ))}
    </View>
  );
};

export default ActivityList;
