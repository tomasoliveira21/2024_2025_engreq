import { Subscription } from "@/types/order";

export const fetchProducerOrders = async (sessionToken: string, producerId?: number): Promise<Subscription[]> => {
  const apiUrl = "http://127.0.0.1:3001/subscription/producer";
  const url = producerId ? `${apiUrl}?producerId=${producerId}` : apiUrl;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: { orders: Subscription[] } = await response.json();

    return data.orders;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};