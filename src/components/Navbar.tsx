import React from 'react';
import { Settings, Trophy, PieChart, Search, Bell, User } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const { tenant } = useTenant();
  const tabs = [
    { id: 'dashboard', label: 'SCORES', icon: PieChart },
    { id: 'admin', label: 'ADMIN', icon: Settings },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      {/* StatArena Blue Top Bar */}
      <nav className="bg-sofa-blue px-4 md:px-6 h-12 md:h-14 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-6 h-full">
            <div 
              className="flex items-center gap-3 cursor-pointer h-full group" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                <img src="/favicon.png" alt="StatArena Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-black text-lg md:text-xl tracking-tighter uppercase">
                  STATARENA <span className="font-light opacity-50">PRO</span>
                </span>
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] hidden xs:block">
                  Tournament Intelligence
                </span>
              </div>
            </div>

            {/* Tenant Badge */}
            {tenant?.name && (
              <div className="hidden md:flex items-center h-full">
                <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-sm">
                  <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{tenant.name}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className="flex h-full items-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-full px-4 md:px-8 flex items-center gap-2 transition-all relative group ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-[10px] md:text-xs tracking-[0.2em]">
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
