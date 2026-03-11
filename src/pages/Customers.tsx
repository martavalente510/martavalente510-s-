/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Customer } from '../types';
import { Plus, Search, Edit2, Trash2, X, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    role: 'Standard Member',
    status: 'Active',
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        role: customer.role,
        status: customer.status,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        role: 'Standard Member',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(formData)
          .eq('id', editingCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{ ...formData, user_id: user.id }]);
        if (error) throw error;
      }
      await fetchCustomers();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete customer');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Customer Management" />

      <main className="p-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-earth-border rounded-2xl focus:ring-2 focus:ring-earth-accent/20 focus:border-earth-accent outline-none text-sm transition-all shadow-sm"
              placeholder="Search customers by name or email..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-earth-accent text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-earth-accent/90 shadow-lg shadow-earth-accent/20 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add Customer
          </button>
        </div>

        <div className="bg-white border border-earth-border/30 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-card-sand/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-earth-accent mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Customers...</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredCustomers.map((customer) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-earth-bg/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-earth-card-sand flex items-center justify-center text-earth-sidebar font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{customer.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                        customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(customer)}
                          className="p-2 text-gray-400 hover:text-earth-accent hover:bg-earth-card-sand rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              )}
              {filteredCustomers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-earth-sidebar/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-earth-border/20 flex justify-between items-center">
                <h3 className="text-2xl font-black tracking-tight">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-earth-bg rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sophia Bennett"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                  <input 
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sophia@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Role</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all appearance-none cursor-pointer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option>Standard Member</option>
                      <option>Premium Member</option>
                      <option>VIP Member</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Status</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-4 text-sm font-black text-gray-400 hover:text-earth-sidebar transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-earth-accent text-white text-sm font-black rounded-2xl shadow-xl shadow-earth-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                  >
                    {editingCustomer ? 'Save Changes' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
