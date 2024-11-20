export interface Order {
  id: number;
  status: string;
  deliveryAddress: string;
  customerNumber: string;
  notes: string;
  deleted: boolean;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: number;
  imageUrl: string;
  description: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
}