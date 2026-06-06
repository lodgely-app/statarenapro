import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Admin } from '@/components/Admin';
import { Login } from '@/components/Login';
import { useTournament } from '@/hooks/useTournament';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('admin');
  
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const { 
    tournaments,
    activeTournament, 
    setActiveId,
    createTournament, 
    endTournament,
    deleteTournament,
    loading: tournamentsLoading
  } = useTournament();

  if (activeTab === 'dashboard') {
    window.location.href = '/';
    return null;
  }

  if (authLoading || tournamentsLoading) {
    return (
      <div className="min-h-screen bg-sofa-bg flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-sofa-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-14 md:pt-16 bg-sofa-bg">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-2 md:space-y-4 relative z-10 pt-4">
        {!isAdmin ? (
          <Login onSuccess={() => {}} />
        ) : (
          <Admin 
            onStartTournament={createTournament} 
            onEndTournament={endTournament}
            onDeleteTournament={deleteTournament}
            onSelectTournament={(id) => {
              setActiveId(id);
            }}
            tournaments={tournaments}
            activeTournament={activeTournament}
            onLogout={logout}
          />
        )}
      </div>
    </div>
  );
}
