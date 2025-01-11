export interface User {
    id: number;
    email: string;
    nif: number;
    name: string;
  }
  
  export interface BalanceDetail {
    totalCostSum: number;
    paidCostSum: number;
    pendingValue: number;
    User: User;
  }
  
  export interface BalanceResponse {
    balance: BalanceDetail[];
  }
  