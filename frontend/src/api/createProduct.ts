import { toast } from "react-toastify";

export const createProduct = async (
  sessionToken: string,
  productData: {
    name: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    photoUrl: string;
  }
) => {
  try {
    const apiUrl = "http://127.0.0.1:3001/";
    const response = await fetch(`${apiUrl}products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    toast.success("Product registered successfully!", {
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
    toast.error("Failed to register product", {
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
