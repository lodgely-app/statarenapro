import type { Team, Match, TeamStats } from '@/types/tournament';

export const generateLeagueFixtures = (teams: Team[], tournamentId: string): Match[] => {
  const matches: Match[] = [];
  const teamList = [...teams];
  if (teamList.length % 2 !== 0) {
    teamList.push({ 
      id: 'BYE', 
      name: 'BYE', 
      tenantId: '',
      tournamentId,
      stats: {} as any 
    });
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  // Generate First half of the season (Home)
  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < half; i++) {
      const homeIdx = (round + i) % (numTeams - 1);
      let awayIdx = (numTeams - 1 - i + round) % (numTeams - 1);

      if (i === 0) awayIdx = numTeams - 1;

      const homeTeam = teamList[homeIdx];
      const awayTeam = teamList[awayIdx];

      if (homeTeam.id !== 'BYE' && awayTeam.id !== 'BYE') {
        matches.push({
          id: `m-r${round + 1}-${i}`,
          homeTeamId: round % 2 === 0 ? homeTeam.id : awayTeam.id,
          awayTeamId: round % 2 === 0 ? awayTeam.id : homeTeam.id,
          homeScore: null,
          awayScore: null,
          status: 'scheduled',
          round: round + 1,
          tournamentId,
          tenantId: '',
          date: Date.now()
        });
      }
    }
  }

  // Generate Second half of the season (Away) - Optional, but common in leagues
  const totalMatches = matches.length;
  for (let i = 0; i < totalMatches; i++) {
    const originalMatch = matches[i];
    matches.push({
      ...originalMatch,
      id: `${originalMatch.id}-return`,
      homeTeamId: originalMatch.awayTeamId,
      awayTeamId: originalMatch.homeTeamId,
      round: (originalMatch.round || 1) + numRounds
    });
  }

  return matches;
};

export const calculateStandings = (teams: Team[], matches: Match[]): Team[] => {
  const statsMap: Record<string, TeamStats> = {};

  teams.forEach(team => {
    statsMap[team.id] = {
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
    };
  });

  matches.filter(m => m.status === 'completed').forEach(match => {
    const homeStats = statsMap[match.homeTeamId];
    const awayStats = statsMap[match.awayTeamId];
    if (!homeStats || !awayStats) return;

    homeStats.played++;
    awayStats.played++;
    const hScore = match.homeScore || 0;
    const aScore = match.awayScore || 0;
    homeStats.goalsFor += hScore;
    homeStats.goalsAgainst += aScore;
    awayStats.goalsFor += aScore;
    awayStats.goalsAgainst += hScore;

    if (hScore > aScore) {
      homeStats.won++; homeStats.points += 3; awayStats.lost++;
    } else if (hScore < aScore) {
      awayStats.won++; awayStats.points += 3; homeStats.lost++;
    } else {
      homeStats.drawn++; homeStats.points += 1; awayStats.drawn++; awayStats.points += 1;
    }
    homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
    awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
  });

  return [...teams].map(team => ({
    ...team,
    stats: statsMap[team.id]
  })).sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    if (b.stats.goalDifference !== a.stats.goalDifference) return b.stats.goalDifference - a.stats.goalDifference;
    if (b.stats.goalsFor !== a.stats.goalsFor) return b.stats.goalsFor - a.stats.goalsFor;
    return a.name.localeCompare(b.name);
  });
};

export const generateCupBracket = (teams: Team[], tournamentId: string): Match[] => {
  const matches: Match[] = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  
  // Power of 2 logic for rounds
  const numTeams = shuffled.length;
  const numRounds = Math.ceil(Math.log2(numTeams));
  const totalSlots = Math.pow(2, numRounds);
  const byes = totalSlots - numTeams;

  // Round 1
  let teamIdx = 0;
  for (let i = 0; i < totalSlots; i += 2) {
    const homeTeam = shuffled[teamIdx++];
    let awayTeam = (i + 1 < totalSlots - byes) ? shuffled[teamIdx++] : null;

    matches.push({
      id: `cup-r1-${i}`,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam ? awayTeam.id : 'BYE',
      homeScore: awayTeam ? null : 1, // Auto-win for BYE
      awayScore: awayTeam ? null : 0,
      status: awayTeam ? 'scheduled' : 'completed',
      round: 1,
      tournamentId,
      tenantId: '',
      date: Date.now()
    });
  }

  // Generate TBD matches for future rounds
  let currentRoundMatches = totalSlots / 2;
  for (let r = 2; r <= numRounds; r++) {
    currentRoundMatches /= 2;
    for (let i = 0; i < currentRoundMatches; i++) {
      matches.push({
        id: `cup-r${r}-${i}`,
        homeTeamId: 'TBD',
        awayTeamId: 'TBD',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
        round: r,
        tournamentId,
        tenantId: '',
        date: Date.now()
      });
    }
  }

  return matches;
};
