/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KpiCard } from '../components/KpiCard';
import { Header } from '../components/Header';
import { REVENUE_DATA } from '../constants';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    conversion: 3.42
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch Revenue
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'COMPLETED');
      
      if (txError) throw txError;
      const totalRevenue = txData.reduce((acc, curr) => acc + Number(curr.amount), 0);

      // Fetch User Count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (userError) throw userError;

      // Fetch Recent Transactions
      const { data: recentTx, error: recentError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (recentError) throw recentError;

      setStats({
        revenue: totalRevenue,
        users: userCount || 0,
        conversion: 3.42 // Mocked for now
      });
      setRecentTransactions(recentTx || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Dashboard Snapshot" />
      
      <main className="p-10 space-y-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-earth-accent" />
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Total Revenue" value={`$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
              <KpiCard title="Active Users" value={stats.users.toString()} variant="taupe" />
              <KpiCard title="Conversion Rate" value={`${stats.conversion}%`} />
            </section>

            <section className="bg-white p-8 rounded-2xl border border-earth-border/30 shadow-sm">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h4 className="text-lg font-bold">Performance Overview</h4>
                  <p className="text-sm text-gray-500">Revenue growth over the last 30 days</p>
                </div>
                <div className="flex gap-2 p-1 bg-earth-bg rounded-full">
                  <button className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-white">Daily</button>
                  <button className="px-4 py-1.5 bg-earth-accent text-white rounded-full text-xs font-bold shadow-sm">Monthly</button>
                </div>
              </div>
              
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DDD0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#8E9299' }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#F5F0EB', 
                        border: '1px solid #D1C7BD',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#A0522D" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#A0522D', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold">Recent Transactions</h4>
                <button className="text-sm font-bold text-earth-accent hover:underline">View all</button>
              </div>
              <div className="bg-white rounded-2xl border border-earth-border/30 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-earth-card-sand/30 border-b border-earth-border/30">
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider opacity-60">ID</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider opacity-60">Customer</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider opacity-60">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider opacity-60 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-border/20 text-sm">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No recent transactions.</td>
                      </tr>
                    ) : (
                      recentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-earth-bg/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.tx_id}</td>
                          <td className="px-6 py-4 font-semibold">{tx.customer}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                              tx.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold">${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
