export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string;
  themeColor?: string;
  ownerUid: string;
}

export interface TournamentSettings {
  trackGoals?: boolean;
  trackYellowCards?: boolean;
  trackRedCards?: boolean;
}

export interface Tournament {
  id: string;
  tenantId: string;
  name: string;
  type: 'league' | 'knockout' | 'group+knockout' | 'infinite_league';
  status: 'upcoming' | 'active' | 'completed';
  createdAt: number;
  teams: Team[];
  matches: Match[];
  settings?: TournamentSettings;
}

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Team {
  id: string;
  tenantId: string;
  tournamentId: string;
  name: string;
  playerName?: string;
  logoUrl?: string;
  stats: TeamStats;
  groupId?: string;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card';
  playerName: string;
  teamId: string;
  minute: string;
  assistPlayerName?: string;
}

export interface Match {
  id: string;
  tenantId: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: 'scheduled' | 'live' | 'completed';
  date: number | null;
  round?: number;
  groupId?: string;
  isKnockout?: boolean;
  events?: MatchEvent[];
}
