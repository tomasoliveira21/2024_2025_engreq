export type SalePeriod = {
    id: number;
    name: string;
    season: string;
    startDate: string;
    endDate: string;
  };

export interface SeasonResponse {
    name: any;
    id: any;
    startDate: Date;
    endDate: Date;
    DeliveryDates: Date[];
    season: SalePeriod[];
  }
  