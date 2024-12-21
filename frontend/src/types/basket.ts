export type SalePeriod = {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
};

export interface Basket {
    id: number;
    name: string;
    description: string;
    type: string;
    photoUrl: string | null;
    price: number;
    weight: number;
    SalePeriods: SalePeriod[];
  }
  