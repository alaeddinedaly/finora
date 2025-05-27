export async function fetchTransactions(userId: any, cardName: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?user_id=${userId}&card_name=${cardName}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const json = await response.json();

    return json.data.map((transaction: any) => ({
      title: transaction.title ?? "Untitled",
      amount: transaction.amount ?? "0",
      type: transaction.type ?? "expense",
      date: transaction.date ?? "No date",
      category: transaction.category,
    }));
  } catch (error) {
    console.error("fetchTransactions error:", error);
    return [];
  }
}

export async function fetchRecentTransactions(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?recent=true&user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      console.log(response);
    }

    const json = await response.json();

    return json.data.map((transaction: any) => ({
      title: transaction.title ?? "Untitled",
      amount: transaction.amount ?? "0",
      type: transaction.type ?? "expense",
      date: transaction.date ?? "No date",
      cardId: transaction.card_id,
    }));
  } catch (error) {
    console.error("fetchTransactions error:", error);
    return [];
  }
}

export async function fetchWeeklySpending(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?weekly=true&user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weekly data");
    }

    const json = await response.json();
    const data = json.data;

    const labels: string[] = [];
    const amounts: number[] = [];

    for (const row of data) {
      labels.push(row.day); // e.g., 'MON', 'TUE'
      amounts.push(row.total);
    }

    return { labels, amounts };
  } catch (error) {
    console.error("fetchWeeklySpending error:", error);
    return { labels: [], amounts: [] };
  }
}
export async function fetchTransactionsForAi(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?ai=true&user_id=${userId}`,
      { method: "GET" },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error text:", errorText);
      throw new Error("Failed to fetch weekly data");
    }

    const json = await response.json();
    return { data: json.data };
  } catch (error) {
    console.error("fetchTransactionsForAi error:", error);
    return { data: [] };
  }
}
