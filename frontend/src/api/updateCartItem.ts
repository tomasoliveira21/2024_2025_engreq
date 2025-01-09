export const updateCartItem = async (
    id: number,
    quantity: number,
    sessionToken: string
  ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    try {
      const response = await fetch(`${apiUrl}subscription/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ quantity }),
      });
  
      console.log("Id: ", id, "Quantity: ", quantity);
      console.log("Response: ", response);
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Cart item not found.");
          return false;
        }
        throw new Error("Failed to update item quantity.");
      }
  
      console.log(`Item with ID ${id} updated successfully.`);
      return true; // Indicate success
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      return false; // Indicate failure
    }
  };
  