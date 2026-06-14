import type { Team, Match, GroupStanding } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://worldcup26.ir";

interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
  iso2: string;
  flag: string;
  groups: string;
}

interface ApiGroup {
  name: string;
  teams: {
    team_id: string;
    mp: string;
    w: string;
    l: string;
    d: string;
    pts: string;
    gf: string;
    ga: string;
    gd: string;
  }[];
}

interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_team_name_en: string;
  away_team_name_en: string;
  home_team_name_fa?: string;
  away_team_name_fa?: string;
  group: string;
  type: string;
  local_date: string;
  finished: string;
  time_elapsed: string;
  stadium_id: string;
  home_scorers: string | null;
  away_scorers: string | null;
  matchday: string;
  home_team_label?: string;
  away_team_label?: string;
}

let teamsCache: any[] | null = null;

const flagEmojiMap: Record<string, string> = {
  MX: "🇲🇽", ZA: "🇿🇦", KR: "🇰🇷", CZ: "🇨🇿", CA: "🇨🇦", BA: "🇧🇦",
  QA: "🇶🇦", CH: "🇨🇭", BR: "🇧🇷", MA: "🇲🇦", HT: "🇭🇹", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  US: "🇺🇸", PY: "🇵🇾", AU: "🇦🇺", TR: "🇹🇷", DE: "🇩🇪", CW: "🇨🇼",
  CI: "🇨🇮", EC: "🇪🇨", NL: "🇳🇱", JP: "🇯🇵", SE: "🇸🇪", TN: "🇹🇳",
  BE: "🇧🇪", EG: "🇪🇬", IR: "🇮🇷", NZ: "🇳🇿", ES: "🇪🇸", CV: "🇨🇻",
  SA: "🇸🇦", UY: "🇺🇾", FR: "🇫🇷", SN: "🇸🇳", IQ: "🇮🇶", NO: "🇳🇴",
  AR: "🇦🇷", DZ: "🇩🇿", AT: "🇦🇹", JO: "🇯🇴", PT: "🇵🇹", CD: "🇨🇩",
  UZ: "🇺🇿", CO: "🇨🇴", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", HR: "🇭🇷", GH: "🇬🇭", PA: "🇵🇦",
};

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export async function getTeams(): Promise<Team[]> {
  try {
    const data = await fetchAPI<{ teams: ApiTeam[] }>("/get/teams");
    teamsCache = data.teams;
    return data.teams.map((t) => ({
      id: t.id,
      name: t.name_en,
      shortName: t.fifa_code,
      code: t.iso2,
      flag: flagEmojiMap[t.iso2] || "🏳️",
      group: t.groups,
      rank: parseInt(t.id),
      logo: t.flag,
      points: 0, played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
      form: ["W", "D", "L"] as ("W" | "D" | "L")[],
      coach: "TBD",
      squad: [] as any[],
    })) as Team[];
  } catch {
    const { teams } = await import("./mockData");
    return teams;
  }
}

export async function getTeamById(id: string) {
  const teams = await getTeams();
  return teams.find((t) => t.id === id) || undefined;
}

export async function getStandings(): Promise<GroupStanding[]> {
  try {
    const [groupsData, teams] = await Promise.all([
      fetchAPI<{ groups: ApiGroup[] }>("/get/groups"),
      getTeams(),
    ]);

    return groupsData.groups.map((g) => ({
      group: g.name,
      teams: g.teams.map((gt) => {
        const team = teams.find((t) => t.id === gt.team_id);
        const teamBase = {
          id: gt.team_id,
          name: team?.name || gt.team_id,
          shortName: team?.shortName || gt.team_id,
          code: team?.code || "",
          flag: team?.flag || "🏳️",
          group: g.name,
          rank: team?.rank || 0,
          logo: team?.logo || "",
          points: parseInt(gt.pts) || 0,
          played: parseInt(gt.mp) || 0,
          wins: parseInt(gt.w) || 0,
          draws: parseInt(gt.d) || 0,
          losses: parseInt(gt.l) || 0,
          goalsFor: parseInt(gt.gf) || 0,
          goalsAgainst: parseInt(gt.ga) || 0,
          goalDiff: parseInt(gt.gd) || 0,
          form: [] as ("W" | "D" | "L")[],
          coach: "",
          squad: [] as any[],
          qualificationProbability: parseInt(gt.pts) > 0 ? Math.min(parseInt(gt.pts) * 25, 95) : 15,
        };
        return teamBase as GroupStanding["teams"][number];
      }),
    }));
  } catch {
    const { standings } = await import("./mockData");
    return standings;
  }
}

export async function getMatches(): Promise<Match[]> {
  try {
    const data = await fetchAPI<{ games: ApiGame[] }>("/get/games");
  const teams = await getTeams();

  const getTeam = (id: string) => {
    if (id === "0" || !id) return null;
    return teams.find((t) => t.id === id) || null;
  };

  const stageMap: Record<string, string> = {
    group: "Group Stage",
    r32: "Round of 32",
    r16: "Round of 16",
    qf: "Quarter-final",
    sf: "Semi-final",
    third: "Third Place",
    final: "Final",
  };

  const roundNames: Record<string, string> = {
    R32: "Round of 32",
    R16: "Round of 16",
    QF: "Quarter-finals",
    SF: "Semi-finals",
    "3RD": "Third Place",
    FINAL: "Final",
  };

  return data.games.map((g) => {
    const homeTeam = getTeam(g.home_team_id);
    const awayTeam = getTeam(g.away_team_id);
    const isFinished = g.finished === "TRUE";
    const isLive = g.time_elapsed !== "notstarted" && !isFinished;
    const isScheduled = g.time_elapsed === "notstarted" && !isFinished;

    const [datePart] = g.local_date.split(" ");
    const [month, day, year] = datePart.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const match = {
      id: g.id,
      homeTeam: homeTeam || {
        id: g.home_team_id,
        name: g.home_team_label || "TBD",
        shortName: g.home_team_label || "TBD",
        code: "",
        flag: "🏳️",
        group: g.group,
        rank: 0,
        points: 0, played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
        form: [] as ("W" | "D" | "L")[],
        logo: "",
        coach: "",
        squad: [] as any[],
      },
      awayTeam: awayTeam || {
        id: g.away_team_id,
        name: g.away_team_label || "TBD",
        shortName: g.away_team_label || "TBD",
        code: "",
        flag: "🏳️",
        group: g.group,
        rank: 0,
        points: 0, played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
        form: [] as ("W" | "D" | "L")[],
        logo: "",
        coach: "",
        squad: [] as any[],
      },
      homeScore: isFinished || isLive ? parseInt(g.home_score) || 0 : null,
      awayScore: isFinished || isLive ? parseInt(g.away_score) || 0 : null,
      status: (isLive ? "live" : isFinished ? "finished" : "scheduled") as Match["status"],
      date: formattedDate,
      time: g.local_date.split(" ")[1] || "00:00",
      venue: "",
      stage: stageMap[g.type] || "Group Stage",
      group: g.group.startsWith("R") || g.group === "FINAL" || g.group === "3RD" || g.group === "SF" || g.group === "QF" ? "KO" : g.group,
      round: roundNames[g.group] || "",
    } as Match;
    return match;
  });
  } catch {
    const { matches } = await import("./mockData");
    return matches;
  }
}

export async function getLiveMatches() {
  const all = await getMatches();
  return all.filter((m) => m.status === "live");
}

export async function getTodayMatches() {
  const all = await getMatches();
  const today = new Date().toISOString().split("T")[0];
  return all.filter((m) => m.date === today);
}

export async function getUpcomingMatches() {
  const all = await getMatches();
  return all.filter((m) => m.status === "scheduled").slice(0, 10);
}

export async function getMatchById(id: string) {
  const all = await getMatches();
  return all.find((m) => m.id === id) || undefined;
}

export async function getMatchesByTeam(teamId: string) {
  const all = await getMatches();
  return all.filter((m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
}

export async function getPlayers() {
  const { players } = await import("./mockData");
  return players;
}

export async function getPlayerById(id: string) {
  const { players } = await import("./mockData");
  return players.find((p) => p.id === id) || undefined;
}

export async function getNews() {
  const { news } = await import("./mockData");
  return news;
}

export async function getNewsBySlug(slug: string) {
  const { news } = await import("./mockData");
  return news.find((a) => a.slug === slug) || undefined;
}

export async function getPredictions() {
  const { predictions } = await import("./mockData");
  return predictions;
}

export async function getPredictionByMatch(matchId: string) {
  const { predictions } = await import("./mockData");
  return predictions.find((p) => p.matchId === matchId) || null;
}

export async function getTopScorers() {
  const { players } = await import("./mockData");
  return [...players].sort((a, b) => b.goals - a.goals).slice(0, 10);
}

export async function getTrendingNews() {
  const { news } = await import("./mockData");
  return news.filter((a) => a.trending).slice(0, 5);
}
