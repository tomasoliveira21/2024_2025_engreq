import { Basket } from "@/types/basket";

export const fetchBaskets = async (sessionToken: string, amapId: string): Promise<Basket[]> => {
    const apiUrl = 'http://127.0.0.1:3001/';
    try {
      const response = await fetch(`${apiUrl}products/basket/amap/${amapId}`, {
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
      return data.baskets;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  };
  