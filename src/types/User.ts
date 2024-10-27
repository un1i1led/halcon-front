export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'purchasing' | 'warehouse' | 'route';
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}