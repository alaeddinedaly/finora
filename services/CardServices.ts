import { images } from "@/constants/images";
import { API_BASE_URL } from "@/constants/api";

export async function fetchSelectedCard(userId: any, cardName: any) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/(api)/card?selected=true&user_id=${userId}&card_name=${cardName}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch selected card");
    }

    const json = await response.json();

    const mappedCards = json.data.map((card: any) => ({
      name: card.card_name,
      balance: `$${card.total_balance}`,
      number: card.card_number,
      expiry: card.expiry_date,
      type: card.card_type.toLowerCase(),
      backgroundImage: getImageForCardType(card.card_type),
    }));

    return mappedCards[0] || null; // return the first card or null
  } catch (error) {
    console.error("fetchSelectedCard error:", error);
    return null;
  }
}

export async function fetchCardNames(userId: any) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/(api)/card?name=true&user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch card Names");
    }

    const json = await response.json();

    return json.data.map((card: any) => ({
      name: card.card_name,
    }));
  } catch (error) {
    console.error("fetchCards error:", error);
    return [];
  }
}

export async function fetchCards(userId: any) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/(api)/card?user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }

    const json = await response.json();

    return json.data.map((card: any) => ({
      id: card.id,
      name: card.card_name,
      balance: `$${card.total_balance}`,
      number: card.card_number,
      expiry: card.expiry_date,
      type: card.card_type.toLowerCase(),
      backgroundImage: getImageForCardType(card.card_type),
    }));
  } catch (error) {
    console.error("fetchCards error:", error);
    return [];
  }
}

export async function updateBalance(
  userId: any,
  cardName: string,
  addedAmount: number,
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/(api)/card?user_id=${userId}&card_name=${cardName}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addedAmount }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update balance:", errorText);
      throw new Error(`Failed to update balance: ${errorText}`);
    }

    const json = await response.json();

    // Return updated card info (or null if no data)
    return json.data ?? null;
  } catch (error) {
    console.error("updateBalance error:", error);
    return null;
  }
}

export async function fetchTotalCardBalance(userId: any) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/(api)/card?balance=true&user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch total card balance");
    }

    const json = await response.json();

    // convert to number; if null or undefined, fallback to 0
    const totalBalanceRaw = json.data?.[0]?.total_balance_sum;
    const totalBalance = totalBalanceRaw ? Number(totalBalanceRaw) : 0;

    return `${totalBalance.toFixed(2)}`;
  } catch (error) {
    console.error("fetchTotalCardBalance error:", error);
    return null;
  }
}

export async function deleteCard(userId: any, cardName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/(api)/card`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cardName }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete Card");
    }

    const json = await response.json();
    return json.message ?? "card deleted successfully";
  } catch (error) {
    console.error("deletedCard error:", error);
    return null;
  }
}

function getImageForCardType(cardType: string) {
  switch (cardType.toLowerCase()) {
    case "apple":
      return images.applecard;
    case "visa":
      return images.visacard;
    case "mastercard":
      return images.mastercard;
    default:
      return images.mastercard;
  }
}
