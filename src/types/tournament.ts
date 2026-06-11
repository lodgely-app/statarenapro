export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string;
  themeColor?: string;
  ownerUid: string;
}

export interface Tournament {
  id: string;
  tenantId: string;
  name: string;
  type: 'league' | 'knockout' | 'group+knockout';
  status: 'upcoming' | 'active' | 'completed';
  createdAt: number;
  teams: Team[];
  matches: Match[];
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
}
