import { KPIs } from "@/types/kpis";

export const fetchKPIs = async (sessionToken: string): Promise<KPIs> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}amap/kpis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: { kpis: KPIs } = await response.json();
    return data.kpis;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};
