import { Carts } from "@/types/cart";

export const fetchCart = async (sessionToken: string): Promise<Carts[]> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}subscription/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("No cart found for the user.");
        return [];
      }
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.Cart; // Assuming the API returns a `cart` field in the response
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};
