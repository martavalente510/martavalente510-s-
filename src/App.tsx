/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';
import { Customers } from './pages/Customers';
import { Inventory } from './pages/Inventory';
import { Auth } from './pages/Auth';
import { Screen, User as AppUser } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: 'User'
        });
        setIsAuthenticated(true);
      }
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: 'User'
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser({
      id: userData.id,
      email: userData.email || '',
      name: userData.user_metadata?.name || 'User',
      role: 'User'
    });
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-earth-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-earth-accent/30 border-t-earth-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'overview':
        return <Dashboard />;
      case 'reports':
        return <Reports />;
      case 'transactions':
        return <Transactions />;
      case 'customers':
        return <Customers />;
      case 'inventory':
        return <Inventory />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-400">Coming Soon</h2>
              <p className="text-gray-500">This feature is currently under development.</p>
              <button 
                onClick={() => setCurrentScreen('overview')}
                className="mt-4 text-earth-accent font-bold hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentScreen={currentScreen} 
        onScreenChange={setCurrentScreen} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
