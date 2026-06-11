import React, { useState } from 'react';
import type { Match, Team } from '@/types/tournament';
import { Shield } from 'lucide-react';

interface BracketProps {
  matches: Match[];
  teams: Team[];
}

export const Bracket = ({ matches, teams }: BracketProps) => {
  const bracketMatches = matches.filter(m => (m.isKnockout || !m.groupId) && Number(m.round) > 0);
  const rounds = Array.from(new Set(bracketMatches.map(m => Number(m.round)))).sort((a, b) => a - b);
  
  const matchesByRound = rounds.reduce((acc, round) => {
    acc[round] = bracketMatches.filter(m => Number(m.round) === round);
    return acc;
  }, {} as Record<number, Match[]>);

  const [activeRound, setActiveRound] = useState<number>(rounds[0] || 1);

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi finals';
    if (round === totalRounds - 2) return 'Quarter finals';
    return `Round of ${Math.pow(2, totalRounds - round + 1)}`;
  };

  if (rounds.length === 0) {
    return <div className="p-8 text-center text-sofa-muted text-xs font-bold bg-white rounded-xl border border-slate-200">No bracket matches available.</div>;
  }

  const roundsToDisplay = rounds.filter(r => r >= activeRound);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 text-slate-800 font-sans animate-in fade-in duration-300 shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-4 overflow-x-auto border-b border-slate-200 custom-scrollbar">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              activeRound === round 
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {getRoundName(round, rounds[rounds.length - 1])}
          </button>
        ))}
      </div>

      {/* Bracket Canvas */}
      <div className="p-8 overflow-x-auto overflow-y-hidden custom-scrollbar relative min-h-[500px]">
        <div className="flex gap-16 min-w-max h-full items-stretch">
          {roundsToDisplay.map((round, rIndex) => (
            <div key={round} className="flex flex-col justify-around relative w-64 min-h-full py-4">
              {matchesByRound[round].map((match, mIndex) => {
                const homeTeam = teams.find(t => t.id === match.homeTeamId);
                const awayTeam = teams.find(t => t.id === match.awayTeamId);
                const isCompleted = match.status === 'completed';
                const matchDate = match.date ? new Date(match.date) : null;
                const dayMonth = matchDate ? matchDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() : 'TBD';
                const time = matchDate ? matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBD';

                return (
                  <div key={match.id} className="relative flex items-center my-4">
                    {/* The Match Card */}
                    <div className="bg-white rounded-xl border border-slate-200 flex w-full overflow-hidden relative z-10 shadow-sm">
                       {/* Left side (Date/Time) */}
                       <div className="flex flex-col justify-center items-center px-4 py-3 border-r border-slate-200 bg-slate-50 w-20 shrink-0">
                         <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">{dayMonth}</span>
                         <span className="text-sm font-black text-slate-800">{time}</span>
                       </div>
                       
                       {/* Right side (Teams) */}
                       <div className="flex flex-col justify-center flex-1 p-3 gap-2">
                         <div className="flex items-center gap-2">
                           <Shield className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-[11px] font-bold text-slate-700 truncate flex-1">{homeTeam?.name || 'TBD'}</span>
                           {isCompleted && <span className="text-[11px] font-black text-slate-800">{match.homeScore}</span>}
                         </div>
                         <div className="flex items-center gap-2">
                           <Shield className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-[11px] font-bold text-slate-700 truncate flex-1">{awayTeam?.name || 'TBD'}</span>
                           {isCompleted && <span className="text-[11px] font-black text-slate-800">{match.awayScore}</span>}
                         </div>
                       </div>
                    </div>

                    {/* Connecting lines */}
                    {/* Incoming line from the left */}
                    {(rIndex > 0 || round > rounds[0]) && (
                      <div className="absolute -left-8 w-8 h-px bg-slate-300" />
                    )}
                    {/* Outgoing lines to the right */}
                    {round < rounds[rounds.length - 1] && (
                      <>
                        <div className="absolute -right-8 w-8 h-px bg-slate-300" />
                        <div className={`absolute -right-8 w-px bg-slate-300 ${
                          mIndex % 2 === 0 ? 'top-1/2 h-[calc(50%+2rem)]' : 'bottom-1/2 h-[calc(50%+2rem)]'
                        }`} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
