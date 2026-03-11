/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-20 flex items-center justify-between px-10 border-b border-earth-border/30 bg-white/50 backdrop-blur-md sticky top-0 z-40">
      <h2 className="text-xl font-bold text-earth-sidebar tracking-tight">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 text-earth-sidebar hover:bg-earth-card-sand rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-earth-sidebar hover:bg-earth-card-sand rounded-full transition-colors relative">
          <span className="absolute top-2 right-2 w-2 h-2 bg-earth-accent rounded-full border-2 border-white"></span>
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
