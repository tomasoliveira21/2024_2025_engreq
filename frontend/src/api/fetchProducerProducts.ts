import { Product } from "@/types/product";

export const fetchProducerProducts = async (sessionToken: string, producerId: number | undefined): Promise<Product[]> => {
    const apiUrl = 'http://127.0.0.1:3001/';
    try {
        const response = await fetch(`${apiUrl}products/producer/${producerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
};
