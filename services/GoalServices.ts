export async function fetchGoals(userId: any) {
  try {
    const response = await fetch(`/(api)/goal?user_id=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch goals");
    }

    const json = await response.json();

    return json.data.map((goal: any) => ({
      title: goal.goal_title ?? "Untitled",
      targetAmount: goal.target_amount ?? "0",
      savedAmount: goal.current_amount ?? "0",
      dueDate: goal.deadline ?? "No date",
    }));
  } catch (error) {
    console.error("fetchGoals error:", error);
    return [];
  }
}

export async function fetchMostRecentGoal(userId: any) {
  try {
    const response = await fetch(`/(api)/goal?recent=true&user_id=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Most Recent Goal");
    }

    const json = await response.json();

    return json.data.map((goal: any) => ({
      title: goal.goal_title ?? "Untitled",
      targetAmount: goal.target_amount ?? "0",
      savedAmount: goal.current_amount ?? "0",
      dueDate: goal.deadline ?? "No date",
    }));
  } catch (error) {
    console.error("fetchGoals error:", error);
    return [];
  }
}

export async function deleteGoal(userId: any, title: string) {
  try {
    const response = await fetch(`/(api)/goal`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete goal");
    }

    const json = await response.json();
    return json.message ?? "Goal deleted successfully";
  } catch (error) {
    console.error("deleteGoal error:", error);
    return null;
  }
}

export async function updateGoal(
  userId: any,
  originalTitle: string,
  updates: {
    newTitle: string;
    savedAmount: string;
    targetAmount: string;
    dueDate: string;
  },
) {
  try {
    const response = await fetch(`/(api)/goal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        originalTitle,
        newTitle: updates.newTitle,
        savedAmount: updates.savedAmount,
        targetAmount: updates.targetAmount,
        dueDate: updates.dueDate,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update goal");
    }

    const json = await response.json();
    return json.message ?? "Goal updated successfully";
  } catch (error) {
    console.error("updateGoal error:", error);
    return null;
  }
}
