import type { CartCustomer, Customer, Order, Product, StatSummary } from '@/types'

export const statSummaries: StatSummary[] = [
  // { label: 'Total Sales', value: '$24,450.00', delta: '+12.5%', deltaPositive: true, icon: 'sales' },
  { label: 'Total Orders', value: '1,284', delta: '+8.2%', deltaPositive: true, icon: 'orders' },
  { label: 'New Customers', value: '456', delta: '+15%', deltaPositive: true, icon: 'customers' },
  { label: 'Total Products', value: '16', delta: '+2.4%', deltaPositive: true, icon: 'products' },
]

export const recentOrders: Order[] = [
  { id: '#CO-8842', customerName: 'Eleanor Abbott', customerInitials: 'EA', date: 'Oct 12, 2023', status: 'Shipped', total: 124.0, items: 2 },
  { id: '#CO-8841', customerName: 'Julian Moore', customerInitials: 'JM', date: 'Oct 12, 2023', status: 'Pending', total: 89.5, items: 1 },
  { id: '#CO-8840', customerName: 'Sarah White', customerInitials: 'SW', date: 'Oct 11, 2023', status: 'Shipped', total: 210.0, items: 3 },
  { id: '#CO-8839', customerName: 'Thomas Brown', customerInitials: 'TB', date: 'Oct 11, 2023', status: 'Cancelled', total: 45.0, items: 1 },
]

export const orders: Order[] = [
  ...recentOrders,
  { id: '#CO-8838', customerName: 'Priya Nair', customerInitials: 'PN', date: 'Oct 10, 2023', status: 'Delivered', total: 156.0, items: 2 },
  { id: '#CO-8837', customerName: 'Marcus Lee', customerInitials: 'ML', date: 'Oct 10, 2023', status: 'Processing', total: 72.0, items: 1 },
  { id: '#CO-8836', customerName: 'Ayesha Khan', customerInitials: 'AK', date: 'Oct 9, 2023', status: 'Delivered', total: 198.5, items: 4 },
  { id: '#CO-8835', customerName: 'Daniel Kim', customerInitials: 'DK', date: 'Oct 9, 2023', status: 'Shipped', total: 64.0, items: 1 },
]

export const customers: Customer[] = [
  { id: 'C-01', name: 'Eleanor Abbott', initials: 'EA', email: 'eleanor.a@mail.com', phone: '+91 98450 11234', orders: 6, totalSpent: 512.4, joined: 'Jan 2024', location: 'Kochi, IN' },
  { id: 'C-02', name: 'Julian Moore', initials: 'JM', email: 'julian.moore@mail.com', phone: '+91 90210 55123', orders: 2, totalSpent: 148.5, joined: 'Mar 2024', location: 'Bengaluru, IN' },
  { id: 'C-03', name: 'Sarah White', initials: 'SW', email: 'sarah.white@mail.com', phone: '+91 88991 22110', orders: 9, totalSpent: 890.0, joined: 'Nov 2023', location: 'Chennai, IN' },
  { id: 'C-04', name: 'Thomas Brown', initials: 'TB', email: 'thomas.brown@mail.com', phone: '+91 99872 43301', orders: 1, totalSpent: 45.0, joined: 'Jun 2024', location: 'Kozhikode, IN' },
  { id: 'C-05', name: 'Priya Nair', initials: 'PN', email: 'priya.nair@mail.com', phone: '+91 97456 61234', orders: 4, totalSpent: 322.75, joined: 'Feb 2024', location: 'Malappuram, IN' },
]

export const carts: CartCustomer[] = [
  {
    id: 'CART-101',
    customerName: 'Eleanor Abbott',
    customerInitials: 'EA',
    phone: '+91 98450 11234',
    addedAt: '10 mins ago',
    total: 166.8,
    items: [
      { id: 'CI-1', name: 'Organic Cotton Onesie', quantity: 2, price: 32 },
      { id: 'CI-2', name: 'Linen Sun Frock', quantity: 1, price: 36 },
    ],
  },
  {
    id: 'CART-102',
    customerName: 'Julian Moore',
    customerInitials: 'JM',
    phone: '+91 90210 55123',
    addedAt: '24 mins ago',
    total: 89.5,
    items: [
      { id: 'CI-3', name: 'Natural Dye Romper', quantity: 3, price: 18 },
      { id: 'CI-4', name: 'Festive Kurta Set', quantity: 1, price: 42 },
    ],
  },
  {
    id: 'CART-103',
    customerName: 'Sarah White',
    customerInitials: 'SW',
    phone: '+91 88991 22110',
    addedAt: '1 hr ago',
    total: 120.0,
    items: [
      { id: 'CI-5', name: 'Denim Dungaree', quantity: 2, price: 45 },
    ],
  },
]

