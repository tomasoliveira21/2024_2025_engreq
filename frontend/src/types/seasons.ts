export type SalePeriod = {
    id: number;
    name: string;
    season: string;
    startDate: string;
    endDate: string;
  };

export interface SeasonResponse {
    season: SalePeriod[];
  }
  