export interface User {
    id: number;
    email: string;
    nif: number;
  }
  
  export interface Certificate {
    id: number;
    name: string;
    issuingAuthority: string;
    issueDate: string;
    expirationDate: string;
  }
  
  export interface Producer {
    id: number;
    businessName: string | null;
    User: User;
    Certificates?: Certificate[];
  }
  
  export interface SalePeriod {
    id: number;
    name: string;
    season: string;
    startDate: string;
    endDate: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    photoUrl: string;
    Producer: Producer;
    SalePeriods: SalePeriod[];
  }
  
  export interface Basket {
    id: number;
    name: string;
    description: string;
    photoUrl: string | null;
    price: number;
    weight: number;
    Producer: Producer;
    Products: {
      id: number;
      name: string;
      description: string;
      price: number;
    }[];
    SalePeriods: SalePeriod[];
  }
  
  export interface OrderDetail {
    id: number;
    itemType: "basket" | "product";
    itemId: number;
    quantity: number;
    price: number;
    Basket?: Basket;
    Product?: Product;
  }
  
  export interface SubscriptionPeriod {
    startDate: string;
    endDate: string;
  }
  
  export interface Subscription {
    id: number;
    periodType: "weekly" | "monthly";
    totalCost: number;
    paidCost: number;
    orderDate: string;
    status: "pending" | "completed" | "cancelled";
    Subscription: SubscriptionPeriod;
    OrderDetails: OrderDetail[];
  }
  
  export interface SubscriptionsResponse {
    subscription: Subscription[];
  }
  