import { BalanceDetail } from "@/types/producerBalance";

export const fetchProducerBalance = async (
  sessionToken: string
): Promise<BalanceDetail[]> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}amap/balance/producer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!Array.isArray(data.balance)) {
      throw new Error("Invalid response format");
    }

    return data.balance as BalanceDetail[];
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};
