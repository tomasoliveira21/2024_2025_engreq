export type User = {
    id: number;
    email: string;
    nif: number;
    AMAPId: number;
  };
  
  export type Producer = {
    id: number;
    businessName: string;
    description: string;
    photoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    userId: number;
    User: User;
  };
  
  export type Product = {
    id: number;
    name: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    Producer: Producer;
  };
  