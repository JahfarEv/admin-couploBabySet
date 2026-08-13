export type OrderStatus = 'Shipped' | 'Pending' | 'Cancelled' | 'Delivered' | 'Confirm and Processing'

export interface Order {
  id: string
  customerName: string
  customerInitials: string
  date: string
  status: OrderStatus
  total: number
  items: number
}

export type ProductCategory = string

export interface Category {
  name: string
  image?: string
  description?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  includes?: string[]
  category: ProductCategory
  price: number
  stock: number
  sold: number
  image: string
  images?: string[]
  status: 'Active' | 'Draft' | 'Out of Stock'
  customizable: boolean
}

export interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface CartCustomer {
  id: string
  customerName: string
  customerInitials: string
  phone: string
  addedAt: string
  total: number
  items: CartItem[]
}

export interface Customer {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joined: string
  location: string
}

export interface StatSummary {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  icon: 'sales' | 'orders' | 'customers' | 'products'
}

export interface AdminUser {
  name: string
  email: string
  role: string
}



// types/index.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  includes?: string[];
  category: ProductCategory;
  price: number;
  stock: number;
  sold: number;
  image: string; // Now stores Cloudinary URL
  images?: string[];
  status: 'Active' | 'Draft' | 'Out of Stock';
  customizable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
