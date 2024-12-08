export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  photoUrl: string;
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
    Certificates: {
      id: number;
      name: string;
      issuingAuthority: string;
      issueDate: string;
      expirationDate: string;
    }[];
  };
}