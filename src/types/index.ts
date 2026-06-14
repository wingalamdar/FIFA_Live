export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  flag: string;
  group: string;
  rank: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form: ('W' | 'D' | 'L')[];
  logo: string;
  coach: string;
  squad: Player[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  age: number;
  nationality: string;
  teamId: string;
  teamName: string;
  image: string;
  goals: number;
  assists: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  biography?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  date: string;
  time: string;
  venue: string;
  stage: string;
  group: string;
  round: string;
  minute?: number;
  possession?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  events?: MatchEvent[];
  lineups?: { home: string[]; away: string[] };
  commentary?: CommentaryEntry[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  team: 'home' | 'away';
  player: string;
  minute: number;
  assist?: string;
}

export interface CommentaryEntry {
  id: string;
  minute: number;
  text: string;
  type: 'goal' | 'card' | 'sub' | 'miss' | 'save' | 'normal';
}

export interface GroupStanding {
  group: string;
  teams: (Team & { qualificationProbability: number })[];
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  trending: boolean;
  views: number;
}

export interface Prediction {
  id: string;
  matchId: string;
  homeWinProb: number;
  awayWinProb: number;
  drawProb: number;
  predictedScore: { home: number; away: number };
  keyPlayers: { home: string[]; away: string[] };
  headToHead: { home: number; away: number; draws: number };
  fanVotes: { home: number; away: number; draw: number };
}
