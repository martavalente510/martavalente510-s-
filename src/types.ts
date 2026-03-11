/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  customer: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  amount: number;
  date: string;
  category?: string;
}

export interface ReportEntry {
  id: string;
  name: string;
  dateCreated: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Draft';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar?: string;
}

export type Screen = 'overview' | 'reports' | 'transactions' | 'settings' | 'customers' | 'inventory';
