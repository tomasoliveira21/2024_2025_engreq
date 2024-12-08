export const createSubscription = async (
    sessionToken: string,
    subscriptionData: {
      periodType: string;
      itemType: string;
      itemId: number;
      quantity: number;
      createdAt?: Date;
      updatedAt?: Date;
    }
  ): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    try {
      const response = await fetch(`${apiUrl}subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(subscriptionData),
      });
  
      console.log("response", response);
      console.log(subscriptionData);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Subscription created successfully:", data);
  
      return true; // Return true if the subscription is successfully created
    } catch (error) {
      console.error("There was a problem with the subscription creation:", error);
      return false; // Return false in case of an error
    }
  };
  