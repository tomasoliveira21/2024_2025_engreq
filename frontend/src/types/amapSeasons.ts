export interface DeliveryDate {
    date: string;
  }
  
  export interface SeasonDetail {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    season: string;
    DeliveryDates: DeliveryDate[];
  }
  
  export interface SeasonResponse {
    season: SeasonDetail[];
  }
  