/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Search, Calendar, Filter, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.tx_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="p-10 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight">Transactions History</h2>
          <p className="text-gray-500 text-sm">Monitor and manage all financial activities across your supply chain.</p>
        </div>
      </header>

      <section className="px-10 py-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-earth-border rounded-2xl focus:ring-2 focus:ring-earth-accent/20 focus:border-earth-accent outline-none text-sm transition-all shadow-sm"
              placeholder="Search by ID, customer, or category"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-earth-border rounded-2xl text-sm font-bold text-gray-700 hover:bg-earth-bg transition-colors shadow-sm">
              All Statuses <ChevronLeft className="w-4 h-4 rotate-270" />
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-earth-border rounded-2xl text-sm font-bold text-gray-700 hover:bg-earth-bg transition-colors shadow-sm">
              This Month <Calendar className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-earth-border rounded-2xl text-sm font-bold text-gray-700 hover:bg-earth-bg transition-colors shadow-sm">
              Category <Filter className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-earth-accent text-white rounded-2xl text-sm font-bold hover:bg-earth-accent/90 shadow-lg shadow-earth-accent/20 transition-all">
              Export <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-earth-border/30 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-card-sand/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-earth-accent mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Transactions...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-earth-bg/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{tx.tx_id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tx.customer}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-earth-card-sand/40 text-earth-sidebar rounded-full text-[10px] font-bold border border-earth-border/30">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        tx.status === 'PENDING' ? 'bg-gray-100 text-gray-500' :
                        tx.status === 'REFUNDED' ? 'bg-red-50 text-red-600' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-right">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <div className="px-6 py-5 bg-earth-card-sand/10 flex items-center justify-between border-t border-earth-border/30">
            <p className="text-xs text-gray-500 font-bold">Showing {filteredTransactions.length} transactions</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl border border-earth-border text-gray-400 hover:bg-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-4 py-1.5 text-xs font-bold rounded-xl bg-earth-accent text-white shadow-sm">1</button>
              <button className="p-2 rounded-xl border border-earth-border text-gray-400 hover:bg-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
