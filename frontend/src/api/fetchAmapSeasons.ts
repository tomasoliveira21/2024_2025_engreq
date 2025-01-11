import { SeasonDetail, SeasonResponse } from "@/types/amapSeasons";

export const fetchAmapSeasons = async (sessionToken: string): Promise<SeasonDetail[]> => {
  const apiUrl = 'http://127.0.0.1:3001/';
  try {
    const response = await fetch(`${apiUrl}amap/4/season`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: SeasonResponse = await response.json();
    return data.season;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
};
