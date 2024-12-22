import { toast } from "react-toastify";

export const updateProduct = async (
    sessionToken: string,
    productId: number, // Assuming the product is identified by an ID
    updatedProductData: {
        name?: string;
        description?: string;
        type?: string;
        price?: number;
        quantity?: number;
        photoUrl?: string;
    }
) => {
    try {
        const apiUrl = "http://127.0.0.1:3001/";
        const response = await fetch(`${apiUrl}products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(updatedProductData),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        toast.success("Product updated successfully!", {
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
        toast.error("Failed to update product", {
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
