export interface BasketDetails {
  id: number;
  name: string;
  description: string;
  photoUrl: string;
  price: number;
  weight: number;
  Producer: {
    id: number;
    businessName: string;
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
}
