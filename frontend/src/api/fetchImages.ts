const API_KEY = "";
const BASE_URL = "";

/**
 * Fetches images from the Pexels API based on a search query.
 * 
 * @param query - The search term for fetching images.
 * @param perPage - The number of images to fetch per page (default: 10).
 * @returns An array of image URLs.
 */
export const fetchPhoto = async (photoId: string, token: string): Promise<string> => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch photo with ID: ${photoId}, status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.src.original; // Returns the original image URL
    } catch (error) {
      console.error("Error fetching photo:", error);
      throw error;
    }
  };
  
  export async function fetchImages(query: string, perPage: number = 10): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
        headers: {
          Authorization: API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Pexels API responded with status ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extract and return the image URLs
      return data.photos.map((photo: { src: { original: string } }) => photo.src.original);
    } catch (error) {
      console.error("Error fetching images from Pexels API:", error);
      return [];
    }
  }
