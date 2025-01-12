export type Carts = {
    itemId: number;
    itemType: 'product' | 'basket';
    quantity: number;
    productName: string;
    price: number;
    basketName: string;
    basketPrice: number;
    basketProducts: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
    }>;
  };
  