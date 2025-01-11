export const handleCheckout = async (
        sessionToken: string
    ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
  
    try {
      // Perform the POST request to checkout the cart
      const response = await fetch(`${apiUrl}subscription/cart/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
  
      console.log("Checkout Response: ", response);
  
      if (!response.ok) {
        if (response.status === 400) {
          console.warn("Invalid checkout request.");
        }
        throw new Error("Checkout failed.");
      }
  
      console.log("Checkout successful!");
      return true; // Indicate success
    } catch (error) {
      console.error("There was a problem with the checkout operation:", error);
      return false; // Indicate failure
    }
  };
  