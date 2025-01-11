export const updateSubscription = async (
    id: number,
    status: string,
    quantity: number,
    sessionToken: string
  ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    const validStatuses = ["pending", "completed", "cancelled"];
  
    if (!validStatuses.includes(status)) {
      console.error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}.`);
      return false; // Indicate failure due to invalid input
    }
  
    try {
      const response = await fetch(`${apiUrl}subscription/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ status, quantity }),
      });
  
      console.log("Id:", id, "Status:", status, "Quantity:", quantity);
      console.log("Response:", response);
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Subscription not found.");
          return false;
        }
        throw new Error(`Failed to update subscription status. Status code: ${response.status}`);
      }
  
      console.log(`Subscription with ID ${id} updated successfully.`);
      return true; // Indicate success
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      return false; // Indicate failure
    }
  };
  