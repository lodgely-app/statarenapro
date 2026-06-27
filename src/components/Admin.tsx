import React, { useState } from 'react';
import { Plus, Trash2, Shield, Settings2, Play, Shuffle, CalendarPlus, Search, Globe, ChevronDown, CheckCircle2, History, User, Trophy, Layout, Trash, FilePlus, ChevronRight, X, Users, Target } from 'lucide-react';
import type { Team, Match, Tournament, MatchEvent } from '@/types/tournament';
import { generateLeagueFixtures, generateCupBracket, generateGroupKnockout } from '@/lib/tournament-logic';
import { PRESET_TEAMS } from '@/lib/teams-data';
import { ScheduleManager } from './ScheduleManager';
import { Fixtures as FixturesPreview } from '@/components/Fixtures';
import { useTournament } from '@/hooks/useTournament';

interface AdminProps {
  onStartTournament: (name: string, type: 'league' | 'knockout' | 'group+knockout' | 'infinite_league', teams: Team[], fixtures: Match[], settings?: any) => void;
  onEndTournament: (id: string) => void;
  onDeleteTournament: (id: string) => void;
  onSelectTournament: (id: string) => void;
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  onLogout: () => void;
  onUpdateMatchScore?: (matchId: string, homeScore: number | null, awayScore: number | null, events?: MatchEvent[], timestamp?: number | null) => void;
  onUpdateMatchDate?: (matchId: string, timestamp: number) => void;
  onUpdateTournamentMatches?: (matches: Match[]) => void;
  onUpdateTournamentSettings?: (id: string, settings: any) => void;
}

export const Admin = ({ 
  onStartTournament, 
  onEndTournament, 
  onDeleteTournament, 
  onSelectTournament, 
  tournaments,
  activeTournament,
  onLogout,
  onUpdateMatchScore,
  onUpdateMatchDate,
  onUpdateTournamentMatches,
  onUpdateTournamentSettings
}: AdminProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [type, setType] = useState<'league' | 'knockout' | 'group+knockout' | 'infinite_league'>('league');
  const [expectedTeamCount, setExpectedTeamCount] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(tournaments.length === 0);
  const [createStep, setCreateStep] = useState<'teams' | 'fixtures' | 'schedule'>('teams');
  const [adminActiveTab, setAdminActiveTab] = useState<'scheduled' | 'unscheduled'>('unscheduled');
  
  const [selectedLeague, setSelectedLeague] = useState<string>('Premier League');
  const [teamSearch, setTeamSearch] = useState('');
  
  const [statsSettings, setStatsSettings] = useState({
    trackGoals: true,
    trackYellowCards: true,
    trackRedCards: true
  });

  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  const [editingMatchDate, setEditingMatchDate] = useState<Match | null>(null);
  const [addingMatchToDate, setAddingMatchToDate] = useState<number | null>(null);
  const [tempEditDate, setTempEditDate] = useState('');
  const [tempEditTime, setTempEditTime] = useState('');
  const [selectedMatchesToAdd, setSelectedMatchesToAdd] = useState<{matchId: string, time: string}[]>([]);

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
    const expected = parseInt(expectedTeamCount) || 0;
    if (teams.length !== expected || teams.length < 2) return;
    
    let generatedMatches: Match[] = [];
    if (type === 'league' || type === 'infinite_league') {
      generatedMatches = generateLeagueFixtures(teams, 'temp-id');
    } else if (type === 'group+knockout') {
      const { matches, teams: updatedTeams } = generateGroupKnockout(teams, 'temp-id');
      generatedMatches = matches;
      setTeams(updatedTeams);
    } else {
      generatedMatches = generateCupBracket(teams, 'temp-id');
    }
    
    setFixtures(generatedMatches);
    setCreateStep('fixtures');
  };

  const handleCreate = (finalFixtures: Match[]) => {
    const expected = parseInt(expectedTeamCount) || 0;
    const isValidKnockout = (type === 'knockout' || type === 'group+knockout') ? [2, 4, 8, 16, 32, 64].includes(expected) : true;
    if (!tournamentName || teams.length !== expected || teams.length < 2 || !isValidKnockout) return;
    
    onStartTournament(tournamentName, type, teams, finalFixtures, statsSettings);
    setTeams([]);
    setFixtures([]);
    setTournamentName('');
    setShowCreateForm(false);
    setCreateStep('teams');
  };

    const { 
      setActiveId,
      updateMatchScore, 
      updateMatchDate,
      loading: tournamentsLoading
    } = useTournament();

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
            <button onClick={() => {
              setShowCreateForm(false);
              setTeams([]);
              setFixtures([]);
              setTournamentName('');
              setCreateStep('teams');
            }} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="flex gap-6 border-b border-sofa-border pb-4">
              <button 
                onClick={() => setCreateStep('teams')}
                className={`text-[10px] font-black uppercase tracking-widest pb-4 -mb-4 border-b-2 transition-all ${createStep === 'teams' ? 'border-sofa-blue text-sofa-blue' : 'border-transparent text-sofa-muted hover:text-sofa-text'}`}
              >
                1. Teams & Format
              </button>
              <button 
                onClick={() => {
                   const expected = parseInt(expectedTeamCount) || 0;
                   const isValidKnockout = type === 'knockout' ? [2, 4, 8, 16, 32, 64].includes(expected) : true;
                   const isValidGroup = type === 'group+knockout' ? [8, 16, 32, 64].includes(expected) : true;
                   if (tournamentName && teams.length === expected && teams.length >= 2 && isValidKnockout && isValidGroup && fixtures.length > 0) {
                     setCreateStep('fixtures');
                   }
                }}
                className={`text-[10px] font-black uppercase tracking-widest pb-4 -mb-4 border-b-2 transition-all ${createStep === 'fixtures' ? 'border-sofa-blue text-sofa-blue' : 'border-transparent text-sofa-muted hover:text-sofa-text'} ${(!tournamentName || teams.length !== (parseInt(expectedTeamCount)||0) || teams.length < 2 || fixtures.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                2. Fixtures Preview
              </button>
              <button 
                onClick={() => {
                   if (fixtures.length > 0) {
                     setCreateStep('schedule');
                   }
                }}
                className={`text-[10px] font-black uppercase tracking-widest pb-4 -mb-4 border-b-2 transition-all ${createStep === 'schedule' ? 'border-sofa-blue text-sofa-blue' : 'border-transparent text-sofa-muted hover:text-sofa-text'} ${fixtures.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                3. Schedule
              </button>
            </div>

            {createStep === 'teams' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-sofa-muted uppercase tracking-widest ml-1">Competition Title</label>
                  <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="e.g. Champions League" className="w-full bg-slate-50 border border-sofa-border rounded-lg px-4 py-3 text-xs font-bold text-sofa-text focus:border-sofa-blue outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-sofa-muted uppercase tracking-widest ml-1">Number of Teams</label>
                  <input type="number" min="2" max="64" value={expectedTeamCount} onChange={(e) => setExpectedTeamCount(e.target.value)} placeholder="e.g. 8" className="w-full bg-slate-50 border border-sofa-border rounded-lg px-4 py-3 text-xs font-bold text-sofa-text focus:border-sofa-blue outline-none transition-all" />
                  {expectedTeamCount && (
                    (type === 'knockout' && ![2, 4, 8, 16, 32, 64].includes(parseInt(expectedTeamCount))) ||
                    (type === 'group+knockout' && ![8, 16, 32, 64].includes(parseInt(expectedTeamCount))) ||
                    ((type === 'league' || type === 'infinite_league') && parseInt(expectedTeamCount) < 2)
                  ) && (
                    <p className="text-[8px] text-sofa-live ml-1 mt-1">
                      {type === 'knockout' && "Must be 2, 4, 8, 16, 32, or 64"}
                      {type === 'group+knockout' && "Must be 8, 16, 32, or 64"}
                      {(type === 'league' || type === 'infinite_league') && "Must be at least 2 teams"}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-sofa-muted uppercase tracking-widest ml-1">Format Type</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-50 p-1 rounded-lg border border-sofa-border">
                   <button onClick={() => setType('league')} className={`py-2 rounded-md text-[10px] font-bold uppercase transition-all ${type === 'league' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>LEAGUE</button>
                   <button onClick={() => setType('infinite_league')} className={`py-2 rounded-md text-[10px] font-bold uppercase transition-all ${type === 'infinite_league' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>INFINITE LEAGUE</button>
                   <button onClick={() => setType('knockout')} className={`py-2 rounded-md text-[10px] font-bold uppercase transition-all ${type === 'knockout' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>KNOCKOUT</button>
                   <button onClick={() => setType('group+knockout')} className={`py-2 rounded-md text-[9px] font-bold uppercase transition-all ${type === 'group+knockout' ? 'bg-white shadow-sm text-sofa-blue' : 'text-sofa-muted'}`}>GROUP+KNOCKOUT</button>
                </div>
                <p className="text-[8px] text-sofa-muted ml-1 mt-2">
                  {type === 'league' && "Minimum 2 teams required to generate a round-robin schedule."}
                  {type === 'infinite_league' && "Play infinite seasons. New matchweeks generated on demand."}
                  {type === 'knockout' && "Minimum 2 teams. Byes will be generated for uneven brackets."}
                  {type === 'group+knockout' && "Minimum 2 teams required for group stages followed by a bracket."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-sofa-text uppercase tracking-widest border-b border-sofa-border pb-2">Player Stats Tracking</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'trackGoals', label: 'Goals' },
                  { id: 'trackYellowCards', label: 'Yellow Cards' },
                  { id: 'trackRedCards', label: 'Red Cards' }
                ].map(stat => (
                  <label key={stat.id} className="flex items-center gap-3 p-3 border border-sofa-border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={(statsSettings as any)[stat.id]}
                      onChange={(e) => setStatsSettings({ ...statsSettings, [stat.id]: e.target.checked })}
                      className="w-4 h-4 text-sofa-blue rounded border-sofa-border focus:ring-sofa-blue"
                    />
                    <span className="text-[10px] font-bold text-sofa-text uppercase">{stat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="border-b border-sofa-border pb-2">
                     <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black text-sofa-text uppercase">Create Teams ({teams.length} / {expectedTeamCount || '?'})</h3>
                     </div>
                     <p className="text-[9px] text-sofa-muted mt-1">Create a custom team below, or choose from Europe's top 5 leagues on the right.</p>
                  </div>
                  <div className="flex md:flex-row flex-col gap-2">
                    <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Club Name" className="flex-1 bg-slate-50 border border-sofa-border rounded-lg px-3 py-2 text-[10px] font-bold" />
                    <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Manager" className="flex-1 bg-slate-50 border border-sofa-border rounded-lg px-3 py-2 text-[10px] font-bold" />
                    <button onClick={() => addTeam(newTeamName, newPlayerName)} className="px-10 py-3 bg-sofa-blue text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg disabled:opacity-30 transition-all"><Plus className="w-4 h-4" /></button>
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
            </div>

              <div className="flex justify-end pt-4 border-t border-sofa-border">
                <button 
                  onClick={autoGenerate} 
                  disabled={!tournamentName || teams.length !== (parseInt(expectedTeamCount) || 0) || teams.length < 2 || (type === 'knockout' && ![2, 4, 8, 16, 32, 64].includes(teams.length)) || (type === 'group+knockout' && ![8, 16, 32, 64].includes(teams.length))} 
                  className="px-10 py-3 bg-sofa-blue text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg disabled:opacity-30 transition-all"
                >
                  Next: Generate Fixtures
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            )}
            {createStep === 'fixtures' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sofa-text">
                    <Settings2 className="w-5 h-5 text-sofa-blue" />
                    <span className="text-xs font-black uppercase tracking-widest">Fixtures Preview</span>
                  </div>
                  <button onClick={autoGenerate} className="px-4 py-2 bg-slate-100 text-sofa-text rounded text-[9px] font-black uppercase hover:bg-slate-200 transition-colors flex items-center gap-2"><Shuffle className="w-3 h-3"/> Regenerate</button>
                </div>
                <div className="bg-slate-50 border border-sofa-border rounded-xl p-4">
                  <FixturesPreview matches={fixtures} teams={teams} onUpdateScore={() => {}} tournamentType={type} isAdmin={false} />
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-sofa-border mt-6">
                  <button onClick={() => setCreateStep('teams')} className="px-6 py-3 text-sofa-muted hover:text-sofa-text font-black text-[10px] uppercase tracking-widest transition-colors">
                    Back to Teams
                  </button>
                  <button onClick={() => setCreateStep('schedule')} className="px-12 py-3.5 bg-sofa-blue text-white rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition-all">
                    Next: Schedule
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {createStep === 'schedule' && (
              <ScheduleManager 
                matches={fixtures} 
                teams={teams} 
                onSave={handleCreate} 
                onBack={() => setCreateStep('fixtures')} 
                isWizard 
              />
            )}
          </div>
        </div>
      )}

      {!showCreateForm && activeTournament && (
        <div className="sofa-card overflow-hidden mt-6 animate-in fade-in duration-300">
           <div className="bg-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sofa-border pb-6 mb-6">
                 <div>
                    <h2 className="text-xl font-black text-sofa-text uppercase">{activeTournament.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-sofa-muted uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {activeTournament.teams.length} Teams</div>
                      <span className="w-1 h-1 bg-sofa-border rounded-full" />
                      <div className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {activeTournament.type}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-sofa-border">
                      <span className="block text-xl font-black text-sofa-blue">{activeTournament.matches.filter(m => m.status === 'completed').length}</span>
                      <span className="text-[8px] font-black uppercase text-sofa-muted tracking-widest">Completed</span>
                    </div>
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-sofa-border">
                      <span className="block text-xl font-black text-sofa-success">{activeTournament.matches.filter(m => m.date !== null && m.status !== 'completed').length}</span>
                      <span className="text-[8px] font-black uppercase text-sofa-muted tracking-widest">Scheduled</span>
                    </div>
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-sofa-border">
                      <span className="block text-xl font-black text-amber-500">{activeTournament.matches.filter(m => m.date === null).length}</span>
                      <span className="text-[8px] font-black uppercase text-sofa-muted tracking-widest">Unscheduled</span>
                    </div>
                 </div>
              </div>

              {onUpdateTournamentSettings && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-sofa-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[10px] font-black text-sofa-text uppercase tracking-widest flex items-center gap-2"><Settings2 className="w-4 h-4 text-sofa-blue" /> Tracking Settings</h3>
                    <p className="text-[9px] text-sofa-muted mt-1">Enable or disable player stats tracking for this competition.</p>
                  </div>
                  <div className="flex gap-4">
                    {[
                      { id: 'trackGoals', label: 'Goals & Assists' },
                      { id: 'trackYellowCards', label: 'Yellow' },
                      { id: 'trackRedCards', label: 'Red' }
                    ].map(stat => {
                      const isEnabled = (activeTournament.settings as any)?.[stat.id] ?? false;
                      return (
                        <label key={stat.id} className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isEnabled}
                            onChange={(e) => {
                              const newSettings = { ...activeTournament.settings, [stat.id]: e.target.checked };
                              onUpdateTournamentSettings(activeTournament.id, newSettings);
                            }}
                            className="w-3.5 h-3.5 text-sofa-blue rounded border-sofa-border focus:ring-sofa-blue"
                          />
                          <span className="text-[9px] font-bold text-sofa-text uppercase">{stat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <ScheduleManager 
                  matches={activeTournament.matches} 
                  teams={activeTournament.teams} 
                  onSave={(matches) => {
                    if (onUpdateTournamentMatches) {
                      onUpdateTournamentMatches(matches);
                    }
                  }}
                />
              </div>

              <div className="bg-slate-50 border border-sofa-border rounded-xl overflow-hidden mt-6">
                <div className="flex border-b border-sofa-border bg-white">
                  <button 
                    onClick={() => setAdminActiveTab('scheduled')} 
                    className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${adminActiveTab === 'scheduled' ? 'border-sofa-blue text-sofa-blue bg-blue-50/30' : 'border-transparent text-sofa-muted hover:text-sofa-text hover:bg-slate-50'}`}
                  >
                    Scheduled Matches
                  </button>
                  <button 
                    onClick={() => setAdminActiveTab('unscheduled')} 
                    className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${adminActiveTab === 'unscheduled' ? 'border-sofa-blue text-sofa-blue bg-blue-50/30' : 'border-transparent text-sofa-muted hover:text-sofa-text hover:bg-slate-50'}`}
                  >
                    Unscheduled Matches
                  </button>
                </div>

                <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {adminActiveTab === 'scheduled' ? (
                    <FixturesPreview 
                      matches={activeTournament.matches.filter(m => m.date !== null)} 
                      teams={activeTournament.teams} 
                      onUpdateScore={onUpdateMatchScore || (() => {})} 
                      tournamentType={activeTournament.type} 
                      isAdmin={true} 
                      isPreview={false} 
                      isDashboard={true}
                      hideTabs={true}
                      onEditMatchDate={setEditingMatchDate}
                      onAddMatchToDate={setAddingMatchToDate}
                      onUpdateDate={updateMatchDate}
                    />             
                  ) : (
                    <FixturesPreview 
                      matches={activeTournament.matches.filter(m => m.date === null)} 
                      teams={activeTournament.teams} 
                      onUpdateScore={onUpdateMatchScore || (() => {})} 
                      tournamentType={activeTournament.type} 
                      isAdmin={false} 
                      isPreview={true} 
                      isDashboard={true}
                      hideTabs={true}
                    />
                  )}
                  {adminActiveTab === 'scheduled' && activeTournament.matches.filter(m => m.date !== null).length === 0 && (
                    <div className="py-10 text-center text-sofa-muted text-[10px] font-black uppercase tracking-widest">
                      No matches scheduled yet.
                    </div>
                  )}
                  {adminActiveTab === 'unscheduled' && activeTournament.matches.filter(m => m.date === null).length === 0 && (
                    <div className="py-10 text-center text-sofa-muted text-[10px] font-black uppercase tracking-widest">
                      No unscheduled matches.
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Modals for Edit and Add Matches */}
      {editingMatchDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative">
            <button onClick={() => setEditingMatchDate(null)} className="absolute top-4 right-4 text-sofa-muted hover:text-sofa-text"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-black text-sofa-text uppercase tracking-tight mb-6">Edit Match Date</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-sofa-muted uppercase tracking-widest block mb-2">New Date</label>
                <input 
                  type="date" 
                  value={tempEditDate} 
                  onChange={e => setTempEditDate(e.target.value)} 
                  className="w-full bg-slate-50 border border-sofa-border rounded-xl px-4 py-3 text-sm font-bold focus:border-sofa-blue outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-sofa-muted uppercase tracking-widest block mb-2">New Time</label>
                <input 
                  type="time" 
                  value={tempEditTime} 
                  onChange={e => setTempEditTime(e.target.value)} 
                  className="w-full bg-slate-50 border border-sofa-border rounded-xl px-4 py-3 text-sm font-bold focus:border-sofa-blue outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  if (onUpdateTournamentMatches && activeTournament) {
                    const ts = new Date(`${tempEditDate}T${tempEditTime || '12:00'}:00`).getTime();
                    if (!isNaN(ts)) {
                      const newMatches = activeTournament.matches.map(m => m.id === editingMatchDate.id ? { ...m, date: ts, status: 'scheduled' as const } : m);
                      onUpdateTournamentMatches(newMatches);
                    }
                  }
                  setEditingMatchDate(null);
                  setTempEditDate('');
                  setTempEditTime('');
                }}
                className="w-full py-4 bg-sofa-blue text-white rounded-xl text-xs font-black uppercase tracking-widest mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {addingMatchToDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative">
            <button onClick={() => setAddingMatchToDate(null)} className="absolute top-4 right-4 text-sofa-muted hover:text-sofa-text"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-black text-sofa-text uppercase tracking-tight mb-2">Add Matches to Date</h2>
            <p className="text-xs text-sofa-muted mb-6">Select unscheduled matches to assign to {new Date(addingMatchToDate).toLocaleDateString()}</p>
            
            <div className="max-h-[60vh] overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
              {activeTournament?.matches.filter(m => m.date === null).length === 0 && (
                <p className="text-[10px] font-black text-sofa-muted uppercase tracking-widest text-center py-8">No unscheduled matches available</p>
              )}
              {activeTournament?.matches.filter(m => m.date === null).map(match => {
                const isSelected = selectedMatchesToAdd.some(s => s.matchId === match.id);
                return (
                  <div key={match.id} className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-colors ${isSelected ? 'border-sofa-blue bg-blue-50/30' : 'border-sofa-border hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedMatchesToAdd([...selectedMatchesToAdd, { matchId: match.id, time: '12:00' }]);
                          else setSelectedMatchesToAdd(selectedMatchesToAdd.filter(s => s.matchId !== match.id));
                        }}
                        className="w-4 h-4 text-sofa-blue rounded border-sofa-border focus:ring-sofa-blue"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-sofa-text truncate">
                          {activeTournament.teams.find(t => t.id === match.homeTeamId)?.name} v {activeTournament.teams.find(t => t.id === match.awayTeamId)?.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <input 
                        type="time" 
                        value={selectedMatchesToAdd.find(s => s.matchId === match.id)?.time || '12:00'}
                        onChange={e => {
                          setSelectedMatchesToAdd(selectedMatchesToAdd.map(s => s.matchId === match.id ? { ...s, time: e.target.value } : s));
                        }}
                        className="w-24 bg-white border border-sofa-border rounded-lg px-2 py-1.5 text-[10px] font-bold"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => {
                if (onUpdateTournamentMatches && activeTournament && selectedMatchesToAdd.length > 0) {
                  const dateStr = new Date(addingMatchToDate).toISOString().split('T')[0];
                  const updatedMatches = activeTournament.matches.map(m => {
                    const sel = selectedMatchesToAdd.find(s => s.matchId === m.id);
                    if (sel) {
                      const ts = new Date(`${dateStr}T${sel.time || '12:00'}:00`).getTime();
                      return { ...m, date: !isNaN(ts) ? ts : addingMatchToDate, status: 'scheduled' as const };
                    }
                    return m;
                  });
                  onUpdateTournamentMatches(updatedMatches);
                }
                setAddingMatchToDate(null);
                setSelectedMatchesToAdd([]);
              }}
              disabled={selectedMatchesToAdd.length === 0}
              className="w-full py-4 bg-sofa-blue text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selectedMatchesToAdd.length} Matches
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
