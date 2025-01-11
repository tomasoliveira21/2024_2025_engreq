import { toast } from "react-toastify";

export const createSeason = async (
  sessionToken: string,
  seasonData: {
    name: string;
    startDate: string;
    endDate: string;
    season: string;
  }
) => {
  try {
    const apiUrl = "http://127.0.0.1:3001/";
    const response = await fetch(`${apiUrl}amap/4/season`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(seasonData),
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
