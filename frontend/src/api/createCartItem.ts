export const createCartItem = async (
    sessionToken: string,
    itemData: {
        itemType: string,
        itemId: number,
        quantity: number
    }
  ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    const validTypes = ["product", "basket"];
  
    try {
      // Validate itemType
      if (!validTypes.includes(itemData.itemType)) {
        console.error(`Invalid itemType: '${itemData.itemType}'. Must be 'product' or 'basket'.`);
        return false;
      }
  
      // Make the POST request
      const response = await fetch(`${apiUrl}subscription/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(itemData),
      });
  
      console.log("Payload: ", itemData);
      console.log("Response: ", response);
  
      if (!response.ok) {
        if (response.status === 400) {
          console.warn("Invalid data provided to the cart.");
          return false;
        }
        throw new Error("Failed to add item to the cart.");
      }
  
      console.log(`Item successfully added to the cart: ${itemData.itemType}, ID: ${itemData.itemId}, Quantity: ${itemData.quantity}`);
      return true; // Indicate success
    } catch (error) {
      console.error("There was a problem with the add-to-cart operation:", error);
      return false; // Indicate failure
    }
  };
  