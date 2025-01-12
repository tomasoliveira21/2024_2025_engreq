import { KpisResponse } from "@/types/coproducerCriticalKPIs";

export const fetchCoProducerCriticalKPIs = async (
  sessionToken: string
): Promise<KpisResponse> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}amap/coproducer/kpis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: KpisResponse = await response.json();

    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};
