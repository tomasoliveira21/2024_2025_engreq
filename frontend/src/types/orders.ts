export interface Order {
  id: number;
  periodType: string;
  totalCost: number;
  paidCost: number;
  orderDate: string;
  status: string;
  OrderDetails: Array<{
    id: number;
    orderId: number;
    itemId: number;
    itemType: string;
    quantity: number;
    price: number;
    producerId: number;
    createdAt: string;
    updatedAt: string;
    Producer: null | {
      id: number;
      businessName: string | null;
      User: {
        id: number;
        email: string;
        nif: number;
      };
      Certificates: Array<any>;
    };
    Product?: {
      id: number;
      name: string;
      description: string;
      type: string;
      price: number;
      quantity: number;
      Producer: {
        id: number;
        businessName: string | null;
        User: {
          id: number;
          email: string;
          nif: number;
        };
        Certificates: Array<any>;
      };
    };
    Basket?: {
      id: number;
      name: string;
      description: string;
      photoUrl: string;
      price: number;
      weight: number;
      Producer: {
        id: number;
        businessName: string | null;
        User: {
          id: number;
          email: string;
          nif: number;
        };
      };
      Products: Array<{
        id: number;
        name: string;
        description: string;
        price: number;
      }>;
    };
  }>;
}
