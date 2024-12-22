export const deleteBasket = async (
    sessionToken: string,
    basketId: number,
): Promise<boolean> => {
    const apiUrl = "http://127.0.0.1:3001/";
    try {
        const response = await fetch(`${apiUrl}products/basket/${basketId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
        });

        console.log("response", response);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        console.log("Basket deleted successfully");
        return true; // Return true if the basket is successfully deleted
    } catch (error) {
        console.error("There was a problem with the delete operation:", error);
        return false; // Return false in case of an error
    }
};
