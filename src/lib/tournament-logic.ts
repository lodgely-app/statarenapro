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
          date: null
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

export const appendInfiniteLeagueSeason = (teams: Team[], existingMatches: Match[], tournamentId: string): Match[] => {
  // Find the highest round currently in existence
  const maxRound = existingMatches.reduce((max, m) => Math.max(max, m.round || 0), 0);
  
  // A season generation ID to ensure match IDs are unique across seasons
  const seasonId = Date.now().toString(36).substring(3, 8);

  // Generate a fresh league season
  const newMatches = generateLeagueFixtures(teams, tournamentId);

  // Offset the rounds and make IDs unique
  return newMatches.map(m => ({
    ...m,
    id: `${m.id}-s${seasonId}`,
    round: (m.round || 1) + maxRound
  }));
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
  let matchIdx = 0; // sequential id counter, independent of the team-pair-walking `i`
  for (let i = 0; i < totalSlots; i += 2) {
    const homeTeam = shuffled[teamIdx++];
    let awayTeam = (i + 1 < totalSlots - byes) ? shuffled[teamIdx++] : null;

    matches.push({
      id: `cup-r1-${matchIdx}`,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam ? awayTeam.id : 'BYE',
      homeScore: awayTeam ? null : 1, // Auto-win for BYE
      awayScore: awayTeam ? null : 0,
      status: awayTeam ? 'scheduled' : 'completed',
      round: 1,
      tournamentId,
      tenantId: '',
      date: null
    });
    matchIdx++;
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
        date: null
      });
    }
  }

  return matches;
};

/**
 * Given a knockout match id of the form `cup-r{round}-{index}`, returns the id
 * of the match one round later that its winner feeds into, and whether the
 * winner lands in the home or away slot there. Single source of truth for
 * bracket advancement, used both incrementally (updateMatchScore) and in bulk
 * (rebuildKnockoutBracket).
 */
export const getNextSlot = (matchId: string): { nextMatchId: string; isHome: boolean } | null => {
  const m = matchId.match(/^cup-r(\d+)-(\d+)$/);
  if (!m) return null;
  const round = parseInt(m[1]);
  const idx = parseInt(m[2]);
  return {
    nextMatchId: `cup-r${round + 1}-${Math.floor(idx / 2)}`,
    isHome: idx % 2 === 0
  };
};

/**
 * Recomputes a pure knockout bracket's match ids and downstream slots from
 * scratch. Renumbers round 1 ids to a contiguous 0..n-1 sequence using the
 * existing array order (the source of truth for pairing intent), then
 * replays completed winners forward via getNextSlot. Idempotent and safe to
 * run on already-correct data (changed will be false).
 */
export const rebuildKnockoutBracket = (
  matches: Match[]
): { matches: Match[]; changed: boolean; flagged: string[] } => {
  const rounds = Array.from(new Set(matches.map(m => m.round ?? 0))).sort((a, b) => a - b);
  if (rounds.length === 0) return { matches, changed: false, flagged: [] };

  const firstRound = rounds[0];
  const round1Original = matches.filter(m => m.round === firstRound && /^cup-r\d+-\d+$/.test(m.id));
  if (round1Original.length === 0) return { matches, changed: false, flagged: [] };

  // Renumber round 1 ids sequentially using existing array order — never
  // reshuffles teams or touches any other field on round 1 matches.
  const idRemap = new Map<string, string>();
  round1Original.forEach((m, idx) => {
    const newId = `cup-r${firstRound}-${idx}`;
    if (newId !== m.id) idRemap.set(m.id, newId);
  });

  let working = matches.map(m => (idRemap.has(m.id) ? { ...m, id: idRemap.get(m.id)! } : { ...m }));

  const flagged: string[] = [];
  for (let ri = 0; ri < rounds.length - 1; ri++) {
    const thisRound = working.filter(m => m.round === rounds[ri]);
    thisRound.forEach(m => {
      if (m.status !== 'completed' || m.homeScore == null || m.awayScore == null) return;
      const winnerId = (m.homeScore || 0) > (m.awayScore || 0) ? m.homeTeamId : m.awayTeamId;

      const slot = getNextSlot(m.id);
      if (!slot) return;
      const nextIdx = working.findIndex(nm => nm.id === slot.nextMatchId);
      if (nextIdx === -1) return;

      const next = working[nextIdx];
      const currentVal = slot.isHome ? next.homeTeamId : next.awayTeamId;
      if (currentVal === winnerId) return;

      if (currentVal !== 'TBD' && next.status === 'completed') {
        // Downstream match already has a recorded score against what is now a
        // different team post-repair — do not silently overwrite; flag for review.
        flagged.push(next.id);
        return;
      }

      working[nextIdx] = slot.isHome
        ? { ...next, homeTeamId: winnerId }
        : { ...next, awayTeamId: winnerId };
    });
  }

  const changed = JSON.stringify(working) !== JSON.stringify(matches);
  return { matches: working, changed, flagged };
};

export const generateGroupKnockout = (teams: Team[], tournamentId: string): { matches: Match[], teams: Team[] } => {
  const matches: Match[] = [];
  const updatedTeams = [...teams];
  
  // Shuffle teams for random draw
  const shuffled = [...updatedTeams].sort(() => Math.random() - 0.5);
  
  // 1. Assign Groups (4 teams per group)
  const numGroups = Math.max(1, Math.floor(shuffled.length / 4));
  const groupNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  for (let i = 0; i < numGroups; i++) {
    const groupId = groupNames[i];
    const groupTeams = shuffled.slice(i * 4, (i + 1) * 4);
    
    // Assign groupId to teams
    groupTeams.forEach(t => {
      const teamIdx = updatedTeams.findIndex(ut => ut.id === t.id);
      if (teamIdx > -1) {
        updatedTeams[teamIdx].groupId = groupId;
      }
    });
    
    // Generate Round Robin for this group (up to 4 teams)
    if (groupTeams.length === 4) {
      const matchPairs = [
        [groupTeams[0], groupTeams[3], 1],
        [groupTeams[1], groupTeams[2], 1],
        [groupTeams[0], groupTeams[2], 2],
        [groupTeams[3], groupTeams[1], 2],
        [groupTeams[0], groupTeams[1], 3],
        [groupTeams[2], groupTeams[3], 3],
      ];
      
      matchPairs.forEach(([home, away, round], idx) => {
        if (home && away) {
          matches.push({
            id: `grp-${groupId}-r${round}-${idx}`,
            homeTeamId: (home as Team).id,
            awayTeamId: (away as Team).id,
            homeScore: null,
            awayScore: null,
            status: 'scheduled',
            round: round as number,
            groupId,
            isKnockout: false,
            tournamentId,
            tenantId: '',
            date: null
          });
        }
      });
    }
  }
  
  // 2. Generate Knockout Stage (Top 2 from each group advance)
  const numQualifiers = numGroups * 2;
  const numRounds = Math.ceil(Math.log2(numQualifiers));
  
  // Generate TBD matches for Knockout
  let knockoutMatches = numQualifiers / 2;
  for (let r = 1; r <= numRounds; r++) {
    for (let i = 0; i < knockoutMatches; i++) {
      const knockoutRound = r + 3; // Knockout rounds start after group stage (which is 3 rounds)
      matches.push({
        id: `cup-r${knockoutRound}-${i}`,
        homeTeamId: 'TBD',
        awayTeamId: 'TBD',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
        round: knockoutRound,
        isKnockout: true,
        tournamentId,
        tenantId: '',
        date: null
      });
    }
    knockoutMatches /= 2;
  }
  
  return { matches, teams: updatedTeams };
};
