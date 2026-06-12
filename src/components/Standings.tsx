import React from 'react';
import type { Team } from '@/types/tournament';

interface StandingsProps {
  teams: Team[];
}

export const Standings = ({ teams }: StandingsProps) => {
  return (
    <div className="sofa-card overflow-hidden">
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-sofa-border px-4 py-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-sofa-muted uppercase tracking-wider">Standings</span>
        {/* <span className="text-[9px] font-bold text-sofa-blue cursor-pointer hover:underline">FULL TABLE</span> */}
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-sofa-border text-sofa-muted text-[10px] font-bold uppercase">
              <th className="px-4 py-2 w-10 text-center">#</th>
              <th className="px-2 py-2">Team</th>
              <th className="px-2 py-2 text-center">P</th>
              <th className="px-2 py-2 text-center hidden sm:table-cell">W</th>
              <th className="px-2 py-2 text-center hidden sm:table-cell">D</th>
              <th className="px-2 py-2 text-center hidden sm:table-cell">L</th>
              <th className="px-2 py-2 text-center hidden md:table-cell">G</th>
              <th className="px-2 py-2 text-center">+/-</th>
              <th className="px-4 py-2 text-center text-sofa-text font-black">PTS</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              const gd = team.stats.goalDifference;
              // SofaScore style position indicators
              let posColor = 'bg-transparent';
              if (index < 3) posColor = 'bg-sofa-blue'; // Champions League
              else if (index === 3) posColor = 'bg-sofa-success'; // Europa League
              else if (index >= teams.length - 3) posColor = 'bg-sofa-live'; // Relegation

              return (
                <tr key={team.id} className="hover:bg-slate-50 transition-colors border-b border-sofa-border last:border-b-0 group">
                  <td className="px-4 py-3 text-center relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${posColor}`} />
                    <span className="text-xs font-bold text-sofa-text">{index + 1}</span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-sofa-text truncate group-hover:text-sofa-blue transition-colors uppercase">{team.name}</span>
                      {team.playerName && (
                        <span className="text-[9px] text-sofa-muted truncate font-medium uppercase tracking-widest opacity-60">{team.playerName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-xs font-medium text-sofa-text">{team.stats.played}</td>
                  <td className="px-2 py-3 text-center text-xs text-sofa-muted hidden sm:table-cell">{team.stats.won}</td>
                  <td className="px-2 py-3 text-center text-xs text-sofa-muted hidden sm:table-cell">{team.stats.drawn}</td>
                  <td className="px-2 py-3 text-center text-xs text-sofa-muted hidden sm:table-cell">{team.stats.lost}</td>
                  <td className="px-2 py-3 text-center text-[10px] text-sofa-muted hidden md:table-cell tabular-nums">
                    {team.stats.goalsFor}:{team.stats.goalsAgainst}
                  </td>
                  <td className={`px-2 py-3 text-center text-xs font-bold ${gd > 0 ? 'text-sofa-success' : gd < 0 ? 'text-sofa-live' : 'text-sofa-muted'}`}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-black text-sm text-sofa-text">{team.stats.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {teams.length === 0 && (
        <div className="py-12 text-center bg-white">
          <p className="text-sofa-muted text-[10px] font-bold uppercase tracking-widest">No standings available</p>
        </div>
      )}
    </div>
  );
};
