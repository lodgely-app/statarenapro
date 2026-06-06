export interface PresetTeam {
  name: string;
  league: string;
}

export const PRESET_TEAMS: Record<string, string[]> = {
  "Premier League": [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
    "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
    "Leicester City", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
    "West Ham United", "Wolverhampton Wanderers"
  ],
  "La Liga": [
    "Alavés", "Athletic Bilbao", "Atlético Madrid", "Barcelona", "Celta Vigo",
    "Espanyol", "Getafe", "Girona", "Leganés", "Mallorca", "Osasuna",
    "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla",
    "Valencia", "Valladolid", "Villarreal", "Las Palmas"
  ],
  "Bundesliga": [
    "Augsburg", "Bayer Leverkusen", "Bayern Munich", "Bochum", "Borussia Dortmund",
    "Eintracht Frankfurt", "Freiburg", "Heidenheim", "Hoffenheim", "Holstein Kiel",
    "Mainz 05", "Borussia Mönchengladbach", "RB Leipzig", "St. Pauli", "Stuttgart",
    "Union Berlin", "Werder Bremen", "Wolfsburg"
  ],
  "Serie A": [
    "Atalanta", "Bologna", "Cagliari", "Como", "Empoli", "Fiorentina", "Genoa",
    "Hellas Verona", "Inter Milan", "Juventus", "Lazio", "Lecce", "AC Milan",
    "Monza", "Napoli", "Parma", "Roma", "Torino", "Udinese", "Venezia"
  ],
  "Ligue 1": [
    "Angers", "Auxerre", "Brest", "Le Havre", "Lens", "Lille", "Lyon", "Marseille",
    "Monaco", "Montpellier", "Nantes", "Nice", "Paris Saint-Germain", "Reims",
    "Rennes", "Saint-Étienne", "Strasbourg", "Toulouse"
  ]
};
