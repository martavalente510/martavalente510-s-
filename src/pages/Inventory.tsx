/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { InventoryItem } from '../types';
import { Plus, Search, Edit2, Trash2, X, Package, AlertTriangle, CheckCircle2, MinusCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    sku: '',
    category: 'Finished Goods',
    stock: 0,
    price: 0,
    status: 'In Stock',
  });

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: item.stock,
        price: item.price,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        category: 'Finished Goods',
        stock: 0,
        price: 0,
        status: 'In Stock',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Auto-update status based on stock
    let status: InventoryItem['status'] = 'In Stock';
    if (formData.stock === 0) status = 'Out of Stock';
    else if (formData.stock < 10) status = 'Low Stock';

    const updatedData = { ...formData, status };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (editingItem) {
        const { error } = await supabase
          .from('inventory')
          .update(updatedData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert([{ ...updatedData, user_id: user.id }]);
        if (error) throw error;
      }
      await fetchInventory();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving inventory item:', err);
      alert('Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const { error } = await supabase
          .from('inventory')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setItems(items.filter(i => i.id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item');
      }
    }
  };

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock': return <CheckCircle2 className="w-3 h-3" />;
      case 'Low Stock': return <AlertTriangle className="w-3 h-3" />;
      case 'Out of Stock': return <MinusCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Inventory Management" />

      <main className="p-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-earth-border rounded-2xl focus:ring-2 focus:ring-earth-accent/20 focus:border-earth-accent outline-none text-sm transition-all shadow-sm"
              placeholder="Search items by name or SKU..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-earth-accent text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-earth-accent/90 shadow-lg shadow-earth-accent/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        <div className="bg-white border border-earth-border/30 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-card-sand/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-earth-sidebar text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-earth-accent mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Inventory...</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredItems.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-earth-bg/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-earth-card-sand flex items-center justify-center text-earth-sidebar">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.category}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{item.stock} units</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-earth-accent">${item.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-gray-400 hover:text-earth-accent hover:bg-earth-card-sand rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-earth-bg rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Product Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Organic Clay Pot"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">SKU</label>
                    <input 
                      required
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. CP-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Category</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Finished Goods</option>
                      <option>Raw Materials</option>
                      <option>Tools</option>
                      <option>Terracotta</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Stock Quantity</label>
                    <input 
                      required
                      min="0"
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Price ($)</label>
                    <input 
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
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
                    {editingItem ? 'Save Changes' : 'Create Item'}
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
