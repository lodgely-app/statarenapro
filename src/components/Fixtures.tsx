import React, { useState } from 'react';
import type { Match, Team, MatchEvent, TournamentSettings } from '@/types/tournament';
import { Edit2, ShieldAlert, GitGraph, List, Trophy, ChevronRight, X, Lock, Play, Plus, Trash2 } from 'lucide-react';
import { Standings } from '@/components/Standings';

interface FixturesProps {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null, events?: MatchEvent[], timestamp?: number | null) => void;
  onUpdateDate?: (matchId: string, timestamp: number) => void;
  onGenerateNextSeason?: () => void;
  tournamentType?: 'league' | 'knockout' | 'group+knockout' | 'infinite_league';
  isAdmin?: boolean;
  isPreview?: boolean;
  isDashboard?: boolean;
  hideTabs?: boolean;
  tournamentSettings?: TournamentSettings;
  onEditMatchDate?: (match: Match) => void;
  onAddMatchToDate?: (timestamp: number) => void;
}

export const MatchTimeline = ({ match }: { match: Match }) => {
  if (!match.events || match.events.length === 0) return (
    <div className="py-8 text-center text-sofa-muted text-xs font-medium uppercase tracking-widest">
      No events recorded
    </div>
  );
  
  return (
    <div className="w-full bg-white py-2 px-2 cursor-default" onClick={e => e.stopPropagation()}>
      <div className="space-y-4">
        {[...match.events].sort((a, b) => parseInt(a.minute) - parseInt(b.minute)).map(event => {
          const isHome = event.teamId === match.homeTeamId;
          return (
            <div key={event.id} className="flex items-center justify-center w-full">
              <div className="flex-1 flex justify-end pr-4 text-right">
                {isHome && (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-slate-800">{event.playerName}</span>
                      {event.assistPlayerName && <span className="text-[11px] text-slate-500">assist by {event.assistPlayerName}</span>}
                    </div>
                    {event.type === 'goal' && <span className="text-lg leading-none shrink-0 drop-shadow-sm">⚽</span>}
                    {event.type === 'yellow_card' && <div className="w-[14px] h-[18px] bg-[#facc15] rounded-[2px] shrink-0 shadow-sm border border-black/10"></div>}
                    {event.type === 'red_card' && <div className="w-[14px] h-[18px] bg-[#dc2626] rounded-[2px] shrink-0 shadow-sm border border-black/10"></div>}
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 z-10 border border-slate-200">
                <span className="text-[11px] font-black text-slate-700">{event.minute}'</span>
              </div>
              <div className="flex-1 flex justify-start pl-4 text-left">
                {!isHome && (
                  <div className="flex items-center gap-3">
                    {event.type === 'goal' && <span className="text-lg leading-none shrink-0 drop-shadow-sm">⚽</span>}
                    {event.type === 'yellow_card' && <div className="w-[14px] h-[18px] bg-[#facc15] rounded-[2px] shrink-0 shadow-sm border border-black/10"></div>}
                    {event.type === 'red_card' && <div className="w-[14px] h-[18px] bg-[#dc2626] rounded-[2px] shrink-0 shadow-sm border border-black/10"></div>}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-slate-800">{event.playerName}</span>
                      {event.assistPlayerName && <span className="text-[11px] text-slate-500">assist by {event.assistPlayerName}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MatchCard = ({ 
  match, 
  teams, 
  compact, 
  isAdmin,
  isPreview,
  isDashboard,
  hideTabs,
  onInlineScoreChange,
  onStartEditing,
  onStartViewing,
  onEditMatchDate
}: { 
  match: Match, 
  teams: Team[], 
  compact?: boolean, 
  onStartEditing: (match: Match) => void,
  onStartViewing: (match: Match) => void,
  isAdmin?: boolean,
  isPreview?: boolean,
  isDashboard?: boolean,
  hideTabs?: boolean,
  onInlineScoreChange?: (matchId: string, hScore: number | null, aScore: number | null) => void;
  onEditMatchDate?: (match: Match) => void;
}) => {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  if (compact) {
    return (
      <div className="sofa-card p-3 w-44 md:w-52 space-y-2 relative group hover:bg-slate-50 transition-all cursor-pointer border-l-4 border-l-sofa-blue">
        <div className="flex justify-between items-center gap-1">
           <div className="flex flex-col flex-1 min-w-0">
             <span className={`text-[10px] font-bold truncate ${isCompleted && (match.homeScore || 0) > (match.awayScore || 0) ? 'text-sofa-text' : 'text-sofa-muted'}`}>
               {homeTeam?.name || 'TBD'}
             </span>
             <span className="text-[7px] text-sofa-muted opacity-60 truncate">{homeTeam?.playerName}</span>
           </div>
           <span className={`text-[10px] font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue'}`}>{match.homeScore ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center gap-1">
           <div className="flex flex-col flex-1 min-w-0">
             <span className={`text-[10px] font-bold truncate ${isCompleted && (match.awayScore || 0) > (match.homeScore || 0) ? 'text-sofa-text' : 'text-sofa-muted'}`}>
               {awayTeam?.name || 'TBD'}
             </span>
             <span className="text-[7px] text-sofa-muted opacity-60 truncate">{awayTeam?.playerName}</span>
           </div>
           <span className={`text-[10px] font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue'}`}>{match.awayScore ?? '-'}</span>
        </div>
        {isAdmin && (
          <button 
            onClick={() => onStartEditing(match)}
            className="absolute -right-2 -top-2 bg-sofa-blue text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  const [localH, setLocalH] = React.useState(match.homeScore?.toString() ?? '');
  const [localA, setLocalA] = React.useState(match.awayScore?.toString() ?? '');
  React.useEffect(() => {
    setLocalH(match.homeScore?.toString() ?? '');
    setLocalA(match.awayScore?.toString() ?? '');
  }, [match.homeScore, match.awayScore]);

  if (isDashboard) {
    return (
      <div className="flex flex-col border-b border-slate-100 last:border-0 group">
        <div 
          className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 cursor-pointer transition-colors"
          onClick={() => isAdmin ? onStartEditing(match) : onStartViewing(match)}
        >
           <div className="flex-1 flex justify-end items-center gap-3 min-w-0">
              <span className="text-xs md:text-sm font-medium text-sofa-text group-hover:text-sofa-blue transition-colors truncate">{homeTeam?.name}</span>
              {isAdmin ? (
                 <input 
                   type="number"
                   className="w-8 h-8 md:w-10 md:h-10 text-center font-black text-sofa-blue bg-white border border-sofa-border rounded-lg shadow-sm focus:border-sofa-blue outline-none"
                   value={localH}
                   onChange={(e) => setLocalH(e.target.value)}
                   onBlur={() => {
                     const newH = localH === '' ? null : parseInt(localH);
                     if (newH !== match.homeScore) onInlineScoreChange?.(match.id, newH, match.awayScore ?? null);
                   }}
                   onClick={e => e.stopPropagation()}
                 />
              ) : isCompleted ? (
                 <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base font-black text-sofa-text shrink-0 shadow-sm">
                   {match.homeScore}
                 </div>
              ) : null}
           </div>
           
           <div className="px-4 md:px-8 text-center min-w-[80px] md:min-w-[100px]">
              {isCompleted ? (
                 <div className="flex items-center justify-center gap-2">
                   <span className="text-xs font-black text-sofa-muted uppercase tracking-widest">FT</span>
                 </div>
              ) : (
                 <span className="text-[10px] md:text-xs font-bold text-sofa-muted whitespace-nowrap">
                   {match.date ? new Date(match.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'TBD'}
                 </span>
              )}
           </div>
           
           <div className="flex-1 flex justify-start items-center gap-3 min-w-0">
              {isAdmin ? (
                 <input 
                   type="number"
                   className="w-8 h-8 md:w-10 md:h-10 text-center font-black text-sofa-blue bg-white border border-sofa-border rounded-lg shadow-sm focus:border-sofa-blue outline-none"
                   value={localA}
                   onChange={(e) => setLocalA(e.target.value)}
                   onBlur={() => {
                     const newA = localA === '' ? null : parseInt(localA);
                     if (newA !== match.awayScore) onInlineScoreChange?.(match.id, match.homeScore ?? null, newA);
                   }}
                   onClick={e => e.stopPropagation()}
                 />
              ) : isCompleted ? (
                 <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base font-black text-sofa-text shrink-0 shadow-sm">
                   {match.awayScore}
                 </div>
              ) : null}
              <span className="text-xs md:text-sm font-medium text-sofa-text group-hover:text-sofa-blue transition-colors truncate">{awayTeam?.name}</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col group sofa-row-container relative cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => onStartViewing(match)}
    >
      <div className="sofa-row relative">
        <div className="w-12 md:w-16 flex flex-col items-center justify-center border-r border-sofa-border mr-4 md:mr-8 py-1 relative">
          {!isPreview && match.date !== null && (
            <>
              <span className="text-[9px] font-bold text-sofa-muted uppercase">{isCompleted ? 'FT' : new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[7px] font-bold text-sofa-muted uppercase opacity-60 mt-0.5">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </>
          )}
          {isPreview && <span className="text-[9px] font-bold text-sofa-muted uppercase">TBD</span>}
          {!isPreview && match.date === null && <span className="text-[9px] font-bold text-sofa-muted uppercase">TBD</span>}
          {isLive && <span className="text-[9px] font-black text-sofa-live animate-pulse">45'</span>}
        </div>

        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-12">
          <div className="flex flex-col items-end text-right min-w-0">
            <span className={`text-xs md:text-sm font-bold truncate w-full ${isCompleted && (match.homeScore || 0) > (match.awayScore || 0) ? 'text-sofa-text' : 'text-sofa-muted'}`}>
              {homeTeam?.name}
            </span>
            <span className="text-[8px] md:text-[10px] text-sofa-muted opacity-60 font-medium truncate uppercase tracking-widest">
              {homeTeam?.playerName}
            </span>
          </div>

          <div className="bg-slate-100 rounded-lg px-4 md:px-6 py-1.5 flex items-center gap-3 md:gap-5 shadow-inner min-w-[80px] md:min-w-[110px] justify-center border border-sofa-border">
            <span className={`text-base md:text-2xl font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue opacity-40'}`}>
              {match.homeScore ?? '-'}
            </span>
            <span className="text-sofa-muted opacity-20 font-black text-xs md:text-base">-</span>
            <span className={`text-base md:text-2xl font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue opacity-40'}`}>
              {match.awayScore ?? '-'}
            </span>
          </div>

          <div className="flex flex-col items-start text-left min-w-0">
            <span className={`text-xs md:text-sm font-bold truncate w-full ${isCompleted && (match.awayScore || 0) > (match.homeScore || 0) ? 'text-sofa-text' : 'text-sofa-muted'}`}>
              {awayTeam?.name}
            </span>
            <span className="text-[8px] md:text-[10px] text-sofa-muted opacity-60 font-medium truncate uppercase tracking-widest">
              {awayTeam?.playerName}
            </span>
          </div>
        </div>
        
        {isAdmin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onStartEditing(match); }}
            className="ml-4 p-2 text-sofa-border hover:text-sofa-blue opacity-0 group-hover:opacity-100 transition-all"
            title="Edit Match"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const Fixtures = ({ 
  matches, 
  teams, 
  onUpdateScore, 
  onUpdateDate, 
  tournamentType, 
  isAdmin, 
  isPreview, 
  isDashboard, 
  hideTabs, 
  tournamentSettings, 
  onEditMatchDate, 
  onAddMatchToDate,
  onGenerateNextSeason
}: FixturesProps) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [viewingMatchId, setViewingMatchId] = useState<string | null>(null);
  const [tempScores, setTempScores] = React.useState<Record<string, { h: number | null; a: number | null }>>({});
  const [tempDateStr, setTempDateStr] = useState<string>('');
  const [tempTimeStr, setTempTimeStr] = useState<string>('');
  const [tempEvents, setTempEvents] = useState<MatchEvent[]>([]);
  const [newEvent, setNewEvent] = useState<{type: MatchEvent['type'], playerName: string, teamId: string, minute: string, assistPlayerName?: string} | null>(null);
  const [viewMode, setViewMode] = useState<'matches' | 'groups' | 'upcoming' | 'results' | 'unscheduled'>(isDashboard ? 'upcoming' : 'matches');

  React.useEffect(() => {
    if (editingMatchId && tempScores[editingMatchId]) {
      const match = matches.find(m => m.id === editingMatchId);
      if (!match) return;

      const hScore = tempScores[editingMatchId].h || 0;
      const aScore = tempScores[editingMatchId].a || 0;
      
      const homeGoals = tempEvents.filter(e => e.type === 'goal' && e.teamId === match.homeTeamId);
      const awayGoals = tempEvents.filter(e => e.type === 'goal' && e.teamId === match.awayTeamId);

      if (homeGoals.length !== hScore || awayGoals.length !== aScore) {
        setTempEvents(prev => {
          let newEvents = [...prev];
          
          const currentHomeGoals = newEvents.filter(e => e.type === 'goal' && e.teamId === match.homeTeamId);
          if (currentHomeGoals.length < hScore) {
             const blanks = Array.from({ length: hScore - currentHomeGoals.length }).map(() => ({
               id: `evt-${match.homeTeamId}-${Date.now()}-${Math.random()}`,
               type: 'goal' as const,
               teamId: match.homeTeamId,
               playerName: '',
               minute: '',
               assistPlayerName: ''
             }));
             newEvents = [...newEvents, ...blanks];
          } else if (currentHomeGoals.length > hScore) {
             const toRemove = currentHomeGoals.slice(hScore).map(e => e.id);
             newEvents = newEvents.filter(e => !toRemove.includes(e.id));
          }

          const currentAwayGoals = newEvents.filter(e => e.type === 'goal' && e.teamId === match.awayTeamId);
          if (currentAwayGoals.length < aScore) {
             const blanks = Array.from({ length: aScore - currentAwayGoals.length }).map(() => ({
               id: `evt-${match.awayTeamId}-${Date.now()}-${Math.random()}`,
               type: 'goal' as const,
               teamId: match.awayTeamId,
               playerName: '',
               minute: '',
               assistPlayerName: ''
             }));
             newEvents = [...newEvents, ...blanks];
          } else if (currentAwayGoals.length > aScore) {
             const toRemove = currentAwayGoals.slice(aScore).map(e => e.id);
             newEvents = newEvents.filter(e => !toRemove.includes(e.id));
          }

          return newEvents;
        });
      }
    }
  }, [tempScores, editingMatchId, matches, tempEvents]);

  const startEditing = (match: Match) => {
    if (!isAdmin) return;
    setEditingMatchId(match.id);
    setTempScores({
      ...tempScores,
      [match.id]: { h: match.homeScore ?? 0, a: match.awayScore ?? 0 }
    });
    
    if (match.date) {
      const d = new Date(match.date);
      setTempDateStr(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
      setTempTimeStr(String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'));
    } else {
      setTempDateStr('');
      setTempTimeStr('');
    }
    
    setTempEvents(match.events || []);
    setNewEvent(null);
  };

  const startViewing = (match: Match) => {
    setViewingMatchId(match.id);
  };

  const handleSave = (matchId: string) => {
    let newTs: number | null | undefined = undefined;
    if (tempDateStr) {
      newTs = new Date(`${tempDateStr}T${tempTimeStr || '12:00'}:00`).getTime();
      if (isNaN(newTs)) newTs = undefined;
    }

    const scores = tempScores[matchId];
    if (scores) {
      onUpdateScore(matchId, scores.h, scores.a, tempEvents, newTs);
    }
    
    setEditingMatchId(null);
  };

  const isKnockout = tournamentType === 'knockout' || tournamentType === 'group+knockout';

  return (
    <div className="space-y-4">
      {!hideTabs && (
        <div className="bg-white border-b border-sofa-border px-4 flex items-center justify-between h-10">
          <div className="flex h-full">
            {!isDashboard && (
              <button onClick={() => setViewMode('matches')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'matches' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                MATCHES
                {viewMode === 'matches' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
              </button>
            )}
            {isDashboard && (
              <>
                <button onClick={() => setViewMode('upcoming')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'upcoming' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                  UPCOMING
                  {viewMode === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
                </button>
                <button onClick={() => setViewMode('results')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'results' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                  RESULTS
                  {viewMode === 'results' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
                </button>
                <button onClick={() => setViewMode('unscheduled')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'unscheduled' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                  UNSCHEDULED
                  {viewMode === 'unscheduled' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
                </button>
              </>
            )}
            {!isDashboard && tournamentType === 'group+knockout' && (
              <button onClick={() => setViewMode('groups')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'groups' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                GROUPS
                {viewMode === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
              </button>
            )}
          </div>
          {isAdmin && tournamentType === 'infinite_league' && onGenerateNextSeason && (
            <button 
              onClick={onGenerateNextSeason}
              className="px-3 py-1.5 bg-sofa-blue text-white rounded text-[10px] font-black uppercase hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3 h-3" />
              Generate Next Season
            </button>
          )}
        </div>
      )}

      {viewMode === 'groups' ? (
        <div className="space-y-8">
          {Array.from(new Set(teams.map(t => t.groupId).filter(Boolean))).sort().map(gId => {
            const groupTeams = teams.filter(t => t.groupId === gId);
            const groupMatches = matches.filter(m => m.groupId === gId);
            return (
              <div key={gId as string} className="space-y-4">
                 <div className="flex items-center gap-2 px-2 mb-4">
                   <Trophy className="w-4 h-4 text-sofa-blue" />
                   <h3 className="font-black text-xs uppercase tracking-widest text-sofa-text">Group {gId as string}</h3>
                 </div>
                 <Standings teams={groupTeams} />
                 <div className="sofa-card overflow-hidden mt-4">
                   <div className="divide-y divide-sofa-border">
                     {groupMatches.map(match => (
                       <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} onStartViewing={startViewing} isAdmin={isAdmin} />
                     ))}
                   </div>
                 </div>
              </div>
            );
          })}
        </div>
      ) : isDashboard ? (
        <div className="space-y-6">
          {Object.entries(
            matches
              .filter(m => {
                if (hideTabs) return true;
                if (viewMode === 'upcoming') return m.status === 'scheduled' && m.date !== null;
                if (viewMode === 'results') return m.status === 'completed';
                if (viewMode === 'unscheduled') return m.status === 'scheduled' && m.date === null;
                return true;
              })
              .reduce((acc, match) => {
                const dateKey = match.date
                  ? new Date(match.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'TBD';
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(match);
                return acc;
              }, {} as Record<string, Match[]>)
          )
            .sort((a, b) => {
              if (a[0] === 'TBD') return 1;
              if (b[0] === 'TBD') return -1;
              const dateA = a[1][0]?.date || 0;
              const dateB = b[1][0]?.date || 0;
              return dateA - dateB;
            })
            .map(([dateLabel, dateMatches]) => {
              dateMatches.sort((a, b) => (a.date || 0) - (b.date || 0));

              let displayLabel = dateLabel;
              if (dateLabel !== 'TBD') {
                 const matchDate = new Date(dateMatches[0].date!);
                 const today = new Date();
                 const tomorrow = new Date(today);
                 tomorrow.setDate(tomorrow.getDate() + 1);
                 if (matchDate.toDateString() === today.toDateString()) displayLabel = 'Today';
                 else if (matchDate.toDateString() === tomorrow.toDateString()) displayLabel = 'Tomorrow';
              }
            
            return (
              <div key={dateLabel}>
                <div className="bg-slate-50 border border-sofa-border px-6 py-3 rounded-t-2xl shadow-sm flex justify-between items-center">
                  <span className="text-[13px] font-black text-sofa-text">{displayLabel}</span>
                  {onAddMatchToDate && dateLabel !== 'TBD' && isAdmin && (
                    <button 
                      onClick={() => onAddMatchToDate(dateMatches[0].date!)} 
                      className="text-[10px] text-sofa-blue font-bold uppercase hover:underline flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Matches
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-b-2xl border border-t-0 border-sofa-border overflow-hidden shadow-sm">
                  <div className={`flex flex-col ${viewMode === 'unscheduled' ? 'max-h-[448px] md:max-h-[512px] overflow-y-auto custom-scrollbar' : ''}`}>
                    {dateMatches.map(match => (
                      <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} onStartViewing={startViewing} isAdmin={isAdmin} isPreview={isPreview} isDashboard={isDashboard} onInlineScoreChange={onUpdateScore} onEditMatchDate={onEditMatchDate} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {matches.filter(m => {
                if (hideTabs) return true;
                if (viewMode === 'upcoming') return m.status === 'scheduled' && m.date !== null;
                if (viewMode === 'results') return m.status === 'completed';
                if (viewMode === 'unscheduled') return m.status === 'scheduled' && m.date === null;
                return true;
              }).length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-sofa-border shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sofa-border">
                 <Play className="w-6 h-6 text-sofa-border" />
              </div>
              <p className="text-sofa-muted text-[10px] font-black uppercase tracking-[0.3em]">No fixtures scheduled</p>
            </div>
          )}
        </div>
      ) : (
        <div className="sofa-card overflow-hidden">
          <div className="divide-y divide-sofa-border">
            {matches
              .filter(m => {
                if (hideTabs) return true;
                if (viewMode === 'upcoming') return m.status === 'scheduled' && m.date !== null;
                if (viewMode === 'results') return m.status === 'completed';
                if (viewMode === 'unscheduled') return m.status === 'scheduled' && m.date === null;
                return true;
              })
              .sort((a, b) => {
                if (a.date === null && b.date === null) return 0;
                if (a.date === null) return 1;
                if (b.date === null) return -1;
                return a.date - b.date;
              })
              .map((match) => (
              <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} onStartViewing={startViewing} isAdmin={isAdmin} isPreview={isPreview} isDashboard={isDashboard} onInlineScoreChange={onUpdateScore} />
            ))}
          </div>
          {matches.filter(m => {
                if (viewMode === 'upcoming') return m.status === 'scheduled' && m.date !== null;
                if (viewMode === 'results') return m.status === 'completed';
                if (viewMode === 'unscheduled') return m.status === 'scheduled' && m.date === null;
                return true;
              }).length === 0 && (
            <div className="py-20 text-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sofa-border">
                 <Play className="w-6 h-6 text-sofa-border" />
              </div>
              <p className="text-sofa-muted text-[10px] font-black uppercase tracking-[0.3em]">No fixtures scheduled</p>
            </div>
          )}
        </div>
      )}

      {/* SofaScore Style Modal */}
      {editingMatchId && isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sofa-navy/60 backdrop-blur-sm" onClick={() => setEditingMatchId(null)} />
          <div className="bg-white rounded-xl max-w-sm w-full relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-sofa-blue p-4 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Update Match</h3>
              <X className="w-4 h-4 text-white cursor-pointer" onClick={() => setEditingMatchId(null)} />
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex flex-col items-center gap-3">
                  {/* <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-lg font-black border border-sofa-border text-sofa-text shadow-sm">
                    {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.homeTeamId)?.name?.[0]}
                  </div> */}
                  <span className="text-[10px] font-black text-sofa-text text-center uppercase tracking-widest">{teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.homeTeamId)?.name}</span>
                  <input 
                    type="number" 
                    value={tempScores[editingMatchId]?.h ?? ''} 
                    onChange={e => setTempScores({...tempScores, [editingMatchId]: { ...tempScores[editingMatchId], h: e.target.value === '' ? null : parseInt(e.target.value) }})}
                    className="w-16 h-16 text-center text-3xl font-black bg-slate-50 border-2 border-sofa-border rounded-xl focus:border-sofa-blue outline-none shadow-inner"
                  />
                </div>
                
                <span className="text-3xl font-black text-sofa-border pt-12">-</span>
                
                <div className="flex-1 flex flex-col items-center gap-3">
                  {/* <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-lg font-black border border-sofa-border text-sofa-text shadow-sm">
                    {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.awayTeamId)?.name?.[0]}
                  </div> */}
                  <span className="text-[10px] font-black text-sofa-text text-center uppercase tracking-widest">{teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.awayTeamId)?.name}</span>
                  <input 
                    type="number" 
                    value={tempScores[editingMatchId]?.a ?? ''} 
                    onChange={e => setTempScores({...tempScores, [editingMatchId]: { ...tempScores[editingMatchId], a: e.target.value === '' ? null : parseInt(e.target.value) }})}
                    className="w-16 h-16 text-center text-3xl font-black bg-slate-50 border-2 border-sofa-border rounded-xl focus:border-sofa-blue outline-none shadow-inner"
                  />
                </div>
              </div>
              
              {onUpdateDate && (
                <div className="pt-6 border-t border-sofa-border/50 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-sofa-muted uppercase tracking-widest block mb-2 text-center">Date</label>
                    <input 
                      type="date" 
                      value={tempDateStr} 
                      onChange={e => setTempDateStr(e.target.value)} 
                      className="w-full bg-slate-50 border border-sofa-border rounded-xl px-4 py-3 text-xs font-bold focus:border-sofa-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-sofa-muted uppercase tracking-widest block mb-2 text-center">Time</label>
                    <input 
                      type="time" 
                      value={tempTimeStr} 
                      onChange={e => setTempTimeStr(e.target.value)} 
                      className="w-full bg-slate-50 border border-sofa-border rounded-xl px-4 py-3 text-xs font-bold focus:border-sofa-blue outline-none"
                    />
                  </div>
                </div>
              )}
              
              {/* Match Events Section */}
              {tournamentSettings && Object.values(tournamentSettings).some(v => v) && (
                <div className="pt-6 border-t border-sofa-border/50">
                  <h4 className="text-[10px] font-black text-sofa-text uppercase tracking-widest mb-4 text-center">Match Events</h4>
                  <div className="space-y-6 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { id: 'goal', label: 'Goals', setting: 'trackGoals' },
                      { id: 'yellow_card', label: 'Yellow Cards', setting: 'trackYellowCards' },
                      { id: 'red_card', label: 'Red Cards', setting: 'trackRedCards' }
                    ].map(statType => (tournamentSettings as any)[statType.setting] ? (
                      <div key={statType.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-sofa-muted uppercase">{statType.label}</span>
                          {statType.id !== 'goal' && (
                            <button 
                              onClick={() => setNewEvent({ type: statType.id as any, playerName: '', teamId: matches.find(m => m.id === editingMatchId)?.homeTeamId || '', minute: '', assistPlayerName: '' })}
                              className="w-5 h-5 bg-sofa-blue/10 text-sofa-blue rounded flex items-center justify-center hover:bg-sofa-blue hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {tempEvents.filter(e => e.type === statType.id).map(e => (
                          <div key={e.id} className={`flex items-center justify-between bg-slate-50 border border-sofa-border rounded-lg ${statType.id === 'goal' ? 'p-3' : 'px-3 py-2'}`}>
                            {statType.id === 'goal' ? (
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-2 w-full">
                                  <input 
                                    type="text" 
                                    placeholder="Scorer Name" 
                                    value={e.playerName}
                                    onChange={ev => setTempEvents(tempEvents.map(te => te.id === e.id ? { ...te, playerName: ev.target.value } : te))}
                                    className="flex-1 bg-white border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Min" 
                                    value={e.minute}
                                    onChange={ev => setTempEvents(tempEvents.map(te => te.id === e.id ? { ...te, minute: ev.target.value } : te))}
                                    className="w-12 bg-white border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none text-center"
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Assist By (Optional)" 
                                  value={e.assistPlayerName || ''}
                                  onChange={ev => setTempEvents(tempEvents.map(te => te.id === e.id ? { ...te, assistPlayerName: ev.target.value } : te))}
                                  className="w-full bg-white border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none"
                                />
                                <div className="flex items-center justify-between mt-1">
                                   <span className="text-[8px] font-bold text-sofa-muted uppercase px-1.5 py-0.5 bg-white border border-sofa-border rounded">
                                     {teams.find(t => t.id === e.teamId)?.name}
                                   </span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-sofa-text">{e.minute}'</span>
                                  <span className="text-[10px] font-medium text-slate-600">
                                    {e.playerName}
                                  </span>
                                  <span className="text-[8px] font-bold text-sofa-muted uppercase ml-1 px-1.5 py-0.5 bg-white border border-sofa-border rounded">
                                    {teams.find(t => t.id === e.teamId)?.name.substring(0,3)}
                                  </span>
                                </div>
                                <button onClick={() => setTempEvents(tempEvents.filter(te => te.id !== e.id))} className="text-sofa-muted hover:text-sofa-live">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                        {newEvent?.type === statType.id && statType.id !== 'goal' && (
                          <div className="bg-white border border-sofa-blue rounded-lg p-3 space-y-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Player Name" 
                                  value={newEvent.playerName}
                                  onChange={e => setNewEvent({...newEvent, playerName: e.target.value})}
                                  className="flex-1 bg-slate-50 border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Min (e.g. 45)" 
                                  value={newEvent.minute}
                                  onChange={e => setNewEvent({...newEvent, minute: e.target.value})}
                                  className="w-16 bg-slate-50 border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <select 
                                value={newEvent.teamId}
                                onChange={e => setNewEvent({...newEvent, teamId: e.target.value})}
                                className="flex-1 bg-slate-50 border border-sofa-border rounded px-2 py-1.5 text-[10px] font-bold focus:border-sofa-blue outline-none"
                              >
                                <option value={matches.find(m => m.id === editingMatchId)?.homeTeamId}>{teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.homeTeamId)?.name}</option>
                                <option value={matches.find(m => m.id === editingMatchId)?.awayTeamId}>{teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.awayTeamId)?.name}</option>
                              </select>
                              <button 
                                onClick={() => {
                                  if (newEvent.playerName && newEvent.minute) {
                                    setTempEvents([...tempEvents, { ...newEvent, id: `evt-${Date.now()}` }]);
                                    setNewEvent(null);
                                  }
                                }}
                                className="bg-sofa-blue text-white px-3 py-1.5 rounded text-[10px] font-black uppercase"
                              >
                                Add
                              </button>
                              <button 
                                onClick={() => setNewEvent(null)}
                                className="bg-slate-100 text-sofa-muted px-3 py-1.5 rounded text-[10px] font-black uppercase hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => handleSave(editingMatchId)}
                className="w-full py-4 bg-sofa-success text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Match Events Modal */}
      {viewingMatchId && !isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sofa-navy/60 backdrop-blur-sm" onClick={() => setViewingMatchId(null)} />
          <div className="bg-white rounded-xl max-w-sm w-full relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-sofa-blue p-4 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Match Details</h3>
              <X className="w-4 h-4 text-white cursor-pointer" onClick={() => setViewingMatchId(null)} />
            </div>
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black text-sofa-text text-center uppercase tracking-widest">{teams.find(t => t.id === matches.find(m => m.id === viewingMatchId)?.homeTeamId)?.name}</span>
                  <div className="w-16 h-16 flex items-center justify-center text-3xl font-black bg-slate-50 border border-sofa-border rounded-xl">
                    {matches.find(m => m.id === viewingMatchId)?.homeScore ?? '-'}
                  </div>
                </div>
                
                <span className="text-3xl font-black text-sofa-border">-</span>
                
                <div className="flex-1 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black text-sofa-text text-center uppercase tracking-widest">{teams.find(t => t.id === matches.find(m => m.id === viewingMatchId)?.awayTeamId)?.name}</span>
                  <div className="w-16 h-16 flex items-center justify-center text-3xl font-black bg-slate-50 border border-sofa-border rounded-xl">
                    {matches.find(m => m.id === viewingMatchId)?.awayScore ?? '-'}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-sofa-border/50">
                 <h4 className="text-sm font-bold text-center text-slate-800 mb-6">Match Events</h4>
                 {matches.find(m => m.id === viewingMatchId) && (
                   <MatchTimeline match={matches.find(m => m.id === viewingMatchId)!} />
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
