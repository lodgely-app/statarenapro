import React, { useMemo } from 'react';
import type { Match, Team, MatchEvent } from '@/types/tournament';
import { Target, User, AlertTriangle } from 'lucide-react';

interface TournamentStatsProps {
  matches: Match[];
  teams: Team[];
  settings?: {
    trackGoals?: boolean;
    trackYellowCards?: boolean;
    trackRedCards?: boolean;
  };
}

export const TournamentStats = ({ matches, teams, settings }: TournamentStatsProps) => {
  const stats = useMemo(() => {
    const goals: Record<string, { playerName: string; teamId: string; count: number }> = {};
    const assists: Record<string, { playerName: string; teamId: string; count: number }> = {};
    const yellowCards: Record<string, { playerName: string; teamId: string; count: number }> = {};
    const redCards: Record<string, { playerName: string; teamId: string; count: number }> = {};

    matches.forEach(match => {
      if (match.status === 'completed' && match.events) {
        match.events.forEach(event => {
          const key = `${event.playerName}-${event.teamId}`;
          const initPlayer = () => ({ playerName: event.playerName, teamId: event.teamId, count: 0 });

          if (event.type === 'goal') {
            if (!goals[key]) goals[key] = initPlayer();
            goals[key].count += 1;
            
            if (event.assistPlayerName) {
              const assistKey = `${event.assistPlayerName}-${event.teamId}`;
              if (!assists[assistKey]) assists[assistKey] = { playerName: event.assistPlayerName, teamId: event.teamId, count: 0 };
              assists[assistKey].count += 1;
            }
          } else if (event.type === 'yellow_card') {
            if (!yellowCards[key]) yellowCards[key] = initPlayer();
            yellowCards[key].count += 1;
          } else if (event.type === 'red_card') {
            if (!redCards[key]) redCards[key] = initPlayer();
            redCards[key].count += 1;
          }
        });
      }
    });

    const sortByCount = (obj: Record<string, any>) => Object.values(obj).sort((a: any, b: any) => b.count - a.count).slice(0, 10);

    return {
      goals: sortByCount(goals),
      assists: sortByCount(assists),
      yellowCards: sortByCount(yellowCards),
      redCards: sortByCount(redCards)
    };
  }, [matches]);

  const StatBoard = ({ title, data, icon: Icon, statKey }: { title: string, data: any[], icon: any, statKey: string }) => {
    if (data.length === 0) return null;
    
    return (
      <div className="bg-white rounded-2xl border border-sofa-border overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-3 border-b border-sofa-border flex items-center gap-2">
          <Icon className="w-4 h-4 text-sofa-blue" />
          <h3 className="text-xs font-black text-sofa-text uppercase tracking-widest">{title}</h3>
        </div>
        <div className="divide-y divide-sofa-border">
          {data.map((player, idx) => {
            const team = teams.find(t => t.id === player.teamId);
            return (
              <div key={idx} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-sofa-muted w-4 text-center">{idx + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-sofa-text">{player.playerName}</p>
                    <p className="text-[10px] font-bold text-sofa-muted uppercase tracking-widest">{team?.name}</p>
                  </div>
                </div>
                <div className="text-lg font-black text-sofa-blue">{player.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!settings || (!settings.trackGoals && !settings.trackYellowCards && !settings.trackRedCards)) {
    return (
      <div className="bg-white rounded-2xl border border-sofa-border py-20 text-center shadow-sm mt-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sofa-border">
          <User className="w-6 h-6 text-sofa-muted opacity-40" />
        </div>
        <p className="text-[10px] font-black uppercase text-sofa-muted tracking-widest">Player stats are disabled for this competition</p>
      </div>
    );
  }

  const hasAnyData = stats.goals.length > 0 || stats.assists.length > 0 || stats.yellowCards.length > 0 || stats.redCards.length > 0;

  if (!hasAnyData) {
    return (
      <div className="bg-white rounded-2xl border border-sofa-border py-20 text-center shadow-sm mt-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sofa-border">
          <User className="w-6 h-6 text-sofa-muted opacity-40" />
        </div>
        <p className="text-[10px] font-black uppercase text-sofa-muted tracking-widest">No stats recorded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {settings.trackGoals && <StatBoard title="Top Scorers" data={stats.goals} icon={Target} statKey="goals" />}
      {settings.trackGoals && <StatBoard title="Top Assists" data={stats.assists} icon={User} statKey="assists" />}
      {settings.trackYellowCards && <StatBoard title="Yellow Cards" data={stats.yellowCards} icon={AlertTriangle} statKey="yellow_cards" />}
      {settings.trackRedCards && <StatBoard title="Red Cards" data={stats.redCards} icon={AlertTriangle} statKey="red_cards" />}
    </div>
  );
};
