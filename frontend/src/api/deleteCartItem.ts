export const deleteCartItem = async (
  id: number,
  sessionToken: string
): Promise<boolean> => {
  const apiUrl = "http://127.0.0.1:3001/";
  try {
    const response = await fetch(`${apiUrl}subscription/cart/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log("Id: ", id);
    console.log("Response: ", response);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Item not found in the cart.");
        return false;
      }
      throw new Error("Failed to remove item from the cart.");
    }

    console.log(`Item with ID ${id} removed successfully.`);
    return true; // Indicate success
  } catch (error) {
    console.error("There was a problem with the delete operation:", error);
    return false; // Indicate failure
  }
};
