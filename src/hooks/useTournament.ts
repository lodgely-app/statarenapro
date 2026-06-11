import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import type { Tournament, Team, Match } from '@/types/tournament';
import { calculateStandings } from '@/lib/tournament-logic';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';

export const useTournament = () => {
  const { tenantId } = useTenant();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(() => {
    return localStorage.getItem('statarena_active_tournament_id') || null;
  });
  const [loading, setLoading] = useState(true);

  const setActiveId = (id: string | null) => {
    setActiveIdState(id);
    if (id) {
      localStorage.setItem('statarena_active_tournament_id', id);
    } else {
      localStorage.removeItem('statarena_active_tournament_id');
    }
  };

  // Sync with Firestore
  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'tournaments'), 
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Tournament[];
      
      setTournaments(loaded);
      
      // Auto-select active tournament if none is explicitly saved
      if (!activeId && loaded.length > 0) {
        const firstActive = loaded.find(t => t.status === 'active');
        setActiveId(firstActive ? firstActive.id : loaded[0].id);
      } else if (activeId && !loaded.some(t => t.id === activeId)) {
        // If saved ID no longer exists, select first available
        if (loaded.length > 0) {
          const firstActive = loaded.find(t => t.status === 'active');
          setActiveId(firstActive ? firstActive.id : loaded[0].id);
        } else {
          setActiveId(null);
        }
      }
      setLoading(false);
      
      // Auto-populate any completed group stages that are missing knockout data
      loaded.forEach(t => {
        if (t.type === 'group+knockout') {
          const groupTeams = t.teams.filter(team => team.groupId);
          const allCompleted = groupTeams.length > 0 && groupTeams.every(team => {
            const teamsInThisGroup = groupTeams.filter(gt => gt.groupId === team.groupId).length;
            return team.stats.played >= (teamsInThisGroup - 1);
          });
          
          if (allCompleted) {
            const firstKnockoutRoundMatches = t.matches.filter(m => m.isKnockout && m.round === 4);
            const isPopulated = firstKnockoutRoundMatches.some(m => m.homeTeamId !== 'TBD' || m.awayTeamId !== 'TBD');
            
            if (!isPopulated && firstKnockoutRoundMatches.length > 0) {
              // We need to auto populate it in the database
              const newMatches = [...t.matches];
              const groups = Array.from(new Set(t.teams.map(team => team.groupId).filter(Boolean))).sort();
              const top2ByGroup: Record<string, any[]> = {};
              
              groups.forEach(gId => {
                const sorted = t.teams
                  .filter(team => team.groupId === gId)
                  .sort((a, b) => (b.stats.points - a.stats.points) || (b.stats.goalDifference - a.stats.goalDifference) || (b.stats.goalsFor - a.stats.goalsFor));
                top2ByGroup[gId as string] = sorted.slice(0, 2);
              });
              
              let matchIdx = 0;
              for (let i = 0; i < groups.length; i += 2) {
                const groupA = groups[i] as string;
                const groupB = groups[i + 1] as string;
                
                if (groupB) {
                  const m1 = firstKnockoutRoundMatches[matchIdx++];
                  if (m1) {
                    m1.homeTeamId = top2ByGroup[groupA]?.[0]?.id || 'TBD';
                    m1.awayTeamId = top2ByGroup[groupB]?.[1]?.id || 'TBD';
                  }
                  const m2 = firstKnockoutRoundMatches[matchIdx++];
                  if (m2) {
                    m2.homeTeamId = top2ByGroup[groupB]?.[0]?.id || 'TBD';
                    m2.awayTeamId = top2ByGroup[groupA]?.[1]?.id || 'TBD';
                  }
                }
              }
              
              firstKnockoutRoundMatches.forEach(modifiedMatch => {
                const idx = newMatches.findIndex(m => m.id === modifiedMatch.id);
                if (idx !== -1) newMatches[idx] = modifiedMatch;
              });
              
              updateDoc(doc(db, 'tournaments', t.id), { matches: newMatches }).catch(console.error);
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [activeId, tenantId]);

  const createTournament = async (name: string, type: 'league' | 'knockout' | 'group+knockout', teams: Team[], fixtures: Match[]) => {
    if (!tenantId) return;
    const id = `tourney-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Assign proper IDs to teams and matches so they aren't blank
    const finalTeams = teams.map(t => ({
      ...t,
      tenantId,
      tournamentId: id
    }));
    
    const finalFixtures = fixtures.map(f => ({
      ...f,
      tenantId,
      tournamentId: id
    }));

    const newTournament: Tournament = {
      id,
      tenantId,
      name,
      type,
      teams: finalTeams,
      matches: finalFixtures,
      status: 'active',
      createdAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'tournaments', id), newTournament);
      setActiveId(id);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  const updateMatchScore = async (matchId: string, homeScore: number | null, awayScore: number | null) => {
    if (!activeId) return;

    const t = tournaments.find(tourney => tourney.id === activeId);
    if (!t) return;

    const isCompleted = homeScore !== null && awayScore !== null;

    let newMatches = t.matches.map(m => 
      m.id === matchId ? { ...m, homeScore, awayScore, status: (isCompleted ? 'completed' : m.date !== null ? 'scheduled' : 'pending') as 'completed' | 'scheduled' | 'live' } : m
    );
    
    // If it's a Cup/Knockout, progress the winner
    if (t.type === 'knockout' || matchId.startsWith('cup-')) {
      const completedMatch = newMatches.find(m => m.id === matchId);
      if (completedMatch && isCompleted) {
        const winnerId = (completedMatch.homeScore || 0) > (completedMatch.awayScore || 0) 
          ? completedMatch.homeTeamId 
          : completedMatch.awayTeamId;
        
        // Parse id to find next round robustly (handles both old and new tournament formats)
        const matchRegex = /^cup-r(\d+)-(\d+)$/;
        const matchStr = completedMatch.id.match(matchRegex);
        
        if (matchStr) {
          const currentR = parseInt(matchStr[1]);
          const currentI = parseInt(matchStr[2]);
          
          const nextRoundId = currentR + 1;
          const nextMatchIndex = Math.floor(currentI / 2);
          const isHomeInNext = currentI % 2 === 0;
  
          const nextMatchId = `cup-r${nextRoundId}-${nextMatchIndex}`;
          
          newMatches = newMatches.map(m => {
            if (m.id === nextMatchId) {
              return isHomeInNext 
                ? { ...m, homeTeamId: winnerId } 
                : { ...m, awayTeamId: winnerId };
            }
            return m;
          });
        }
      }
    }

    const newTeams = (t.type === 'league' || t.type === 'group+knockout') ? calculateStandings(t.teams, newMatches) : t.teams;
    
    // Auto-populate knockout stage for group+knockout if all group matches are done
    if (t.type === 'group+knockout') {
      const groupTeams = newTeams.filter(t => t.groupId);
      const allCompleted = groupTeams.length > 0 && groupTeams.every(t => {
        const teamsInThisGroup = groupTeams.filter(gt => gt.groupId === t.groupId).length;
        return t.stats.played >= (teamsInThisGroup - 1);
      });
      
      if (allCompleted) {
        const firstKnockoutRoundMatches = newMatches.filter(m => m.isKnockout && m.round === 4);
        const isPopulated = firstKnockoutRoundMatches.some(m => m.homeTeamId !== 'TBD' || m.awayTeamId !== 'TBD');

        if (!isPopulated && firstKnockoutRoundMatches.length > 0) {
          const groups = Array.from(new Set(newTeams.map(team => team.groupId).filter(Boolean))).sort();
          const top2ByGroup: Record<string, any[]> = {};
          
          groups.forEach(gId => {
            const sorted = newTeams
              .filter(team => team.groupId === gId)
              .sort((a, b) => (b.stats.points - a.stats.points) || (b.stats.goalDifference - a.stats.goalDifference) || (b.stats.goalsFor - a.stats.goalsFor));
            top2ByGroup[gId as string] = sorted.slice(0, 2);
          });
          
          let matchIdx = 0;
          for (let i = 0; i < groups.length; i += 2) {
            const groupA = groups[i] as string;
            const groupB = groups[i + 1] as string;
            
            if (groupB) {
              const m1 = firstKnockoutRoundMatches[matchIdx++];
              if (m1) {
                m1.homeTeamId = top2ByGroup[groupA]?.[0]?.id || 'TBD';
                m1.awayTeamId = top2ByGroup[groupB]?.[1]?.id || 'TBD';
              }
              const m2 = firstKnockoutRoundMatches[matchIdx++];
              if (m2) {
                m2.homeTeamId = top2ByGroup[groupB]?.[0]?.id || 'TBD';
                m2.awayTeamId = top2ByGroup[groupA]?.[1]?.id || 'TBD';
              }
            } else {
              // Odd number of groups, place winner/runner-up of this group
              const m1 = firstKnockoutRoundMatches[matchIdx++];
              if (m1) {
                m1.homeTeamId = top2ByGroup[groupA]?.[0]?.id || 'TBD';
                m1.awayTeamId = 'TBD';
              }
              const m2 = firstKnockoutRoundMatches[matchIdx++];
              if (m2) {
                m2.homeTeamId = 'TBD';
                m2.awayTeamId = top2ByGroup[groupA]?.[1]?.id || 'TBD';
              }
            }
          }
          
          firstKnockoutRoundMatches.forEach(modifiedMatch => {
            const idx = newMatches.findIndex(m => m.id === modifiedMatch.id);
            if (idx !== -1) newMatches[idx] = modifiedMatch;
          });
        }
      }
    }
    
    try {
      await updateDoc(doc(db, 'tournaments', activeId), {
        matches: newMatches,
        teams: newTeams
      });
    } catch (error) {
      console.error("Error updating match score:", error);
    }
  };

  const updateMatchDate = async (matchId: string, timestamp: number) => {
    if (!activeId) return;
    const t = tournaments.find(tourney => tourney.id === activeId);
    if (!t) return;
    const newMatches = t.matches.map(m => m.id === matchId ? { ...m, date: timestamp } : m);
    try {
      await updateDoc(doc(db, 'tournaments', activeId), { matches: newMatches });
    } catch (error) {
      console.error("Error updating match date:", error);
    }
  };

  const updateTournamentMatches = async (matches: Match[]) => {
    if (!activeId) return;
    try {
      await updateDoc(doc(db, 'tournaments', activeId), { matches });
    } catch (error) {
      console.error("Error updating matches:", error);
    }
  };

  const addManualMatch = async (match: Match) => {
    if (!activeId) return;
    const t = tournaments.find(tourney => tourney.id === activeId);
    if (!t) return;

    try {
      await updateDoc(doc(db, 'tournaments', activeId), {
        matches: [...t.matches, match]
      });
    } catch (error) {
      console.error("Error adding manual match:", error);
    }
  };

  const endTournament = async (id: string) => {
    try {
      await updateDoc(doc(db, 'tournaments', id), {
        status: 'ended'
      });
    } catch (error) {
      console.error("Error ending tournament:", error);
    }
  };

  const deleteTournament = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tournaments', id));
      if (activeId === id) {
        setActiveId(null);
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  const activeTournament = tournaments.find(t => t.id === activeId) || null;

  return {
    tournaments,
    activeTournament,
    setActiveId,
    createTournament,
    updateMatchScore,
    updateMatchDate,
    updateTournamentMatches,
    addManualMatch,
    endTournament,
    deleteTournament,
    loading
  };
};
