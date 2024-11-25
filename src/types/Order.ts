export interface Order {
  id: number;
  status: string;
  deliveryAddress: string;
  customerNumber: string;
  notes: string;
  deleted: boolean;
  images: OrderImage[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderImage {
  id: number;
  imageUrl: string;
  description: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
}