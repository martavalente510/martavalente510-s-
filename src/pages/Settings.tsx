/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Edit2, ChevronDown, HelpCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="max-w-4xl mx-auto w-full p-10 lg:p-16">
        <header className="mb-12">
          <h2 className="text-5xl font-black tracking-tight mb-4">Settings</h2>
          <p className="text-gray-500 text-lg">Manage your account preferences and configurations.</p>
        </header>

        <div className="border-b border-earth-border/50 mb-12">
          <nav className="flex gap-10">
            <button className="pb-5 border-b-4 border-earth-accent text-earth-accent font-black text-sm tracking-widest uppercase">Profile</button>
            <button className="pb-5 border-b-4 border-transparent text-gray-400 hover:text-gray-600 font-black text-sm tracking-widest uppercase transition-all">Notifications</button>
            <button className="pb-5 border-b-4 border-transparent text-gray-400 hover:text-gray-600 font-black text-sm tracking-widest uppercase transition-all">Security</button>
            <button className="pb-5 border-b-4 border-transparent text-gray-400 hover:text-gray-600 font-black text-sm tracking-widest uppercase transition-all">Billing</button>
          </nav>
        </div>

        <div className="space-y-16">
          <section className="flex flex-col md:flex-row gap-10 items-start md:items-center p-8 rounded-3xl border border-earth-border/40 bg-white/40 backdrop-blur-sm shadow-sm">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-earth-card-sand overflow-hidden border-4 border-white shadow-lg">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://picsum.photos/seed/julian/200/200" 
                  alt="Profile"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-earth-accent text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black tracking-tight">Profile Picture</h3>
              <p className="text-gray-500 font-medium mt-1">JPG, GIF or PNG. Max size of 800K</p>
              <div className="mt-6 flex gap-4">
                <button className="px-6 py-3 bg-earth-sidebar text-white text-sm font-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-earth-sidebar/20">Upload New</button>
                <button className="px-6 py-3 bg-earth-card-sand text-earth-sidebar text-sm font-black rounded-2xl hover:bg-earth-card-sand/80 transition-all">Remove</button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">First Name</label>
              <input 
                className="w-full px-6 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all" 
                type="text" 
                defaultValue="Julian"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">Last Name</label>
              <input 
                className="w-full px-6 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all" 
                type="text" 
                defaultValue="Casablancas"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  className="w-full pl-16 pr-6 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all" 
                  type="email" 
                  defaultValue="julian@earthy.com"
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">Role</label>
              <div className="relative">
                <select className="w-full px-6 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all appearance-none cursor-pointer">
                  <option>Lead Designer</option>
                  <option>Project Manager</option>
                  <option>Administrator</option>
                  <option>Viewer</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">Biography</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all resize-none min-h-[160px]" 
                defaultValue="Digital craftsperson focused on sustainable design systems and earthy aesthetics."
              />
            </div>
          </section>

          <footer className="flex justify-end items-center gap-6 pt-12 border-t border-earth-border/30">
            <button className="px-8 py-3 text-sm font-black text-gray-400 hover:text-earth-sidebar transition-colors uppercase tracking-widest">Discard Changes</button>
            <button className="px-10 py-4 bg-earth-accent text-white text-sm font-black rounded-2xl shadow-xl shadow-earth-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">Save Changes</button>
          </footer>
        </div>
      </main>
    </div>
  );
};
