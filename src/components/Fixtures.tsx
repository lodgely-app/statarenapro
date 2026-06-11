import React, { useState } from 'react';
import type { Match, Team } from '@/types/tournament';
import { Edit2, ShieldAlert, GitGraph, List, Trophy, ChevronRight, X, Lock, Play } from 'lucide-react';
import { Standings } from '@/components/Standings';

interface FixturesProps {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
  onUpdateDate?: (matchId: string, date: number) => void;
  tournamentType?: 'league' | 'knockout' | 'group+knockout';
  isAdmin?: boolean;
  isPreview?: boolean;
  isDashboard?: boolean;
  hideTabs?: boolean;
  onEditMatchDate?: (match: Match) => void;
  onAddMatchToDate?: (timestamp: number) => void;
}

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
  onEditMatchDate
}: { 
  match: Match, 
  teams: Team[], 
  compact: boolean, 
  onStartEditing: (match: Match) => void,
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
      <div 
        className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-100 last:border-0"
        onClick={() => isAdmin && onStartEditing(match)}
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
    );
  }

  return (
    <div 
      className="sofa-row hover:bg-slate-50 group relative cursor-pointer"
      onClick={() => {
        if (isAdmin) {
          if (onEditMatchDate && match.status !== 'completed') {
            onEditMatchDate(match);
          } else {
            onStartEditing(match);
          }
        }
      }}
    >
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
        {/* HOME TEAM */}
        <div className="flex flex-col items-end text-right min-w-0">
          <span className={`text-xs md:text-sm font-bold truncate w-full ${isCompleted && (match.homeScore || 0) > (match.awayScore || 0) ? 'text-sofa-text' : 'text-sofa-muted'}`}>
            {homeTeam?.name}
          </span>
          <span className="text-[8px] md:text-[10px] text-sofa-muted opacity-60 font-medium truncate uppercase tracking-widest">
            {homeTeam?.playerName}
          </span>
        </div>

        {/* SCOREBOARD (Centered) */}
        <div className="bg-slate-100 rounded-lg px-4 md:px-6 py-1.5 flex items-center gap-3 md:gap-5 shadow-inner min-w-[80px] md:min-w-[110px] justify-center border border-sofa-border">
          <span className={`text-base md:text-2xl font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue opacity-40'}`}>
            {match.homeScore ?? '-'}
          </span>
          <span className="text-sofa-muted opacity-20 font-black text-xs md:text-base">-</span>
          <span className={`text-base md:text-2xl font-black ${isCompleted ? 'text-sofa-text' : 'text-sofa-blue opacity-40'}`}>
            {match.awayScore ?? '-'}
          </span>
        </div>

        {/* AWAY TEAM */}
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
          onClick={(e) => { 
            e.stopPropagation(); 
            if (onEditMatchDate && match.status !== 'completed') {
              onEditMatchDate(match);
            } else {
              onStartEditing(match);
            }
          }}
          className="ml-4 p-2 text-sofa-border hover:text-sofa-blue opacity-0 group-hover:opacity-100 transition-all"
          title="Edit Match"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const Fixtures = ({ matches, teams, onUpdateScore, onUpdateDate, tournamentType, isAdmin, isPreview, isDashboard, hideTabs, onEditMatchDate, onAddMatchToDate }: FixturesProps) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [tempScores, setTempScores] = React.useState<Record<string, { h: number | null; a: number | null }>>({});
  const [tempDateStr, setTempDateStr] = useState<string>('');
  const [tempTimeStr, setTempTimeStr] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'bracket' | 'groups' | 'upcoming' | 'results'>(
    isDashboard ? 'upcoming'
    : tournamentType === 'group+knockout' ? 'groups' 
    : tournamentType === 'knockout' ? 'bracket' 
    : 'list'
  );

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
  };

  const handleSave = (matchId: string) => {
    const scores = tempScores[matchId];
    if (scores) onUpdateScore(matchId, scores.h, scores.a);
    
    if (onUpdateDate) {
      let newTs: number | null = null;
      if (tempDateStr) {
        newTs = new Date(`${tempDateStr}T${tempTimeStr || '12:00'}:00`).getTime();
      }
      if (newTs && !isNaN(newTs)) {
        onUpdateDate(matchId, newTs);
      }
    }
    setEditingMatchId(null);
  };

  const bracketMatches = tournamentType === 'group+knockout' 
    ? matches.filter(m => m.isKnockout) 
    : matches;

  const matchesByRound = bracketMatches.reduce((acc, match) => {
    const round = match.round || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="space-y-4">
      {/* SofaScore Tab Switcher */}
      {!hideTabs && (
        <div className="bg-white border-b border-sofa-border px-4 flex items-center justify-between h-10">
          <div className="flex h-full">
            {!isDashboard && (
              <button onClick={() => setViewMode('list')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'list' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                MATCHES
                {viewMode === 'list' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
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
              </>
            )}
            {!isDashboard && tournamentType === 'group+knockout' && (
              <button onClick={() => setViewMode('groups')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'groups' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                GROUPS
                {viewMode === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
              </button>
            )}
            {(tournamentType === 'knockout' || tournamentType === 'group+knockout') && (
              <button onClick={() => setViewMode('bracket')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'bracket' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
                BRACKET
                {viewMode === 'bracket' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
              </button>
            )}
          </div>
          {!isAdmin && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-sofa-border">
                <Lock className="w-2.5 h-2.5 text-sofa-muted opacity-40" />
                <span className="text-[8px] font-black text-sofa-muted opacity-40 uppercase tracking-widest">Read Only</span>
             </div>
          )}
        </div>
      )}

      {viewMode === 'bracket' ? (
        <div className="sofa-card p-0 overflow-hidden relative group/scroll bg-slate-50">
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar pb-6">
            <div className="p-8 md:p-12 flex gap-12 md:gap-20 min-w-max items-center justify-start">
              {rounds.map((round, rIndex) => (
                <div key={round} className="flex flex-col gap-6 md:gap-10 relative">
                  <div className="text-center mb-1">
                    <span className="text-[9px] font-black text-sofa-muted uppercase tracking-[0.2em]">ROUND {round}</span>
                  </div>
                  <div className="flex flex-col justify-around gap-8 md:gap-12 h-full relative">
                    {matchesByRound[Number(round)].map((match, mIndex) => (
                      <div key={match.id} className="relative flex items-center">
                        <MatchCard match={match} teams={teams} compact={true} onStartEditing={startEditing} isAdmin={isAdmin} />
                        {rIndex < rounds.length - 1 && (
                          <>
                            <div className="absolute -right-6 md:-right-10 w-6 md:w-10 h-px bg-sofa-border" />
                            <div className={`absolute -right-6 md:-right-10 w-px bg-sofa-border ${mIndex % 2 === 0 ? 'h-8 md:h-12 top-1/2' : 'h-8 md:h-12 bottom-1/2'}`} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center gap-4 px-10 relative">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-sofa-blue shadow-lg">
                    <Trophy className="w-6 h-6 text-sofa-blue fill-current" />
                 </div>
                 <span className="text-[9px] font-black text-sofa-blue uppercase tracking-[0.3em] italic">Champion</span>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'groups' ? (
        <div className="space-y-8">
          {Array.from(new Set(teams.map(t => t.groupId).filter(Boolean))).sort().map(gId => {
            const groupTeams = teams.filter(t => t.groupId === gId);
            const groupMatches = matches.filter(m => m.groupId === gId);
            return (
              <div key={gId as string} className="space-y-4">
                 <div className="flex items-center gap-2 px-2">
                   <Trophy className="w-4 h-4 text-sofa-blue" />
                   <h3 className="font-black text-xs uppercase tracking-widest text-sofa-text">Group {gId as string}</h3>
                 </div>
                 <Standings teams={groupTeams} />
                 <div className="sofa-card overflow-hidden mt-4">
                   <div className="divide-y divide-sofa-border">
                     {groupMatches.map(match => (
                       <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} isAdmin={isAdmin} />
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
          ).map(([dateLabel, dateMatches]) => {
            // "Tomorrow" or "Today" calculation
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
                  <div className="flex flex-col">
                    {dateMatches.map(match => (
                      <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} isAdmin={isAdmin} isPreview={isPreview} isDashboard={isDashboard} onInlineScoreChange={onUpdateScore} onEditMatchDate={onEditMatchDate} />
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
                if (viewMode === 'upcoming') return m.status === 'scheduled';
                if (viewMode === 'results') return m.status === 'completed';
                return true;
              })
              .map((match) => (
              <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} isAdmin={isAdmin} isPreview={isPreview} isDashboard={isDashboard} onInlineScoreChange={onUpdateScore} />
            ))}
          </div>
          {matches.filter(m => {
                if (viewMode === 'upcoming') return m.status === 'scheduled';
                if (viewMode === 'results') return m.status === 'completed';
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
    </div>
  );
};
