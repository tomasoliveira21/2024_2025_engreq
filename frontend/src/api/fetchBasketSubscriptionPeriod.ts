import {SalePeriod} from "@/types/salePeriods";

export const fetchBasketPeriod = async (sessionToken: string, basketId: string): Promise<SalePeriod> => {
    const apiUrl = "http://127.0.0.1:3001/";
    try {
        const response = await fetch(`${apiUrl}products/basket/salePeriods/${basketId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn("No cart found for the user.");
                return {} as SalePeriod;
            }
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.salePeriods;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        return {} as SalePeriod;
    }
};