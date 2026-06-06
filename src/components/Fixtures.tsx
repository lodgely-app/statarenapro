import React, { useState } from 'react';
import type { Match, Team } from '@/types/tournament';
import { Edit2, ShieldAlert, GitGraph, List, Trophy, ChevronRight, X, Lock, Play } from 'lucide-react';

interface FixturesProps {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
  tournamentType?: 'league' | 'cup';
  isAdmin?: boolean;
}

const MatchCard = ({ 
  match, 
  teams, 
  compact, 
  onStartEditing,
  isAdmin
}: { 
  match: Match, 
  teams: Team[], 
  compact: boolean, 
  onStartEditing: (match: Match) => void,
  isAdmin?: boolean
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

  return (
    <div 
      className="sofa-row hover:bg-slate-50 group relative cursor-pointer"
      onClick={() => isAdmin && onStartEditing(match)}
    >
      <div className="w-12 md:w-16 flex flex-col items-center justify-center border-r border-sofa-border mr-4 md:mr-8 py-1">
        <span className="text-[9px] font-bold text-sofa-muted uppercase">{isCompleted ? 'FT' : '12:00'}</span>
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
          onClick={(e) => { e.stopPropagation(); onStartEditing(match); }}
          className="ml-4 p-2 text-sofa-border hover:text-sofa-blue opacity-0 group-hover:opacity-100 transition-all"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const Fixtures = ({ matches, teams, onUpdateScore, tournamentType, isAdmin }: FixturesProps) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [tempScores, setTempScores] = useState<Record<string, { h: number, a: number }>>({});
  const [viewMode, setViewMode] = useState<'list' | 'bracket'>(tournamentType === 'cup' ? 'bracket' : 'list');

  const startEditing = (match: Match) => {
    if (!isAdmin) return;
    setEditingMatchId(match.id);
    setTempScores({
      ...tempScores,
      [match.id]: { h: match.homeScore ?? 0, a: match.awayScore ?? 0 }
    });
  };

  const handleSave = (matchId: string) => {
    const scores = tempScores[matchId];
    if (scores) onUpdateScore(matchId, scores.h, scores.a);
    setEditingMatchId(null);
  };

  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="space-y-4">
      {/* SofaScore Tab Switcher */}
      <div className="bg-white border-b border-sofa-border px-4 flex items-center justify-between h-10">
        <div className="flex h-full">
          <button onClick={() => setViewMode('list')} className={`px-4 h-full flex items-center text-[10px] font-bold tracking-wider relative transition-all ${viewMode === 'list' ? 'text-sofa-blue' : 'text-sofa-muted hover:text-sofa-text'}`}>
            MATCHES
            {viewMode === 'list' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sofa-blue" />}
          </button>
          {tournamentType === 'cup' && (
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
      ) : (
        <div className="sofa-card overflow-hidden">
          <div className="divide-y divide-sofa-border">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} teams={teams} compact={false} onStartEditing={startEditing} isAdmin={isAdmin} />
            ))}
          </div>
          {matches.length === 0 && (
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
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Update Match Result</h3>
              <X className="w-4 h-4 text-white cursor-pointer" onClick={() => setEditingMatchId(null)} />
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between gap-6">
                 <div className="flex-1 flex flex-col items-center gap-3">
                   <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-sofa-border text-lg font-black text-sofa-muted">
                     {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.homeTeamId)?.name[0]}
                   </div>
                   <span className="text-[10px] font-black uppercase text-center text-sofa-text truncate w-full">
                     {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.homeTeamId)?.name}
                   </span>
                   <input type="number" autoFocus value={tempScores[editingMatchId]?.h} onChange={(e) => setTempScores({...tempScores, [editingMatchId]: {...tempScores[editingMatchId], h: parseInt(e.target.value) || 0}})} className="w-16 h-16 bg-slate-50 border-2 border-sofa-border rounded-xl text-center text-2xl font-black text-sofa-blue outline-none focus:border-sofa-blue transition-all" />
                 </div>
                 
                 <div className="text-xl font-black text-sofa-muted opacity-20 mt-16">:</div>

                 <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-sofa-border text-lg font-black text-sofa-muted">
                     {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.awayTeamId)?.name[0]}
                   </div>
                   <span className="text-[10px] font-black uppercase text-center text-sofa-text truncate w-full">
                     {teams.find(t => t.id === matches.find(m => m.id === editingMatchId)?.awayTeamId)?.name}
                   </span>
                   <input type="number" value={tempScores[editingMatchId]?.a} onChange={(e) => setTempScores({...tempScores, [editingMatchId]: {...tempScores[editingMatchId], a: parseInt(e.target.value) || 0}})} className="w-16 h-16 bg-slate-50 border-2 border-sofa-border rounded-xl text-center text-2xl font-black text-sofa-blue outline-none focus:border-sofa-blue transition-all" />
                 </div>
              </div>
              
              <button onClick={() => handleSave(editingMatchId)} className="w-full py-4 bg-sofa-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
                SAVE RESULT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
