export type SalePeriod = {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  quantity: number;
  SalePeriods: SalePeriod[];
};
