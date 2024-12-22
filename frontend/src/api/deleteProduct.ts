import { toast } from "react-toastify";

export const deleteProduct = async (
    sessionToken: string,
    productId: number // Assuming the product is identified by an ID
) => {
    try {
        const apiUrl = "http://127.0.0.1:3001/";
        const response = await fetch(`${apiUrl}products/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        toast.success("Product deleted successfully!", {
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
        toast.error("Failed to delete product", {
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
