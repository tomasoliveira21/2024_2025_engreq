export interface KpiUser {
    id: number;
    email: string;
    nif: number;
    name: string;
  }
  
  export interface KpiProducer {
    id: number;
    businessName: string | null;
    description: string | null;
  }
  
  export interface KpiDetail {
    totalOrders: number;
    totalValue: number;
    averageQuantity: number;
    averagePrice: number;
    producer: KpiProducer;
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
  