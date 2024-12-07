export interface ProductDetails {
    id: number;
    name: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    Producer: {
      id: number;
      businessName: string;
      User: {
        id: number;
        email: string;
        nif: number;
      };
    };
  }