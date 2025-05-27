export async function fetchCategoryNames(userId: any) {
  try {
    const response = await fetch(`/(api)/categories?user_id=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const json = await response.json();

    return json.data.map((category: any) => ({
      name: category.name ?? "Untitled",
      color: category.color ?? "Untitled",
    }));
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
}

export async function fetchCategoryData(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?data=true&user_id=${userId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch category sums");

    const json = await response.json();

    const categories = json.data.map((item: any) => item.category);
    const categoryData = json.data.map((item: any) =>
      Number(item.total_amount),
    );

    return { categories, categoryData };
  } catch (error) {
    console.error("fetchCategoryData error:", error);
    return { categories: [], categoryData: [] };
  }
}

export async function fetchIncomeData(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?type=income&user_id=${userId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch Income Data");

    const json = await response.json();

    // return raw data directly with day and total
    return json.data; // [{ day: "MON", total: "316" }, ...]
  } catch (error) {
    console.error("fetchIncomeData error:", error);
    return [];
  }
}

export async function fetchExpensesData(userId: any) {
  try {
    const response = await fetch(
      `/(api)/transaction?type=expense&user_id=${userId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch expenses Data");

    const json = await response.json();

    // return raw data directly with day and total
    return json.data; // [{ day: "MON", total: "316" }, ...]
  } catch (error) {
    console.error("fetchExpensesData error:", error);
    return [];
  }
}
