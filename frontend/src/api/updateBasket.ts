import { toast } from "react-toastify";

export const updateBasket = async (
    sessionToken: string,
    basketId: number, // Assuming the basket is identified by an ID
    updatedBasketData: {
        name?: string;
        description?: string;
        price?: number;
        weight?: number;
        type?: string;
        photoUrl?: string;
        products?: { id: number; quantity: number }[];
    }
) => {
    try {
        const apiUrl = "http://127.0.0.1:3001/";
        const response = await fetch(`${apiUrl}products/basket/${basketId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(updatedBasketData),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        toast.success("Basket updated successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    } catch (error) {
        toast.error("Failed to update basket", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};
