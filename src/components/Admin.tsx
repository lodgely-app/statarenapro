import React, { useState } from 'react';
import { Plus, Trash2, Shield, Settings2, Play, Shuffle, CalendarPlus, Search, Globe, ChevronDown, CheckCircle2, History, User, Trophy, Layout, Trash, FilePlus, ChevronRight } from 'lucide-react';
import type { Team, Match, Tournament } from '@/types/tournament';
import { generateLeagueFixtures, generateCupBracket } from '@/lib/tournament-logic';
import { PRESET_TEAMS } from '@/lib/teams-data';

interface AdminProps {
  onStartTournament: (name: string, type: 'league' | 'cup', teams: Team[], fixtures: Match[]) => void;
  onEndTournament: (id: string) => void;
  onDeleteTournament: (id: string) => void;
  onSelectTournament: (id: string) => void;
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  onLogout?: () => void;
}

export const Admin = ({ 
  onStartTournament, 
  onEndTournament, 
  onDeleteTournament,
  onSelectTournament,
  tournaments,
  activeTournament,
  onLogout
}: AdminProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [type, setType] = useState<'league' | 'cup'>('league');
  const [showCreateForm, setShowCreateForm] = useState(tournaments.length === 0);
  
  const [selectedLeague, setSelectedLeague] = useState<string>('Premier League');
  const [teamSearch, setTeamSearch] = useState('');

  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  const addTeam = (name: string, pName: string = '') => {
    if (!name.trim()) return;
    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: name,
      playerName: pName,
      tenantId: '',
      tournamentId: '',
      stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }
    };
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setNewPlayerName('');
  };

  const addDraftFixture = () => {
    if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) return;
    const newMatch: Match = {
      id: `match-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      homeTeamId,
      awayTeamId,
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      round: 1,
      tournamentId: 'draft',
      tenantId: '',
      date: Date.now()
    };
    setFixtures([...fixtures, newMatch]);
    setHomeTeamId('');
    setAwayTeamId('');
  };

  const autoGenerate = () => {
    if (teams.length < 2) return;
    const generated = type === 'league' 
      ? generateLeagueFixtures(teams, 'temp-id') 
      : generateCupBracket(teams, 'temp-id');
    
    // Filter out duplicates (matches already in the queue)
    const newFixtures = generated.filter(genMatch => 
      !fixtures.some(existing => 
        existing.homeTeamId === genMatch.homeTeamId && 
        existing.awayTeamId === genMatch.awayTeamId
      )
    );
    
    setFixtures([...fixtures, ...newFixtures]);
  };

  const handleCreate = () => {
    if (!tournamentName || teams.length < 2) return;
    const finalFixtures = fixtures.length > 0 ? fixtures : (
      type === 'league' ? generateLeagueFixtures(teams, 'temp-id') : generateCupBracket(teams, 'temp-id')
    );
    onStartTournament(tournamentName, type, teams, finalFixtures);
    setTeams([]);
    setFixtures([]);
    setTournamentName('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-4 pb-10 w-full animate-in fade-in duration-500">
      {/* DASHBOARD HEADER */}
      <div className="sofa-card overflow-hidden">
        <div className="bg-white border-b border-sofa-border px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sofa-blue/5 rounded-lg flex items-center justify-center text-sofa-blue border border-sofa-blue/10">
                <Layout className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-sofa-text">Tournament Administration</h2>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={onLogout}
                className="px-3 py-1.5 text-[10px] font-bold text-sofa-muted hover:text-sofa-live transition-colors"
              >
                SIGN OUT
              </button>
           </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            onClick={() => setShowCreateForm(true)}
            className="col-span-1 border-2 border-dashed border-sofa-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-sofa-blue hover:bg-sofa-blue/5 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-sofa-blue group-hover:text-white transition-colors">
              <FilePlus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-sofa-muted group-hover:text-sofa-blue uppercase tracking-widest">New Competition</span>
          </div>

          {tournaments.map((t) => (
            <div 
              key={t.id} 
              onClick={() => onSelectTournament(t.id)}
              className={`col-span-1 border rounded-xl p-4 transition-all cursor-pointer group relative ${activeTournament?.id === t.id ? 'border-sofa-blue bg-sofa-blue/5' : 'border-sofa-border hover:border-sofa-blue/30'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${t.status === 'active' ? 'bg-sofa-live text-white' : 'bg-sofa-border text-sofa-muted'}`}>{t.status}</span>
                <button onClick={(e) => { e.stopPropagation(); onDeleteTournament(t.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-sofa-muted hover:text-sofa-live"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <h3 className="font-bold text-sm text-sofa-text uppercase truncate mb-1">{t.name}</h3>
              <p className="text-[9px] font-bold text-sofa-muted uppercase tracking-wider">{t.type} • {t.teams.length} CLUBS</p>
              {activeTournament?.id === t.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-sofa-blue rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE FORM */}
      {showCreateForm && (
        <div className="sofa-card overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-sofa-blue px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <FilePlus className="w-4 h-4" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Create New Competition</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-sofa-muted uppercase tracking-widest ml-1">Competition Title</label>
                <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="e.g. Champions League" className="w-full bg-slate-50 border border-sofa-border rounded-lg px-4 py-3 text-xs font-bold text-sofa-text focus:border-sofa-blue outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-sofa-muted uppercase tracking-widest ml-1">Format Type</label>
                <div className="flex bg-slate-50 p-1 rounded-lg border border-sofa-border">
                   <button onClick={() => setType('league')} className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${type === 'league' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>LEAGUE</button>
                   <button onClick={() => setType('cup')} className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${type === 'cup' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>CUP BRACKET</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-sofa-border pb-2">
                     <h3 className="text-[10px] font-black text-sofa-text uppercase">Available Clubs</h3>
                     <div className="flex gap-2">
                        <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="bg-slate-50 border border-sofa-border rounded px-2 py-1 text-[9px] font-bold text-sofa-muted">
                          {Object.keys(PRESET_TEAMS).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <div className="relative">
                          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-sofa-muted opacity-40" />
                          <input type="text" placeholder="Search..." value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} className="bg-slate-50 border border-sofa-border rounded pl-6 pr-2 py-1 text-[9px] font-bold text-sofa-muted" />
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(PRESET_TEAMS).filter(([league]) => !selectedLeague || league === selectedLeague).flatMap(([_, teams]) => teams).filter(name => name.toLowerCase().includes(teamSearch.toLowerCase())).map(name => {
                      const isAdded = teams.some(t => t.name === name);
                      return <button key={name} onClick={() => isAdded ? null : addTeam(name)} disabled={isAdded} className={`text-[9px] font-bold p-2.5 rounded border transition-all ${isAdded ? 'bg-slate-50 text-slate-300 border-transparent' : 'bg-white text-sofa-text border-sofa-border hover:border-sofa-blue hover:text-sofa-blue'}`}>{name}</button>;
                    })}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-sofa-border pb-2">
                     <h3 className="text-[10px] font-black text-sofa-text uppercase">Active Roster ({teams.length})</h3>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Club Name" className="flex-1 bg-slate-50 border border-sofa-border rounded-lg px-3 py-2 text-[10px] font-bold" />
                    <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Manager" className="flex-1 bg-slate-50 border border-sofa-border rounded-lg px-3 py-2 text-[10px] font-bold" />
                    <button onClick={() => addTeam(newTeamName, newPlayerName)} className="bg-sofa-blue text-white p-2 rounded-lg"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {teams.map((team) => (
                      <div key={team.id} className="flex flex-col p-3 bg-white rounded-lg border border-sofa-border group gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-5 h-5 bg-slate-50 rounded border border-sofa-border flex items-center justify-center text-[9px] font-bold text-sofa-muted">{team.name[0]}</div>
                             <span className="text-[10px] font-black text-sofa-text uppercase">{team.name}</span>
                          </div>
                          <button onClick={() => setTeams(teams.filter(t => t.id !== team.id))} className="text-sofa-border hover:text-sofa-live transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Assign Manager..." 
                          value={team.playerName || ''} 
                          onChange={(e) => {
                            const newTeams = teams.map(t => t.id === team.id ? { ...t, playerName: e.target.value } : t);
                            setTeams(newTeams);
                          }}
                          className="bg-slate-50 border border-sofa-border/50 rounded px-2 py-1.5 text-[9px] font-bold text-sofa-text focus:border-sofa-blue outline-none"
                        />
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {teams.length >= 2 && (
              <div className="bg-slate-50 rounded-xl border border-sofa-border p-5 space-y-4">
                <div className="flex items-center gap-2 text-sofa-text mb-2">
                  <CalendarPlus className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Schedule Setup</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} className="w-full bg-white border border-sofa-border rounded px-2 py-2 text-[9px] font-bold">
                        <option value="">HOME</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} className="w-full bg-white border border-sofa-border rounded px-2 py-2 text-[9px] font-bold">
                        <option value="">AWAY</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <button onClick={addDraftFixture} className="w-full py-2.5 bg-white border border-sofa-border rounded-lg text-[9px] font-black uppercase hover:border-sofa-blue hover:text-sofa-blue transition-all">Add Manual</button>
                    <button onClick={autoGenerate} className="w-full py-2.5 bg-sofa-navy text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-2"><Shuffle className="w-3.5 h-3.5" /> Auto-Generate</button>
                  </div>
                  <div className="md:col-span-2 bg-white rounded-lg border border-sofa-border p-4 min-h-[120px]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[8px] font-black text-sofa-muted uppercase tracking-widest block">Fixture Queue ({fixtures.length})</span>
                      {fixtures.length > 0 && (
                        <button 
                          onClick={() => setFixtures([])}
                          className="text-[8px] font-black text-sofa-live hover:underline uppercase tracking-widest"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                      {fixtures.map((f, i) => (
                        <div key={f.id} className="text-[9px] p-2 bg-slate-50 rounded-md flex justify-between items-center group">
                          <span className="font-bold text-sofa-text uppercase">{teams.find(t => t.id === f.homeTeamId)?.name} v {teams.find(t => t.id === f.awayTeamId)?.name}</span>
                          <button onClick={() => setFixtures(fixtures.filter((_, idx) => idx !== i))} className="text-sofa-border hover:text-sofa-live"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-sofa-border">
              <button onClick={handleCreate} disabled={!tournamentName || teams.length < 2} className="px-10 py-3 bg-sofa-success text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg disabled:opacity-30">
                <Play className="w-4 h-4 fill-current" />
                Launch Tournament
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
