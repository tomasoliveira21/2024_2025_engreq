export interface BalanceUser {
    id: number;
    email: string;
    nif: number;
    name: string;
  }
  
  export interface BalanceProducer {
    id: number;
    businessName: string | null;
    description: string | null;
  }
  
  export interface BalanceDetail {
    totalCostSum: number;
    paidCostSum: number;
    pendingValue: number;
    User: BalanceUser;
    Producer: BalanceProducer;
  }
  
  export interface BalanceResponse {
    balance: BalanceDetail[];
  }

  export interface AccountValues {
    pendingValue: number;
    User: BalanceUser;
    Producer: BalanceProducer;
  }
  