export interface KpiUser {
    id: number;
    email: string;
    nif: number;
    name: string;
  }
  
  export interface KpiDetail {
    totalOrders: number;
    totalValue: number;
    averageQuantity: number;
    averagePrice: number;
    user: KpiUser;
  }
  
  export interface Season {
    name: string;
    startDate: string;
    endDate: string;
    kpis: KpiDetail[];
  }
  
  export interface KpisResponse {
    kpis: { season: Season }[];
  }
  