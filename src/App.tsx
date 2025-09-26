import React, { useEffect, useMemo, useState } from "react";

<<<<<<< HEAD
// ===================== Types =====================
=======
// ===================================================================================
//  TYPES
// ===================================================================================
>>>>>>> 2e59d3d (Initial commit)
type Player = { id: string; name: string };
type Mode = "1v1" | "2v2";

type Match = {
  id: string;
  dateISO: string;
  mode: Mode;
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  goalsA: number;
  goalsB: number;
  enteredBy: string;
<<<<<<< HEAD
};

type Session = {
  id: string;
  title: string;
  startedAtISO: string;
  bestOf: 3 | 5 | 7 | 9;
  kings: string[]; // 0–2 player ids
  kingEnteredBy?: string;
};

type ThemeKey = "FCB" | "BVB" | "FALCO";
=======
  sessionId?: string;
};

type KingSession = {
  id: string;
  dateISO: string;
  kings: string[];
  bestOf: number;
  mode: Mode;
  kingEnteredBy?: string;
};

type ViolationType =
  | "unerlaubt_pausiert"
  | "durch_den_bildschirm_gelaufen"
  | "koenigstitel_nicht_erwaehnt"
  | "kein_getraenk_erhalten"
  | "sonderrecht_des_hauens_ignoriert"
  | "sonstiges";

type Violation = {
    id: string;
    dateISO: string;
    playerId: string;
    type: ViolationType;
    comment: string;
    enteredBy: string;
};

type SessionTeam = {
    id: string;
    name: string;
    players: string[];
}

type ActiveSessionMatch = {
    id: string;
    teamA: SessionTeam;
    teamB: SessionTeam;
    goalsA: number | null;
    goalsB: number | null;
};

type ActiveSession = {
    teams: SessionTeam[];
    schedule: ActiveSessionMatch[];
    bestOf: number;
    mode: Mode;
};
>>>>>>> 2e59d3d (Initial commit)

type DB = {
  theme: ThemeKey;
  players: Player[];
  matches: Match[];
<<<<<<< HEAD
  sessions: Session[];
};

// ===================== Constants & Utils =====================
const STORAGE_KEY = "fifa-king-tracker-final-1";

const THEMES: Record<
  ThemeKey,
  { name: string; classes: string; wmText: string; wmImage?: string; wmOpacity?: number }
> = {
  FCB: {
    name: "FC Bayern",
    classes:
      "[--bg:254,242,242] [--paper:255,255,255] [--text:15,23,42] [--accent:220,38,38] [--accent2:37,99,235] [--muted:100,116,139]",
    wmText: "FC BAYERN",
    wmImage:
      "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_%282017%29.svg",
    wmOpacity: 0.12,
  },
  BVB: {
    name: "Borussia Dortmund",
    classes:
      "[--bg:250,250,249] [--paper:255,255,255] [--text:15,23,42] [--accent:234,179,8] [--accent2:24,24,27] [--muted:113,113,122]",
    wmText: "BORUSSIA",
    wmImage:
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
    wmOpacity: 0.15,
  },
  FALCO: {
    name: "Falco",
    classes:
      "[--bg:245,252,245] [--paper:255,255,255] [--text:5,46,22] [--accent:16,185,129] [--accent2:21,128,61] [--muted:71,85,105]",
    wmText: "13× KÖNIG",
    wmImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Beard_icon.svg/512px-Beard_icon.svg.png",
    wmOpacity: 0.18,
  },
};

function useLocalState<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  return [state, setState];
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

function nameOf(players: Player[], id: string): string {
  return players.find((p) => p.id === id)?.name || "?";
}

function fmt(x: number): string {
  if (!isFinite(x)) return "-";
  return (Math.round(x * 100) / 100).toFixed(2);
}

// ===================== Root App =====================
export default function App() {
  const [db, setDb] = useLocalState<DB>({
    theme: "BVB", // Default = BVB
    players: [
      { id: uid(), name: "Alex" },
      { id: uid(), name: "Ben" },
      { id: uid(), name: "Chris" },
      { id: uid(), name: "Dana" },
    ],
    matches: [],
    sessions: [],
  });

  const [tab, setTab] = useState<"table" | "session" | "new" | "history" | "stats" | "settings">(
    "table"
  );

  const theme = THEMES[db.theme];
  const themeClass = theme?.classes || THEMES.BVB.classes;

  const bannerVars = {
    ["--wm-image"]: theme?.wmImage ? `url(${theme.wmImage})` : "none",
    ["--wm-opacity"]: String(theme?.wmOpacity ?? 0.12),
  } as React.CSSProperties;

  return (
    <div
      className={cls(
        "min-h-screen flex flex-col bg-[rgb(var(--bg))] text-[rgb(var(--text))] overflow-x-hidden",
        themeClass
      )}
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        ...bannerVars,
      }}
    >
      {/* Sticky Header + Brand Banner (full width) */}
      <div className="sticky top-0 z-20 bg-[rgb(var(--bg))]/90 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg))]/70 border-b border-neutral-200">
        <div className="w-full p-4 sm:p-6">
          <Header tab={tab} setTab={setTab} db={db} />
          <BrandStrip text={theme?.wmText} />
        </div>
      </div>

      {/* Main Content – full width */}
      <div className="flex-1 w-full p-4 sm:p-6">
        <div className="grid gap-4">
          {tab === "table" && <Standings db={db} />}
          {tab === "session" && <KingsTab db={db} setDb={setDb} />}
          {tab === "new" && <NewMatch db={db} setDb={setDb} />}
          {tab === "history" && <History db={db} setDb={setDb} />}
          {tab === "stats" && <Stats db={db} />}
=======
  kingSessions: KingSession[];
  violations: Violation[];
};

type ThemeKey = "FCB" | "BVB" | "FALCO";


// ===================================================================================
//  KONSTANTEN & UTILS
// ===================================================================================
const STORAGE_KEY = "fifa-king-tracker-v4";

const VIOLATION_TYPES: Record<ViolationType, string> = {
    unerlaubt_pausiert: "Unerlaubt pausiert/resumed",
    durch_den_bildschirm_gelaufen: "Durch den Bildschirm gelaufen",
    koenigstitel_nicht_erwaehnt: "Königstititel nicht erwähnt",
    kein_getraenk_erhalten: "Auf Anfrage kein Getränk erhalten",
    sonderrecht_des_hauens_ignoriert: "Sonderrecht des Hauens ignoriert",
    sonstiges: "Sonstiges (siehe Kommentar)"
};

const KING_TITLES: { [key: number]: string } = {
    1: "König", 2: "Zönig", 3: "Drönig", 4: "Vönig", 5: "Fönig", 6: "Sönig",
    7: "Septönig", 8: "Oktönig", 9: "Nönig", 10: "Xönig", 11: "Kaiser",
    12: "Zwaiser", 13: "Traiser"
};

const THEMES: Record<ThemeKey, { name: string; classes: string; wmText: string; wmImage?: string; wmOpacity?: number }> = {
  FCB: { name: "FC Bayern", classes: "[--bg:254,242,242] [--paper:255,255,255] [--text:15,23,42] [--accent:220,38,38] [--accent2:37,99,235] [--muted:100,116,139]", wmText: "FC BAYERN", wmImage: "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_%282017%29.svg", wmOpacity: 0.12 },
  BVB: { name: "Borussia Dortmund", classes: "[--bg:250,250,249] [--paper:255,255,255] [--text:15,23,42] [--accent:234,179,8] [--accent2:24,24,27] [--muted:113,113,122]", wmText: "BORUSSIA", wmImage: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", wmOpacity: 0.15 },
  FALCO: { name: "Falco", classes: "[--bg:245,252,245] [--paper:255,255,255] [--text:5,46,22] [--accent:16,185,129] [--accent2:21,128,61] [--muted:71,85,105]", wmText: "FALCO", wmImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Beard_icon.svg/512px-Beard_icon.svg.png", wmOpacity: 0.18 },
};

function useLocalState<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return initial; const data = JSON.parse(raw) as T; return { ...initial, ...data }; } catch { return initial; } });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  return [state, setState];
}

function cls(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }
function uid(): string { return Date.now().toString(36) + Math.random().toString(36).substring(2); }
function nameOf(players: Player[], id: string): string { return players.find((p) => p.id === id)?.name || "?"; }

// ===================================================================================
//  HOOK FÜR KÖNIGS-INFORMATIONEN
// ===================================================================================
type KingInfo = {
    currentKings: { id: string; name: string; streak: number }[];
    longestStreaks: Record<string, number>;
};

function useKingInfo(db: DB): KingInfo {
    return useMemo(() => {
        const sortedSessions = [...db.kingSessions].sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
        const longestStreaks: Record<string, number> = {};
        const currentStreaks: Record<string, number> = {};

        for (const player of db.players) {
            longestStreaks[player.id] = 0;
            currentStreaks[player.id] = 0;
        }

        for (const session of sortedSessions) {
            if (session.kings.length === 0) continue;
            const winnerIds = new Set(session.kings);
            for (const player of db.players) {
                if (winnerIds.has(player.id)) {
                    currentStreaks[player.id]++;
                } else {
                    if (currentStreaks[player.id] > longestStreaks[player.id]) {
                        longestStreaks[player.id] = currentStreaks[player.id];
                    }
                    currentStreaks[player.id] = 0;
                }
            }
        }
        
        for (const player of db.players) {
            if (currentStreaks[player.id] > longestStreaks[player.id]) {
                longestStreaks[player.id] = currentStreaks[player.id];
            }
        }

        const currentKings = db.players
            .filter(p => currentStreaks[p.id] > 0)
            .map(p => ({ id: p.id, name: p.name, streak: currentStreaks[p.id] }));

        return { currentKings, longestStreaks };
    }, [db.kingSessions, db.players]);
}


// ===================================================================================
//  ROOT APP COMPONENT
// ===================================================================================
export default function App() {
  const [db, setDb] = useLocalState<DB>({
    theme: "FALCO",
    players: [ 
        { id: uid(), name: "Falco" }, { id: uid(), name: "Marcus" }, 
        { id: uid(), name: "Alex" }, { id: uid(), name: "Martin" }, 
        { id: uid(), name: "Obi" } 
    ],
    matches: [], kingSessions: [], violations: [],
  });
  
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  type TabKey = "session" | "table" | "violations" | "history" | "stats" | "settings";
  const [tab, setTab] = useState<TabKey>("session");

  const kingInfo = useKingInfo(db);
  const theme = THEMES[db.theme];
  const themeClass = theme?.classes || THEMES.BVB.classes;
  const bannerVars = { ["--wm-image"]: theme?.wmImage ? `url(${theme.wmImage})` : "none", ["--wm-opacity"]: String(theme?.wmOpacity ?? 0.12) } as React.CSSProperties;

  return (
    <div className={cls("min-h-screen flex flex-col bg-[rgb(var(--bg))] text-[rgb(var(--text))] overflow-x-hidden", themeClass)} style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", ...bannerVars, }} >
      <div className="sticky top-0 z-20 bg-[rgb(var(--bg))]/90 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg))]/70 border-b border-neutral-200">
        <div className="w-full p-4 sm:p-6">
          <Header tab={tab} setTab={setTab} kingInfo={kingInfo} />
          <BrandStrip text={theme?.wmText} />
        </div>
      </div>
      <div className="flex-1 w-full p-4 sm:p-6">
        <div className="grid gap-4">
          {tab === "session" && <SessionManager db={db} setDb={setDb} activeSession={activeSession} setActiveSession={setActiveSession} />}
          {tab === "table" && <Standings db={db} kingInfo={kingInfo} />}
          {tab === "violations" && <ViolationsTab db={db} setDb={setDb} />}
          {tab === "history" && <History db={db} setDb={setDb} />}
          {tab === "stats" && <Stats db={db} kingInfo={kingInfo} />}
>>>>>>> 2e59d3d (Initial commit)
          {tab === "settings" && <Settings db={db} setDb={setDb} />}
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
// ===================== Header & Tabs =====================
function Header({
  tab,
  setTab,
  db,
}: {
  tab: string;
  setTab: React.Dispatch<
    React.SetStateAction<"table" | "session" | "new" | "history" | "stats" | "settings">
  >;
  db: DB;
}) {
=======
// ===================================================================================
//  HEADER & UI COMPONENTS
// ===================================================================================
function Header({ tab, setTab, kingInfo }: { tab: string; setTab: (t: any) => void; kingInfo: KingInfo; }) {
    const kingTitle = useMemo(() => {
        if (kingInfo.currentKings.length === 0) return "Der Thron ist leer";
        const sortedKings = [...kingInfo.currentKings].sort((a,b) => b.streak - a.streak);
        const topKing = sortedKings[0];
        const title = KING_TITLES[topKing.streak] || `König (${topKing.streak}x)`;
        const names = sortedKings.map(k => `${k.name} (${k.streak})`).join(' & ');
        return `${title}: ${names}`;
    }, [kingInfo]);

>>>>>>> 2e59d3d (Initial commit)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">FIFA König Session Tracker</h1>
<<<<<<< HEAD
        <p className="text-sm text-[rgb(var(--muted))]">{THEMES[db.theme]?.name}</p>
      </div>
      <nav className="flex flex-wrap gap-2 min-h-[42px]">
        {(
          [
            ["table", "Tabelle"],
            ["session", "Session"],
            ["new", "Neues Spiel"],
            ["history", "History"],
            ["stats", "Statistiken"],
            ["settings", "Einstellungen"],
          ] as const
        ).map(([k, label]) => (
          <TabButton key={k} active={tab === k} onClick={() => setTab(k as any)}>
            {label}
          </TabButton>
        ))}
=======
        <p className="text-sm text-[rgb(var(--accent2))] font-semibold">👑 {kingTitle}</p>
      </div>
      <nav className="flex flex-wrap gap-2 min-h-[42px]">
        {( [ ["session", "🏆 Session"], ["table", "Tabelle"], ["violations", "Regelverstöße"], ["history", "History"], ["stats", "Statistiken"], ["settings", "Einstellungen"], ] as const
        ).map(([k, label]) => ( <TabButton key={k} active={tab === k} onClick={() => setTab(k)}> {label} </TabButton> ))}
>>>>>>> 2e59d3d (Initial commit)
      </nav>
    </div>
  );
}

<<<<<<< HEAD
function TabButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cls(
        "px-3 py-2 rounded-xl text-sm border transition-colors",
        active
          ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white shadow"
          : "bg-[rgb(var(--paper))] border-neutral-200 hover:bg-neutral-50"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ===================== Brand Strip (Banner oben) =====================
function BrandStrip({ text }: { text?: string }) {
  return (
    <div className="mt-3 w-full">
      <div
        className="h-28 sm:h-32 flex items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--accent),0.98), rgba(var(--accent2),0.98))",
        }}
      >
        {/* optional: Bild/Logo rechts im Banner */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: "var(--wm-opacity, 0.12)",
            backgroundImage: "var(--wm-image)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
            filter: "grayscale(0.1) contrast(0.9)",
          }}
        />
        <div
          className="relative text-white/95 text-3xl sm:text-5xl font-extrabold tracking-[0.18em] uppercase select-none"
          style={{
            textShadow:
              "0 2px 10px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)",
            WebkitTextStroke: "1px rgba(0,0,0,0.15)",
            letterSpacing: "0.18em",
          }}
        >
          {text ?? ""}
        </div>
      </div>
    </div>
  );
}

// ===================== Tabelle (Spiele & Sessions) =====================
function Standings({ db }: { db: DB }) {
  const [source, setSource] = useState<"matches" | "sessions">("matches");
  const [boFilter, setBoFilter] = useState<"all" | 3 | 5 | 7 | 9>("all");

  const matchStats = useMemo(
    () => computeStandings(db.players, db.matches),
    [db.players, db.matches]
  );

  // Sessions-Ansicht
  const sessionsFiltered = useMemo(
    () => db.sessions.filter((s) => (boFilter === "all" ? true : s.bestOf === boFilter)),
    [db.sessions, boFilter]
  );
  const sessionCounts = useMemo(() => {
    const map = new Map<string, { id: string; name: string; sessions: number; wins: number }>(
      db.players.map((p) => [p.id, { id: p.id, name: p.name, sessions: 0, wins: 0 }])
    );
    for (const s of sessionsFiltered) {
      for (const pid of s.kings) {
        const rec = map.get(pid);
        if (!rec) continue;
        rec.sessions += 1; // gezählte Session (Sieg)
        rec.wins += 1;
      }
    }
    return Array.from(map.values());
  }, [db.players, sessionsFiltered]);

  return (
    <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h2 className="text-xl font-semibold">Tabelle</h2>
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2">
            Quelle:
            <select
              className="px-3 py-2 rounded-xl border border-neutral-300"
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
            >
              <option value="matches">Punkte</option>
              <option value="sessions">Königs-Sessions</option>
            </select>
          </label>
          {source === "sessions" && (
            <label className="flex items-center gap-2">
              Best of:
              <select
                className="px-3 py-2 rounded-xl border border-neutral-300"
                value={String(boFilter)}
                onChange={(e) => {
                  const v = e.target.value as any;
                  setBoFilter(v === "all" ? "all" : (Number(v) as 3 | 5 | 7 | 9));
                }}
              >
                <option value="all">Alle</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="9">9</option>
              </select>
            </label>
          )}
        </div>
      </div>

      {source === "matches" ? (
        <TableStats stats={matchStats as any} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                {["#", "Spieler", "Sessions (gewonnen)", "Siege", "Quote"].map((h) => (
                  <th key={h} className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionCounts
                .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name))
                .map((r, i) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{i + 1}</td>
                    <td className="py-2 pr-3 font-semibold">{r.name}</td>
                    <td className="py-2 pr-3">{r.sessions}</td>
                    <td className="py-2 pr-3">{r.wins}</td>
                    <td className="py-2 pr-3">
                      {r.sessions ? ((r.wins / r.sessions) * 100).toFixed(0) + "%" : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TableStats({
  stats,
}: {
  stats: Array<ReturnType<typeof computeStandings>[number]>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            {[
              "#",
              "Spieler",
              "Spiele",
              "S",
              "U",
              "N",
              "Tore",
              "Gegentore",
              "+/−",
              "Pkte",
              "Pkte/Sp",
              "Tore/Sp",
              "Gegent/Sp",
            ].map((h) => (
              <th key={h} className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats
            .sort(
              (a, b) =>
                b.points - a.points ||
                b.goalDiff - a.goalDiff ||
                b.goalsFor - a.goalsFor ||
                a.name.localeCompare(b.name)
            )
            .map((p, i) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2 pr-3">{i + 1}</td>
                <td className="py-2 pr-3 font-semibold">{p.name}</td>
                <td className="py-2 pr-3">{p.played}</td>
                <td className="py-2 pr-3">{p.wins}</td>
                <td className="py-2 pr-3">{p.draws}</td>
                <td className="py-2 pr-3">{p.losses}</td>
                <td className="py-2 pr-3">{p.goalsFor}</td>
                <td className="py-2 pr-3">{p.goalsAgainst}</td>
                <td className="py-2 pr-3">{p.goalDiff}</td>
                <td className="py-2 pr-3 font-semibold">{p.points}</td>
                <td className="py-2 pr-3">{fmt(p.pointsPerGame)}</td>
                <td className="py-2 pr-3">{fmt(p.goalsPerGame)}</td>
                <td className="py-2 pr-3">{fmt(p.concededPerGame)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function computeStandings(players: Player[], matches: Match[]) {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      played: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
    }
  >(
    players.map((p) => [
      p.id,
      {
        id: p.id,
        name: p.name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      },
    ])
  );

  for (const m of matches) {
    const aWon = m.goalsA > m.goalsB;
    const bWon = m.goalsB > m.goalsA;

    for (const pid of m.teamAPlayers) {
      const s = map.get(pid);
      if (!s) continue;
      s.played += 1;
      s.goalsFor += m.goalsA;
      s.goalsAgainst += m.goalsB;
      if (aWon) s.wins += 1;
      else if (bWon) s.losses += 1;
      else s.draws += 1;
    }
    for (const pid of m.teamBPlayers) {
      const s = map.get(pid);
      if (!s) continue;
      s.played += 1;
      s.goalsFor += m.goalsB;
      s.goalsAgainst += m.goalsA;
      if (bWon) s.wins += 1;
      else if (aWon) s.losses += 1;
      else s.draws += 1;
    }
  }

  return Array.from(map.values()).map((s) => {
    const points = s.wins * 3 + s.draws;
    const goalDiff = s.goalsFor - s.goalsAgainst;
    return {
      ...s,
      points,
      goalDiff,
      pointsPerGame: s.played ? points / s.played : Number.NaN,
      goalsPerGame: s.played ? s.goalsFor / s.played : Number.NaN,
      concededPerGame: s.played ? s.goalsAgainst / s.played : Number.NaN,
    };
  });
}

// ===================== Königs-Sessions Tab =====================
function KingsTab({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SessionList db={db} setDb={setDb} />
      <QuickKingCounter db={db} setDb={setDb} />
    </div>
  );
}

function SessionList({
  db,
  setDb,
}: {
  db: DB;
  setDb: React.Dispatch<React.SetStateAction<DB>>;
}) {
  const [boFilter, setBoFilter] = useState<"all" | 3 | 5 | 7 | 9>("all");
  function clearKings(id: string) {
    setDb((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === id ? { ...s, kings: [] } : s)),
    }));
  }
  const sessions = [...db.sessions]
    .filter((s) => (boFilter === "all" ? true : s.bestOf === boFilter))
    .sort((a, b) => new Date(b.startedAtISO).getTime() - new Date(a.startedAtISO).getTime());

  return (
    <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Königs-Sessions</h3>
        <label className="text-sm flex items-center gap-2">
          Best of:
          <select
            className="px-3 py-2 rounded-xl border border-neutral-300"
            value={String(boFilter)}
            onChange={(e) => {
              const v = e.target.value as any;
              setBoFilter(v === "all" ? "all" : (Number(v) as 3 | 5 | 7 | 9));
            }}
          >
            <option value="all">Alle</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
        </label>
      </div>
      {sessions.length === 0 ? (
        <div className="text-sm text-[rgb(var(--muted))]">Noch keine Sessions.</div>
      ) : (
        <ul className="divide-y">
          {sessions.map((s) => (
            <li key={s.id} className="py-3 flex items-start justify-between gap-3 text-sm">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-[rgb(var(--muted))]">
                  {new Date(s.startedAtISO).toLocaleString()}
                </div>
                <div className="text-xs text-[rgb(var(--muted))]">Best of {s.bestOf}</div>
                {s.kings?.length ? (
                  <div>
                    König(e): <b>{s.kings.map((id) => nameOf(db.players, id)).join(" & ")}</b>
                    {s.kingEnteredBy ? (
                      <span className="ml-2 text-xs text-[rgb(var(--muted))]">
                        (eingetragen von {s.kingEnteredBy})
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div className="opacity-70">Keine Könige festgelegt</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {s.kings?.length > 0 && (
                  <button
                    onClick={() => clearKings(s.id)}
                    className="px-2 py-1 rounded-lg border hover:bg-neutral-50"
                  >
                    Könige löschen
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Schneller Königs-Runden-Zähler
function QuickKingCounter({
  db,
  setDb,
}: {
  db: DB;
  setDb: React.Dispatch<React.SetStateAction<DB>>;
}) {
  const [selected, setSelected] = useState<string[]>([]); // 0–2 player ids
  const [enteredBy, setEnteredBy] = useState<string>("");
  const [bestOf, setBestOf] = useState<3 | 5 | 7 | 9>(3);

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const sessionsToday = db.sessions.filter(
    (s) => s.startedAtISO.slice(0, 10) === todayKey
  );
  const nextIndex = sessionsToday.length + 1;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, id];
    });
  }

  function addQuickSession() {
    if (selected.length === 0) {
      alert("Bitte 1–2 Könige wählen");
      return;
    }
    const now = new Date().toISOString();
    const s: Session = {
      id: uid(),
      title: `${today.toLocaleDateString()} – Königssession #${nextIndex}`,
      startedAtISO: now,
      kings: selected,
      kingEnteredBy: enteredBy || "Unbekannt",
      bestOf,
    };
    setDb((prev) => ({ ...prev, sessions: [s, ...prev.sessions] }));
    setSelected([]);
  }

  return (
    <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Königs-Runden heute</h3>
        <span className="text-xs text-[rgb(var(--muted))]">bisher: {sessionsToday.length}</span>
      </div>
      <div className="text-sm mb-2">
        Wähle König(e) (max. 2) und Best-of. Mit „+1“ wird eine zählende Session angelegt.
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {db.players.map((p) => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={cls(
              "px-3 py-1.5 rounded-xl border text-sm",
              selected.includes(p.id)
                ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white"
                : "bg-white border-neutral-300 hover:bg-neutral-50"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-3 text-sm flex-wrap">
        <label className="flex items-center gap-2">
          <span>Best of</span>
          <select
            className="px-3 py-2 rounded-xl border border-neutral-300"
            value={bestOf}
            onChange={(e) => setBestOf(Number(e.target.value) as 3 | 5 | 7 | 9)}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={9}>9</option>
          </select>
        </label>
        <span className="text-xs text-[rgb(var(--muted))]">eingetragen von:</span>
        <SelectOrInput
          players={db.players}
          value={enteredBy}
          onChange={setEnteredBy}
          placeholder="Name"
        />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={addQuickSession} className="px-4 py-2 rounded-xl bg-[rgb(var(--accent2))] text-white">
          +1 Königssession
        </button>
        <span className="text-xs text-[rgb(var(--muted))]">nächste ist # {nextIndex}</span>
      </div>
    </div>
  );
}

// ===================== Neues Spiel =====================
function NewMatch({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) {
  const [mode, setMode] = useState<Mode>("1v1");
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [teamAName, setTeamAName] = useState<string>("");
  const [teamBName, setTeamBName] = useState<string>("");
  const [goalsA, setGoalsA] = useState<number>(0);
  const [goalsB, setGoalsB] = useState<number>(0);
  const [enteredBy, setEnteredBy] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 16));

  useEffect(() => {
    setTeamAPlayers([]);
    setTeamBPlayers([]);
  }, [mode]);

  const canSave = useMemo<boolean>(() => {
    const nA = teamAPlayers.length;
    const nB = teamBPlayers.length;
    if (mode === "1v1" && (nA !== 1 || nB !== 1)) return false;
    if (mode === "2v2" && (nA !== 2 || nB !== 2)) return false;
    if (new Set([...teamAPlayers, ...teamBPlayers]).size !== nA + nB) return false;
    return true;
  }, [mode, teamAPlayers, teamBPlayers]);

  function addMatch() {
    const match: Match = {
      id: uid(),
      dateISO: new Date(date).toISOString(),
      mode,
      teamAName: teamAName || "Team A",
      teamBName: teamBName || "Team B",
      teamAPlayers,
      teamBPlayers,
      goalsA: Number(goalsA),
      goalsB: Number(goalsB),
      enteredBy: enteredBy || "Unbekannt",
    };
    setDb((prev) => ({ ...prev, matches: [match, ...prev.matches] }));
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setTeamAName("");
    setTeamBName("");
    setGoalsA(0);
    setGoalsB(0);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold mb-3">Spiel anlegen</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { key: "1v1" as Mode, label: "1 vs 1" },
            { key: "2v2" as Mode, label: "2 vs 2" },
          ]).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              type="button"
              className={cls(
                "px-3 py-1.5 rounded-xl border text-sm",
                mode === m.key
                  ? "bg-[rgb(var(--accent2))] text-white border-[rgb(var(--accent2))]"
                  : "bg-white border-neutral-300 hover:bg-neutral-50"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Team A – Name</label>
            <input
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="z. B. Bayern"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Team B – Name</label>
            <input
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="z. B. Dortmund"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Datum/Zeit</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Eingetragen von</label>
            <SelectOrInput
              players={db.players}
              value={enteredBy}
              onChange={setEnteredBy}
              placeholder="Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <TeamPicker
            title="Team A – Spieler"
            players={db.players}
            value={teamAPlayers}
            onChange={setTeamAPlayers}
            max={mode === "1v1" ? 1 : 2}
          />
          <TeamPicker
            title="Team B – Spieler"
            players={db.players}
            value={teamBPlayers}
            onChange={setTeamBPlayers}
            max={mode === "1v1" ? 1 : 2}
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <NumberInput label="Tore A" value={goalsA} setValue={setGoalsA} />
          <span className="opacity-60">:</span>
          <NumberInput label="Tore B" value={goalsB} setValue={setGoalsB} />
        </div>

        <div className="flex justify-end mt-4">
          <button
            disabled={!canSave}
            onClick={addMatch}
            className={cls(
              "px-4 py-2 rounded-xl text-white",
              canSave ? "bg-[rgb(var(--accent))]" : "bg-neutral-300 cursor-not-allowed"
            )}
          >
            Speichern
          </button>
        </div>
      </div>

      <QuickPreview
        db={db}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        goalsA={goalsA}
        goalsB={goalsB}
        teamAName={teamAName}
        teamBName={teamBName}
        mode={mode}
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value || "0", 10))}
        className="w-24 px-3 py-2 rounded-xl border border-neutral-300"
        min={0}
      />
    </label>
  );
}

function TeamPicker({
  title,
  players,
  value,
  onChange,
  max,
}: {
  title: string;
  players: Player[];
  value: string[];
  onChange: (ids: string[]) => void;
  max: number;
}) {
  function toggle(id: string) {
    const has = value.includes(id);
    if (has) onChange(value.filter((x) => x !== id));
    else if (value.length < max) onChange([...value, id]);
  }
  return (
    <div>
      <div className="text-sm font-semibold mb-2">
        {title} <span className="text-[rgb(var(--muted))]">(max. {max})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => toggle(p.id)}
            className={cls(
              "px-3 py-1.5 rounded-xl border text-sm",
              value.includes(p.id)
                ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white"
                : "bg-white border-neutral-300 hover:bg-neutral-50"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectOrInput({
  players,
  value,
  onChange,
  placeholder,
}: {
  players: Player[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"select" | "manual">("select");
  return (
    <div className="flex gap-2">
      <select
        className="flex-1 px-3 py-2 rounded-xl border border-neutral-300"
        value={mode === "select" ? value : ""}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "__manual__") setMode("manual");
          else onChange(v);
        }}
      >
        <option value="">– auswählen –</option>
        {players.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
        <option value="__manual__">Andere…</option>
      </select>
      {mode === "manual" && (
        <input
          className="flex-1 px-3 py-2 rounded-xl border border-neutral-300"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function QuickPreview({
  db,
  mode,
  teamAPlayers,
  teamBPlayers,
  goalsA,
  goalsB,
  teamAName,
  teamBName,
}: {
  db: DB;
  mode: Mode;
  teamAPlayers: string[];
  teamBPlayers: string[];
  goalsA: number;
  goalsB: number;
  teamAName: string;
  teamBName: string;
}) {
  function names(ids: string[]) {
    return ids.map((id) => nameOf(db.players, id)).join(" & ");
  }
  return (
    <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
      <h3 className="text-lg font-semibold mb-3">Vorschau</h3>
      <div className="text-sm grid gap-1">
        <div>Modus: <b>{mode}</b></div>
        <div>Teams: <b>{teamAName || "Team A"}</b> vs <b>{teamBName || "Team B"}</b></div>
        <div>Spieler: <b>{names(teamAPlayers) || "—"}</b> vs <b>{names(teamBPlayers) || "—"}</b></div>
        <div>Ergebnis: <b>{goalsA}</b> : <b>{goalsB}</b></div>
      </div>
    </div>
  );
}

// ===================== History =====================
function History({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) {
  function playerNames(ids: string[]) {
    return ids.map((id) => nameOf(db.players, id)).join(" & ");
  }
  function remove(id: string) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    setDb((prev) => ({ ...prev, matches: prev.matches.filter((m) => m.id !== id) }));
  }

  type Row =
    | { kind: "match"; when: string; id: string; text: React.ReactNode }
    | { kind: "session"; when: string; id: string; text: React.ReactNode };
  const rows: Row[] = [];

  for (const m of db.matches) {
    rows.push({
      kind: "match",
      when: m.dateISO,
      id: m.id,
      text: (
        <>
          <div className="text-sm">
            <b>{new Date(m.dateISO).toLocaleString()}</b>
            <span className="opacity-70 ml-2">{m.mode}</span>
          </div>
          <div className="text-sm">
            <b>{m.teamAName}</b> ({playerNames(m.teamAPlayers)}){" "}
            <span className="font-semibold">{m.goalsA}</span> :{" "}
            <span className="font-semibold">{m.goalsB}</span>{" "}
            <b>{m.teamBName}</b> ({playerNames(m.teamBPlayers)})
          </div>
          <div className="text-xs text-[rgb(var(--muted))]">eingetragen von: {m.enteredBy}</div>
        </>
      ),
    });
  }

  for (const s of db.sessions) {
    rows.push({
      kind: "session",
      when: s.startedAtISO,
      id: `session-${s.id}`,
      text: (
        <>
          <div className="text-sm">
            <b>{new Date(s.startedAtISO).toLocaleString()}</b> ·{" "}
            <span className="opacity-70">Königs-Session</span>
          </div>
          <div className="text-sm">Session: <b>{s.title}</b></div>
          <div className="text-xs text-[rgb(var(--muted))]">Best of {s.bestOf}</div>
          {s.kings?.length ? (
            <div className="text-sm">König(e): <b>{s.kings.map((id) => nameOf(db.players, id)).join(" & ")}</b></div>
          ) : (
            <div className="text-sm opacity-70">Keine Könige vergeben</div>
          )}
          {s.kingEnteredBy && (
            <div className="text-xs text-[rgb(var(--muted))]">eingetragen von: {s.kingEnteredBy}</div>
          )}
        </>
      ),
    });
  }

  rows.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());

  return (
    <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">History</h3>
        <span className="text-xs text-[rgb(var(--muted))]">Spiele & Königs-Sessions</span>
      </div>
      {rows.length === 0 ? (
        <div className="text-sm text-[rgb(var(--muted))]">Noch keine Einträge.</div>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.id} className="py-3 flex items-start justify-between gap-3">
              <div className="max-w-full">{r.text}</div>
              {r.kind === "match" ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => remove(r.id)} className="px-2 py-1 rounded-lg border text-xs hover:bg-neutral-50">
                    Löschen
                  </button>
                </div>
              ) : (
                <div />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===================== Stats (Best-of Filter + Sortierung) =====================
function Stats({ db }: { db: DB }) {
  const [boFilter, setBoFilter] = useState<"all" | 3 | 5 | 7 | 9>("all");
  const [sortBy, setSortBy] = useState<"wins" | "name">("wins");

  const sessions = [...db.sessions]
    .filter((s) => (boFilter === "all" ? true : s.bestOf === boFilter));

  const kingWins = new Map<string, number>();
  for (const s of sessions) for (const pid of s.kings || []) kingWins.set(pid, (kingWins.get(pid) || 0) + 1);

  const rows = db.players.map((p) => ({ id: p.id, name: p.name, wins: kingWins.get(p.id) || 0 }));
  rows.sort((a, b) =>
    sortBy === "wins" ? b.wins - a.wins || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2 justify-end">
        <label className="text-sm">
          Best of:
          <select
            className="ml-2 px-3 py-2 rounded-xl border border-neutral-300"
            value={String(boFilter)}
            onChange={(e) => {
              const v = e.target.value as any;
              setBoFilter(v === "all" ? "all" : (Number(v) as 3 | 5 | 7 | 9));
            }}
          >
            <option value="all">Alle</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
        </label>
        <label className="text-sm">
          Sortieren nach:
          <select
            className="ml-2 px-3 py-2 rounded-xl border border-neutral-300"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "wins" | "name")}
          >
            <option value="wins">Meisten Siege</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold mb-3">
          Meiste Best-of-{boFilter === "all" ? "Alle" : boFilter} Session-Siege
        </h3>
        <RankList
          rows={rows.map((r) => ({ id: r.id, name: r.name, value: r.wins }))}
          valueLabel={(v) => `${v}`}
          emptyText="Noch keine Könige vergeben."
        />
      </div>
    </div>
  );
}

function RankList({
  rows,
  valueLabel,
  emptyText,
}: {
  rows: { id: string; name: string; value: number }[];
  valueLabel: (v: number) => string;
  emptyText: string;
}) {
  const sorted = [...rows].sort((a, b) => (b.value || 0) - (a.value || 0) || a.name.localeCompare(b.name));
  return (
    <div>
      {sorted.every((r) => !r.value) ? (
        <div className="text-sm text-[rgb(var(--muted))]">{emptyText}</div>
      ) : (
        <ul className="divide-y">
          {sorted.map((r, i) => (
            <li key={r.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">{i + 1}</span>
                <span className="font-semibold">{r.name}</span>
              </div>
              <div className="text-sm">{valueLabel(r.value || 0)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===================== Einstellungen =====================
function Settings({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) {
  const [name, setName] = useState<string>("");
  const [wmUrl, setWmUrl] = useState<string>("");

  useEffect(() => {
    setWmUrl(THEMES[db.theme].wmImage || "");
  }, [db.theme]);

  function addPlayer() {
    const n = name.trim();
    if (!n) return;
    setDb((prev) => ({ ...prev, players: [...prev.players, { id: uid(), name: n }] }));
    setName("");
  }

  function rename(id: string, newName: string) {
    setDb((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, name: newName } : p)),
    }));
  }

  function remove(id: string) {
    if (!confirm("Spieler wirklich entfernen? (Ältere Spiele bleiben unverändert)")) return;
    setDb((prev) => ({ ...prev, players: prev.players.filter((p) => p.id !== id) }));
  }

  function clearAll() {
    if (!confirm("Alle Daten löschen? (unwiderruflich)")) return;
    setDb({ theme: db.theme, players: [], matches: [], sessions: [] });
  }

  function setTheme(t: ThemeKey) {
    setDb((prev) => ({ ...prev, theme: t }));
  }

  function saveWatermarkUrl() {
    const t = db.theme;
    const next = { ...THEMES[t] };
    next.wmImage = wmUrl.trim();
    (THEMES as any)[t] = next; // Laufzeit-Referenz aktualisieren
    alert("Banner-Bild aktualisiert. Wenn es nicht sofort erscheint: Theme kurz wechseln und zurück.");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold mb-3">Spieler</h3>
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-300"
            placeholder="Neuer Spieler"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="px-3 py-2 rounded-xl bg-[rgb(var(--accent))] text-white" onClick={addPlayer}>
            Hinzufügen
          </button>
        </div>
        <ul className="space-y-2">
          {db.players.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-300"
                value={p.name}
                onChange={(e) => rename(p.id, e.target.value)}
              />
              <button
                onClick={() => remove(p.id)}
                className="px-2 py-1 rounded-lg border text-xs hover:bg-neutral-50"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold mb-3">Theme & Daten</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className={cls(
                "px-3 py-2 rounded-xl border text-sm",
                db.theme === k
                  ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white"
                  : "bg-white border-neutral-300 hover:bg-neutral-50"
              )}
            >
              {THEMES[k].name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold mb-1">Banner-Bild (URL)</div>
            <input
              className="w-full px-3 py-2 rounded-xl border border-neutral-300"
              placeholder="https://…/dein-bild.png"
              value={wmUrl}
              onChange={(e) => setWmUrl(e.target.value)}
            />
            <div className="text-xs text-[rgb(var(--muted))] mt-1">
              Für <b>{THEMES[db.theme].name}</b> z. B. Vereinslogo oder beim <b>FALCO</b>-Theme ein Bart-Bild.
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={saveWatermarkUrl} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">
                Speichern
              </button>
              <button onClick={() => setWmUrl("")} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">
                Leeren
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ExportButton db={db} />
            <ImportButton setDb={setDb} keepTheme={db.theme} />
            <button onClick={clearAll} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">
              Alle Daten löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportButton({ db }: { db: DB }) {
  function download() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fifa-king-tracker.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={download} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">
      Export
    </button>
  );
}

function ImportButton({
  setDb,
  keepTheme,
}: {
  setDb: React.Dispatch<React.SetStateAction<DB>>;
  keepTheme: ThemeKey;
}) {
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as DB;
        setDb({ ...data, theme: keepTheme || data.theme || "BVB" });
      } catch {
        alert("Ungültige Datei");
      }
    };
    reader.readAsText(file);
  }
  return (
    <label className="px-3 py-2 rounded-xl border hover:bg-neutral-50 cursor-pointer">
      Import
      <input type="file" accept="application/json" className="hidden" onChange={onPick} />
    </label>
  );
}
=======
function TabButton({ active, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) { return ( <button className={cls("px-3 py-2 rounded-xl text-sm border transition-colors", active ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white shadow" : "bg-[rgb(var(--paper))] border-neutral-200 hover:bg-neutral-50")} {...props}> {children} </button> ); }
function BrandStrip({ text }: { text?: string }) { return <div className="mt-3 w-full"><div className="h-28 sm:h-32 flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(90deg, rgba(var(--accent),0.98), rgba(var(--accent2),0.98))", }}><div aria-hidden className="absolute inset-0 pointer-events-none" style={{ opacity: "var(--wm-opacity, 0.12)", backgroundImage: "var(--wm-image)", backgroundRepeat: "no-repeat", backgroundPosition: "right center", backgroundSize: "contain", filter: "grayscale(0.1) contrast(0.9)", }}/><div className="relative text-white/95 text-3xl sm:text-5xl font-extrabold tracking-[0.18em] uppercase select-none" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)", WebkitTextStroke: "1px rgba(0,0,0,0.15)", letterSpacing: "0.18em", }}>{text ?? ""}</div></div></div>; }

function PlayerNameDisplay({ playerId, players, kingInfo }: { playerId: string, players: Player[], kingInfo: KingInfo }) {
    const player = players.find(p => p.id === playerId);
    const kingData = kingInfo.currentKings.find(k => k.id === playerId);
    if (!player) return <span>?</span>;
    return (
        <span className="flex items-center gap-1.5">{player.name}{kingData && kingData.streak > 0 && (<span className="text-amber-500 font-bold" title={`${kingData.streak} Session(s) in Folge König`}>👑<sub className="text-xs -ml-1">{kingData.streak}</sub></span>)}</span>
    );
}

// ===================================================================================
//  TAB: TABELLE
// ===================================================================================
function Standings({ db, kingInfo }: { db: DB, kingInfo: KingInfo }) { const matchStats = useMemo(() => computeStandings(db.players, db.matches), [db.players, db.matches]); const sessionCounts = useMemo(() => { const map = new Map<string, { id: string; name: string; wins: number }>(db.players.map((p) => [p.id, { id: p.id, name: p.name, wins: 0 }])); for (const s of db.kingSessions) { for (const pid of s.kings) { const rec = map.get(pid); if (!rec) continue; rec.wins += 1; } } return Array.from(map.values()); }, [db.players, db.kingSessions]); return (<div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h2 className="text-xl font-semibold mb-3">Gesamttabellen</h2><div className="grid md:grid-cols-2 gap-6"><div><h3 className="font-semibold text-lg mb-2">🏆 Königs-Titel</h3><div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="text-left border-b">{["#", "Spieler", "Titel"].map((h) => (<th key={h} className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">{h}</th>))}</tr></thead><tbody>{sessionCounts.sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name)).map((r, i) => (<tr key={r.id} className="border-b last:border-0"><td className="py-2 pr-3">{i + 1}</td><td className="py-2 pr-3 font-semibold"><PlayerNameDisplay playerId={r.id} players={db.players} kingInfo={kingInfo} /></td><td className="py-2 pr-3">{r.wins}</td></tr>))}</tbody></table></div></div><div><h3 className="font-semibold text-lg mb-2">🎯 Punkte aus Spielen</h3><TableStats stats={matchStats} db={db} kingInfo={kingInfo} /></div></div></div>); }
function TableStats({ stats, db, kingInfo }: { stats: Array<ReturnType<typeof computeStandings>[number]>; db: DB; kingInfo: KingInfo; }) { return (<div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="text-left border-b">{["#", "Spieler", "Pkte", "+/−", "Sp", "S", "U", "N", "Tore"].map((h) => (<th key={h} className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">{h}</th>))}</tr></thead><tbody>{stats.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name)).map((p, i) => (<tr key={p.id} className="border-b last:border-0"><td className="py-2 pr-3">{i + 1}</td><td className="py-2 pr-3 font-semibold"><PlayerNameDisplay playerId={p.id} players={db.players} kingInfo={kingInfo} /></td><td className="py-2 pr-3 font-bold">{p.points}</td><td className="py-2 pr-3">{p.goalDiff > 0 ? `+${p.goalDiff}` : p.goalDiff}</td><td className="py-2 pr-3">{p.played}</td><td className="py-2 pr-3">{p.wins}</td><td className="py-2 pr-3">{p.draws}</td><td className="py-2 pr-3">{p.losses}</td><td className="py-2 pr-3">{p.goalsFor}:{p.goalsAgainst}</td></tr>))}</tbody></table></div>); }
function computeStandings(players: Player[], matches: Match[]) { const map = new Map<string, { id: string; name: string; played: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; }>(players.map((p) => [p.id, { id: p.id, name: p.name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, },])); for (const m of matches) { const aWon = m.goalsA > m.goalsB; const bWon = m.goalsB > m.goalsA; for (const pid of m.teamAPlayers) { const s = map.get(pid); if (!s) continue; s.played += 1; s.goalsFor += m.goalsA; s.goalsAgainst += m.goalsB; if (aWon) s.wins += 1; else if (bWon) s.losses += 1; else s.draws += 1; } for (const pid of m.teamBPlayers) { const s = map.get(pid); if (!s) continue; s.played += 1; s.goalsFor += m.goalsB; s.goalsAgainst += m.goalsA; if (bWon) s.wins += 1; else if (aWon) s.losses += 1; else s.draws += 1; } } return Array.from(map.values()).map((s) => { const points = s.wins * 3 + s.draws; const goalDiff = s.goalsFor - s.goalsAgainst; return { ...s, points, goalDiff }; }); }

// ===================================================================================
//  TAB: SESSION MANAGER (MIT "BEST OF"-LOGIK)
// ===================================================================================
function SessionManager({ db, setDb, activeSession, setActiveSession } : { db: DB, setDb: React.Dispatch<React.SetStateAction<DB>>, activeSession: ActiveSession | null, setActiveSession: React.Dispatch<React.SetStateAction<ActiveSession | null>>}) {
    if (activeSession) {
        return <ActiveSessionDisplay db={db} setDb={setDb} activeSession={activeSession} setActiveSession={setActiveSession} />;
    }
    return <StartSessionForm db={db} setActiveSession={setActiveSession} />;
}

function StartSessionForm({ db, setActiveSession }: { db: DB, setActiveSession: React.Dispatch<React.SetStateAction<ActiveSession | null>> }) {
    const [mode, setMode] = useState<Mode>('1v1');
    const [bestOf, setBestOf] = useState<number>(3);
    const [sessionTeams, setSessionTeams] = useState<SessionTeam[]>([]);
    const [teamName, setTeamName] = useState("");
    const [teamPlayers, setTeamPlayers] = useState<string[]>([]);
    
    const availablePlayers = db.players.filter(p => !sessionTeams.flatMap(t => t.players).includes(p.id));
    const playersPerTeam = mode === '1v1' ? 1 : 2;

    function toggleTeamPlayer(id: string) { setTeamPlayers(current => { if (current.includes(id)) return current.filter(pId => pId !== id); if (current.length >= playersPerTeam) return current; return [...current, id]; }); }
    
    function addTeam() {
        if (teamPlayers.length !== playersPerTeam) { alert(`Bitte genau ${playersPerTeam} Spieler für das Team auswählen.`); return; }
        const finalTeamName = teamName.trim() || teamPlayers.map(pId => nameOf(db.players, pId)).join(' & ');
        setSessionTeams(current => [...current, { id: uid(), name: finalTeamName, players: teamPlayers }]);
        setTeamName(""); setTeamPlayers([]);
    }

    function handleStart() {
        if (sessionTeams.length !== 2) { alert("Bitte genau 2 Teams für eine 'Best of'-Session erstellen."); return; }
        const schedule: ActiveSessionMatch[] = Array.from({ length: bestOf }, () => ({
            id: uid(), teamA: sessionTeams[0], teamB: sessionTeams[1], goalsA: null, goalsB: null
        }));
        setActiveSession({ teams: sessionTeams, schedule, bestOf, mode });
    }

    return (
        <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Neue Session starten</h2>
            <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold mb-2">1. Session-Einstellungen</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium">Modus:</span><TabButton active={mode === '1v1'} onClick={() => { setMode('1v1'); setTeamPlayers([]) }}>1 vs 1</TabButton><TabButton active={mode === '2v2'} onClick={() => { setMode('2v2'); setTeamPlayers([]) }}>2 vs 2</TabButton></div>
                    <label className="flex items-center gap-2 text-sm"><span className="font-medium">Best of:</span><select value={bestOf} onChange={e => setBestOf(Number(e.target.value))} className="px-3 py-2 rounded-xl border border-neutral-300"><option value={3}>3</option><option value={5}>5</option><option value={7}>7</option><option value={9}>9</option></select></label>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 border-b pb-4 mb-4">
                <div>
                    <h3 className="font-semibold mb-2">2. Teams erstellen (genau 2 benötigt)</h3>
                    <div className="p-3 bg-neutral-50 rounded-lg space-y-3">
                        <input type="text" placeholder="Teamname (optional)" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"/>
                        <div className="text-sm">Spieler wählen ({playersPerTeam - teamPlayers.length} / {playersPerTeam}):</div>
                        <div className="flex flex-wrap gap-1">
                            {availablePlayers.map(p => (<button key={p.id} onClick={() => toggleTeamPlayer(p.id)} className={cls("px-2 py-1 rounded-lg border text-xs", teamPlayers.includes(p.id) ? "bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white" : "bg-white border-neutral-300 hover:bg-neutral-50")}>{p.name}</button>))}
                        </div>
                        <button onClick={addTeam} disabled={teamPlayers.length !== playersPerTeam || sessionTeams.length >= 2} className="w-full px-4 py-2 rounded-xl text-white bg-[rgb(var(--accent2))] disabled:bg-neutral-300 text-sm">Team hinzufügen</button>
                    </div>
                </div>
                <div>
                     <h3 className="font-semibold mb-2">Teilnehmende Teams ({sessionTeams.length}/2)</h3>
                     {sessionTeams.length === 0 && <p className="text-sm text-gray-500">Noch keine Teams hinzugefügt.</p>}
                     <ul className="space-y-1">{sessionTeams.map((team, i) => (<li key={team.id} className="text-sm flex justify-between items-center p-2 rounded bg-white border"><span>{i+1}. <b>{team.name}</b> ({team.players.map(pId => nameOf(db.players, pId)).join(', ')})</span><button onClick={() => setSessionTeams(t => t.filter(t => t.id !== team.id))} className="text-red-500 text-xs">X</button></li>))}</ul>
                </div>
            </div>
            <div className="flex justify-end mt-4"><button onClick={handleStart} disabled={sessionTeams.length !== 2} className="px-6 py-3 rounded-xl text-white font-bold bg-[rgb(var(--accent))] disabled:bg-neutral-300">Session starten</button></div>
        </div>
    );
}

function ActiveSessionDisplay({ db, setDb, activeSession, setActiveSession }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>>; activeSession: ActiveSession; setActiveSession: React.Dispatch<React.SetStateAction<ActiveSession | null>>; }) {
    const [schedule, setSchedule] = useState(activeSession.schedule);
    
    const winsNeeded = Math.ceil(activeSession.bestOf / 2);

    const scores = useMemo(() => {
        const teamAWins = schedule.filter(m => m.goalsA !== null && m.goalsB !== null && m.goalsA > m.goalsB).length;
        const teamBWins = schedule.filter(m => m.goalsA !== null && m.goalsB !== null && m.goalsB > m.goalsA).length;
        return { teamAWins, teamBWins };
    }, [schedule]);

    function updateScore(matchId: string, team: 'A' | 'B', value: string) {
        setSchedule(current => current.map(match => {
            if (match.id === matchId) {
                const score = value === '' ? null : parseInt(value, 10);
                return { ...match, [team === 'A' ? 'goalsA' : 'goalsB']: score };
            }
            return match;
        }));
    }

    function finishSession(isConfirmed = false) {
        if (!isConfirmed && (scores.teamAWins < winsNeeded && scores.teamBWins < winsNeeded)) {
            if (!window.confirm("Die Serie ist noch nicht entschieden. Trotzdem beenden und speichern?")) return;
        }

        const winnerTeam = scores.teamAWins >= winsNeeded ? activeSession.teams[0] : scores.teamBWins >= winsNeeded ? activeSession.teams[1] : null;
        const kings = winnerTeam ? winnerTeam.players : [];

        const sessionId = uid();
        const now = new Date().toISOString();

        const newMatches: Match[] = schedule
            .filter(m => m.goalsA !== null && m.goalsB !== null)
            .map(m => ({
                id: uid(), dateISO: now, mode: activeSession.mode, sessionId,
                teamAPlayers: m.teamA.players, teamBPlayers: m.teamB.players,
                goalsA: m.goalsA!, goalsB: m.goalsB!,
                teamAName: m.teamA.name, teamBName: m.teamB.name, enteredBy: "Session"
            }));

        const newKingSession: KingSession = {
            id: sessionId, dateISO: now, kings, kingEnteredBy: "Session",
            bestOf: activeSession.bestOf, mode: activeSession.mode
        };
        
        setDb(prev => ({ ...prev, matches: [...prev.matches, ...newMatches], kingSessions: [...prev.kingSessions, newKingSession] }));
        const winnerName = winnerTeam ? winnerTeam.name : "Niemand";
        alert(`Session beendet! Der Sieger ist: ${winnerName}! Alle Spiele und der Königstitel wurden gespeichert.`);
        setActiveSession(null);
    }
    
    // Auto-finish session when a winner is determined
    useEffect(() => {
        if (scores.teamAWins >= winsNeeded || scores.teamBWins >= winsNeeded) {
            finishSession(true); // isConfirmed = true to bypass the confirmation dialog
        }
    }, [scores, winsNeeded]);


    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4">
                 <h2 className="text-xl font-semibold mb-1">Laufende Session: Best of {activeSession.bestOf}</h2>
                 <h3 className="text-2xl font-bold text-center mb-4">{activeSession.teams[0].name} <span className="text-[rgb(var(--accent))]">{scores.teamAWins} : {scores.teamBWins}</span> {activeSession.teams[1].name}</h3>
                 <div className="space-y-2">
                    {schedule.map((match, i) => (
                        <div key={match.id} className="grid grid-cols-[1fr,50px,20px,50px,1fr] items-center gap-2 p-2 bg-neutral-50 rounded-lg">
                           <span className="text-right font-bold">Spiel {i+1}</span>
                           <input type="number" min="0" value={match.goalsA ?? ''} onChange={e => updateScore(match.id, 'A', e.target.value)} className="w-full text-center p-1 rounded-md border border-neutral-300"/>
                           <span className="text-center">:</span>
                           <input type="number" min="0" value={match.goalsB ?? ''} onChange={e => updateScore(match.id, 'B', e.target.value)} className="w-full text-center p-1 rounded-md border border-neutral-300"/>
                           <span className="font-bold"></span>
                        </div>
                    ))}
                 </div>
                 <div className="flex justify-between items-center mt-4">
                    <button onClick={() => { if(window.confirm("Session wirklich abbrechen?")) setActiveSession(null); }} className="px-4 py-2 rounded-xl bg-neutral-200 text-sm">Abbrechen</button>
                    <button onClick={() => finishSession(false)} className="px-4 py-2 rounded-xl text-white bg-[rgb(var(--accent))]">Manuell beenden & speichern</button>
                 </div>
            </div>
             <div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4 self-start">
                 <h3 className="text-lg font-semibold mb-3">Session Info</h3>
                 <p><b>Modus:</b> {activeSession.mode}</p>
                 <p><b>Teams:</b></p>
                 <ul className="list-disc pl-5">
                    {activeSession.teams.map(t => <li key={t.id}>{t.name}</li>)}
                 </ul>
                 <p className="mt-2"><b>Siege zum Gewinn:</b> {winsNeeded}</p>
            </div>
        </div>
    );
}


// ===================================================================================
// TAB: REGELVERSTÖSSE
// ===================================================================================
function ViolationsTab({ db, setDb }: { db: DB, setDb: React.Dispatch<React.SetStateAction<DB>> }) { const [playerId, setPlayerId] = useState(''); const [type, setType] = useState<ViolationType>('unerlaubt_pausiert'); const [comment, setComment] = useState(''); const [enteredBy, setEnteredBy] = useState(''); function addViolation() { if (!playerId) { alert("Bitte einen Spieler auswählen."); return; } const violation: Violation = { id: uid(), dateISO: new Date().toISOString(), playerId, type, comment, enteredBy: enteredBy || 'Unbekannt' }; setDb(prev => ({ ...prev, violations: [violation, ...prev.violations] })); setPlayerId(''); setType('unerlaubt_pausiert'); setComment(''); } const sortedViolations = [...db.violations].sort((a,b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()); return (<div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-1 bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4 self-start"><h3 className="text-lg font-semibold mb-3">Neuer Regelverstoß</h3><div className="space-y-3 text-sm"><div><label className="block mb-1">Spieler</label><select value={playerId} onChange={e => setPlayerId(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-neutral-300"><option value="">- auswählen -</option>{db.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label className="block mb-1">Verstoß</label><select value={type} onChange={e => setType(e.target.value as ViolationType)} className="w-full px-3 py-2 rounded-xl border border-neutral-300">{Object.entries(VIOLATION_TYPES).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}</select></div><div><label className="block mb-1">Kommentar (optional)</label><input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Details..." className="w-full px-3 py-2 rounded-xl border border-neutral-300" /></div><div><label className="block mb-1">Eingetragen von</label><SelectOrInput players={db.players} value={enteredBy} onChange={setEnteredBy} placeholder="Dein Name" /></div><div className="text-right pt-2"><button onClick={addViolation} className="px-4 py-2 rounded-xl text-white bg-[rgb(var(--accent2))]">Hinzufügen</button></div></div></div><div className="lg:col-span-2 bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h3 className="text-lg font-semibold mb-3">Protokoll der Regelverstöße</h3><ul className="divide-y">{sortedViolations.length === 0 && <p className="text-sm text-gray-500">Bisher keine Verstöße. Vorbildlich!</p>}{sortedViolations.map(v => (<li key={v.id} className="py-2 text-sm"><div className="flex justify-between"><span className="font-bold">{nameOf(db.players, v.playerId)}</span><span className="text-xs text-gray-400">{new Date(v.dateISO).toLocaleString()}</span></div><p className="text-gray-600">{VIOLATION_TYPES[v.type]}</p>{v.comment && <p className="text-xs text-gray-500 italic pl-2 border-l-2 border-gray-200 my-1">"{v.comment}"</p>}</li>))}</ul></div></div>); }

// ===================================================================================
//  TAB: HISTORY
// ===================================================================================
function History({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) { function deleteMatch(id: string) { if (window.confirm("Soll dieses Spiel wirklich gelöscht werden?")) { setDb(prev => ({ ...prev, matches: prev.matches.filter(m => m.id !== id) })); } } function removeKingTitle(id: string) { if (window.confirm("Soll der Königstitel dieser Session wirklich entfernt werden? Die Session bleibt in der History, zählt aber nicht mehr als Sieg.")) { setDb(prev => ({ ...prev, kingSessions: prev.kingSessions.map(s => s.id === id ? { ...s, kings: [] } : s) })); } } const combinedHistory = useMemo(() => { const matchHistory = db.matches.map(m => ({ type: 'match' as const, date: m.dateISO, data: m })); const sessionHistory = db.kingSessions.map(s => ({ type: 'session' as const, date: s.dateISO, data: s })); return [...matchHistory, ...sessionHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }, [db.matches, db.kingSessions]); return (<div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h2 className="text-xl font-semibold mb-3">Verlauf</h2><ul className="divide-y">{combinedHistory.map(item => { if (item.type === 'match') { const m = item.data; return (<li key={`match-${m.id}`} className="py-3 flex items-start justify-between gap-3 text-sm"><div><div>{new Date(m.dateISO).toLocaleString()} • {m.mode === '2v2' ? '2vs2 Spiel' : '1vs1 Spiel'}</div><div className="font-semibold text-base">{m.teamAName} <span className="text-lg">{m.goalsA} : {m.goalsB}</span> {m.teamBName}</div><div className="text-xs text-gray-500">Eingetragen von: {m.enteredBy} {m.sessionId ? `(Session ID: ...${m.sessionId.slice(-4)})` : ''}</div></div><button onClick={() => deleteMatch(m.id)} className="px-2 py-1 rounded-lg border text-red-500 border-red-200 hover:bg-red-50 text-xs">Löschen</button></li>); } else { const s = item.data; return (<li key={`session-${s.id}`} className="py-3 flex items-start justify-between gap-3 text-sm bg-amber-50/50 px-2 rounded"><div><div>{new Date(s.dateISO).toLocaleString()} • Session-Ende ({s.mode}, Best of {s.bestOf})</div>{s.kings.length > 0 ? (<div className="font-semibold">König(e): {s.kings.map(id => nameOf(db.players, id)).join(" & ")}</div>) : (<div className="text-gray-500">Kein Königstitel für diese Session vergeben.</div>)}{s.kingEnteredBy && <div className="text-xs text-gray-500">Eingetragen von: {s.kingEnteredBy}</div>}</div>{s.kings.length > 0 && (<button onClick={() => removeKingTitle(s.id)} className="px-2 py-1 rounded-lg border text-orange-600 border-orange-200 hover:bg-orange-50 text-xs">Titel entfernen</button>)}</li>); } })}</ul></div>); }

// ===================================================================================
//  TAB: STATISTIKEN
// ===================================================================================
function Stats({ db, kingInfo }: { db: DB, kingInfo: KingInfo }) { const violationCounts = useMemo(() => { const counts: Record<string, number> = {}; db.players.forEach(p => counts[p.id] = 0); db.violations.forEach(v => { if(counts[v.playerId] !== undefined) counts[v.playerId]++; }); return counts; }, [db.violations, db.players]); const playerStats = useMemo(() => { return db.players.map(p => ({ id: p.id, name: p.name, longestStreak: kingInfo.longestStreaks[p.id] || 0, violations: violationCounts[p.id] || 0, })).sort((a,b) => b.longestStreak - a.longestStreak || a.violations - b.violations); }, [db.players, kingInfo.longestStreaks, violationCounts]); return (<div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h2 className="text-xl font-semibold mb-3">Spielerstatistiken</h2><div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="text-left border-b"><th className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">Spieler</th><th className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">Längste Königsserie</th><th className="py-2 pr-3 font-medium text-[rgb(var(--muted))]">Regelverstöße</th></tr></thead><tbody>{playerStats.map(p => (<tr key={p.id} className="border-b last:border-0"><td className="py-2 pr-3 font-semibold"><PlayerNameDisplay playerId={p.id} players={db.players} kingInfo={kingInfo} /></td><td className="py-2 pr-3">{p.longestStreak}</td><td className="py-2 pr-3">{p.violations}</td></tr>))}</tbody></table></div></div>); }

// ===================================================================================
//  TAB: EINSTELLUNGEN
// ===================================================================================
function Settings({ db, setDb }: { db: DB; setDb: React.Dispatch<React.SetStateAction<DB>> }) { const [newName, setNewName] = useState(""); function addPlayer() { if (newName.trim() && !db.players.some((p) => p.name === newName.trim())) { setDb((prev) => ({ ...prev, players: [...prev.players, { id: uid(), name: newName.trim() }], })); setNewName(""); } } function deletePlayer(id: string) { if (window.confirm("Soll dieser Spieler wirklich gelöscht werden?")) { setDb((prev) => ({ ...prev, players: prev.players.filter((p) => p.id !== id), })); } } return (<div className="grid md:grid-cols-2 gap-4"><div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h3 className="text-lg font-semibold mb-3">Spieler verwalten</h3><ul className="divide-y mb-3">{db.players.map((p) => (<li key={p.id} className="py-2 flex items-center justify-between"><span>{p.name}</span><button onClick={() => deletePlayer(p.id)} className="text-red-500 text-sm">Löschen</button></li>))}</ul><div className="flex gap-2"><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Neuer Spielername" className="flex-1 px-3 py-2 rounded-xl border border-neutral-300" /><button onClick={addPlayer} className="px-4 py-2 rounded-xl bg-[rgb(var(--accent))] text-white">+</button></div></div><div className="bg-[rgb(var(--paper))] rounded-2xl shadow border border-neutral-200 p-4"><h3 className="text-lg font-semibold mb-3">Theme</h3><div className="flex flex-col gap-2">{Object.entries(THEMES).map(([key, theme]) => (<button key={key} onClick={() => setDb((prev) => ({ ...prev, theme: key as ThemeKey }))} className={cls("px-3 py-2 rounded-xl border w-full text-left", db.theme === key && "border-[rgb(var(--accent))] border-2")}>{theme.name}</button>))}</div></div></div>); }

// ===================================================================================
//  HELPER COMPONENTS
// ===================================================================================
function SelectOrInput({ players, value, onChange, placeholder, }: { players: Player[]; value: string; onChange: (v: string) => void; placeholder?: string; }) { const [mode, setMode] = useState<"select" | "manual">("select"); if(mode === 'manual') { return (<div className="flex gap-2"><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-neutral-300" /><button onClick={() => setMode('select')} className="text-xs">Liste</button></div>); } return (<select className="w-full px-3 py-2 rounded-xl border border-neutral-300" value={value} onChange={(e) => { const v = e.target.value; if (v === "__manual__") { setMode("manual"); onChange(""); } else onChange(v); }}><option value="">– auswählen –</option>{players.map((p) => (<option key={p.id} value={p.name}>{p.name}</option>))}<option value="__manual__">Andere…</option></select>); }
>>>>>>> 2e59d3d (Initial commit)
