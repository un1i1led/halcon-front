export interface Order {
  id: number;
  status: string;
  deliveryAddress: string;
  customerNumber: string;
  notes: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}