import { AccountValues } from "../types/producerBalance";

export const fetchProducerAccountValues = async (
    sessionToken: string
    ): Promise<AccountValues[]> => {
    const apiUrl = "http://localhost:3001/";
    const response = await fetch(`${apiUrl}amap/account/producer`, {
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

    if (!Array.isArray(data.account)) {
        throw new Error("Invalid response format");
    }

    return data.account as AccountValues[];

}
  