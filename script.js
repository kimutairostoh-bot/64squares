// 64 SQUARES v8 cburnett — 2026-05-31 10:11
// ===================================================
// 64 SQUARES — script.js
// ===================================================

const SUPABASE_REST = 'https://amhotjblrmctyisrpuub.supabase.co/rest/v1';
const SUPABASE_KEY  = 'sb_publishable_Mr7Q-_rHblJ8qczzYZnkQw_X7Rkdsq3';
const SB_HEADERS = {
  'Content-Type':  'application/json',
  'apikey':        SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Prefer':        'return=representation',
};
async function sbSelect(table, order, cols) {
  const url = SUPABASE_REST + '/' + table
    + '?order=' + (order || 'created_at.asc')
    + '&select=' + (cols || '*');
  const res = await fetch(url, { headers: SB_HEADERS });
  if (!res.ok) { const t = await res.text(); console.error('[sb] GET ' + table + ':', res.status, t); return []; }
  return res.json();
}
async function sbSelectOne(table, id) {
  const url = SUPABASE_REST + '/' + table + '?id=eq.' + id + '&select=*&limit=1';
  const res = await fetch(url, { headers: SB_HEADERS });
  if (!res.ok) { const t = await res.text(); console.error('[sb] GET ONE ' + table + ':', res.status, t); return null; }
  const rows = await res.json();
  return rows[0] || null;
}
async function sbUpsert(table, row) {
  const clean = Object.fromEntries(Object.entries(row).filter(([, val]) => val !== undefined));
  const res = await fetch(SUPABASE_REST + '/' + table, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(clean),
  });
  if (!res.ok) { const t = await res.text(); console.error('[sb] UPSERT ' + table + ':', res.status, t); try { const err = JSON.parse(t); showToast('Save failed: ' + (err.message || err.hint || res.status)); } catch (_) { showToast('Save failed (' + res.status + ') — check console.'); } return false; }
  return true;
}
async function sbDelete(table, id) {
  const res = await fetch(SUPABASE_REST + '/' + table + '?id=eq.' + id, { method: 'DELETE', headers: SB_HEADERS });
  if (!res.ok) { const t = await res.text(); console.error('[sb] DELETE ' + table + ':', res.status, t); return false; }
  return true;
}
const THEME_KEY = 'chess64_theme';
const VIEWS_KEY = 'chess64_views';
let siteData = { articles: [], players: [], games: [], pdfs: [] };
function getViews() { try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}'); } catch { return {}; } }
function trackView(type, id) { const v = getViews(); const k = type + ':' + id; v[k] = (v[k] || 0) + 1; try { localStorage.setItem(VIEWS_KEY, JSON.stringify(v)); } catch (e) {} }
function toggleTheme() { const isDark = document.body.classList.toggle('dark'); localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); document.getElementById('themeToggleBtn').textContent = isDark ? '\u25CB' : '\u25D1'; }
function applyStoredTheme() { if (localStorage.getItem(THEME_KEY) === 'dark') { document.body.classList.add('dark'); const btn = document.getElementById('themeToggleBtn'); if (btn) btn.textContent = '\u25CB'; } }

const defaultData = {
  articles: [
    { id: 1, tag: 'Strategy', title: 'The Art of the Endgame: Rook & Pawn Mastery', excerpt: 'Understanding why endgames are where true chess understanding is revealed.', content: 'The endgame is where champions are made. While openings can be memorized and middlegames can be calculated, the endgame demands pure understanding.\n\nRook endgames constitute the vast majority of practical endgame situations, and mastering them is perhaps the single greatest investment a club player can make.\n\nThe key insight is activity. In rook endgames, the rook must be active at all costs.', date: 'May 2026', read_time: '8 min', published: true, image: '' },
    { id: 2, tag: 'History', title: 'Fischer vs. Spassky: The Match That Stopped the World', excerpt: 'A look back at the 1972 World Championship in Reykjavik — a Cold War showdown played on 64 squares.', content: 'In the summer of 1972, the world held its breath — not over a military confrontation, but over a chess match.\n\nFischer won the match 12.5–8.5, becoming the 11th World Chess Champion and the first American to hold the title. He never defended it.', date: 'Apr 2026', read_time: '12 min', published: true, image: '' },
    { id: 3, tag: 'Opening Theory', title: 'The Sicilian Dragon: Fire on the Board', excerpt: 'One of chess\'s most double-edged openings — why the Dragon keeps burning generations of players.', content: 'Few opening systems in chess generate as much heat as the Sicilian Dragon.\n\nThe Dragon demands deep theoretical preparation. A single misplaced move can be catastrophic for either side.', date: 'Mar 2026', read_time: '6 min', published: true, image: '' },
  ],
  players: [
    { id: 1, title: 'GM', name: 'Garry Kasparov', country: 'Russia', rating: '2851', style: 'Universal', bio: 'Widely regarded as the greatest chess player of all time, Garry Kasparov dominated competitive chess for two decades. Born in Baku in 1963, he became World Champion at 22 — the youngest in history at the time — defeating the formidable Anatoly Karpov in a legendary five-match series.', career: '1985–2000: World Championship era\nKasparov defeated Karpov in five legendary World Championship matches from 1984 to 1990. He held the world number one ranking for 225 months.\n\n1997: The Deep Blue match\nIn 1997, he famously lost a match to IBM\'s Deep Blue — the first time a computer defeated a reigning world champion under standard time controls.', achievements: [{ title: 'World Chess Champion', year: '1985–2000' }, { title: 'Peak FIDE Rating 2851', year: '1999' }, { title: 'World number 1 for 225 months', year: '1984–2005' }], best_games: [{ title: 'Kasparov vs. Topalov — The Immortal Game', event: 'Wijk aan Zee', year: '1999' }], image: '' },
    { id: 2, title: 'GM', name: 'Magnus Carlsen', country: 'Norway', rating: '2882', style: 'Universal', bio: 'Magnus Carlsen is a Norwegian grandmaster and the highest-rated player in chess history, achieving a peak rating of 2882 in 2014. Born in 1990, he became a grandmaster at just 13 years of age after winning the C group at Corus in Wijk aan Zee.', career: '2004: The prodigy emerges\nAt just 13 years old, Carlsen made headlines by winning the C group at Corus with 10½/13. His win over Sipke Ernst in 29 moves announced a talent unlike anything seen in a generation.\n\n2009–2010: The climb to world number one\nAt Nanjing Pearl Spring 2009, Carlsen achieved a performance rating of 3002 — one of the greatest tournament results in chess history. By December 2009 he surpassed Topalov as world number one.\n\n2013–2023: World Chess Champion\nCarlsen defeated Anand in Chennai 2013, becoming the 16th undisputed World Champion at age 22. He defended the title four times before voluntarily vacating it in 2022.', achievements: [{ title: 'FIDE World Chess Champion', year: '2013–2023' }, { title: 'Peak FIDE Rating 2882', year: '2014' }, { title: 'World Rapid Champion (6 titles)', year: '2014–2025' }, { title: 'World Blitz Champion (9 titles)', year: '2009–2025' }], best_games: [{ title: 'Carlsen vs. Karjakin — Game 10', event: 'World Championship Match', year: '2016' }], image: '' },
    { id: 3, title: 'GM', name: 'Bobby Fischer', country: 'USA', rating: '2785', style: 'Tactical', bio: 'Robert James Fischer, the 11th World Chess Champion. Born in 1943, became a grandmaster at 15 — a world record at the time. His intensity, genius, and turbulent personality made him a cultural phenomenon beyond chess.', career: '1956–1971: Rise to the top\nFischer won the US Championship eight times, starting at age 14. His 1971 Candidates campaign saw him defeat Taimanov and Larsen 6–0 each — results without precedent in professional chess.\n\n1972: The Match of the Century\nFischer\'s 1972 match against Spassky in Reykjavik became a global media sensation during the Cold War. He won 12.5–8.5 to become the first American World Champion.\n\n1975: Title forfeited\nFischer refused to defend his title against Anatoly Karpov in 1975, forfeiting the championship. He did not play another official match until 1992.', achievements: [{ title: 'World Chess Champion', year: '1972–1975' }, { title: 'US Chess Champion (8 times)', year: '1957–1967' }, { title: 'Youngest US Champion ever', year: '1957' }], best_games: [{ title: 'The Game of the Century vs. Donald Byrne', event: 'Rosenwald Trophy', year: '1956' }], image: '' },
  ],
  games: [
    { id: 1, title: 'The Opera Game', white: 'Paul Morphy', black: 'Duke of Brunswick & Count Isouard', white_name: 'Paul Morphy', black_name: 'Duke of Brunswick & Count Isouard', white_title: '', black_title: '', year: '1858', event: 'Paris Opera', result: '1-0', description: 'Played during a performance of Norma at the Paris Opera House, this game is the quintessential illustration of rapid development. Morphy declined material repeatedly, culminating in a breathtaking queen sacrifice on move 16.', pgn: '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#' },
    { id: 2, title: 'The Immortal Game', white: 'Adolf Anderssen', black: 'Lionel Kieseritzky', white_name: 'Adolf Anderssen', black_name: 'Lionel Kieseritzky', white_title: '', black_title: '', year: '1851', event: 'London', result: '1-0', description: 'Anderssen sacrificed both rooks, his bishop, and finally his queen — then delivered checkmate with three minor pieces.', pgn: '1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7#' },
    { id: 3, title: 'Game of the Century', white: 'Donald Byrne', black: 'Robert J. Fischer', white_name: 'Donald Byrne', black_name: 'Robert J. Fischer', white_title: '', black_title: '', year: '1956', event: 'Rosenwald Trophy', result: '0-1', description: "A 13-year-old Bobby Fischer sacrificed his queen on move 17, launching a forcing sequence of extraordinary depth.", pgn: '1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2#' },
  ],
  pdfs: [
    { id: 1, title: 'My System', author: 'Nimzowitsch', tag: 'Strategy', description: 'The foundational text of modern positional chess strategy.', content: "Nimzowitsch's My System, published in 1925, is arguably the most influential chess book ever written.", size: '2.4 MB', url: '', file_data: '', file_name: '', cover_image: '' },
    { id: 2, title: 'Chess Fundamentals', author: 'Capablanca', tag: 'Endgames', description: "The World Champion's essential guide covering endings, middle games, and openings.", content: "Capablanca's Chess Fundamentals, published in 1921, is lean and direct.", size: '1.8 MB', url: '', file_data: '', file_name: '', cover_image: '' },
  ],
};

async function loadData() {
  try {
    const PDF_COLS = 'id,title,author,tag,description,content,url,file_name,size,cover_image,created_at';
    const [articles, players, games, pdfs] = await Promise.all([
      sbSelect('articles', 'created_at.desc'),
      sbSelect('players',  'created_at.asc'),
      sbSelect('games',    'created_at.asc'),
      sbSelect('pdfs',     'created_at.asc', PDF_COLS),
    ]);
    return { articles, players, games, pdfs };
  } catch (err) {
    console.error('[64sq] loadData crashed:', err);
    return { articles: [], players: [], games: [], pdfs: [] };
  }
}
async function upsertItem(table, item) { const ok = await sbUpsert(table, item); if (!ok) showToast('Save failed — check console.'); return ok; }
async function deleteItemById(table, id) { const ok = await sbDelete(table, id); if (!ok) showToast('Delete failed — check console.'); return ok; }
async function seedDefaultData() { console.log('[64sq] Seeding default data…'); for (const a of defaultData.articles) await sbUpsert('articles', a); for (const p of defaultData.players) await sbUpsert('players', p); for (const g of defaultData.games) await sbUpsert('games', g); for (const d of defaultData.pdfs) await sbUpsert('pdfs', d); console.log('[64sq] Seed complete.'); }

const OPENINGS = [
  ['Sicilian Dragon','1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6'],
  ['Sicilian Najdorf','1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6'],
  ['Nimzo-Indian','1.d4 Nf6 2.c4 e6 3.Nc3 Bb4'],
  ['Grunfeld Defense','1.d4 Nf6 2.c4 g6 3.Nc3 d5'],
  ['Queens Gambit Accepted','1.d4 d5 2.c4 dxc4'],
  ['Queens Gambit Declined','1.d4 d5 2.c4 e6'],
  ['Ruy Lopez','1.e4 e5 2.Nf3 Nc6 3.Bb5'],
  ['Italian Game','1.e4 e5 2.Nf3 Nc6 3.Bc4'],
  ['Kings Gambit','1.e4 e5 2.f4'],
  ['Kings Indian','1.d4 Nf6 2.c4 g6'],
  ['Queens Gambit','1.d4 d5 2.c4'],
  ['London System','1.d4 d5 2.Nf3 Nf6 3.Bf4'],
  ['Sicilian Defense','1.e4 c5'],
  ['French Defense','1.e4 e6'],
  ['Caro-Kann','1.e4 c6'],
  ['English Opening','1.c4'],
  ['Reti Opening','1.Nf3'],
];
function detectOpening(pgn) {
  if (!pgn) return null;
  const clean = pgn.replace(/\d+\./g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = clean.split(' ').filter(Boolean);
  for (const [name, seq] of OPENINGS) {
    const seqTokens = seq.replace(/\d+\./g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    let gi = 0, matched = 0;
    for (const st of seqTokens) { while (gi < tokens.length && tokens[gi] !== st) gi++; if (gi < tokens.length) { matched++; gi++; } }
    if (matched === seqTokens.length) return name;
  }
  return null;
}





// ── Lichess cburnett pieces (exact) ────────────────────────────────────────
const PIECE_SVG = {
  wK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#fff" d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  wQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g></svg>`,
  wR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="m34 14-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="m31 29.5 1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g></svg>`,
  wB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
  wN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#fff" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#fff" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#000" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"/></g></svg>`,
  wP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#fff" stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,
  bK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.6V6"/><path fill="#000" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#000" d="M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path stroke-linejoin="miter" d="M20 8h5"/><path stroke="#ececec" d="M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9"/><path stroke="#ececec" d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  bQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" stroke-linecap="butt" d="M11 38.5a35 35 1 0 0 23 0"/><path fill="none" stroke="#ececec" d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"/></g></svg>`,
  bR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M14 29.5v-13h17v13z"/><path stroke-linecap="butt" d="M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z"/><path fill="none" stroke="#ececec" stroke-linejoin="miter" stroke-width="1" d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"/></g></svg>`,
  bB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke="#ececec" stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
  bN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#000" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#000" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3"/><path fill="#ececec" stroke="#ececec" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5"/><path fill="#ececec" stroke="none" d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z"/></g></svg>`,
  bP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z"/></svg>`,
};

function pieceHTML(pieceCode) { return PIECE_SVG[pieceCode] || ''; }

function pieceHTML(pieceCode) { return PIECE_SVG[pieceCode] || ''; }

function pieceHTML(pieceCode) { return PIECE_SVG[pieceCode] || ''; }

function pieceHTML(pieceCode) {
  return PIECE_SVG[pieceCode] || '';
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
function fenToBoard(fen) { return fen.split(' ')[0].split('/').map(function(row){const r=[];for(const ch of row){if(isNaN(ch)){r.push((ch===ch.toUpperCase()?'w':'b')+ch.toUpperCase());}else{for(let i=0;i<+ch;i++)r.push(null);}}return r;}); }
function cleanPGN(pgn) {
  if (!pgn) return '';
  return pgn
    .replace(/\{[^}]*\}/g, '').replace(/\([^)]*\)/g, '')
    .replace(/\$\d+/g, '').replace(/[?!]+/g, '').replace(/\d+\.\.\./g, '')
    .replace(/\s+/g, ' ').trim();
}

function parsePGN(pgn) {
  const clean = cleanPGN(pgn);
  const tokens = clean.replace(/\d+\./g, '').replace(/\s+/g, ' ').trim()
    .split(' ').filter(function(m) { return m && !m.match(/^\d/) && !['1-0','0-1','1/2-1/2','*'].includes(m); });
  const states = [], moveList = [];
  let board = fenToBoard(START_FEN), turn = 'w';
  states.push(board.map(function(r) { return [...r]; }));
  for (const move of tokens) {
    board = applyMove(board, move, turn);
    states.push(board.map(function(r) { return [...r]; }));
    moveList.push({ san: move, color: turn });
    turn = turn === 'w' ? 'b' : 'w';
  }
  return { states, moveList };
}
function applyMove(board,san,color){const b=board.map(function(r){return[...r];});try{if(san==='O-O'||san==='0-0'){const row=color==='w'?7:0;b[row][6]=color+'K';b[row][4]=null;b[row][5]=color+'R';b[row][7]=null;return b;}if(san==='O-O-O'||san==='0-0-0'){const row=color==='w'?7:0;b[row][2]=color+'K';b[row][4]=null;b[row][3]=color+'R';b[row][0]=null;return b;}const clean=san.replace(/[+#!?]/g,'');const promo=clean.includes('=')?clean.split('=')[1][0]:null;const s=clean.split('=')[0];let piece,rest;if('KQRBN'.includes(s[0])){piece=s[0];rest=s.slice(1);}else{piece='P';rest=s;}const isCapture=rest.includes('x');rest=rest.replace('x','');const dest=rest.slice(-2);const toC=dest.charCodeAt(0)-97;const toR=8-parseInt(dest[1]);const hint=rest.slice(0,-2);for(let r=0;r<8;r++){for(let c=0;c<8;c++){if(b[r][c]!==color+piece)continue;if(hint){if(hint.length===2){if(r!==8-parseInt(hint[1])||c!==hint.charCodeAt(0)-97)continue;}else if(isNaN(hint)){if(c!==hint.charCodeAt(0)-97)continue;}else{if(r!==8-parseInt(hint))continue;}}if(canMove(b,r,c,toR,toC,color,piece)){b[toR][toC]=promo?color+promo:b[r][c];b[r][c]=null;if(piece==='P'&&isCapture&&!board[toR][toC])b[r][toC]=null;return b;}}}}catch(e){}return b;}
function canMove(board,fr,fc,tr,tc,color,piece){const dr=tr-fr,dc=tc-fc;const target=board[tr][tc];if(target&&target[0]===color)return false;if(piece==='P'){const dir=color==='w'?-1:1;const sr=color==='w'?6:1;if(dc===0&&dr===dir&&!target)return true;if(dc===0&&dr===2*dir&&fr===sr&&!board[fr+dir][fc]&&!target)return true;if(Math.abs(dc)===1&&dr===dir)return true;return false;}if(piece==='N')return(Math.abs(dr)===2&&Math.abs(dc)===1)||(Math.abs(dr)===1&&Math.abs(dc)===2);if(piece==='K')return Math.abs(dr)<=1&&Math.abs(dc)<=1;if(piece==='R'){if(dr!==0&&dc!==0)return false;return pathClear(board,fr,fc,tr,tc);}if(piece==='B'){if(Math.abs(dr)!==Math.abs(dc))return false;return pathClear(board,fr,fc,tr,tc);}if(piece==='Q'){if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc))return false;return pathClear(board,fr,fc,tr,tc);}return false;}
function pathClear(board,fr,fc,tr,tc){const dr=Math.sign(tr-fr),dc=Math.sign(tc-fc);let r=fr+dr,c=fc+dc;while(r!==tr||c!==tc){if(board[r][c])return false;r+=dr;c+=dc;}return true;}
function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function getLegalMoves(board,r,c,color){const piece=board[r][c];if(!piece||piece[0]!==color)return[];const type=piece[1];const enemy=color==='w'?'b':'w';const moves=[];const slide=function(dirs){for(const[dr,dc]of dirs){let nr=r+dr,nc=c+dc;while(inBounds(nr,nc)){const t=board[nr][nc];if(!t){moves.push([nr,nc]);}else{if(t[0]===enemy)moves.push([nr,nc]);break;}nr+=dr;nc+=dc;}}};const step=function(dirs){for(const[dr,dc]of dirs){const nr=r+dr,nc=c+dc;if(inBounds(nr,nc)){const t=board[nr][nc];if(!t||t[0]===enemy)moves.push([nr,nc]);}}};if(type==='P'){const dir=color==='w'?-1:1;const sr=color==='w'?6:1;if(inBounds(r+dir,c)&&!board[r+dir][c]){moves.push([r+dir,c]);if(r===sr&&!board[r+2*dir][c])moves.push([r+2*dir,c]);}for(const dc of[-1,1]){if(inBounds(r+dir,c+dc)&&board[r+dir][c+dc]&&board[r+dir][c+dc][0]===enemy)moves.push([r+dir,c+dc]);}}else if(type==='R'){slide([[1,0],[-1,0],[0,1],[0,-1]]);}else if(type==='B'){slide([[1,1],[1,-1],[-1,1],[-1,-1]]);}else if(type==='Q'){slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);}else if(type==='N'){step([[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]);}else if(type==='K'){step([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);}return moves;}

let homeBoard=fenToBoard(START_FEN),homeSel=null,homeMoves=[],homeTurn='w';
function getHomePlayers(){const w=siteData.players[0];const b=siteData.players[1];const whiteName=w?((w.title?w.title+' ':'')+w.name):'White';const blackName=b?((b.title?b.title+' ':'')+b.name):'Black';return{whiteName,blackName};}
function buildHomeBoard(){const el=document.getElementById('chessBoard');if(!el)return;el.innerHTML='';el.className='chess-board-interactive';for(let r=0;r<8;r++){for(let c=0;c<8;c++){const sq=document.createElement('div');sq.className='isq '+((r+c)%2===0?'isq-light':'isq-dark');if(c===0){const lbl=document.createElement('span');lbl.className='sq-label sq-rank';lbl.textContent=8-r;sq.appendChild(lbl);}if(r===7){const lbl=document.createElement('span');lbl.className='sq-label sq-file';lbl.textContent=String.fromCharCode(97+c);sq.appendChild(lbl);}const piece=homeBoard[r][c];if(piece){const sp=document.createElement('span');sp.className='ipiece piece-svg '+(piece[0]==='w'?'wpiece':'bpiece');sp.innerHTML=PIECE_SVG[piece]||'';sq.appendChild(sp);}if(homeSel&&homeSel[0]===r&&homeSel[1]===c)sq.classList.add('isq-selected');if(homeMoves.some(function(m){return m[0]===r&&m[1]===c;})){sq.classList.add('isq-legal');if(homeBoard[r][c])sq.classList.add('isq-capture');}sq.addEventListener('click',(function(rr,cc){return function(){homeClick(rr,cc);};})(r,c));el.appendChild(sq);}}const{whiteName,blackName}=getHomePlayers();const ti=document.getElementById('turnIndicator');if(ti)ti.textContent=homeTurn==='w'?'\u2B1C '+whiteName+' to move':'\u2B1B '+blackName+' to move';const wpEl=document.getElementById('boardPlayerWhite');const bpEl=document.getElementById('boardPlayerBlack');if(wpEl)wpEl.textContent='\u2654 '+whiteName;if(bpEl)bpEl.textContent='\u265A '+blackName;}
function homeClick(r,c){if(homeSel){if(homeMoves.some(function(m){return m[0]===r&&m[1]===c;})){homeBoard[r][c]=homeBoard[homeSel[0]][homeSel[1]];homeBoard[homeSel[0]][homeSel[1]]=null;homeTurn=homeTurn==='w'?'b':'w';homeSel=null;homeMoves=[];playMoveSound();buildHomeBoard();return;}homeSel=null;homeMoves=[];}const piece=homeBoard[r][c];if(piece&&piece[0]===homeTurn){homeSel=[r,c];homeMoves=getLegalMoves(homeBoard,r,c,homeTurn);}buildHomeBoard();}
function resetBoard(){homeBoard=fenToBoard(START_FEN);homeSel=null;homeMoves=[];homeTurn='w';buildHomeBoard();}

const gameViewerStates={};
function buildGameBoard(containerId,boardState,flipped){const el=document.getElementById(containerId);if(!el)return;el.innerHTML='';el.className='chess-board-viewer';for(let rr=0;rr<8;rr++){for(let cc=0;cc<8;cc++){const r=flipped?7-rr:rr;const c=flipped?7-cc:cc;const sq=document.createElement('div');sq.className='vsq '+((r+c)%2===0?'vsq-light':'vsq-dark');const piece=boardState[r][c];if(piece){const sp=document.createElement('span');sp.className='vpiece piece-svg '+(piece[0]==='w'?'wpiece':'bpiece');sp.innerHTML=PIECE_SVG[piece]||'';sq.appendChild(sp);}el.appendChild(sq);}}}
function initGameViewer(vid, pgn) {
  const key = String(vid);
  let states, moveList;
  if (pgn && pgn.trim()) {
    const parsed = parsePGN(pgn);
    states = parsed.states; moveList = parsed.moveList;
  } else {
    states = [fenToBoard(START_FEN)]; moveList = [];
  }
  gameViewerStates[key] = { states, moveList, idx:0, flipped:false, playing:false, timer:null };
  buildGameBoard('board-' + key, states[0], false);
  updateGameNav(key);
  renderMoveList(key, moveList);
}
function renderMoveList(key, moveList) {
  const mlEl = document.getElementById('ml-' + key);
  const pgnEl = document.getElementById('pgn-' + key);
  if (!moveList || !moveList.length) {
    const empty = '<div style="padding:.5rem .7rem;font-family:var(--mono);font-size:.62rem;color:rgba(255,255,255,.3);">No moves</div>';
    if (mlEl) mlEl.innerHTML = empty;
    return;
  }
  let html = '';
  for (let i = 0; i < moveList.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    const w = moveList[i];
    const b = moveList[i + 1];
    html += '<div class="gv-move-row">'
      + '<span class="gv-move-num">' + num + '.</span>'
      + '<span class="gv-move-w pgn-move" data-idx="' + (i+1) + '" onclick="pgnMoveClick(\'' + key + '\',' + (i+1) + ')">' + w.san + '</span>'
      + (b ? '<span class="gv-move-b pgn-move" data-idx="' + (i+2) + '" onclick="pgnMoveClick(\'' + key + '\',' + (i+2) + ')">' + b.san + '</span>' : '<span></span>')
      + '</div>';
  }
  if (mlEl)  mlEl.innerHTML = html;
  if (pgnEl) pgnEl.innerHTML = html;
}
function renderClickablePgn(vid,pgn){const key=String(vid);const vs=gameViewerStates[key];renderMoveList(key,vs?vs.moveList:[]);}
function updateGameNav(vid) {
  const key = String(vid);
  const vs = gameViewerStates[key];
  if (!vs) return;
  const navEl = document.getElementById('movenav-' + key);
  if (navEl) navEl.textContent = 'Move ' + vs.idx + ' / ' + (vs.states.length - 1);
  const prev = document.getElementById('prev-' + key);
  const next = document.getElementById('next-' + key);
  if (prev) prev.disabled = vs.idx === 0;
  if (next) next.disabled = vs.idx === vs.states.length - 1;
  ['ml-' + key, 'pgn-' + key].forEach(function(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.querySelectorAll('.pgn-move').forEach(function(span) {
      const active = parseInt(span.dataset.idx) === vs.idx;
      span.classList.toggle('gv-move-active', active);
      if (active) span.scrollIntoView({ block: 'nearest' });
    });
  });
  if (vs.playing && vs.idx === vs.states.length - 1) stopAutoPlay(key);
}
function gameStep(vid, dir) {
  const key = String(vid);
  const vs = gameViewerStates[key];
  if (!vs) return;
  vs.idx = Math.max(0, Math.min(vs.states.length - 1, vs.idx + dir));
  buildGameBoard('board-' + key, vs.states[vs.idx], vs.flipped);
  updateGameNav(key);
  if (dir !== 0) playMoveSound();
}
function gameJump(vid,pos){const key=String(vid);const vs=gameViewerStates[key];if(!vs)return;vs.idx=pos==='start'?0:vs.states.length-1;buildGameBoard('board-'+key,vs.states[vs.idx],vs.flipped);updateGameNav(key);}
function flipBoard(vid){const key=String(vid);const vs=gameViewerStates[key];if(!vs)return;vs.flipped=!vs.flipped;buildGameBoard('board-'+key,vs.states[vs.idx],vs.flipped);}
function toggleAutoPlay(vid){const key=String(vid);const vs=gameViewerStates[key];if(!vs)return;if(vs.playing)stopAutoPlay(key);else startAutoPlay(key);}
function startAutoPlay(vid){const key=String(vid);const vs=gameViewerStates[key];if(!vs)return;if(vs.idx===vs.states.length-1)vs.idx=0;vs.playing=true;const btn=document.getElementById('play-'+key);if(btn)btn.textContent='\u23F8';vs.timer=setInterval(function(){if(vs.idx<vs.states.length-1){vs.idx++;buildGameBoard('board-'+key,vs.states[vs.idx],vs.flipped);updateGameNav(key);}else{stopAutoPlay(key);}},800);}
function stopAutoPlay(vid){const key=String(vid);const vs=gameViewerStates[key];if(!vs)return;vs.playing=false;clearInterval(vs.timer);const btn=document.getElementById('play-'+key);if(btn)btn.textContent='\u25B6';}

// ── Piece move sound (Web Audio API — no external file needed) ──────────────
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playMoveSound(type) {
  try {
    const ctx = getAudioCtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    // Crisp wood-knock sound
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      data[i] = Math.exp(-t * 80) * Math.sin(2 * Math.PI * 440 * t)
              + Math.exp(-t * 200) * (Math.random() * 2 - 1) * 0.3;
    }
    const src2 = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    src2.buffer = buf;
    src2.connect(gain);
    gain.connect(ctx.destination);
    src2.start();
  } catch(e) {}
}

let _activeViewerGameId=null;
document.addEventListener('keydown',function(e){if(!_activeViewerGameId)return;if(e.key==='ArrowLeft')gameStep(_activeViewerGameId,-1);if(e.key==='ArrowRight')gameStep(_activeViewerGameId,1);});

let currentPage='home';
function goHome(){currentPage='home';document.getElementById('homePage').style.display='block';document.getElementById('detailPage').style.display='none';window.scrollTo(0,0);}
function showDetailPage(html){currentPage='detail';document.getElementById('homePage').style.display='none';document.getElementById('detailPage').style.display='block';document.getElementById('detailContent').innerHTML=html;window.scrollTo(0,0);setTimeout(initArticleBoards,120);}
function scrollToSection(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});}

function buildWhatNext(currentType,currentId){const items=[];const arts=siteData.articles.filter(function(a){return a.published!==false&&(currentType!=='article'||a.id!==currentId);});const plrs=siteData.players.filter(function(p){return currentType!=='player'||p.id!==currentId;});const gms=siteData.games.filter(function(g){return currentType!=='game'||g.id!==currentId;});const pick=function(arr){return arr.length?arr[currentId%arr.length]:null;};const a=pick(arts);const p=pick(plrs);const g=pick(gms);if(a)items.push({type:'article',id:a.id,label:a.tag||'Article',title:a.title,sub:(a.date||'')+(a.read_time?' &middot; '+a.read_time+' read':'')});if(p)items.push({type:'player',id:p.id,label:'Player',title:(p.title?p.title+' ':'')+p.name,sub:p.country||''});if(g)items.push({type:'game',id:g.id,label:'Game',title:g.title,sub:g.white+' vs '+g.black});if(!items.length)return'';return'<div class="whatnext-strip"><div class="whatnext-title">What to read next</div><div class="whatnext-cards">'+items.map(function(it){const oc=it.type==='article'?'openArticle('+it.id+')':it.type==='player'?'openPlayer('+it.id+')':'openGame('+it.id+')';return'<div class="whatnext-card" onclick="'+oc+'"><div class="whatnext-label">'+it.label+'</div><div class="whatnext-card-title">'+it.title+'</div><div class="whatnext-card-sub">'+it.sub+'</div></div>';}).join('')+'</div></div>';}

function buildLatestStrip(){const el=document.getElementById('latestStrip');if(!el)return;const all=[];siteData.articles.filter(function(a){return a.published!==false;}).forEach(function(a){all.push({type:'article',id:a.id,label:a.tag||'Article',title:a.title,ts:a.id});});siteData.players.forEach(function(p){all.push({type:'player',id:p.id,label:'Player',title:(p.title?p.title+' ':'')+p.name,ts:p.id});});siteData.games.forEach(function(g){all.push({type:'game',id:g.id,label:'Game',title:g.title,ts:g.id});});all.sort(function(a,b){return b.ts-a.ts;});const recent=all.slice(0,4);if(!recent.length){el.style.display='none';return;}el.style.display='block';el.innerHTML='<div class="latest-inner"><div class="latest-heading">Latest additions</div><div class="latest-cards">'+recent.map(function(it){const oc=it.type==='article'?'openArticle('+it.id+')':it.type==='player'?'openPlayer('+it.id+')':'openGame('+it.id+')';return'<div class="latest-card" onclick="'+oc+'"><div class="latest-label">'+it.label+'</div><div class="latest-card-title">'+it.title+'</div></div>';}).join('')+'</div></div>';}

let searchOpen=false;
function toggleSearch(){searchOpen=!searchOpen;const overlay=document.getElementById('searchOverlay');if(searchOpen){overlay.classList.add('open');setTimeout(function(){document.getElementById('searchInput').focus();},100);runSearch();}else{overlay.classList.remove('open');}}
function closeSearch(){searchOpen=false;document.getElementById('searchOverlay').classList.remove('open');}
function runSearch(){const q=(document.getElementById('searchInput').value||'').toLowerCase().trim();const res=document.getElementById('searchResults');if(!q){res.innerHTML='<p class="search-empty">Start typing to search articles, players, games and books.</p>';return;}const hits=[];siteData.articles.filter(function(a){return a.published!==false;}).forEach(function(a){if((a.title+' '+(a.tag||'')+' '+(a.excerpt||'')).toLowerCase().includes(q))hits.push({label:a.tag||'Article',title:a.title,sub:(a.date||'')+(a.read_time?' &middot; '+a.read_time+' read':''),onclick:'openArticle('+a.id+')'});});siteData.players.forEach(function(p){if((p.name+' '+(p.country||'')+' '+(p.bio||'')).toLowerCase().includes(q))hits.push({label:p.title||'Player',title:p.name,sub:(p.country||'')+(p.rating?' &middot; '+p.rating:''),onclick:'openPlayer('+p.id+')'});});siteData.games.forEach(function(g){if((g.title+' '+g.white+' '+g.black+' '+(g.event||'')).toLowerCase().includes(q))hits.push({label:'Game '+g.year,title:g.title,sub:g.white+' vs '+g.black,onclick:'openGame('+g.id+')'});});siteData.pdfs.forEach(function(p){if((p.title+' '+p.author+' '+(p.description||'')).toLowerCase().includes(q))hits.push({label:p.tag||'PDF',title:p.title,sub:'by '+p.author,onclick:'openPdf('+p.id+')'});});if(!hits.length){res.innerHTML='<p class="search-empty">No results for &ldquo;'+q+'&rdquo;</p>';return;}res.innerHTML=hits.map(function(h){return'<div class="search-hit" onclick="'+h.onclick+';closeSearch()"><div class="search-hit-label">'+h.label+'</div><div class="search-hit-title">'+h.title+'</div><div class="search-hit-sub">'+h.sub+'</div></div>';}).join('');}


let articleBoardCounter = 0;

function detectInlinePGN(text) {
  if (!text) return null;
  const t = text.trim();
  // Must look like a move sequence: starts with 1. and has at least 2 move numbers
  if (/^\d+\.\s*[A-Za-z]/.test(t) && (t.match(/\d+\./g) || []).length >= 2) return t;
  return null;
}

function renderArticleBody(content) {
  if (!content) return '';
  const lines = content.split('\n');
  let html = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const pgn = detectInlinePGN(line);
    if (pgn) {
      const bid = 'ab-' + (++articleBoardCounter);
      html += '<div class="article-board-wrap">'
        + '<div class="article-board-label">&#9817; Interactive Position</div>'
        + '<div class="article-board-inner">'
          + '<div class="article-board-left">'
            + '<div class="ab-player">&#9818; Black</div>'
            + '<div id="board-' + bid + '" class="chess-board-viewer ab-board"></div>'
            + '<div class="ab-player">&#9812; White</div>'
          + '</div>'
          + '<div class="article-board-right">'
            + '<div class="gv-movelist article-movelist" id="ml-' + bid + '"></div>'
            + '<div class="gv-nav article-board-nav">'
              + '<button class="gv-btn" onclick="gameJump(\'' + bid + '\',\'start\')">&#124;&#9664;</button>'
              + '<button class="gv-btn" id="prev-' + bid + '" onclick="gameStep(\'' + bid + '\',-1)">&#9664;</button>'
              + '<button class="gv-btn" id="play-' + bid + '" onclick="toggleAutoPlay(\'' + bid + '\')">&#9654;</button>'
              + '<span class="gv-movenav" id="movenav-' + bid + '">Move 0</span>'
              + '<button class="gv-btn" id="next-' + bid + '" onclick="gameStep(\'' + bid + '\',1)">&#9654;</button>'
              + '<button class="gv-btn" onclick="gameJump(\'' + bid + '\',\'end\')">&#9654;&#124;</button>'
              + '<button class="gv-btn" onclick="flipBoard(\'' + bid + '\')">&#8645;</button>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="ab-pgn-data" style="display:none" data-bid="' + bid + '">' + escHtml(pgn) + '</div>'
        + '</div>';
    } else {
      html += '<p>' + escHtml(line) + '</p>';
    }
  }
  return html;
}

function initArticleBoards() {
  document.querySelectorAll('.ab-pgn-data').forEach(function(el) {
    const bid = el.dataset.bid;
    const pgn = el.textContent;
    if (bid && pgn) setTimeout(function() { initGameViewer(bid, pgn); }, 80);
  });
}

function openArticle(id){const a=siteData.articles.find(function(x){return x.id===id;});if(!a)return;trackView('article',id);articleBoardCounter=0;const bodyHTML=renderArticleBody(a.content||a.excerpt||'').split('\n').filter(function(p){return p.trim();}).map(function(p){return'<p>'+p.trim()+'</p>';}).join('');const heroImg=a.image?'<img class="article-detail-hero-img" src="'+a.image+'" alt="'+escHtml(a.title)+'"/>':'';const related=siteData.articles.filter(function(x){return x.published!==false&&x.id!==id&&x.tag===a.tag;}).slice(0,2);const relatedHTML=related.length?'<div class="related-strip"><div class="related-title">More in '+escHtml(a.tag)+'</div><div class="related-cards">'+related.map(function(r){return'<div class="related-card" onclick="openArticle('+r.id+')"><div class="related-tag">'+escHtml(r.tag)+'</div><div class="related-card-title">'+escHtml(r.title)+'</div><div class="related-card-meta">'+(r.read_time||'')+'</div></div>';}).join('')+'</div></div>':'';showDetailPage('<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div><div class="article-detail">'+heroImg+'<div class="article-detail-tag">'+escHtml(a.tag||'General')+'</div><h1 class="article-detail-title">'+escHtml(a.title)+'</h1><div class="article-detail-meta">'+escHtml(a.date||'')+' &nbsp;&middot;&nbsp; '+escHtml(a.read_time||'')+' read</div><div class="article-detail-body">'+bodyHTML+'</div>'+relatedHTML+buildWhatNext('article',id)+'</div>');}


function openPlayer(id) {
  const p = siteData.players.find(function(x) { return x.id === id; });
  if (!p) return;
  trackView('player', id);
  const achievements = Array.isArray(p.achievements) ? p.achievements : [];
  const bestGames    = Array.isArray(p.best_games)   ? p.best_games   : [];

  const avatarHTML = p.image
    ? '<img class="pd-hero-photo" src="' + p.image + '" alt="' + escHtml(p.name) + '"/>'
    : '<div class="pd-hero-initials">' + escHtml(p.name[0]) + '</div>';

  const titlePill = p.title ? '<span class="pd-title-pill">' + escHtml(p.title) + '</span>' : '';
  const stylePill = p.style ? '<span class="pd-style-pill">' + escHtml(p.style) + '</span>' : '';

  // ── Bio panel ────────────────────────────────────────────────
  const bioParagraphs = (p.bio || 'No biography available.').split('\n')
    .filter(function(l) { return l.trim(); })
    .map(function(l) { return '<p>' + escHtml(l.trim()) + '</p>'; }).join('');
  const bioHTML = '<div class="pd-bio-body">' + bioParagraphs + '</div>';

  // ── Achievements ─────────────────────────────────────────────
  const achRows = achievements.length
    ? achievements.map(function(a) {
        return '<tr><td>' + escHtml(a.title) + '</td><td>' + escHtml(a.year) + '</td></tr>';
      }).join('')
    : '<tr><td colspan="2" style="color:var(--mid);font-size:.85rem;padding:.8rem 0">No achievements listed.</td></tr>';
  const achHTML = '<table class="pd-ach-table"><tbody>' + achRows + '</tbody></table>';

  // ── Career ───────────────────────────────────────────────────
  function buildStatBar() {
    const ratingVal = (p.rating || '—');
    const titles = achievements.filter(function(a) { return /champion|world|title/i.test(a.title); }).length;
    const years = achievements.map(function(a) { return (a.year||'').match(/\d{4}/g)||[]; })
      .reduce(function(acc,y) { return acc.concat(y); }, []).map(Number).filter(Boolean);
    const span = years.length >= 2 ? (Math.max(...years)-Math.min(...years)) + ' yrs' : '—';
    const stats = [
      { num: titles || achievements.length, lbl: 'Major Titles' },
      { num: ratingVal, lbl: 'Peak Rating' },
      { num: span, lbl: 'Career Span' },
      { num: bestGames.length || '—', lbl: 'Notable Games' },
    ];
    return '<div class="pd-stats-bar">'
      + stats.map(function(s) {
          return '<div class="pd-stat-card"><span class="pd-stat-num">' + escHtml(String(s.num))
            + '</span><span class="pd-stat-lbl">' + escHtml(s.lbl) + '</span></div>';
        }).join('') + '</div>';
  }

  function buildCareerEras(text) {
    if (!text || !text.trim()) return '<div class="pd-era"><p style="color:var(--mid)">No career summary yet.</p></div>';
    const lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
    const headingRe = /^(\d{4}[\s\-–—]+\d{4}|\d{4}|[A-Z][A-Za-z\s&,]{0,40}:)/;
    let eras = [], current = null;
    lines.forEach(function(line) {
      if (headingRe.test(line) && line.length < 60) {
        if (current) eras.push(current);
        current = { head: line, body: [] };
      } else {
        if (!current) current = { head: null, body: [] };
        current.body.push(line);
      }
    });
    if (current) eras.push(current);
    if (eras.length === 1 && !eras[0].head) {
      return '<div class="pd-era">' + eras[0].body.map(function(b) { return '<p>' + escHtml(b) + '</p>'; }).join('') + '</div>';
    }
    return eras.map(function(era) {
      const yearMatch = era.head ? (era.head.match(/\d{4}[\s\-–—]+\d{4}|\d{4}/)||[null])[0] : null;
      const headText  = era.head ? era.head.replace(/^[\d\-–—\s:]+/,'').trim() || era.head : null;
      const headerHTML = headText
        ? '<div class="pd-era-head">'
            + (yearMatch ? '<span class="pd-era-year">' + escHtml(yearMatch) + '</span>' : '')
            + '<h3 class="pd-era-title">' + escHtml(headText) + '</h3>'
          + '</div>' : '';
      return '<div class="pd-era">' + headerHTML
        + era.body.map(function(b) { return '<p>' + escHtml(b) + '</p>'; }).join('') + '</div>';
    }).join('');
  }

  const careerHTML = buildStatBar() + buildCareerEras(p.career || '');

  // ── Best Games ───────────────────────────────────────────────
    const gamesHTML = !bestGames.length
    ? '<div class="gt-empty">No games listed yet. Add PGN in the admin panel.</div>'
    : (function() {
        const listItems = bestGames.map(function(g, gi) {
          const bgvid  = 'bgv-' + id + '-' + gi;
          const hasPgn = !!(g.pgn && g.pgn.trim());
          return '<div class="gt-item" id="gtitem-' + bgvid + '" onclick="selectBestGame(\'' + bgvid + '\',\'' + escHtml(g.pgn||'') + '\',' + gi + ',' + id + ')">'
            + '<div class="gt-item-num">' + String(gi+1).padStart(2,'0') + '</div>'
            + '<div class="gt-item-body">'
              + '<div class="gt-item-title">' + escHtml(g.title) + '</div>'
              + '<div class="gt-item-meta">'
                + escHtml(g.event||'') + (g.year ? ' · ' + escHtml(g.year) : '')
                + (g.white ? ' · ' + escHtml(g.white||'') + ' vs ' + escHtml(g.black||'') : '')
              + '</div>'
            + '</div>'
            + '<div class="gt-item-icon">' + (hasPgn ? '▶' : '—') + '</div>'
            + '</div>';
        }).join('');

        // Stage area — board + moves shown when a game is selected
        const stage = '<div class="gt-stage" id="gt-stage-' + id + '">'
          + '<div class="gt-stage-empty" id="gt-stage-empty-' + id + '">'
            + '<div class="gt-stage-empty-icon">♟</div>'
            + '<div class="gt-stage-empty-text">Select a game to view</div>'
          + '</div>'
          + '<div class="gt-stage-content" id="gt-stage-content-' + id + '" style="display:none;">'
            + '<div class="gt-stage-header">'
              + '<div class="gt-stage-title-wrap">'
                + '<div class="gt-stage-game-title" id="gt-stage-title-' + id + '"></div>'
                + '<div class="gt-stage-game-meta" id="gt-stage-meta-' + id + '"></div>'
              + '</div>'
              + '<button class="gt-stage-close" onclick="closeBestGame(' + id + ')">✕ Close</button>'
            + '</div>'
            + '<div class="gt-stage-body">'
              + '<div class="gt-stage-board-wrap">'
                + '<div class="gt-board-player gt-player-black" id="gt-black-' + id + '">♛ Black</div>'
                + '<div id="board-gt-' + id + '" class="chess-board-viewer gt-board"></div>'
                + '<div class="gt-board-player gt-player-white" id="gt-white-' + id + '">♚ White</div>'
              + '</div>'
              + '<div class="gt-stage-moves-wrap">'
                + '<div class="gt-moves-list gv-movelist" id="ml-gt-' + id + '"></div>'
                + '<div class="gt-nav gv-nav">'
                  + '<button class="gv-btn gt-btn" onclick="gameJump(\'gt-' + id + '\',\'start\')" title="Start">⏮</button>'
                  + '<button class="gv-btn gt-btn" id="prev-gt-' + id + '" onclick="gameStep(\'gt-' + id + '\',-1)" title="Back">◀</button>'
                  + '<button class="gv-btn gt-btn" id="play-gt-' + id + '" onclick="toggleAutoPlay(\'gt-' + id + '\')" title="Play">▶</button>'
                  + '<span class="gv-movenav" id="movenav-gt-' + id + '">Move 0</span>'
                  + '<button class="gv-btn gt-btn" id="next-gt-' + id + '" onclick="gameStep(\'gt-' + id + '\',1)" title="Next">▶</button>'
                  + '<button class="gv-btn gt-btn" onclick="gameJump(\'gt-' + id + '\',\'end\')" title="End">⏭</button>'
                  + '<button class="gv-btn gt-btn" onclick="flipBoard(\'gt-' + id + '\')" title="Flip">⇅</button>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>';

        return '<div class="gt-theatre">'
          + '<div class="gt-list">' + listItems + '</div>'
          + stage
          + '</div>';
      })();


  showDetailPage(
    '<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div>'
    + '<div class="pd-hero-banner">'
      + avatarHTML
      + '<div class="pd-hero-info">'
        + '<div class="pd-hero-name">' + escHtml(p.name) + '</div>'
        + '<div class="pd-hero-country">' + escHtml((p.country||'').toUpperCase()) + '</div>'
        + '<div class="pd-hero-meta">' + titlePill + stylePill + '<span class="pd-hero-badge">Peak: ' + escHtml(p.rating||'N/A') + '</span></div>'
      + '</div>'
    + '</div>'
    + '<div class="pd-tabs-row">'
      + '<button class="pd-tab-btn active" onclick="pdSwitchTab(this,\'bio\')">Biography</button>'
      + '<button class="pd-tab-btn" onclick="pdSwitchTab(this,\'career\')">Career</button>'
      + '<button class="pd-tab-btn" onclick="pdSwitchTab(this,\'achievements\')">Achievements</button>'
      + '<button class="pd-tab-btn" onclick="pdSwitchTab(this,\'games\')">Best Games</button>'
    + '</div>'
    + '<div class="pd-panels">'
      + '<div class="pd-pane active" id="pd-bio">'       + bioHTML    + '</div>'
      + '<div class="pd-pane"        id="pd-career">'    + careerHTML + '</div>'
      + '<div class="pd-pane"        id="pd-achievements">' + achHTML + '</div>'
      + '<div class="pd-pane"        id="pd-games">'     + gamesHTML  + '</div>'
    + '</div>'
    + buildWhatNext('player', id)
  );
}


// ── Game Theatre: select & display a best game ────────────────────────────────
function selectBestGame(vid, pgn, gi, playerId) {
  const stageVid = 'gt-' + playerId;

  // Update item highlight
  document.querySelectorAll('.gt-item').forEach(function(el) {
    el.classList.remove('gt-item-active');
  });
  const item = document.getElementById('gtitem-' + vid);
  if (item) item.classList.add('gt-item-active');

  // Get game metadata from best_games
  const p = siteData.players.find(function(x) { return x.id === playerId; });
  const g = p && Array.isArray(p.best_games) ? p.best_games[gi] : null;

  // Update stage header
  const titleEl = document.getElementById('gt-stage-title-' + playerId);
  const metaEl  = document.getElementById('gt-stage-meta-'  + playerId);
  const blackEl = document.getElementById('gt-black-' + playerId);
  const whiteEl = document.getElementById('gt-white-' + playerId);
  if (titleEl) titleEl.textContent = g ? g.title  : '';
  if (metaEl)  metaEl.textContent  = g ? (g.event||'') + (g.year ? ' · ' + g.year : '') : '';
  if (blackEl) blackEl.textContent = '♛ ' + (g && g.black  ? g.black  : 'Black');
  if (whiteEl) whiteEl.textContent = '♚ ' + (g && g.white  ? g.white  : 'White');

  // Show stage, hide empty
  const emptyEl   = document.getElementById('gt-stage-empty-'   + playerId);
  const contentEl = document.getElementById('gt-stage-content-' + playerId);
  if (emptyEl)   emptyEl.style.display   = 'none';
  if (contentEl) contentEl.style.display = 'block';

  // Re-map board id to the shared stage board
  // The board element is gt-board-{playerId}, viewer key is gt-{playerId}
  _activeViewerGameId = stageVid;
  if (pgn && pgn.trim()) {
    setTimeout(function() {
      initGameViewer(stageVid, pgn);
      // Also wire up board id
      const boardEl = document.getElementById('board-' + stageVid);
      // buildGameBoard uses 'board-' + key so this is already correct
    }, 80);
  } else {
    // No PGN — show starting position
    const vs = gameViewerStates[stageVid] || {};
    vs.states   = [fenToBoard(START_FEN)];
    vs.moveList = [];
    vs.idx = 0; vs.flipped = false; vs.playing = false; vs.timer = null;
    gameViewerStates[stageVid] = vs;
    buildGameBoard('board-' + stageVid, vs.states[0], false);
    renderMoveList(stageVid, []);
    updateGameNav(stageVid);
  }
}

function closeBestGame(playerId) {
  const emptyEl   = document.getElementById('gt-stage-empty-'   + playerId);
  const contentEl = document.getElementById('gt-stage-content-' + playerId);
  if (emptyEl)   emptyEl.style.display   = 'block';
  if (contentEl) contentEl.style.display = 'none';
  document.querySelectorAll('.gt-item').forEach(function(el) {
    el.classList.remove('gt-item-active');
  });
  if (_activeViewerGameId === 'gt-' + playerId) _activeViewerGameId = null;
}

function pdSwitchTab(btn, id) {
  const wrap = btn.closest('.pd-tabs-row');
  if (wrap) wrap.querySelectorAll('.pd-tab-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.pd-pane').forEach(function(p) { p.classList.remove('active'); });
  const panel = document.getElementById('pd-' + id);
  if (panel) panel.classList.add('active');
}

function toggleBestGameViewer(vid, pgn) {
  const el = document.getElementById(vid);
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  document.querySelectorAll('.pd-game-viewer-wrap').forEach(function(v) {
    if (v.id !== vid) {
      v.style.display = 'none';
      const ob = document.getElementById('playtoggle-' + v.id);
      if (ob) ob.textContent = '▶ Play';
      const oc = document.getElementById('card-' + v.id);
      if (oc) oc.classList.remove('pd-game-card-open');
    }
  });
  el.style.display = isOpen ? 'none' : 'block';
  const playBtn = document.getElementById('playtoggle-' + vid);
  if (playBtn) playBtn.textContent = isOpen ? '▶ Play' : '⏸ Close';
  const card = document.getElementById('card-' + vid);
  if (card) card.classList.toggle('pd-game-card-open', !isOpen);
  if (!isOpen && pgn && pgn.trim()) {
    _activeViewerGameId = vid;
    setTimeout(function() { initGameViewer(vid, pgn); }, 80);
  }
}




function openGame(id){const g=siteData.games.find(function(x){return x.id===id;});if(!g)return;trackView('game',id);const vid='d'+id;const boardId='board-'+vid;const opening=detectOpening(g.pgn);const openingBadge=opening?'<span class="opening-badge">\u265E '+escHtml(opening)+'</span>':'';const whiteLbl=(g.white_title?g.white_title+' ':'')+( g.white_name||g.white||'White');const blackLbl=(g.black_title?g.black_title+' ':'')+( g.black_name||g.black||'Black');showDetailPage('<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div><div class="game-detail"><div class="game-detail-header"><div class="game-detail-num">Games of the Century</div><h1 class="game-detail-title">'+escHtml(g.title)+'</h1>'+openingBadge+'<div class="game-detail-players">'+escHtml(g.white)+' (White) vs '+escHtml(g.black)+' (Black) &nbsp;&middot;&nbsp; '+escHtml(g.event||'')+' '+escHtml(g.year||'')+' &nbsp;&middot;&nbsp; '+escHtml(g.result||'')+'</div></div><div class="game-detail-body"><div class="game-detail-left"><p class="game-detail-desc">'+escHtml(g.description||'A landmark game in chess history.')+'</p>'+(g.pgn?'<div class="game-detail-pgn-label">PGN Notation</div><div class="game-detail-pgn-box"><div id="pgn-'+vid+'"></div></div>':'')+'</div><div class="game-detail-right"><div class="board-player-strip board-player-black">\u265A '+escHtml(blackLbl)+'</div><div id="'+boardId+'" class="chess-board-viewer"></div><div class="board-player-strip board-player-white">\u2654 '+escHtml(whiteLbl)+'</div><div class="gv-nav"><button class="gv-btn" title="Start" onclick="gameJump(\''+vid+'\',\'start\')">\u007C\u25C0</button><button class="gv-btn" id="prev-'+vid+'" onclick="gameStep(\''+vid+'\',-1)">\u25C0</button><button class="gv-btn" id="play-'+vid+'" onclick="toggleAutoPlay(\''+vid+'\')">\u25B6</button><span class="gv-movenav" id="movenav-'+vid+'">Move 0</span><button class="gv-btn" id="next-'+vid+'" onclick="gameStep(\''+vid+'\',1)">\u25B6</button><button class="gv-btn" title="End" onclick="gameJump(\''+vid+'\',\'end\')">\u25B6\u007C</button><button class="gv-btn" id="flip-'+vid+'" title="Flip" onclick="flipBoard(\''+vid+'\')">&#8645;</button></div></div></div>'+buildWhatNext('game',id)+'</div>');_activeViewerGameId=vid;setTimeout(function(){initGameViewer(vid,g.pgn||'');},50);}

async function openPdf(id){showToast('Loading\u2026');let p=await sbSelectOne('pdfs',id);if(!p){p=siteData.pdfs.find(function(x){return x.id===id;});}if(!p){showToast('PDF not found.');return;}trackView('pdf',id);const contentHTML=(p.content||'').split('\n').filter(function(x){return x.trim();}).map(function(x){return'<p>'+escHtml(x.trim())+'</p>';}).join('');let downloadBtn;if(p.file_data){downloadBtn='<a class="pdf-download-btn" href="'+p.file_data+'" download="'+escHtml(p.file_name||p.title+'.pdf')+'">\u2193 Download PDF</a>';}else if(p.url){downloadBtn='<a class="pdf-download-btn" href="'+escHtml(p.url)+'" target="_blank" rel="noopener">\u2193 Open PDF</a>';}else{downloadBtn='<button class="pdf-download-btn" onclick="showToast(\'No file attached.\')">\u2193 Download PDF</button>';}let viewerHTML='';const viewerSrc=p.file_data||p.url;if(viewerSrc){viewerHTML='<div style="margin-top:2rem;"><p style="font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;">Document Preview</p><iframe class="pdf-viewer-embed" src="'+viewerSrc+'" title="'+escHtml(p.title)+'"></iframe></div>';}const coverImg=p.cover_image?'<img src="'+p.cover_image+'" alt="'+escHtml(p.title)+'" style="width:100%;max-height:280px;object-fit:cover;margin-bottom:2rem;border:1px solid var(--rule);">':'';const tagBadge=p.tag?'<span class="pdf-tag-badge">'+escHtml(p.tag)+'</span>':'';showDetailPage('<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div><div class="pdf-detail">'+coverImg+'<div class="pdf-detail-header"><div class="pdf-detail-icon">PDF</div><div><h1 class="pdf-detail-title">'+escHtml(p.title)+'</h1><div class="pdf-detail-author">by '+escHtml(p.author)+'</div>'+tagBadge+(p.size?'<div class="pdf-detail-size">'+escHtml(p.size)+'</div>':'')+(p.file_name?'<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);margin-top:.3rem;">File: '+escHtml(p.file_name)+'</div>':'')+'</div></div>'+(p.description?'<p class="pdf-detail-desc">'+escHtml(p.description)+'</p>':'')+downloadBtn+viewerHTML+(contentHTML?'<div class="pdf-detail-content" style="margin-top:2.5rem;padding-top:2.5rem;border-top:1px solid var(--rule);">'+contentHTML+'</div>':'')+buildWhatNext('pdf',id)+'</div>');}

let articlesShowAll = false;
function makeArticleCard(a) {
  const imgHTML = a.image ? '<img class="article-card-img" src="' + a.image + '" alt="' + escHtml(a.title) + '"/>' : '';
  const readTime = a.read_time ? escHtml(a.read_time) + ' read' : '';
  const meta = [escHtml(a.date || ''), readTime].filter(Boolean).join(' &nbsp;&middot;&nbsp; ');
  return '<div class="article-card fade-in" onclick="openArticle(' + a.id + ')">'
    + imgHTML + '<div class="article-card-body">'
    + '<div class="article-tag">' + escHtml(a.tag || 'General') + '</div>'
    + '<div class="article-title">' + escHtml(a.title) + '</div>'
    + '<div class="article-excerpt">' + escHtml(a.excerpt || '') + '</div>'
    + '<div class="article-card-footer">'
    + '<span class="article-meta">' + meta + '</span>'
    + '<span class="article-read-link">Read &nbsp;&#8594;</span>'
    + '</div></div></div>';
}
function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  const pub = siteData.articles.filter(function(a) { return a.published !== false; });
  if (!pub.length) { grid.innerHTML = '<p class="empty-msg">No articles yet.</p>'; return; }
  const LIMIT = 6;
  const visible = articlesShowAll ? pub : pub.slice(0, LIMIT);
  grid.innerHTML = visible.map(makeArticleCard).join('');
  const existing = document.getElementById('articles-show-more');
  if (existing) existing.remove();
  if (pub.length > LIMIT && !articlesShowAll) {
    const btn = document.createElement('div');
    btn.id = 'articles-show-more';
    btn.className = 'articles-show-more-wrap';
    btn.innerHTML = '<button class="articles-show-more-btn" onclick="showAllArticles()">Show all ' + pub.length + ' articles &nbsp;&#8594;</button>';
    grid.parentNode.insertBefore(btn, grid.nextSibling);
  }
  setTimeout(initFadeIn, 80);
}
function showAllArticles() { articlesShowAll = true; renderArticles(); }

function renderPlayers(){const grid=document.getElementById('playersGrid');if(!grid)return;if(!siteData.players.length){grid.innerHTML='<p class="empty-msg">No players yet.</p>';return;}grid.innerHTML=siteData.players.map(function(p){const avatarHTML=p.image?'<img class="player-avatar-photo" src="'+p.image+'" alt="'+escHtml(p.name)+'"/>':'<div class="player-avatar">'+escHtml(p.name[0])+'</div>';return'<div class="player-card fade-in" onclick="openPlayer('+p.id+')"><div class="player-card-header">'+avatarHTML+'<div><div class="player-name">'+(p.title?'<span class="player-title-badge">'+escHtml(p.title)+'</span> ':'')+escHtml(p.name)+'</div><div class="player-country">'+escHtml(p.country||'')+'</div></div></div><div class="player-card-body"><div class="player-rating">Peak Rating <strong>'+escHtml(p.rating||'N/A')+'</strong></div>'+(p.style?'<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);letter-spacing:.1em;text-transform:uppercase;margin-top:.5rem;">'+escHtml(p.style)+'</div>':'')+'<div style="margin-top:1rem;font-family:var(--mono);font-size:.62rem;color:var(--mid);letter-spacing:.08em;">Click to view full profile \u2192</div></div></div>';}).join('');}

let activePdfTag='All';
function renderGames(){const list=document.getElementById('gamesList');if(!list)return;if(!siteData.games.length){list.innerHTML='<p class="empty-msg">No games yet.</p>';return;}list.innerHTML=siteData.games.map(function(g,i){const opening=detectOpening(g.pgn);const gid=String(g.id);const blackName=escHtml(g.black_name||g.black||'Black');const whiteName=escHtml(g.white_name||g.white||'White');return'<div class="game-entry fade-in"><div class="game-row" onclick="toggleGameViewer(\'gv-'+gid+'\','+gid+')"><div class="game-num">'+String(i+1).padStart(2,'0')+'</div><div><div class="game-title">'+escHtml(g.title)+(opening?' <span class="opening-badge-sm">\u265E '+escHtml(opening)+'</span>':'')+'</div><div class="game-meta">'+escHtml(g.white||'')+' vs '+escHtml(g.black||'')+' &nbsp;&middot;&nbsp; '+escHtml(g.event||'')+' &nbsp;&middot;&nbsp; '+escHtml(g.result||'')+'</div></div><div class="game-right"><div class="game-year">'+escHtml(g.year||'')+'</div><div class="game-expand-icon">\u25BE</div></div></div><div class="game-viewer" id="gv-'+gid+'" style="display:none;"><div class="game-viewer-inner"><div class="gv-board-wrap"><div class="board-player-strip board-player-black">\u265A '+blackName+'</div><div id="board-'+gid+'" class="chess-board-viewer"></div><div class="board-player-strip board-player-white">\u2654 '+whiteName+'</div></div><div class="gv-controls"><div class="gv-pgn" id="pgn-'+gid+'"></div><div class="gv-nav"><button class="gv-btn" onclick="gameJump(\''+gid+'\',\'start\')">\u007C\u25C0</button><button class="gv-btn" id="prev-'+gid+'" onclick="gameStep(\''+gid+'\',-1)">\u25C0</button><button class="gv-btn" id="play-'+gid+'" onclick="toggleAutoPlay(\''+gid+'\')">\u25B6</button><span class="gv-movenav" id="movenav-'+gid+'">Move 0</span><button class="gv-btn" id="next-'+gid+'" onclick="gameStep(\''+gid+'\',1)">\u25B6</button><button class="gv-btn" onclick="gameJump(\''+gid+'\',\'end\')">\u25B6\u007C</button><button class="gv-btn" id="flip-'+gid+'" onclick="flipBoard(\''+gid+'\')">&#8645;</button></div><button class="gv-open-page" onclick="openGame('+gid+')">Open full game page \u2192</button></div></div></div></div>';}).join('');}

function toggleGameViewer(id,gameId){const el=document.getElementById(id);if(!el)return;const isOpen=el.style.display!=='none';el.style.display=isOpen?'none':'block';if(!isOpen){const gid=String(gameId);_activeViewerGameId=gid;const game=siteData.games.find(function(g){return String(g.id)===gid;});if(game){setTimeout(function(){initGameViewer(gid,game.pgn||'');},50);}}}

function renderPDFs() {
  const grid = document.getElementById('pdfGrid');
  if (!grid) return;
  if (!siteData.pdfs.length) { grid.innerHTML = '<p class="empty-msg">No PDFs yet.</p>'; return; }
  const tags = ['All', ...new Set(siteData.pdfs.map(function(p) { return p.tag; }).filter(Boolean))];
  const filterBar = '<div class="pdf-tag-filter">'
    + tags.map(function(t) {
        return '<button class="pdf-tag-btn' + (t === activePdfTag ? ' active' : '')
          + '" onclick="setPdfTag(\'' + t + '\')">' + escHtml(t) + '</button>';
      }).join('') + '</div>';
  const filtered = activePdfTag === 'All' ? siteData.pdfs : siteData.pdfs.filter(function(p) { return p.tag === activePdfTag; });
  const cards = filtered.map(function(p) {
    const hasFile = p.file_data || p.url;
    const coverHTML = p.cover_image
      ? '<div class="pdf-h-cover"><img src="' + p.cover_image + '" alt="' + escHtml(p.title) + '"/></div>'
      : '<div class="pdf-h-cover pdf-h-cover-placeholder"><span>PDF</span></div>';
    return '<div class="pdf-h-card fade-in" onclick="openPdf(' + p.id + ')">'
      + coverHTML + '<div class="pdf-h-body">'
      + (p.tag ? '<div class="pdf-h-tag">' + escHtml(p.tag) + '</div>' : '')
      + '<div class="pdf-h-title">' + escHtml(p.title) + '</div>'
      + '<div class="pdf-h-author">by ' + escHtml(p.author) + '</div>'
      + '<div class="pdf-h-desc">' + escHtml(p.description || '') + '</div>'
      + '<div class="pdf-h-footer">'
      + '<span class="pdf-h-action">' + (hasFile ? '&#8595; Download' : '&#8599; View') + '</span>'
      + (p.size ? '<span class="pdf-h-size">' + escHtml(p.size) + '</span>' : '')
      + '</div></div></div>';
  }).join('') || '<p class="empty-msg">No books in this category.</p>';
  grid.innerHTML = filterBar + '<div class="pdf-h-grid">' + cards + '</div>';
  setTimeout(initFadeIn, 50);
}

function setPdfTag(tag){activePdfTag=tag;renderPDFs();}
function renderAll(){renderArticles();renderPlayers();renderGames();renderPDFs();buildLatestStrip();buildHomeBoard();setTimeout(initFadeIn,80);}

function handleImgUpload(inputId,previewId,dataId){const input=document.getElementById(inputId);const file=input.files[0];if(!file)return;if(file.size>2*1024*1024){showToast('Image too large — max 2MB.');input.value='';return;}const reader=new FileReader();reader.onload=function(e){document.getElementById(dataId).value=e.target.result;const preview=document.getElementById(previewId);const img=document.getElementById(previewId+'-img');if(img)img.src=e.target.result;if(preview)preview.style.display='flex';const dropId=inputId.replace('-input','-drop');const drop=document.getElementById(dropId);if(drop)drop.style.display='none';showToast('Image loaded \u2713');};reader.readAsDataURL(file);}
function handlePdfUpload(){const input=document.getElementById('d-pdf-input');const file=input.files[0];if(!file)return;if(file.type!=='application/pdf'){showToast('Please select a PDF file.');input.value='';return;}if(file.size>5*1024*1024){showToast('PDF too large — max 5MB.');input.value='';return;}const sizeMB=(file.size/(1024*1024)).toFixed(1)+' MB';const reader=new FileReader();reader.onload=function(e){document.getElementById('d-file-data').value=e.target.result;document.getElementById('d-file-name').value=file.name;document.getElementById('d-pdf-preview-name').textContent=file.name;document.getElementById('d-pdf-preview-size').textContent=sizeMB;document.getElementById('d-pdf-preview').style.display='flex';document.getElementById('d-pdf-drop').style.display='none';showToast('PDF loaded \u2713 — '+sizeMB);};reader.onerror=function(){showToast('Failed to read file.');};reader.readAsDataURL(file);}
function removePdfUpload(){document.getElementById('d-file-data').value='';document.getElementById('d-file-name').value='';document.getElementById('d-pdf-preview').style.display='none';document.getElementById('d-pdf-drop').style.display='flex';document.getElementById('d-pdf-input').value='';}
function removeImg(previewId,dataId,dropId){document.getElementById(previewId).style.display='none';document.getElementById(dataId).value='';const drop=document.getElementById(dropId);if(drop)drop.style.display='flex';}
function clearImgField(previewId,dataId,dropId,inputId){removeImg(previewId,dataId,dropId);const inp=document.getElementById(inputId);if(inp)inp.value='';}

const ADMIN_PW='chess2026';
let adminUnlocked=false,adminOpen=false;
function toggleAdmin(){if(!adminUnlocked){document.getElementById('adminLoginOverlay').classList.add('open');document.getElementById('adminPwError').classList.remove('visible');setTimeout(function(){document.getElementById('adminPwInput').focus();},150);return;}if(adminOpen)closeAdminPanel();else openAdminPanel();}
function openAdminPanel(){adminOpen=true;document.getElementById('adminPanel').classList.add('open');document.getElementById('adminToggleBtn').textContent='\u2715 Close Admin';showAdminTab('articles');renderAdminLists();}
function closeAdminPanel(){adminOpen=false;document.getElementById('adminPanel').classList.remove('open');document.getElementById('adminToggleBtn').textContent='\u2699 Admin';}
function submitAdminLogin(){const pw=document.getElementById('adminPwInput').value;if(pw===ADMIN_PW){adminUnlocked=true;document.getElementById('adminLoginOverlay').classList.remove('open');document.getElementById('adminPwInput').value='';document.getElementById('adminPwError').classList.remove('visible');openAdminPanel();}else{document.getElementById('adminPwError').classList.add('visible');document.getElementById('adminPwInput').value='';document.getElementById('adminPwInput').focus();}}
function closeAdminLogin(){document.getElementById('adminLoginOverlay').classList.remove('open');document.getElementById('adminPwInput').value='';document.getElementById('adminPwError').classList.remove('visible');}
function showAdminTab(tab){document.querySelectorAll('.admin-tab-btn').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab);});document.querySelectorAll('.admin-section').forEach(function(s){s.classList.remove('active');});const sec=document.getElementById('admin-'+tab);if(sec)sec.classList.add('active');}

function renderAdminLists(){const pubA=siteData.articles.filter(function(a){return a.published!==false;});const draftA=siteData.articles.filter(function(a){return a.published===false;});const al=document.getElementById('adminArticleList');if(al)al.innerHTML=pubA.map(function(a){return'<div class="admin-item"><span>'+escHtml(a.title)+'</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle('+a.id+')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'articles\','+a.id+')">\u2715</button></div></div>';}).join('')||'<p class="admin-empty">None yet.</p>';const dal=document.getElementById('adminArticleDraftList');if(dal)dal.innerHTML=draftA.map(function(a){return'<div class="admin-item"><span>'+escHtml(a.title)+' <span class="draft-badge">Draft</span></span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle('+a.id+')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'articles\','+a.id+')">\u2715</button></div></div>';}).join('')||'<p class="admin-empty">No drafts.</p>';const pl=document.getElementById('adminPlayerList');if(pl)pl.innerHTML=siteData.players.map(function(p){return'<div class="admin-item"><span>'+escHtml((p.title?p.title+' ':'')+p.name+(p.country?' — '+p.country:''))+'</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPlayer('+p.id+')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'players\','+p.id+')">\u2715</button></div></div>';}).join('')||'<p class="admin-empty">No players yet.</p>';const gl=document.getElementById('adminGameList');if(gl)gl.innerHTML=siteData.games.map(function(g){return'<div class="admin-item"><span>'+escHtml(g.title+' — '+g.white+' vs '+g.black+' ('+g.year+')')+'</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editGame('+g.id+')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'games\','+g.id+')">\u2715</button></div></div>';}).join('')||'<p class="admin-empty">No games yet.</p>';const dl=document.getElementById('adminPdfList');if(dl)dl.innerHTML=siteData.pdfs.map(function(p){return'<div class="admin-item"><span>'+escHtml(p.title+' — '+p.author)+'</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPdf('+p.id+')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'pdfs\','+p.id+')">\u2715</button></div></div>';}).join('')||'<p class="admin-empty">No PDFs yet.</p>';}

async function deleteItem(type,id){if(!confirm('Delete this item?'))return;const ok=await deleteItemById(type,id);if(!ok)return;showToast('Item deleted.');siteData=await loadData();renderAdminLists();renderAll();}
async function addArticle(){const editId=v('a-edit-id');const tag=v('a-tag');const title=v('a-title');const content=v('a-content');const excerpt=v('a-excerpt');const date=v('a-date');const rt=v('a-readtime');const published=document.getElementById('a-published').checked;const image=document.getElementById('a-img-data').value||'';if(!title){showToast('Title is required.');return;}if(!content&&!excerpt){showToast('Add content or an excerpt.');return;}const newExcerpt=excerpt||content.slice(0,160)+(content.length>160?'\u2026':'');const item={id:editId?Number(editId):Date.now(),tag:tag||'General',title,content,excerpt:newExcerpt,date:date||nowDate(),read_time:rt||'5 min',published,image};const ok=await upsertItem('articles',item);if(!ok)return;showToast(published?'Article published!':'Draft saved!');cancelEdit('article');siteData=await loadData();renderAdminLists();renderAll();}
function editArticle(id){const a=siteData.articles.find(function(x){return x.id===id;});if(!a)return;showAdminTab('articles');document.getElementById('a-edit-id').value=String(a.id);document.getElementById('a-tag').value=a.tag||'';document.getElementById('a-title').value=a.title||'';document.getElementById('a-content').value=a.content||'';document.getElementById('a-excerpt').value=a.excerpt||'';document.getElementById('a-date').value=a.date||'';document.getElementById('a-readtime').value=a.read_time||'';document.getElementById('a-published').checked=a.published!==false;document.getElementById('a-published-label').textContent=a.published!==false?'Published':'Draft';if(a.image){document.getElementById('a-img-data').value=a.image;const prev=document.getElementById('a-img-preview');const img=document.getElementById('a-img-preview-img');if(img)img.src=a.image;if(prev)prev.style.display='flex';const drop=document.getElementById('a-img-drop');if(drop)drop.style.display='none';}document.getElementById('article-form-heading').textContent='Edit Article';document.getElementById('a-submit-label').textContent='Save Changes \u2192';document.getElementById('article-cancel-edit').style.display='inline-block';document.querySelector('#admin-articles .admin-form').classList.add('editing');document.getElementById('admin-articles').scrollIntoView({behavior:'smooth',block:'start'});}
function previewArticle(){const title=v('a-title');const content=v('a-content');const excerpt=v('a-excerpt');const tag=v('a-tag');const date=v('a-date');const rt=v('a-readtime');const image=document.getElementById('a-img-data').value;if(!title&&!content){showToast('Add a title or content to preview.');return;}const bodyHTML=(content||excerpt||'').split('\n').filter(function(p){return p.trim();}).map(function(p){return'<p>'+p.trim()+'</p>';}).join('');showDetailPage('<div onclick="goHome();setTimeout(function(){openAdminPanel();},100)" class="detail-back">\u2190 Back to Editor</div><div class="article-detail">'+(image?'<img class="article-detail-hero-img" src="'+image+'" alt="'+escHtml(title)+'"/>':'')+'<div class="article-detail-tag">'+escHtml(tag||'General')+' &nbsp;<span style="background:#fff3cd;color:#856404;padding:.2rem .5rem;font-size:.6rem;">PREVIEW</span></div><h1 class="article-detail-title">'+escHtml(title||'Untitled')+'</h1><div class="article-detail-meta">'+escHtml(date||nowDate())+' &nbsp;&middot;&nbsp; '+escHtml(rt||'5 min')+' read</div><div class="article-detail-body">'+(bodyHTML||'<p style="color:var(--mid);">[No content yet]</p>')+'</div></div>');}
async function addPlayer(){const editId=v('p-edit-id');const title=document.getElementById('p-title').value||'';const name=v('p-name');const country=v('p-country');const rating=v('p-rating');const bio=v('p-bio');const career=v('p-career');const style=document.getElementById('p-style').value||'';const image=document.getElementById('p-img-data').value||'';if(!name||!bio){showToast('Name and bio are required.');return;}const achievements=v('p-achievements').split('\n').filter(function(l){return l.trim();}).map(function(l){const parts=l.split('|');return{title:(parts[0]||'').trim(),year:(parts[1]||'').trim()};});const best_games=v('p-bestgames').split('\n').filter(function(l){return l.trim();}).map(function(l){const parts=l.split('|');return{title:(parts[0]||'').trim(),event:(parts[1]||'').trim(),year:(parts[2]||'').trim()};});const item={id:editId?Number(editId):Date.now(),title,name,country:country||'',rating:rating||'N/A',style,bio,career:career||'',achievements,best_games,image};const ok=await upsertItem('players',item);if(!ok)return;showToast(editId?'Player updated!':'Player added!');cancelEdit('player');siteData=await loadData();renderAdminLists();renderAll();}
function editPlayer(id){const p=siteData.players.find(function(x){return x.id===id;});if(!p)return;showAdminTab('players');document.getElementById('p-edit-id').value=String(p.id);document.getElementById('p-name').value=p.name||'';document.getElementById('p-country').value=p.country||'';document.getElementById('p-rating').value=p.rating||'';document.getElementById('p-bio').value=p.bio||'';document.getElementById('p-career').value=p.career||'';document.getElementById('p-title').value=p.title||'';document.getElementById('p-style').value=p.style||'';const achievements=Array.isArray(p.achievements)?p.achievements:[];const best_games=Array.isArray(p.best_games)?p.best_games:[];document.getElementById('p-achievements').value=achievements.map(function(a){return a.title+'|'+a.year;}).join('\n');document.getElementById('p-bestgames').value=best_games.map(function(g){return g.title+'|'+g.event+'|'+g.year+(g.pgn?'|'+g.pgn:'')+(g.white?'|'+g.white:'')+(g.black?'|'+g.black:'');}).join('\n');if(p.image){document.getElementById('p-img-data').value=p.image;const prev=document.getElementById('p-img-preview');const img=document.getElementById('p-img-preview-img');if(img)img.src=p.image;if(prev)prev.style.display='flex';const drop=document.getElementById('p-img-drop');if(drop)drop.style.display='none';}document.getElementById('player-form-heading').textContent='Edit Player';document.getElementById('p-submit-label').textContent='Save Changes \u2192';document.getElementById('player-cancel-edit').style.display='inline-block';document.querySelector('#admin-players .admin-form').classList.add('editing');document.getElementById('admin-players').scrollIntoView({behavior:'smooth',block:'start'});}
async function addGame(){const editId=v('g-edit-id');const title=v('g-title');const white_title=document.getElementById('g-white-title').value||'';const black_title=document.getElementById('g-black-title').value||'';const white_name=v('g-white');const black_name=v('g-black');const white=white_title?white_title+' '+white_name:white_name;const black=black_title?black_title+' '+black_name:black_name;const year=v('g-year');const event=v('g-event');const result=v('g-result');const description=v('g-desc');const pgn=v('g-pgn');if(!title||!white_name||!black_name){showToast('Title, White, and Black are required.');return;}const item={id:editId?Number(editId):Date.now(),title,white,black,white_title,black_title,white_name,black_name,year:year||'',event:event||'',result:result||'',description:description||'',pgn:pgn||''};const ok=await upsertItem('games',item);if(!ok)return;showToast(editId?'Game updated!':'Game added!');cancelEdit('game');siteData=await loadData();renderAdminLists();renderAll();}
function editGame(id){const g=siteData.games.find(function(x){return x.id===id;});if(!g)return;showAdminTab('games');document.getElementById('g-edit-id').value=String(g.id);document.getElementById('g-title').value=g.title||'';document.getElementById('g-white').value=g.white_name||g.white||'';document.getElementById('g-black').value=g.black_name||g.black||'';document.getElementById('g-white-title').value=g.white_title||'';document.getElementById('g-black-title').value=g.black_title||'';document.getElementById('g-year').value=g.year||'';document.getElementById('g-event').value=g.event||'';document.getElementById('g-result').value=g.result||'';document.getElementById('g-desc').value=g.description||'';document.getElementById('g-pgn').value=g.pgn||'';document.getElementById('game-form-heading').textContent='Edit Game';document.getElementById('g-submit-label').textContent='Save Changes \u2192';document.getElementById('game-cancel-edit').style.display='inline-block';document.querySelector('#admin-games .admin-form').classList.add('editing');document.getElementById('admin-games').scrollIntoView({behavior:'smooth',block:'start'});}
async function addPdf(){var editId=v('d-edit-id');var title=v('d-title');var author=v('d-author');var description=v('d-desc');var pdfContent=v('d-content');var url=v('d-url');var tag=document.getElementById('d-tag').value||'';var file_data=document.getElementById('d-file-data').value||'';var file_name=document.getElementById('d-file-name').value||'';var cover_image=document.getElementById('d-img-data').value||'';if(!title||!author){showToast('Title and author are required.');return;}var MAX_B64=900*1024;var safeFile=file_data;var size='';if(file_data){var approxBytes=Math.round(file_data.length*0.75);size=approxBytes>1048576?(approxBytes/1048576).toFixed(1)+' MB':Math.round(approxBytes/1024)+' KB';if(file_data.length>MAX_B64){safeFile='';showToast('PDF too large to embed — paste an external URL instead.');}}var existing=editId?siteData.pdfs.find(function(p){return String(p.id)===editId;}):null;var item={id:editId?Number(editId):Date.now(),title,author,tag:tag||'',description:description||'',content:pdfContent||'',url:url||(existing&&existing.url)||'',file_data:safeFile||(existing&&existing.file_data)||'',file_name:file_name||(existing&&existing.file_name)||'',size:size||(existing&&existing.size)||'',cover_image:cover_image||(existing&&existing.cover_image)||''};var ok=await upsertItem('pdfs',item);if(!ok)return;showToast(editId?'PDF updated!':'PDF added!');cancelEdit('pdf');siteData=await loadData();renderAdminLists();renderAll();}
async function editPdf(id){let p=await sbSelectOne('pdfs',id);if(!p)p=siteData.pdfs.find(function(x){return x.id===id;});if(!p){showToast('PDF not found.');return;}showAdminTab('pdfs');document.getElementById('d-edit-id').value=String(p.id);document.getElementById('d-title').value=p.title||'';document.getElementById('d-author').value=p.author||'';document.getElementById('d-desc').value=p.description||'';document.getElementById('d-content').value=p.content||'';document.getElementById('d-url').value=p.url||'';document.getElementById('d-tag').value=p.tag||'';if(p.file_data){document.getElementById('d-file-data').value=p.file_data;document.getElementById('d-file-name').value=p.file_name||p.title+'.pdf';document.getElementById('d-pdf-preview-name').textContent=p.file_name||p.title+'.pdf';document.getElementById('d-pdf-preview-size').textContent=p.size||'';document.getElementById('d-pdf-preview').style.display='flex';document.getElementById('d-pdf-drop').style.display='none';}if(p.cover_image){document.getElementById('d-img-data').value=p.cover_image;const prev=document.getElementById('d-img-preview');const img=document.getElementById('d-img-preview-img');if(img)img.src=p.cover_image;if(prev)prev.style.display='flex';const drop=document.getElementById('d-img-drop');if(drop)drop.style.display='none';}document.getElementById('pdf-form-heading').textContent='Edit PDF';document.getElementById('d-submit-label').textContent='Save Changes \u2192';document.getElementById('pdf-cancel-edit').style.display='inline-block';document.querySelector('#admin-pdfs .admin-form').classList.add('editing');document.getElementById('admin-pdfs').scrollIntoView({behavior:'smooth',block:'start'});}

function cancelEdit(type){const sectionMap={article:'articles',player:'players',game:'games',pdf:'pdfs'};const prefixMap={article:'a',player:'p',game:'g',pdf:'d'};const headings={article:'Add Article',player:'Add Player Profile',game:'Add Game of the Century',pdf:'Add PDF to Library'};const labels={article:'Add Article \u2192',player:'Add Player \u2192',game:'Add Game \u2192',pdf:'Add PDF \u2192'};const p=prefixMap[type];const sec=sectionMap[type];const editId=document.getElementById(p+'-edit-id');if(editId)editId.value='';const hEl=document.getElementById(type+'-form-heading');if(hEl)hEl.textContent=headings[type];const sEl=document.getElementById(p+'-submit-label');if(sEl)sEl.textContent=labels[type];const cancelBtn=document.getElementById(type+'-cancel-edit');if(cancelBtn)cancelBtn.style.display='none';const form=document.querySelector('#admin-'+sec+' .admin-form');if(form)form.classList.remove('editing');const section=document.getElementById('admin-'+sec);if(section){section.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=file])').forEach(function(el){el.value='';});section.querySelectorAll('textarea').forEach(function(el){el.value='';});section.querySelectorAll('select').forEach(function(el){el.selectedIndex=0;});section.querySelectorAll('input[type=checkbox]').forEach(function(el){if(el.id.endsWith('-published'))el.checked=true;});}if(type==='article')clearImgField('a-img-preview','a-img-data','a-img-drop','a-img-input');if(type==='player')clearImgField('p-img-preview','p-img-data','p-img-drop','p-img-input');if(type==='pdf'){removePdfUpload();clearImgField('d-img-preview','d-img-data','d-img-drop','d-img-input');}}
async function resetToDefault(){if(!confirm('Reset ALL content to defaults? This cannot be undone.'))return;showToast('Resetting\u2026');await seedDefaultData();siteData=await loadData();renderAdminLists();renderAll();showToast('Content reset to defaults.');}
document.addEventListener('change',function(e){if(e.target.id==='a-published'){const lbl=document.getElementById('a-published-label');if(lbl)lbl.textContent=e.target.checked?'Published':'Draft';}});

function v(id){const el=document.getElementById(id);return el?el.value.trim():'';}
function nowDate(){return new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'});}
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2800);}
function escHtml(str){if(!str)return'';return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function initFadeIn(){const obs=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible');},i*80);obs.unobserve(e.target);}});},{threshold:0.1});document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el){obs.observe(el);});}
function initScrollSpy(){const sections=['articles','players','games','library'];const links=document.querySelectorAll('.nav-links a');window.addEventListener('scroll',function(){if(currentPage!=='home')return;let cur='';sections.forEach(function(id){const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-120)cur=id;});links.forEach(function(l,i){l.classList.toggle('active',sections[i]===cur);});});}

window.addEventListener('DOMContentLoaded',async function(){applyStoredTheme();buildHomeBoard();showToast('Loading content\u2026');siteData=await loadData();if(!siteData.articles.length&&!siteData.players.length&&!siteData.games.length){showToast('First run — loading default content\u2026');await seedDefaultData();siteData=await loadData();}renderAll();buildHomeBoard();buildLatestStrip();initScrollSpy();setTimeout(initFadeIn,120);const pwInput=document.getElementById('adminPwInput');if(pwInput){pwInput.addEventListener('keydown',function(e){if(e.key==='Enter')submitAdminLogin();});}document.addEventListener('keydown',function(e){if(e.key==='Escape'&&searchOpen)closeSearch();});});
