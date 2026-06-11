import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Standings } from '@/components/Standings';
import { Fixtures } from '@/components/Fixtures';
import { useTournament } from '@/hooks/useTournament';
import { Trophy, LayoutDashboard, Target, Users, ChevronDown } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/hooks/useAuth';
import { Fixtures as FixturesPreview } from '@/components/Fixtures';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { tenant } = useTenant();
  const { isAdmin } = useAuth();

  const { 
    tournaments,
    activeTournament, 
    setActiveId,
    updateMatchScore, 
    updateMatchDate,
    loading: tournamentsLoading
  } = useTournament();

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'admin') {
      navigate('/admin');
    }
  }, [activeTab, navigate]);

  if (tournamentsLoading) {
    return (
      <div className="fixed inset-0 bg-[#F2F4F7] z-[100] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl animate-pulse">
            <img src="/favicon.png" alt="StatArena Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -inset-4 border-2 border-sofa-blue/20 rounded-[2rem] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-sm font-black text-sofa-navy uppercase tracking-[0.3em] animate-pulse">
            StatArena Pro
          </span>
          <span className="text-[10px] font-bold text-sofa-muted uppercase tracking-[0.2em] opacity-40">
            Tournament Intelligence
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-14 md:pt-16 bg-sofa-bg selection:bg-sofa-blue selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-2 md:space-y-4 relative z-10 pt-4">
        {activeTournament ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className="flex items-center gap-4 px-6 py-3 bg-white border border-sofa-border rounded-full hover:bg-sofa-border transition-all group shadow-sm"
                  >
                    <Trophy className="w-5 h-5 text-sofa-muted group-hover:text-sofa-blue transition-colors" />
                    <span className="text-base font-black text-sofa-text uppercase tracking-tight">
                      {activeTournament.name}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-sofa-muted transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSelectorOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSelectorOpen(false)} />
                      <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border border-sofa-border z-50 overflow-hidden">
                        <div className="py-2">
                          <div className="px-4 py-1.5 text-[11px] font-medium text-sofa-muted">
                            Your competitions
                          </div>
                          {tournaments.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setActiveId(t.id);
                                setIsSelectorOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeTournament?.id === t.id ? 'text-sofa-blue bg-sofa-blue/10' : 'text-sofa-text hover:bg-sofa-border'}`}
                            >
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sofa-border rounded-lg">
                   <Users className="w-3.5 h-3.5 text-sofa-muted" />
                   <span className="text-[10px] font-black text-sofa-text uppercase italic">{activeTournament.teams.length} Clubs</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sofa-border rounded-lg">
                   <Target className="w-3.5 h-3.5 text-sofa-muted" />
                   <span className="text-[10px] font-black text-sofa-text uppercase italic">{activeTournament.type}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Trophy className="w-3.5 h-3.5 text-sofa-muted" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sofa-muted italic">Standings</h3>
                </div>
                {activeTournament.type === 'group+knockout' ? (
                  <div className="space-y-6">
                    {Array.from(new Set(activeTournament.teams.map(t => t.groupId).filter(Boolean))).sort().map(gId => (
                      <div key={gId as string} className="space-y-2">
                        <h4 className="text-xs font-black text-sofa-text uppercase px-2">Group {gId as string}</h4>
                        <Standings teams={activeTournament.teams.filter(t => t.groupId === gId)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Standings teams={activeTournament.teams} />
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-sofa-muted" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sofa-muted italic">Fixtures</h3>
                </div>
                <Fixtures 
                  matches={activeTournament.matches} 
                  teams={activeTournament.teams} 
                  onUpdateScore={updateMatchScore}
                  tournamentType={activeTournament.type}
                  isAdmin={isAdmin}
                  isDashboard={true}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center sm:items-start justify-center py-10 md:py-20 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-primary/10 shadow-sm">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-primary uppercase italic leading-tight">No Active Tournament</h2>
              <p className="text-sm md:text-base text-slate-500 max-w-xl font-medium">
                Check back later for updates from {tenant?.name || 'this community'} or start your first league from the admin panel.
              </p>
            </div>
            <button 
              onClick={() => { window.location.href = '/admin'; }}
              className="group flex items-center gap-3 bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-2xl shadow-xl hover:bg-accent transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Trophy className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-sm md:text-base font-black uppercase tracking-tight">
                Open Control Panel
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
