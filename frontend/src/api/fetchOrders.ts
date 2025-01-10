import { Subscription } from "@/types/order";

export const fetchOrders = async (sessionToken: string): Promise<Subscription[]> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}subscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: { subscription: Subscription[] } = await response.json();

    return data.subscription;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};
