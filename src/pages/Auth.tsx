/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: (userData: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          alert('Registration successful! Please check your email for verification (if enabled) or sign in.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-earth-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-earth-sidebar/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-earth-sidebar/10 overflow-hidden relative z-10"
      >
        <div className="p-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-earth-accent/10 rounded-2xl mb-6">
            <Leaf className="w-8 h-8 text-earth-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-earth-sidebar mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? 'Enter your credentials to access your dashboard' : 'Join our community of artisans and managers'}
          </p>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all placeholder:text-gray-300"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all placeholder:text-gray-300"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
              {isLogin && (
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-earth-accent hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-none bg-earth-card-sand/50 text-earth-sidebar font-bold focus:ring-4 focus:ring-earth-accent/10 transition-all placeholder:text-gray-300"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full bg-earth-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-earth-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="p-10 pt-0 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-gray-500 hover:text-earth-sidebar transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-earth-accent font-black uppercase tracking-widest ml-1">
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </button>
        </div>

        <div className="bg-earth-card-sand/30 p-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          Secure Enterprise Access
        </div>
      </motion.div>
    </div>
  );
};
