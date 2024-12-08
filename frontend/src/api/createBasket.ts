export const createBasket = async (
    sessionToken: string,
    basketData: {
      name: string;
      description: string;
      price: number;
      weight: number;
      type: string;
      photoUrl: string;
      products: { id: number; quantity: number }[];
      createdAt?: Date;
      updatedAt?: Date;
    }
  ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    try {
      const response = await fetch(`${apiUrl}products/basket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(basketData),
      });
      console.log("response", response);
      console.log(basketData);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Basket created successfully:", data);
  
      return true; // Return true if the basket is successfully created
    } catch (error) {
      console.error("There was a problem with the create operation:", error);
      return false; // Return false in case of an error
    }
  };
  