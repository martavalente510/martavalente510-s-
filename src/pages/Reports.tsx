/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from '../components/Header';
import { KpiCard } from '../components/KpiCard';
import { REVENUE_DATA, CATEGORY_SALES, REPORT_ENTRIES } from '../constants';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Reports: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="p-10 pb-4 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Reports</h1>
          <p className="text-gray-500 mt-1">Manage and analyze your business performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-earth-card-sand p-2 rounded-2xl border border-earth-border/50">
          <button className="p-2 hover:bg-earth-border/20 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-earth-accent" />
          </button>
          <span className="text-sm font-bold px-4">October 2023 - November 2023</span>
          <button className="p-2 hover:bg-earth-border/20 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-earth-accent" />
          </button>
          <button className="flex items-center gap-2 bg-earth-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold ml-2 shadow-lg shadow-earth-accent/20 hover:scale-[1.02] transition-all">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="p-10 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Revenue" value="$42,500.00" trend={{ value: '+5.2%', isUp: true }} />
          <KpiCard title="Average Order" value="$128.50" trend={{ value: '+1.8%', isUp: true }} />
          <KpiCard title="New Customers" value="1,240" trend={{ value: '+8.4%', isUp: true }} />
          <KpiCard title="Conversion Rate" value="12.5%" trend={{ value: '-0.5%', isUp: false }} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-earth-card-sand/40 border border-earth-border/30 p-8 rounded-2xl min-h-[400px] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold">Revenue Trends</h2>
              <select className="bg-transparent border-none text-sm font-bold text-gray-500 focus:ring-0 cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A0522D" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#A0522D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C4B5A5" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#8E9299' }}
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
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#A0522D" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-earth-card-sand/40 border border-earth-border/30 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-8">Sales by Category</h2>
            <div className="flex flex-col gap-6">
              {CATEGORY_SALES.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{cat.name}</span>
                    <span>{cat.value}%</span>
                  </div>
                  <div className="w-full h-3 bg-earth-border/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-earth-card-sand/40 border border-earth-border/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-earth-border/30 flex justify-between items-center bg-white/30">
            <h2 className="text-lg font-bold">Recent Report Entries</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs font-bold bg-white/50 border border-earth-border/30 rounded-xl hover:bg-white transition-colors">Filter</button>
              <button className="px-4 py-1.5 text-xs font-bold bg-white/50 border border-earth-border/30 rounded-xl hover:bg-white transition-colors">Search</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-earth-border/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Created</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-border/20">
                {REPORT_ENTRIES.map((report) => (
                  <tr key={report.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-earth-accent" />
                        <span className="text-sm font-bold">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.dateCreated}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                        report.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        report.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-earth-accent font-bold text-sm hover:underline">
                        {report.status === 'Draft' ? 'Edit' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
