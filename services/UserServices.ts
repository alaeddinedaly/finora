export async function fetchSummary(userId: any) {
  try {
    const response = await fetch(
      `/(api)/profile?summary=true&user_id=${userId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch summary data");
    }

    const json = await response.json();

    return json.data;
  } catch (error) {
    console.error("fetchSummary error:", error);
    return null;
  }
}

export async function fetchImage(UserId: any) {
  try {
    const response = await fetch(`/(api)/profile?user_id=${UserId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile image");
    }

    const json = await response.json();

    return json.data.image_url; // Assuming image_url is returned from backend
  } catch (error) {
    console.error("fetchImage error:", error);
    return null;
  }
}

export async function UpdateImage(image: any, clerkId: any) {
  try {
    const response = await fetch(`/(api)/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerk_id: clerkId,
        image_url: image,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile image");
    }

    const json = await response.json();

    return json.data.image_url; // Assuming backend returns updated image_url
  } catch (error) {
    console.error("UpdateImage error:", error);
    return null;
  }
}

export async function UpdateProfile(
  name: any,
  email: any,
  image: any,
  userId: any,
) {
  try {
    const response = await fetch(`/(api)/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        image_url: image,
        userId: userId,
        name: name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile info");
    }

    const json = await response.json();

    return json.data; // Assuming backend returns updated image_url
  } catch (error) {
    console.error("updateProfile error:", error);
    return null;
  }
}

export async function fetchUserData(clerkId: any) {
  try {
    const response = await fetch(`/(api)/user?id=${clerkId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user Data");
    }

    const json = await response.json();

    return json.data;
  } catch (error) {
    console.error("fetchImage error:", error);
    return null;
  }
}

export async function DeleteProfile(clerkId: any) {
  try {
    const response = await fetch(`/(api)/user?id=${clerkId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const json = await response.json();
    return json.message || "User deleted successfully";
  } catch (error) {
    console.error("deleteUser error:", error);
    return null;
  }
}
