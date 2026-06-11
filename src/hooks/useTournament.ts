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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      // Auto-select active tournament
      if (!activeId && loaded.length > 0) {
        const firstActive = loaded.find(t => t.status === 'active');
        setActiveId(firstActive ? firstActive.id : loaded[0].id);
      }
      setLoading(false);
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
      if (completedMatch) {
        const winnerId = (completedMatch.homeScore || 0) > (completedMatch.awayScore || 0) 
          ? completedMatch.homeTeamId 
          : completedMatch.awayTeamId;
        
        const nextRound = (completedMatch.round || 1) + 1;
        const matchIndexInRound = t.matches.filter(m => m.round === completedMatch.round).findIndex(m => m.id === matchId);
        const nextMatchIndex = Math.floor(matchIndexInRound / 2);
        const isHomeInNext = matchIndexInRound % 2 === 0;

        const nextMatchId = `cup-r${nextRound}-${nextMatchIndex}`;
        
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

    const newTeams = (t.type === 'league' || t.type === 'group+knockout') ? calculateStandings(t.teams, newMatches) : t.teams;
    
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
