/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, ReportEntry, Customer, InventoryItem } from './types';

export const TRANSACTIONS: Transaction[] = [
  { id: '#TRX-9402', customer: 'Sophia Bennett', status: 'COMPLETED', amount: 240.00, date: 'Oct 24, 2023', category: 'Organic Goods' },
  { id: '#TRX-9403', customer: 'Marcus Sterling', status: 'PENDING', amount: 1105.50, date: 'Oct 23, 2023', category: 'Handcrafted' },
  { id: '#TRX-9404', customer: 'Elena Vance', status: 'COMPLETED', amount: 45.00, date: 'Oct 22, 2023', category: 'Wellness' },
  { id: '#TRX-9405', customer: 'Julian Thorne', status: 'FAILED', amount: 612.20, date: 'Oct 21, 2023', category: 'Home Decor' },
  { id: '#TRX-9928', customer: 'Sarah Jenkins', status: 'COMPLETED', amount: 124.50, date: 'Oct 24, 2023', category: 'Organic Goods' },
  { id: '#TRX-9927', customer: 'Michael Chen', status: 'PENDING', amount: 89.00, date: 'Oct 23, 2023', category: 'Handcrafted' },
  { id: '#TRX-9926', customer: 'Elena Rodriguez', status: 'REFUNDED', amount: 45.20, date: 'Oct 22, 2023', category: 'Wellness' },
];

export const REPORT_ENTRIES: ReportEntry[] = [
  { id: '1', name: 'Q3 Sustainable Growth', dateCreated: 'Oct 24, 2023', category: 'Financial', status: 'Completed' },
  { id: '2', name: 'Inventory Audit - Earthy Pots', dateCreated: 'Oct 18, 2023', category: 'Inventory', status: 'Pending' },
  { id: '3', name: 'Customer Retention Analysis', dateCreated: 'Oct 12, 2023', category: 'Marketing', status: 'Completed' },
  { id: '4', name: 'Seasonal Trend Forecast', dateCreated: 'Oct 05, 2023', category: 'Forecasting', status: 'Draft' },
];

export const REVENUE_DATA = [
  { name: 'Oct 01', value: 400 },
  { name: 'Oct 05', value: 300 },
  { name: 'Oct 10', value: 600 },
  { name: 'Oct 15', value: 450 },
  { name: 'Oct 20', value: 800 },
  { name: 'Oct 25', value: 650 },
  { name: 'Oct 30', value: 900 },
  { name: 'Nov 09', value: 1100 },
];

export const CATEGORY_SALES = [
  { name: 'Organic Clay', value: 65, color: '#A0522D' },
  { name: 'Terracotta Pots', value: 42, color: '#3B2F2F' },
  { name: 'Ceramic Tools', value: 28, color: '#C4B5A5' },
  { name: 'Natural Glazes', value: 88, color: '#A0522D' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Sophia Bennett', email: 'sophia@example.com', role: 'Premium Member', status: 'Active' },
  { id: '2', name: 'Marcus Sterling', email: 'marcus@example.com', role: 'Standard Member', status: 'Active' },
  { id: '3', name: 'Elena Vance', email: 'elena@example.com', role: 'Standard Member', status: 'Inactive' },
  { id: '4', name: 'Julian Thorne', email: 'julian@example.com', role: 'Premium Member', status: 'Active' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Organic Clay Pot', sku: 'CP-001', category: 'Terracotta', stock: 45, price: 24.99, status: 'In Stock' },
  { id: '2', name: 'Ceramic Glaze Set', sku: 'GS-012', category: 'Tools', stock: 8, price: 59.50, status: 'Low Stock' },
  { id: '3', name: 'Natural Pigment Pack', sku: 'PP-088', category: 'Raw Materials', stock: 120, price: 15.00, status: 'In Stock' },
  { id: '4', name: 'Handcrafted Vase', sku: 'HV-005', category: 'Finished Goods', stock: 0, price: 85.00, status: 'Out of Stock' },
];
