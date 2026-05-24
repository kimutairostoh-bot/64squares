// ===================================================
// 64 SQUARES -- script.js  (v6 -- Supabase edition)
// ===================================================

// ============================================
// SUPABASE CONFIG  — direct REST API (no SDK needed)
// ============================================
const SUPABASE_REST = 'https://amhotjblrmctyisrpuub.supabase.co/rest/v1';
const SUPABASE_KEY  = 'sb_publishable_Mr7Q-_rHblJ8qczzYZnkQw_X7Rkdsq3';

// Base headers sent with every request
const SB_HEADERS = {
  'Content-Type':  'application/json',
  'apikey':        SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Prefer':        'return=representation',
};

// ---- tiny REST helpers ----
async function sbSelect(table, order) {
  const url = SUPABASE_REST + '/' + table + '?order=' + (order || 'created_at.asc') + '&select=*';
  const res = await fetch(url, { headers: SB_HEADERS });
  if (!res.ok) { const t = await res.text(); console.error('[sb] GET ' + table + ':', res.status, t); return []; }
  return res.json();
}

async function sbUpsert(table, row) {
  // Remove undefined values so PostgREST doesn't choke
  const clean = Object.fromEntries(Object.entries(row).filter(([,v]) => v !== undefined && v !== null || typeof v === 'boolean'));
  const res = await fetch(SUPABASE_REST + '/' + table, {
    method:  'POST',
    headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body:    JSON.stringify(clean),
  });
  if (!res.ok) { const t = await res.text(); console.error('[sb] UPSERT ' + table + ':', res.status, t); return false; }
  return true;
}

async function sbDelete(table, id) {
  const res = await fetch(SUPABASE_REST + '/' + table + '?id=eq.' + id, {
    method:  'DELETE',
    headers: SB_HEADERS,
  });
  if (!res.ok) { const t = await res.text(); console.error('[sb] DELETE ' + table + ':', res.status, t); return false; }
  return true;
}

const THEME_KEY = 'chess64_theme';
const VIEWS_KEY = 'chess64_views';

let siteData = { articles: [], players: [], games: [], pdfs: [] };

// ============================================
// VIEW TRACKING  (still local — not critical)
// ============================================
function getViews() { try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}'); } catch { return {}; } }
function trackView(type, id) {
  const v = getViews();
  const k = type + ':' + id;
  v[k] = (v[k] || 0) + 1;
  try { localStorage.setItem(VIEWS_KEY, JSON.stringify(v)); } catch (e) {}
}

// ============================================
// DARK MODE
// ============================================
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  document.getElementById('themeToggleBtn').textContent = isDark ? '\u25CB' : '\u25D1';
  syncDarkSelects();
}
function applyStoredTheme() {
  const t = localStorage.getItem(THEME_KEY);
  if (t === 'dark') {
    document.body.classList.add('dark');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = '\u25CB';
  }
}
function syncDarkSelects() {
  const dark = document.body.classList.contains('dark');
  document.querySelectorAll('select[id^="g-white-title"],select[id^="g-black-title"],select[id="p-title"]').forEach(sel => {
    sel.style.background = dark ? '#1a1a1a' : '';
    sel.style.color = dark ? '#e8e4dc' : '';
    sel.style.borderColor = dark ? '#2a2826' : '';
  });
}

// ============================================
// DEFAULT DATA  (used only to seed empty DB)
// ============================================
const defaultData = {
  articles: [
    { id: 1, tag: 'Strategy', title: 'The Art of the Endgame: Rook & Pawn Mastery', excerpt: 'Understanding why endgames are where true chess understanding is revealed -- and how the world\'s best navigated them.', content: 'The endgame is where champions are made. While openings can be memorized and middlegames can be calculated, the endgame demands pure understanding -- an intuitive grasp of piece coordination, king activity, and pawn promotion that separates true masters from the rest.\n\nRook endgames constitute the vast majority of practical endgame situations, and mastering them is perhaps the single greatest investment a club player can make. The Lucena position and the Philidor defense are not merely theoretical curiosities; they are the pillars upon which practical rook endgame technique is built.\n\nThe key insight is activity. In rook endgames, the rook must be active at all costs. A passive rook is almost always losing; an active rook can often hold or even win seemingly hopeless positions.\n\nPractice these positions repeatedly until the moves become second nature. The champions of the game did not merely study endgames -- they absorbed them.', date: 'May 2026', read_time: '8 min', published: true, image: '' },
    { id: 2, tag: 'History', title: 'Fischer vs. Spassky: The Match That Stopped the World', excerpt: 'A look back at the 1972 World Championship in Reykjavik -- a Cold War showdown played on 64 squares.', content: 'In the summer of 1972, the world held its breath -- not over a military confrontation, but over a chess match. In Reykjavik, Iceland, an eccentric American prodigy named Robert James Fischer faced the calm Soviet champion Boris Spassky in what would become the most watched chess match in history.\n\nThe backdrop was unmistakable: the Cold War was at its height. The Soviet chess machine had dominated the World Championship for decades, and Fischer\'s challenge was seen in Washington and Moscow alike as something far greater than sport.\n\nFischer won the match 12.5-8.5, becoming the 11th World Chess Champion and the first American to hold the title. He never defended it. The chess world was never quite the same.', date: 'Apr 2026', read_time: '12 min', published: true, image: '' },
    { id: 3, tag: 'Opening Theory', title: 'The Sicilian Dragon: Fire on the Board', excerpt: 'One of chess\'s most double-edged openings -- why the Dragon keeps burning generations of players.', content: 'Few opening systems in chess generate as much heat as the Sicilian Dragon. Named for the pawn structure that resembles the constellation Draco, the Dragon has seduced generations of attacking players with its promise of sharp, uncompromising chess.\n\nThe position arises after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6, with Black fianchettoing the bishop on g7 -- the fabled Dragon bishop, the soul of the entire system.\n\nThe Dragon demands deep theoretical preparation. A single misplaced move can be catastrophic for either side. Yet this is precisely the appeal: the Dragon rewards the player who has studied hardest and calculated most precisely.', date: 'Mar 2026', read_time: '6 min', published: true, image: '' },
  ],
  players: [
    { id: 1, title: 'GM', name: 'Garry Kasparov', country: 'Russia', rating: '2851', style: 'Universal', bio: 'Widely regarded as the greatest chess player of all time, Garry Kasparov dominated competitive chess for two decades. Born in Baku in 1963, he became World Champion at 22 -- the youngest in history at the time -- defeating the formidable Anatoly Karpov in a legendary five-match series.', career: 'Kasparov defeated Karpov in five legendary World Championship matches from 1984 to 1990. He held the world number one ranking for 225 months. In 1997, he famously lost a match to IBM\'s Deep Blue.', achievements: [{ title: 'World Chess Champion', year: '1985-2000' }, { title: 'Peak FIDE Rating 2851', year: '1999' }, { title: 'World number 1 for 225 months', year: '1984-2005' }], best_games: [{ title: 'Kasparov vs. Topalov -- The Immortal Game', event: 'Wijk aan Zee', year: '1999' }], image: '' },
    { id: 2, title: 'GM', name: 'Magnus Carlsen', country: 'Norway', rating: '2882', style: 'Universal', bio: 'Magnus Carlsen is a Norwegian grandmaster and the highest-rated player in chess history, achieving a peak rating of 2882 in 2014. Born in 1990, he became a grandmaster at just 13 years of age.', career: 'Carlsen became World Chess Champion in 2013 by defeating Viswanathan Anand. He defended the title four times. In 2022 he declined to defend against Nepomniachtchi.', achievements: [{ title: 'FIDE World Chess Champion', year: '2013-2023' }, { title: 'Peak FIDE Rating 2882', year: '2014' }], best_games: [{ title: 'Carlsen vs. Karjakin -- Game 10', event: 'World Championship Match', year: '2016' }], image: '' },
    { id: 3, title: 'GM', name: 'Bobby Fischer', country: 'USA', rating: '2785', style: 'Tactical', bio: 'Robert James Fischer, the 11th World Chess Champion. Born in 1943, became a grandmaster at 15 -- a world record at the time. His intensity, genius, and turbulent personality made him a cultural phenomenon.', career: 'Fischer annihilated Taimanov and Larsen 6-0 in the 1971 Candidates before defeating Petrosian. His 1972 match against Spassky became a global media sensation.', achievements: [{ title: 'World Chess Champion', year: '1972-1975' }, { title: 'US Chess Champion (8 times)', year: '1957-1967' }], best_games: [{ title: 'The Game of the Century vs. Donald Byrne', event: 'Rosenwald Trophy', year: '1956' }], image: '' },
  ],
  games: [
    { id: 1, title: 'The Opera Game', white: 'Paul Morphy', black: 'Duke of Brunswick & Count Isouard', white_name: 'Paul Morphy', black_name: 'Duke of Brunswick & Count Isouard', white_title: '', black_title: '', year: '1858', event: 'Paris Opera', result: '1-0', description: 'Played during a performance of Norma at the Paris Opera House, this game is the quintessential illustration of rapid development. Morphy declined material repeatedly, culminating in a breathtaking queen sacrifice on move 16.', pgn: '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#' },
    { id: 2, title: 'The Immortal Game', white: 'Adolf Anderssen', black: 'Lionel Kieseritzky', white_name: 'Adolf Anderssen', black_name: 'Lionel Kieseritzky', white_title: '', black_title: '', year: '1851', event: 'London', result: '1-0', description: 'Anderssen sacrificed both rooks, his bishop, and finally his queen -- then delivered checkmate with three minor pieces. Perhaps the most celebrated attacking game in chess history.', pgn: '1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7#' },
    { id: 3, title: 'Game of the Century', white: 'Donald Byrne', black: 'Robert J. Fischer', white_name: 'Donald Byrne', black_name: 'Robert J. Fischer', white_title: '', black_title: '', year: '1956', event: 'Rosenwald Trophy', result: '0-1', description: 'A 13-year-old Bobby Fischer sacrificed his queen on move 17, launching a forcing sequence of extraordinary depth. Hans Kmoch declared it \'The Game of the Century\' -- the name has stuck for 70 years.', pgn: '1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2#' },
  ],
  pdfs: [
    { id: 1, title: 'My System', author: 'Nimzowitsch', tag: 'Strategy', description: 'The foundational text of modern positional chess strategy.', content: 'Nimzowitsch\'s My System, published in 1925, is arguably the most influential chess book ever written. It systematized concepts like the blockade, prophylaxis, and overprotection into a coherent framework.\n\nNimzowitsch\'s prose is colorful; he anthropomorphizes pawns and pieces, describing the passed pawn\'s \'lust to expand.\' Whether this makes the book more or less accessible depends on the reader, but it is rarely dull.\n\nMy System remains essential reading for any player seeking to move beyond tactical calculation into strategic understanding.', size: '2.4 MB', url: '', file_data: '', file_name: '', cover_image: '' },
    { id: 2, title: 'Chess Fundamentals', author: 'Capablanca', tag: 'Endgames', description: 'The World Champion\'s essential guide covering endings, middle games, and openings.', content: 'Capablanca\'s Chess Fundamentals, published in 1921, is lean and direct. Capablanca believed chess knowledge should be built from the endgame backward -- understand the endings first, and the rest of the game makes more sense.\n\nThe book covers king and pawn endgames, rook endgames, basic tactical motifs, and key opening principles, all illustrated with Capablanca\'s own games.\n\nFor the improving player, Chess Fundamentals remains one of the most efficient paths to genuine chess understanding.', size: '1.8 MB', url: '', file_data: '', file_name: '', cover_image: '' },
  ],
};

// ============================================
// SUPABASE DATA LAYER  (pure fetch — no SDK)
// ============================================
async function loadData() {
  try {
    const [articles, players, games, pdfs] = await Promise.all([
      sbSelect('articles', 'created_at.desc'),
      sbSelect('players',  'created_at.asc'),
      sbSelect('games',    'created_at.asc'),
      sbSelect('pdfs',     'created_at.asc'),
    ]);
    console.log('[64sq] loaded', articles.length, 'articles,', players.length,
      'players,', games.length, 'games,', pdfs.length, 'pdfs');
    return { articles, players, games, pdfs };
  } catch (err) {
    console.error('[64sq] loadData crashed:', err);
    return { articles: [], players: [], games: [], pdfs: [] };
  }
}

async function upsertItem(table, item) {
  const ok = await sbUpsert(table, item);
  if (!ok) showToast('Save failed — check console.');
  return ok;
}

async function deleteItemById(table, id) {
  const ok = await sbDelete(table, id);
  if (!ok) showToast('Delete failed — check console.');
  return ok;
}

async function seedDefaultData() {
  console.log('[64sq] Seeding default data...');
  for (const a of defaultData.articles) await sbUpsert('articles', a);
  for (const p of defaultData.players)  await sbUpsert('players',  p);
  for (const g of defaultData.games)    await sbUpsert('games',    g);
  for (const d of defaultData.pdfs)     await sbUpsert('pdfs',     d);
  console.log('[64sq] Seed complete.');
}

// ============================================
// OPENING NAME DETECTION
// ============================================
const OPENINGS = [
  ['Ruy Lopez',             '1.e4 e5 2.Nf3 Nc6 3.Bb5'],
  ['Italian Game',          '1.e4 e5 2.Nf3 Nc6 3.Bc4'],
  ['Sicilian Defense',      '1.e4 c5'],
  ['Sicilian Dragon',       '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6'],
  ['Sicilian Najdorf',      '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6'],
  ['French Defense',        '1.e4 e6'],
  ['Caro-Kann',             '1.e4 c6'],
  ['Pirc Defense',          '1.e4 d6 2.d4 Nf6 3.Nc3 g6'],
  ['Scandinavian Defense',  '1.e4 d5'],
  ['Alekhine Defense',      '1.e4 Nf6'],
  ['Queens Gambit',         '1.d4 d5 2.c4'],
  ['Queens Gambit Accepted','1.d4 d5 2.c4 dxc4'],
  ['Queens Gambit Declined','1.d4 d5 2.c4 e6'],
  ['Kings Indian',          '1.d4 Nf6 2.c4 g6'],
  ['Nimzo-Indian',          '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4'],
  ['Grunfeld Defense',      '1.d4 Nf6 2.c4 g6 3.Nc3 d5'],
  ['English Opening',       '1.c4'],
  ['Reti Opening',          '1.Nf3'],
  ['Kings Gambit',          '1.e4 e5 2.f4'],
  ['Vienna Game',           '1.e4 e5 2.Nc3'],
  ['Four Knights',          '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6'],
  ['Petrov Defense',        '1.e4 e5 2.Nf3 Nf6'],
  ['London System',         '1.d4 d5 2.Nf3 Nf6 3.Bf4'],
  ['Dutch Defense',         '1.d4 f5'],
  ['Bishops Opening',       '1.e4 e5 2.Bc4'],
];

function detectOpening(pgn) {
  if (!pgn) return null;
  const clean = pgn.replace(/\d+\./g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = clean.split(' ').filter(Boolean);
  const sorted = [...OPENINGS].sort((a, b) => b[1].split(' ').length - a[1].split(' ').length);
  for (const [name, seq] of sorted) {
    const seqTokens = seq.replace(/\d+\./g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    let gi = 0, matched = 0;
    for (const st of seqTokens) {
      while (gi < tokens.length && tokens[gi] !== st) gi++;
      if (gi < tokens.length) { matched++; gi++; }
    }
    if (matched === seqTokens.length) return name;
  }
  return null;
}

// ============================================
// CHESS ENGINE
// ============================================
const GLYPHS = { wK: '\u2654', wQ: '\u2655', wR: '\u2656', wB: '\u2657', wN: '\u2658', wP: '\u2659', bK: '\u265A', bQ: '\u265B', bR: '\u265C', bB: '\u265D', bN: '\u265E', bP: '\u265F' };
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

function fenToBoard(fen) {
  return fen.split(' ')[0].split('/').map(row => {
    const r = [];
    for (const ch of row) isNaN(ch) ? r.push((ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase()) : [...Array(+ch)].forEach(() => r.push(null));
    return r;
  });
}
function parsePGN(pgn) {
  const moves = pgn.replace(/\d+\./g, '').replace(/\s+/g, ' ').trim().split(' ').filter(m => m && !m.match(/^\d/) && !['1-0', '0-1', '1/2-1/2'].includes(m));
  const states = []; let board = fenToBoard(START_FEN); let turn = 'w';
  states.push(board.map(r => [...r]));
  for (const move of moves) { board = applyMove(board, move, turn); states.push(board.map(r => [...r])); turn = turn === 'w' ? 'b' : 'w'; }
  return states;
}
function applyMove(board, san, color) {
  const b = board.map(r => [...r]);
  try {
    if (san === 'O-O' || san === '0-0')    { const row = color === 'w' ? 7 : 0; b[row][6] = color + 'K'; b[row][4] = null; b[row][5] = color + 'R'; b[row][7] = null; return b; }
    if (san === 'O-O-O' || san === '0-0-0') { const row = color === 'w' ? 7 : 0; b[row][2] = color + 'K'; b[row][4] = null; b[row][3] = color + 'R'; b[row][0] = null; return b; }
    const clean = san.replace(/[+#!?]/g, ''); const promo = clean.includes('=') ? clean.split('=')[1][0] : null; const s = clean.split('=')[0];
    let piece, rest; if ('KQRBN'.includes(s[0])) { piece = s[0]; rest = s.slice(1); } else { piece = 'P'; rest = s; }
    const isCapture = rest.includes('x'); rest = rest.replace('x', '');
    const dest = rest.slice(-2); const toC = dest.charCodeAt(0) - 97; const toR = 8 - parseInt(dest[1]); const hint = rest.slice(0, -2);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      if (b[r][c] !== color + piece) continue;
      if (hint) { if (hint.length === 2) { if (r !== 8 - parseInt(hint[1]) || c !== hint.charCodeAt(0) - 97) continue; } else if (isNaN(hint)) { if (c !== hint.charCodeAt(0) - 97) continue; } else { if (r !== 8 - parseInt(hint)) continue; } }
      if (canMove(b, r, c, toR, toC, color, piece)) { b[toR][toC] = promo ? color + promo : b[r][c]; b[r][c] = null; if (piece === 'P' && isCapture && !board[toR][toC]) b[r][toC] = null; return b; }
    }
  } catch (e) {}
  return b;
}
function canMove(board, fr, fc, tr, tc, color, piece) {
  const dr = tr - fr, dc = tc - fc, target = board[tr][tc];
  if (target && target[0] === color) return false;
  if (piece === 'P') { const dir = color === 'w' ? -1 : 1, sr = color === 'w' ? 6 : 1; if (dc === 0 && dr === dir && !target) return true; if (dc === 0 && dr === 2 * dir && fr === sr && !board[fr + dir][fc] && !target) return true; if (Math.abs(dc) === 1 && dr === dir) return true; return false; }
  if (piece === 'N') return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
  if (piece === 'K') return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  if (piece === 'R') { if (dr !== 0 && dc !== 0) return false; return pathClear(board, fr, fc, tr, tc); }
  if (piece === 'B') { if (Math.abs(dr) !== Math.abs(dc)) return false; return pathClear(board, fr, fc, tr, tc); }
  if (piece === 'Q') { if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return false; return pathClear(board, fr, fc, tr, tc); }
  return false;
}
function pathClear(board, fr, fc, tr, tc) { const dr = Math.sign(tr - fr), dc = Math.sign(tc - fc); let r = fr + dr, c = fc + dc; while (r !== tr || c !== tc) { if (board[r][c]) return false; r += dr; c += dc; } return true; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function getLegalMoves(board, r, c, color) {
  const piece = board[r][c]; if (!piece || piece[0] !== color) return [];
  const type = piece[1], enemy = color === 'w' ? 'b' : 'w', moves = [];
  const slide = dirs => { for (const [dr, dc] of dirs) { let nr = r + dr, nc = c + dc; while (inBounds(nr, nc)) { const t = board[nr][nc]; if (!t) { moves.push([nr, nc]); } else { if (t[0] === enemy) moves.push([nr, nc]); break; } nr += dr; nc += dc; } } };
  const step = dirs => { for (const [dr, dc] of dirs) { const nr = r + dr, nc = c + dc; if (inBounds(nr, nc)) { const t = board[nr][nc]; if (!t || t[0] === enemy) moves.push([nr, nc]); } } };
  if (type === 'P') { const dir = color === 'w' ? -1 : 1, sr = color === 'w' ? 6 : 1; if (inBounds(r + dir, c) && !board[r + dir][c]) { moves.push([r + dir, c]); if (r === sr && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]); } for (const dc of [-1, 1]) { if (inBounds(r + dir, c + dc) && board[r + dir][c + dc] && board[r + dir][c + dc][0] === enemy) moves.push([r + dir, c + dc]); } }
  else if (type === 'R') slide([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  else if (type === 'B') slide([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  else if (type === 'Q') slide([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
  else if (type === 'N') step([[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]);
  else if (type === 'K') step([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
  return moves;
}

// ============================================
// HOME BOARD  — chess.com theme + player names
// ============================================
let homeBoard = fenToBoard(START_FEN), homeSel = null, homeMoves = [], homeTurn = 'w';

// white/black player name displayed beside the board
// auto-picked from siteData.players when available
function getHomePlayers() {
  const whiteName = (siteData.players[0] && ((siteData.players[0].title ? siteData.players[0].title + ' ' : '') + siteData.players[0].name)) || 'White';
  const blackName = (siteData.players[1] && ((siteData.players[1].title ? siteData.players[1].title + ' ' : '') + siteData.players[1].name)) || 'Black';
  return { whiteName, blackName };
}

function buildHomeBoard() {
  const el = document.getElementById('chessBoard'); if (!el) return;
  el.innerHTML = ''; el.className = 'chess-board-interactive';

  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const sq = document.createElement('div');
    sq.className = 'isq ' + ((r + c) % 2 === 0 ? 'isq-light' : 'isq-dark');
    if (c === 0) { const lbl = document.createElement('span'); lbl.className = 'sq-label sq-rank'; lbl.textContent = 8 - r; sq.appendChild(lbl); }
    if (r === 7) { const lbl = document.createElement('span'); lbl.className = 'sq-label sq-file'; lbl.textContent = String.fromCharCode(97 + c); sq.appendChild(lbl); }
    const piece = homeBoard[r][c];
    if (piece) {
      const sp = document.createElement('span');
      sp.className = 'ipiece ' + (piece[0] === 'w' ? 'wpiece' : 'bpiece') + ' piece-' + piece;
      sp.textContent = GLYPHS[piece];
      sq.appendChild(sp);
    }
    if (homeSel && homeSel[0] === r && homeSel[1] === c) sq.classList.add('isq-selected');
    if (homeMoves.some(m => m[0] === r && m[1] === c)) {
      sq.classList.add('isq-legal');
      if (homeBoard[r][c]) sq.classList.add('isq-capture');
    }
    sq.addEventListener('click', () => homeClick(r, c));
    el.appendChild(sq);
  }

  // Update turn indicator + player name strips
  const { whiteName, blackName } = getHomePlayers();
  const ti = document.getElementById('turnIndicator');
  if (ti) ti.textContent = homeTurn === 'w' ? '\u2B1C ' + whiteName + ' to move' : '\u2B1B ' + blackName + ' to move';

  const wpEl = document.getElementById('boardPlayerWhite');
  const bpEl = document.getElementById('boardPlayerBlack');
  if (wpEl) wpEl.textContent = '\u265A ' + whiteName;
  if (bpEl) bpEl.textContent = '\u265A ' + blackName;
}

function homeClick(r, c) {
  const piece = homeBoard[r][c];
  if (homeSel) {
    if (homeMoves.some(m => m[0] === r && m[1] === c)) {
      homeBoard[r][c] = homeBoard[homeSel[0]][homeSel[1]];
      homeBoard[homeSel[0]][homeSel[1]] = null;
      homeTurn = homeTurn === 'w' ? 'b' : 'w';
      homeSel = null; homeMoves = [];
      buildHomeBoard(); return;
    }
    homeSel = null; homeMoves = [];
  }
  if (piece && piece[0] === homeTurn) { homeSel = [r, c]; homeMoves = getLegalMoves(homeBoard, r, c, homeTurn); }
  buildHomeBoard();
}
function resetBoard() { homeBoard = fenToBoard(START_FEN); homeSel = null; homeMoves = []; homeTurn = 'w'; buildHomeBoard(); }

// ============================================
// GAME VIEWER  (flip + autoplay + keyboard + clickable PGN)
// ============================================
const gameViewerStates = {};

function buildGameBoard(containerId, boardState, flipped) {
  const el = document.getElementById(containerId); if (!el) return;
  el.innerHTML = ''; el.className = 'chess-board-viewer';
  for (let rr = 0; rr < 8; rr++) for (let cc = 0; cc < 8; cc++) {
    const r = flipped ? 7 - rr : rr;
    const c = flipped ? 7 - cc : cc;
    const sq = document.createElement('div');
    sq.className = 'vsq ' + ((r + c) % 2 === 0 ? 'vsq-light' : 'vsq-dark');
    const piece = boardState[r][c];
    if (piece) { const sp = document.createElement('span'); sp.className = 'vpiece ' + (piece[0] === 'w' ? 'wpiece' : 'bpiece') + ' piece-' + piece; sp.textContent = GLYPHS[piece]; sq.appendChild(sp); }
    el.appendChild(sq);
  }
}

function initGameViewer(gameId, pgn) {
  const states = pgn ? parsePGN(pgn) : [fenToBoard(START_FEN)];
  gameViewerStates[gameId] = { states, idx: 0, flipped: false, playing: false, timer: null };
  buildGameBoard('board-' + gameId, states[0], false);
  updateGameNav(gameId);
  renderClickablePgn(gameId, pgn);
}

function renderClickablePgn(gameId, pgn) {
  const el = document.getElementById('pgn-' + gameId); if (!el || !pgn) return;
  const tokens = pgn.replace(/\s+/g, ' ').trim().split(' ');
  let html = ''; let mi = 0;
  for (const tok of tokens) {
    if (tok.match(/^\d+\./)) { html += '<span class="pgn-movenum">' + tok + '</span> '; }
    else if (['1-0', '0-1', '1/2-1/2'].includes(tok)) { html += '<span class="pgn-result">' + tok + '</span>'; }
    else { mi++; html += '<span class="pgn-move" data-idx="' + mi + '" onclick="pgnMoveClick(\'' + gameId + '\',' + mi + ')">' + tok + '</span> '; }
  }
  el.innerHTML = html;
}

function pgnMoveClick(gameId, idx) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  vs.idx = Math.min(idx, vs.states.length - 1);
  buildGameBoard('board-' + gameId, vs.states[vs.idx], vs.flipped);
  updateGameNav(gameId);
}

function updateGameNav(gameId) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  const el = document.getElementById('movenav-' + gameId);
  if (el) el.textContent = 'Move ' + vs.idx + ' / ' + (vs.states.length - 1);
  const prev = document.getElementById('prev-' + gameId);
  const next = document.getElementById('next-' + gameId);
  if (prev) prev.disabled = vs.idx === 0;
  if (next) next.disabled = vs.idx === vs.states.length - 1;
  const pgnel = document.getElementById('pgn-' + gameId);
  if (pgnel) pgnel.querySelectorAll('.pgn-move').forEach(function (m) { m.classList.toggle('pgn-move-active', parseInt(m.dataset.idx) === vs.idx); });
  if (vs.playing && vs.idx === vs.states.length - 1) stopAutoPlay(gameId);
}

function gameStep(gameId, dir) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  vs.idx = Math.max(0, Math.min(vs.states.length - 1, vs.idx + dir));
  buildGameBoard('board-' + gameId, vs.states[vs.idx], vs.flipped);
  updateGameNav(gameId);
}
function gameJump(gameId, pos) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  vs.idx = pos === 'start' ? 0 : vs.states.length - 1;
  buildGameBoard('board-' + gameId, vs.states[vs.idx], vs.flipped);
  updateGameNav(gameId);
}
function flipBoard(gameId) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  vs.flipped = !vs.flipped;
  buildGameBoard('board-' + gameId, vs.states[vs.idx], vs.flipped);
}
function toggleAutoPlay(gameId) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  if (vs.playing) stopAutoPlay(gameId); else startAutoPlay(gameId);
}
function startAutoPlay(gameId) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  if (vs.idx === vs.states.length - 1) vs.idx = 0;
  vs.playing = true;
  const btn = document.getElementById('play-' + gameId); if (btn) btn.textContent = '\u23F8';
  vs.timer = setInterval(function () {
    if (vs.idx < vs.states.length - 1) { vs.idx++; buildGameBoard('board-' + gameId, vs.states[vs.idx], vs.flipped); updateGameNav(gameId); }
    else stopAutoPlay(gameId);
  }, 800);
}
function stopAutoPlay(gameId) {
  const vs = gameViewerStates[gameId]; if (!vs) return;
  vs.playing = false; clearInterval(vs.timer);
  const btn = document.getElementById('play-' + gameId); if (btn) btn.textContent = '\u25B6';
}

let _activeViewerGameId = null;
document.addEventListener('keydown', function (e) {
  if (!_activeViewerGameId) return;
  if (e.key === 'ArrowLeft') gameStep(_activeViewerGameId, -1);
  if (e.key === 'ArrowRight') gameStep(_activeViewerGameId, 1);
});

// ============================================
// PAGE ROUTING
// ============================================
let currentPage = 'home';
function goHome() {
  currentPage = 'home';
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('detailPage').style.display = 'none';
  window.scrollTo(0, 0);
}
function showDetailPage(html) {
  currentPage = 'detail';
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('detailPage').style.display = 'block';
  document.getElementById('detailContent').innerHTML = html;
  window.scrollTo(0, 0);
}
function scrollToSection(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

// ============================================
// WHAT TO READ NEXT
// ============================================
function buildWhatNext(currentType, currentId) {
  const items = [];
  const arts = siteData.articles.filter(a => a.published !== false && (currentType !== 'article' || a.id !== currentId));
  const plrs = siteData.players.filter(p => currentType !== 'player' || p.id !== currentId);
  const gms  = siteData.games.filter(g => currentType !== 'game' || g.id !== currentId);
  if (arts.length) { const a = arts[Math.floor(Math.random() * arts.length)]; items.push({ type: 'article', id: a.id, label: a.tag || 'Article', title: a.title, sub: (a.date || '') + (a.read_time ? ' &middot; ' + a.read_time + ' read' : '') }); }
  if (plrs.length) { const p = plrs[Math.floor(Math.random() * plrs.length)]; items.push({ type: 'player', id: p.id, label: 'Player', title: (p.title ? p.title + ' ' : '') + p.name, sub: p.country || '' }); }
  if (gms.length)  { const g = gms[Math.floor(Math.random() * gms.length)];  items.push({ type: 'game',   id: g.id, label: 'Game',   title: g.title, sub: g.white + ' vs ' + g.black }); }
  if (!items.length) return '';
  return '<div class="whatnext-strip">' +
    '<div class="whatnext-title">What to read next</div>' +
    '<div class="whatnext-cards">' +
    items.map(function (it) {
      const onclick = it.type === 'article' ? 'openArticle(' + it.id + ')' : it.type === 'player' ? 'openPlayer(' + it.id + ')' : 'openGame(' + it.id + ')';
      return '<div class="whatnext-card" onclick="' + onclick + '">' +
        '<div class="whatnext-label">' + it.label + '</div>' +
        '<div class="whatnext-card-title">' + it.title + '</div>' +
        '<div class="whatnext-card-sub">' + it.sub + '</div>' +
        '</div>';
    }).join('') +
    '</div></div>';
}

// ============================================
// LATEST ADDITIONS STRIP
// ============================================
function buildLatestStrip() {
  const el = document.getElementById('latestStrip'); if (!el) return;
  const all = [];
  siteData.articles.filter(a => a.published !== false).forEach(a => all.push({ type: 'article', id: a.id, label: a.tag || 'Article', title: a.title, ts: a.id }));
  siteData.players.forEach(p => all.push({ type: 'player', id: p.id, label: 'Player', title: (p.title ? p.title + ' ' : '') + p.name, ts: p.id }));
  siteData.games.forEach(g => all.push({ type: 'game', id: g.id, label: 'Game', title: g.title, ts: g.id }));
  all.sort(function (a, b) { return b.ts - a.ts; });
  const recent = all.slice(0, 4);
  if (!recent.length) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.innerHTML = '<div class="latest-inner">' +
    '<div class="latest-heading">Latest additions</div>' +
    '<div class="latest-cards">' +
    recent.map(function (it) {
      const onclick = it.type === 'article' ? 'openArticle(' + it.id + ')' : it.type === 'player' ? 'openPlayer(' + it.id + ')' : 'openGame(' + it.id + ')';
      return '<div class="latest-card" onclick="' + onclick + '">' +
        '<div class="latest-label">' + it.label + '</div>' +
        '<div class="latest-card-title">' + it.title + '</div>' +
        '</div>';
    }).join('') +
    '</div></div>';
}

// ============================================
// GLOBAL SEARCH
// ============================================
let searchOpen = false;
function toggleSearch() {
  searchOpen = !searchOpen;
  const overlay = document.getElementById('searchOverlay');
  if (searchOpen) { overlay.classList.add('open'); setTimeout(function () { document.getElementById('searchInput').focus(); }, 100); runSearch(); }
  else { overlay.classList.remove('open'); }
}
function closeSearch() { searchOpen = false; document.getElementById('searchOverlay').classList.remove('open'); }
function runSearch() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const res = document.getElementById('searchResults');
  if (!q) { res.innerHTML = '<p class="search-empty">Start typing to search articles, players, games and books.</p>'; return; }
  const hits = [];
  siteData.articles.filter(a => a.published !== false).forEach(a => {
    if ((a.title + ' ' + (a.tag || '') + ' ' + (a.excerpt || '')).toLowerCase().includes(q))
      hits.push({ label: a.tag || 'Article', title: a.title, sub: (a.date || '') + (a.read_time ? ' &middot; ' + a.read_time + ' read' : ''), onclick: 'openArticle(' + a.id + ')' });
  });
  siteData.players.forEach(p => {
    if ((p.name + ' ' + (p.country || '') + ' ' + (p.bio || '')).toLowerCase().includes(q))
      hits.push({ label: p.title || 'Player', title: p.name, sub: (p.country || '') + (p.rating ? ' &middot; ' + p.rating : ''), onclick: 'openPlayer(' + p.id + ')' });
  });
  siteData.games.forEach(g => {
    if ((g.title + ' ' + g.white + ' ' + g.black + ' ' + (g.event || '')).toLowerCase().includes(q))
      hits.push({ label: 'Game ' + g.year, title: g.title, sub: g.white + ' vs ' + g.black, onclick: 'openGame(' + g.id + ')' });
  });
  siteData.pdfs.forEach(p => {
    if ((p.title + ' ' + p.author + ' ' + (p.description || '')).toLowerCase().includes(q))
      hits.push({ label: p.tag || 'PDF', title: p.title, sub: 'by ' + p.author, onclick: 'openPdf(' + p.id + ')' });
  });
  if (!hits.length) { res.innerHTML = '<p class="search-empty">No results for &ldquo;' + q + '&rdquo;</p>'; return; }
  res.innerHTML = hits.map(function (h) {
    return '<div class="search-hit" onclick="' + h.onclick + ';closeSearch()">' +
      '<div class="search-hit-label">' + h.label + '</div>' +
      '<div class="search-hit-title">' + h.title + '</div>' +
      '<div class="search-hit-sub">' + h.sub + '</div>' +
      '</div>';
  }).join('');
}

// ============================================
// ARTICLE DETAIL
// ============================================
function openArticle(id) {
  const a = siteData.articles.find(x => x.id === id); if (!a) return;
  trackView('article', id);
  const bodyHTML = (a.content || a.excerpt || '').split('\n').filter(p => p.trim()).map(p => '<p>' + p.trim() + '</p>').join('');
  const heroImg = a.image ? '<img class="article-detail-hero-img" src="' + a.image + '" alt="' + a.title + '"/>' : '';
  const related = siteData.articles.filter(x => x.published !== false && x.id !== id && x.tag === a.tag).slice(0, 2);
  const relatedHTML = related.length ? '<div class="related-strip"><div class="related-title">More in ' + a.tag + '</div><div class="related-cards">' + related.map(function (r) { return '<div class="related-card" onclick="openArticle(' + r.id + ')"><div class="related-tag">' + r.tag + '</div><div class="related-card-title">' + r.title + '</div><div class="related-card-meta">' + (r.read_time || '') + '</div></div>'; }).join('') + '</div></div>' : '';
  showDetailPage(
    '<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div>' +
    '<div class="article-detail">' +
      heroImg +
      '<div class="article-detail-tag">' + (a.tag || 'General') + '</div>' +
      '<h1 class="article-detail-title">' + a.title + '</h1>' +
      '<div class="article-detail-meta">' + (a.date || '') + ' &nbsp;&middot;&nbsp; ' + (a.read_time || '') + ' read</div>' +
      '<div class="article-detail-body">' + bodyHTML + '</div>' +
      relatedHTML +
      buildWhatNext('article', id) +
    '</div>'
  );
}

// ============================================
// PLAYER DETAIL
// ============================================
function openPlayer(id) {
  const p = siteData.players.find(x => x.id === id); if (!p) return;
  trackView('player', id);
  const avatarHTML = p.image ? '<img class="player-detail-photo" src="' + p.image + '" alt="' + p.name + '"/>'
    : '<div class="player-detail-avatar">' + p.name[0] + '</div>';
  const achievements = Array.isArray(p.achievements) ? p.achievements : [];
  const bestGames    = Array.isArray(p.best_games)   ? p.best_games   : [];
  const achievementsHTML = achievements.map(a => '<tr><td>' + a.title + '</td><td>' + a.year + '</td></tr>').join('')
    || '<tr><td colspan="2" style="color:var(--mid);font-size:.8rem;">No achievements listed.</td></tr>';
  const bestGamesHTML = bestGames.map(g => '<div class="bestgame-row"><h4>' + g.title + '</h4><p>' + g.event + ' &middot; ' + g.year + '</p></div>').join('')
    || '<p style="color:var(--mid);font-size:.9rem;">No games listed.</p>';
  const styleBadge = p.style ? '<span class="style-badge">' + p.style + '</span>' : '';
  showDetailPage(
    '<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div>' +
    '<div class="player-detail">' +
      '<div class="player-detail-hero">' +
        avatarHTML +
        '<div>' +
          '<div class="player-detail-name">' + (p.title ? '<span class="player-title-badge">' + p.title + '</span>' : '') + ' ' + p.name + '</div>' +
          '<div class="player-detail-country">' + ((p.country || '').toUpperCase()) + '</div>' +
          '<div class="player-detail-rating-badge">Peak Rating: ' + (p.rating || 'N/A') + '</div>' +
          styleBadge +
        '</div>' +
      '</div>' +
      '<div class="player-detail-tabs">' +
        '<button class="pd-tab active" onclick="switchPdTab(this,\'bio\')">Biography</button>' +
        '<button class="pd-tab" onclick="switchPdTab(this,\'achievements\')">Achievements</button>' +
        '<button class="pd-tab" onclick="switchPdTab(this,\'career\')">Career</button>' +
        '<button class="pd-tab" onclick="switchPdTab(this,\'bestgames\')">Best Games</button>' +
      '</div>' +
      '<div class="pd-panel active" id="pd-bio"><p>' + (p.bio || 'No biography available.') + '</p></div>' +
      '<div class="pd-panel" id="pd-achievements"><table class="achievement-table"><tbody>' + achievementsHTML + '</tbody></table></div>' +
      '<div class="pd-panel" id="pd-career"><p>' + (p.career || 'No career summary available.') + '</p></div>' +
      '<div class="pd-panel" id="pd-bestgames">' + bestGamesHTML + '</div>' +
      buildWhatNext('player', id) +
    '</div>'
  );
}
function switchPdTab(btn, id) {
  document.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pd-panel').forEach(t => t.classList.remove('active'));
  btn.classList.add('active'); const panel = document.getElementById('pd-' + id); if (panel) panel.classList.add('active');
}

// ============================================
// GAME DETAIL PAGE
// ============================================
function openGame(id) {
  const g = siteData.games.find(x => x.id === id); if (!g) return;
  trackView('game', id);
  const boardId = 'detail-board-' + g.id;
  const vid = 'd' + g.id;
  const opening = detectOpening(g.pgn);
  const openingBadge = opening ? '<span class="opening-badge">\u265E ' + opening + '</span>' : '';

  // Player name strips for the game detail board
  const whiteLbl = (g.white_title ? g.white_title + ' ' : '') + (g.white_name || g.white || 'White');
  const blackLbl = (g.black_title ? g.black_title + ' ' : '') + (g.black_name || g.black || 'Black');

  showDetailPage(
    '<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div>' +
    '<div class="game-detail">' +
      '<div class="game-detail-header">' +
        '<div class="game-detail-num">Games of the Century</div>' +
        '<h1 class="game-detail-title">' + g.title + '</h1>' +
        openingBadge +
        '<div class="game-detail-players">' + g.white + ' (White) vs ' + g.black + ' (Black) &nbsp;&middot;&nbsp; ' + g.event + ' ' + g.year + ' &nbsp;&middot;&nbsp; ' + g.result + '</div>' +
      '</div>' +
      '<div class="game-detail-body">' +
        '<div class="game-detail-left">' +
          '<p class="game-detail-desc">' + (g.description || 'A landmark game in chess history.') + '</p>' +
          (g.pgn ? '<div class="game-detail-pgn-label">PGN Notation</div><div class="game-detail-pgn-box"><div id="pgn-' + vid + '"></div></div>' : '') +
        '</div>' +
        '<div class="game-detail-right">' +
          '<div class="board-player-strip board-player-black" id="gdBlack-' + vid + '">\u265A ' + blackLbl + '</div>' +
          '<div id="' + boardId + '" class="chess-board-viewer"></div>' +
          '<div class="board-player-strip board-player-white" id="gdWhite-' + vid + '">\u2654 ' + whiteLbl + '</div>' +
          '<div class="gv-nav">' +
            '<button class="gv-btn" title="Start" onclick="gameJump(\'' + vid + '\',\'start\')">\u007C\u25C0</button>' +
            '<button class="gv-btn" id="prev-' + vid + '" title="Prev" onclick="gameStep(\'' + vid + '\',-1)">\u25C0</button>' +
            '<button class="gv-btn" id="play-' + vid + '" title="Auto-play" onclick="toggleAutoPlay(\'' + vid + '\')">&#9654;</button>' +
            '<span class="gv-movenav" id="movenav-' + vid + '">Move 0</span>' +
            '<button class="gv-btn" id="next-' + vid + '" title="Next" onclick="gameStep(\'' + vid + '\',1)">\u25B6</button>' +
            '<button class="gv-btn" title="End" onclick="gameJump(\'' + vid + '\',\'end\')">\u25B6\u007C</button>' +
            '<button class="gv-btn" id="flip-' + vid + '" title="Flip board" onclick="flipBoard(\'' + vid + '\')">&#8645;</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      buildWhatNext('game', id) +
    '</div>'
  );
  _activeViewerGameId = vid;
  setTimeout(function () {
    const states = g.pgn ? parsePGN(g.pgn) : [fenToBoard(START_FEN)];
    gameViewerStates[vid] = { states: states, idx: 0, flipped: false, playing: false, timer: null };
    buildGameBoard(boardId, states[0], false);
    updateGameNav(vid);
    renderClickablePgn(vid, g.pgn);
  }, 50);
}

// ============================================
// PDF DETAIL
// ============================================
function openPdf(id) {
  const p = siteData.pdfs.find(x => x.id === id); if (!p) return;
  trackView('pdf', id);
  const contentHTML = (p.content || '').split('\n').filter(x => x.trim()).map(x => '<p>' + x.trim() + '</p>').join('');
  let downloadBtn = '';
  if (p.file_data) { downloadBtn = '<a class="pdf-download-btn" href="' + p.file_data + '" download="' + (p.file_name || p.title + '.pdf') + '">\u2193 Download PDF</a>'; }
  else if (p.url)  { downloadBtn = '<a class="pdf-download-btn" href="' + p.url + '" target="_blank">\u2193 Open PDF</a>'; }
  else             { downloadBtn = '<button class="pdf-download-btn" onclick="showToast(\'No file attached.\')"> \u2193 Download PDF</button>'; }
  let viewerHTML = '';
  if (p.file_data) { viewerHTML = '<div style="margin-top:2rem;"><p style="font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;">Document Preview</p><iframe class="pdf-viewer-embed" src="' + p.file_data + '" title="' + p.title + '"></iframe></div>'; }
  else if (p.url)  { viewerHTML = '<div style="margin-top:2rem;"><p style="font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;">Document Preview</p><iframe class="pdf-viewer-embed" src="' + p.url + '" title="' + p.title + '"></iframe></div>'; }
  const coverImg = p.cover_image ? '<img src="' + p.cover_image + '" alt="' + p.title + '" style="width:100%;max-height:280px;object-fit:cover;margin-bottom:2rem;border:1px solid var(--rule);">' : '';
  const tagBadge = p.tag ? '<span class="pdf-tag-badge">' + p.tag + '</span>' : '';
  showDetailPage(
    '<div onclick="goHome()" class="detail-back">\u2190 Back to Journal</div>' +
    '<div class="pdf-detail">' +
      coverImg +
      '<div class="pdf-detail-header">' +
        '<div class="pdf-detail-icon">PDF</div>' +
        '<div>' +
          '<h1 class="pdf-detail-title">' + p.title + '</h1>' +
          '<div class="pdf-detail-author">by ' + p.author + '</div>' +
          tagBadge +
          (p.size ? '<div class="pdf-detail-size">' + p.size + '</div>' : '') +
          (p.file_name ? '<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);margin-top:.3rem;">File: ' + p.file_name + '</div>' : '') +
        '</div>' +
      '</div>' +
      (p.description ? '<p class="pdf-detail-desc">' + p.description + '</p>' : '') +
      downloadBtn + viewerHTML +
      (contentHTML ? '<div class="pdf-detail-content" style="margin-top:2.5rem;padding-top:2.5rem;border-top:1px solid var(--rule);">' + contentHTML + '</div>' : '') +
      buildWhatNext('pdf', id) +
    '</div>'
  );
}

// ============================================
// RENDER SECTIONS
// ============================================
function renderArticles() {
  const grid = document.getElementById('articlesGrid'); if (!grid) return;
  const pub = siteData.articles.filter(a => a.published !== false);
  if (!pub.length) { grid.innerHTML = '<p class="empty-msg">No articles yet.</p>'; return; }
  grid.innerHTML = pub.map(a =>
    '<div class="article-card fade-in" onclick="openArticle(' + a.id + ')">' +
      (a.image ? '<img class="article-card-img" src="' + a.image + '" alt="' + a.title + '"/>' : '') +
      '<div class="article-card-body">' +
        '<div class="article-tag">' + (a.tag || 'General') + '</div>' +
        '<div class="article-title">' + a.title + '</div>' +
        '<div class="article-excerpt">' + a.excerpt + '</div>' +
        '<div class="article-meta">' + (a.date || '') + ' &nbsp;&middot;&nbsp; ' + (a.read_time || '') + ' read</div>' +
        '<div class="article-arrow">\u2192</div>' +
      '</div>' +
    '</div>'
  ).join('');
}

function renderPlayers() {
  const grid = document.getElementById('playersGrid'); if (!grid) return;
  if (!siteData.players.length) { grid.innerHTML = '<p class="empty-msg">No players yet.</p>'; return; }
  grid.innerHTML = siteData.players.map(p => {
    const avatarHTML = p.image ? '<img class="player-avatar-photo" src="' + p.image + '" alt="' + p.name + '"/>'
      : '<div class="player-avatar">' + p.name[0] + '</div>';
    return '<div class="player-card fade-in" onclick="openPlayer(' + p.id + ')">' +
      '<div class="player-card-header">' + avatarHTML +
        '<div><div class="player-name">' + (p.title ? '<span class="player-title-badge">' + p.title + '</span>' : '') + ' ' + p.name + '</div>' +
        '<div class="player-country">' + (p.country || '') + '</div></div></div>' +
      '<div class="player-card-body">' +
        '<div class="player-rating">Peak Rating <strong>' + (p.rating || 'N/A') + '</strong></div>' +
        (p.style ? '<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);letter-spacing:.1em;text-transform:uppercase;margin-top:.5rem;">' + p.style + '</div>' : '') +
        '<div style="margin-top:1rem;font-family:var(--mono);font-size:.62rem;color:var(--mid);letter-spacing:.08em;">Click to view full profile \u2192</div>' +
      '</div></div>';
  }).join('');
}

let activePdfTag = 'All';
function renderGames() {
  const list = document.getElementById('gamesList'); if (!list) return;
  if (!siteData.games.length) { list.innerHTML = '<p class="empty-msg">No games yet.</p>'; return; }
  list.innerHTML = siteData.games.map((g, i) => {
    const opening = detectOpening(g.pgn);
    return '<div class="game-entry fade-in">' +
      '<div class="game-row" onclick="toggleGameViewer(\'gv-' + g.id + '\',' + g.id + ')">' +
        '<div class="game-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div>' +
          '<div class="game-title">' + g.title + (opening ? ' <span class="opening-badge-sm">\u265E ' + opening + '</span>' : '') + '</div>' +
          '<div class="game-meta">' + (g.white || '') + ' vs ' + (g.black || '') + ' &nbsp;&middot;&nbsp; ' + (g.event || '') + ' &nbsp;&middot;&nbsp; ' + (g.result || '') + '</div>' +
        '</div>' +
        '<div class="game-right"><div class="game-year">' + (g.year || '') + '</div><div class="game-expand-icon">\u25BE</div></div>' +
      '</div>' +
      '<div class="game-viewer" id="gv-' + g.id + '" style="display:none;">' +
        '<div class="game-viewer-inner">' +
          '<div class="gv-board-wrap">' +
            '<div class="board-player-strip board-player-black">\u265A ' + (g.black_name || g.black || 'Black') + '</div>' +
            '<div id="board-' + g.id + '" class="chess-board-viewer"></div>' +
            '<div class="board-player-strip board-player-white">\u2654 ' + (g.white_name || g.white || 'White') + '</div>' +
          '</div>' +
          '<div class="gv-controls">' +
            '<div class="gv-pgn" id="pgn-' + g.id + '"></div>' +
            '<div class="gv-nav">' +
              '<button class="gv-btn" onclick="gameJump(' + g.id + ',\'start\')">\u007C\u25C0</button>' +
              '<button class="gv-btn" id="prev-' + g.id + '" onclick="gameStep(' + g.id + ',-1)">\u25C0</button>' +
              '<button class="gv-btn" id="play-' + g.id + '" onclick="toggleAutoPlay(' + g.id + ')">\u25B6</button>' +
              '<span class="gv-movenav" id="movenav-' + g.id + '">Move 0</span>' +
              '<button class="gv-btn" id="next-' + g.id + '" onclick="gameStep(' + g.id + ',1)">\u25B6</button>' +
              '<button class="gv-btn" onclick="gameJump(' + g.id + ',\'end\')">\u25B6\u007C</button>' +
              '<button class="gv-btn" id="flip-' + g.id + '" title="Flip" onclick="flipBoard(' + g.id + ')">&#8645;</button>' +
            '</div>' +
            '<button class="gv-open-page" onclick="openGame(' + g.id + ')">Open full game page \u2192</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function toggleGameViewer(id, gameId) {
  const el = document.getElementById(id); if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    _activeViewerGameId = gameId;
    const game = siteData.games.find(g => g.id === gameId);
    if (game) setTimeout(function () { initGameViewer(gameId, game.pgn || ''); }, 50);
  }
}

function renderPDFs() {
  const grid = document.getElementById('pdfGrid'); if (!grid) return;
  if (!siteData.pdfs.length) { grid.innerHTML = '<p class="empty-msg">No PDFs yet.</p>'; return; }
  const tags = ['All', ...new Set(siteData.pdfs.map(p => p.tag).filter(Boolean))];
  const filterBar = '<div class="pdf-tag-filter">' +
    tags.map(function (t) { return '<button class="pdf-tag-btn' + (t === activePdfTag ? ' active' : '') + '" onclick="setPdfTag(\'' + t + '\')">' + t + '</button>'; }).join('') +
    '</div>';
  const filtered = activePdfTag === 'All' ? siteData.pdfs : siteData.pdfs.filter(p => p.tag === activePdfTag);
  const cards = filtered.map(p => {
    const hasFile = p.file_data || p.url;
    return '<div class="pdf-card fade-in" onclick="openPdf(' + p.id + ')">' +
      (p.cover_image ? '<img class="pdf-card-cover" src="' + p.cover_image + '" alt="' + p.title + '"/>' : '') +
      '<div class="pdf-icon">PDF</div>' +
      (p.tag ? '<div class="pdf-card-tag">' + p.tag + '</div>' : '') +
      '<div class="pdf-title">' + p.title + '</div>' +
      '<div class="pdf-desc">' + (p.description || '') + '<br><br><em style="font-size:.78rem;">\u2014 ' + p.author + '</em></div>' +
      '<div class="pdf-size">' + (hasFile ? '\u2193 View / Download' : '\u2193 View') + ' &nbsp;&middot;&nbsp; ' + (p.size || '') + '</div>' +
    '</div>';
  }).join('') || '<p class="empty-msg">No books in this category.</p>';
  grid.innerHTML = filterBar + '<div class="pdf-cards-wrap">' + cards + '</div>';
  setTimeout(initFadeIn, 50);
}
function setPdfTag(tag) { activePdfTag = tag; renderPDFs(); }

function renderAll() { renderArticles(); renderPlayers(); renderGames(); renderPDFs(); buildLatestStrip(); buildHomeBoard(); setTimeout(initFadeIn, 80); }

// ============================================
// IMAGE / PDF UPLOAD
// ============================================
function handleImgUpload(inputId, previewId, dataId) {
  const input = document.getElementById(inputId); const file = input.files[0]; if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Image too large -- max 2MB.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById(dataId).value = e.target.result;
    const preview = document.getElementById(previewId); const img = document.getElementById(previewId + '-img');
    if (img) img.src = e.target.result; preview.style.display = 'flex';
    const drop = document.getElementById(inputId.replace('-input', '-drop')); if (drop) drop.style.display = 'none';
    showToast('Image loaded \u2713');
  };
  reader.readAsDataURL(file);
}
function handlePdfUpload() {
  const input = document.getElementById('d-pdf-input'); const file = input.files[0]; if (!file) return;
  if (file.type !== 'application/pdf') { showToast('Please select a PDF file.'); input.value = ''; return; }
  if (file.size > 5 * 1024 * 1024) { showToast('PDF too large -- max 5MB.'); input.value = ''; return; }
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('d-file-data').value = e.target.result;
    document.getElementById('d-file-name').value = file.name;
    document.getElementById('d-pdf-preview-name').textContent = file.name;
    document.getElementById('d-pdf-preview-size').textContent = sizeMB;
    document.getElementById('d-pdf-preview').style.display = 'flex';
    document.getElementById('d-pdf-drop').style.display = 'none';
    showToast('PDF loaded \u2713 -- ' + sizeMB);
  };
  reader.onerror = function () { showToast('Failed to read file.'); };
  reader.readAsDataURL(file);
}
function removePdfUpload() {
  document.getElementById('d-file-data').value = ''; document.getElementById('d-file-name').value = '';
  document.getElementById('d-pdf-preview').style.display = 'none'; document.getElementById('d-pdf-drop').style.display = 'flex';
  document.getElementById('d-pdf-input').value = '';
}
function removeImg(previewId, dataId, dropId) {
  document.getElementById(previewId).style.display = 'none'; document.getElementById(dataId).value = '';
  const drop = document.getElementById(dropId); if (drop) drop.style.display = 'flex';
}
function clearImgField(previewId, dataId, dropId, inputId) {
  removeImg(previewId, dataId, dropId); const inp = document.getElementById(inputId); if (inp) inp.value = '';
}

// ============================================
// ADMIN PANEL
// ============================================
const ADMIN_PW = 'chess2026';
let adminUnlocked = false, adminOpen = false;

function toggleAdmin() {
  if (!adminUnlocked) { document.getElementById('adminLoginOverlay').classList.add('open'); document.getElementById('adminPwError').classList.remove('visible'); setTimeout(function () { document.getElementById('adminPwInput').focus(); }, 150); return; }
  if (adminOpen) closeAdminPanel(); else openAdminPanel();
}
function openAdminPanel() {
  adminOpen = true;
  document.getElementById('adminPanel').classList.add('open');
  document.getElementById('adminToggleBtn').textContent = '\u2715 Close Admin';
  showAdminTab('articles'); renderAdminLists(); syncDarkSelects();
}
function closeAdminPanel() {
  adminOpen = false;
  document.getElementById('adminPanel').classList.remove('open');
  document.getElementById('adminToggleBtn').textContent = '\u2699 Admin';
}
function submitAdminLogin() {
  const pw = document.getElementById('adminPwInput').value;
  if (pw === ADMIN_PW) { adminUnlocked = true; document.getElementById('adminLoginOverlay').classList.remove('open'); document.getElementById('adminPwInput').value = ''; document.getElementById('adminPwError').classList.remove('visible'); openAdminPanel(); }
  else { document.getElementById('adminPwError').classList.add('visible'); document.getElementById('adminPwInput').value = ''; document.getElementById('adminPwInput').focus(); }
}
function closeAdminLogin() { document.getElementById('adminLoginOverlay').classList.remove('open'); document.getElementById('adminPwInput').value = ''; document.getElementById('adminPwError').classList.remove('visible'); }
function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('admin-' + tab); if (sec) sec.classList.add('active');
}

function renderAdminLists() {
  const pubA   = siteData.articles.filter(a => a.published !== false);
  const draftA = siteData.articles.filter(a => a.published === false);
  const al = document.getElementById('adminArticleList');
  if (al) al.innerHTML = pubA.map(a => '<div class="admin-item"><span>' + a.title + '</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle(' + a.id + ')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'articles\',' + a.id + ')">\u2715</button></div></div>').join('') || '<p class="admin-empty">None yet.</p>';
  const dal = document.getElementById('adminArticleDraftList');
  if (dal) dal.innerHTML = draftA.map(a => '<div class="admin-item"><span>' + a.title + ' <span class="draft-badge">Draft</span></span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle(' + a.id + ')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'articles\',' + a.id + ')">\u2715</button></div></div>').join('') || '<p class="admin-empty">No drafts.</p>';
  const pl = document.getElementById('adminPlayerList');
  if (pl) pl.innerHTML = siteData.players.map(p => '<div class="admin-item"><span>' + (p.title ? p.title + ' ' : '') + p.name + (p.country ? ' -- ' + p.country : '') + '</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPlayer(' + p.id + ')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'players\',' + p.id + ')">\u2715</button></div></div>').join('') || '<p class="admin-empty">No players yet.</p>';
  const gl = document.getElementById('adminGameList');
  if (gl) gl.innerHTML = siteData.games.map(g => '<div class="admin-item"><span>' + g.title + ' -- ' + g.white + ' vs ' + g.black + ' (' + g.year + ')</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editGame(' + g.id + ')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'games\',' + g.id + ')">\u2715</button></div></div>').join('') || '<p class="admin-empty">No games yet.</p>';
  const dl = document.getElementById('adminPdfList');
  if (dl) dl.innerHTML = siteData.pdfs.map(p => '<div class="admin-item"><span>' + p.title + ' -- ' + p.author + '</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPdf(' + p.id + ')">Edit</button><button class="admin-del-btn" onclick="deleteItem(\'pdfs\',' + p.id + ')">\u2715</button></div></div>').join('') || '<p class="admin-empty">No PDFs yet.</p>';
}

async function deleteItem(type, id) {
  if (!confirm('Delete this item?')) return;
  const ok = await deleteItemById(type, id);
  if (!ok) return;
  showToast('Item deleted.');
  siteData = await loadData();
  renderAdminLists();
  renderAll();
}

async function addArticle() {
  const editId = v('a-edit-id'), tag = v('a-tag'), title = v('a-title'), content = v('a-content'), excerpt = v('a-excerpt'), date = v('a-date'), rt = v('a-readtime');
  const published = document.getElementById('a-published').checked;
  const image = document.getElementById('a-img-data').value || '';
  if (!title) { showToast('Title is required.'); return; }
  if (!content && !excerpt) { showToast('Add content or an excerpt.'); return; }
  const newExcerpt = excerpt || content.slice(0, 160) + (content.length > 160 ? '\u2026' : '');
  const item = {
    id: editId ? Number(editId) : Date.now(),
    tag: tag || 'General', title, content,
    excerpt: newExcerpt,
    date: date || nowDate(),
    read_time: rt || '5 min',
    published, image,
  };
  const ok = await upsertItem('articles', item);
  if (!ok) return;
  showToast(published ? 'Article published!' : 'Draft saved!');
  cancelEdit('article');
  siteData = await loadData();
  renderAdminLists(); renderAll();
}

function editArticle(id) {
  const a = siteData.articles.find(x => x.id === id); if (!a) return;
  showAdminTab('articles');
  document.getElementById('a-edit-id').value = String(a.id);
  document.getElementById('a-tag').value = a.tag || '';
  document.getElementById('a-title').value = a.title || '';
  document.getElementById('a-content').value = a.content || '';
  document.getElementById('a-excerpt').value = a.excerpt || '';
  document.getElementById('a-date').value = a.date || '';
  document.getElementById('a-readtime').value = a.read_time || '';
  document.getElementById('a-published').checked = a.published !== false;
  document.getElementById('a-published-label').textContent = a.published !== false ? 'Published' : 'Draft';
  if (a.image) { document.getElementById('a-img-data').value = a.image; const prev = document.getElementById('a-img-preview'); const img = document.getElementById('a-img-preview-img'); if (img) img.src = a.image; if (prev) prev.style.display = 'flex'; const drop = document.getElementById('a-img-drop'); if (drop) drop.style.display = 'none'; }
  document.getElementById('article-form-heading').textContent = 'Edit Article';
  document.getElementById('a-submit-label').textContent = 'Save Changes \u2192';
  document.getElementById('article-cancel-edit').style.display = 'inline-block';
  document.querySelector('#admin-articles .admin-form').classList.add('editing');
  document.getElementById('admin-articles').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function previewArticle() {
  const title = v('a-title'), content = v('a-content'), excerpt = v('a-excerpt'), tag = v('a-tag'), date = v('a-date'), rt = v('a-readtime'), image = document.getElementById('a-img-data').value;
  if (!title && !content) { showToast('Add a title or content to preview.'); return; }
  const bodyHTML = (content || excerpt || '').split('\n').filter(p => p.trim()).map(p => '<p>' + p.trim() + '</p>').join('');
  showDetailPage('<div onclick="goHome();setTimeout(function(){openAdminPanel();},100)" class="detail-back">\u2190 Back to Editor</div>' +
    '<div class="article-detail">' + (image ? '<img class="article-detail-hero-img" src="' + image + '" alt="' + title + '"/>' : '') +
    '<div class="article-detail-tag">' + (tag || 'General') + ' &nbsp;<span style="background:#fff3cd;color:#856404;padding:.2rem .5rem;font-size:.6rem;">PREVIEW</span></div>' +
    '<h1 class="article-detail-title">' + (title || 'Untitled') + '</h1>' +
    '<div class="article-detail-meta">' + (date || nowDate()) + ' &nbsp;&middot;&nbsp; ' + (rt || '5 min') + ' read</div>' +
    '<div class="article-detail-body">' + (bodyHTML || '<p style="color:var(--mid);">[No content yet]</p>') + '</div></div>');
}

async function addPlayer() {
  const editId = v('p-edit-id');
  const title   = document.getElementById('p-title') && document.getElementById('p-title').value || '';
  const name    = v('p-name'), country = v('p-country'), rating = v('p-rating'), bio = v('p-bio'), career = v('p-career');
  const style   = document.getElementById('p-style') && document.getElementById('p-style').value || '';
  const image   = document.getElementById('p-img-data').value || '';
  if (!name || !bio) { showToast('Name and bio are required.'); return; }
  const achievements = v('p-achievements').split('\n').filter(l => l.trim()).map(l => { const parts = l.split('|'); return { title: (parts[0] || '').trim(), year: (parts[1] || '').trim() }; });
  const best_games   = v('p-bestgames').split('\n').filter(l => l.trim()).map(l => { const parts = l.split('|'); return { title: (parts[0] || '').trim(), event: (parts[1] || '').trim(), year: (parts[2] || '').trim() }; });
  const item = { id: editId ? Number(editId) : Date.now(), title, name, country: country || '', rating: rating || 'N/A', style, bio, career: career || '', achievements, best_games, image };
  const ok = await upsertItem('players', item);
  if (!ok) return;
  showToast(editId ? 'Player updated!' : 'Player added!');
  cancelEdit('player');
  siteData = await loadData();
  renderAdminLists(); renderAll();
}

function editPlayer(id) {
  const p = siteData.players.find(x => x.id === id); if (!p) return;
  showAdminTab('players');
  document.getElementById('p-edit-id').value = String(p.id);
  document.getElementById('p-name').value = p.name || '';
  document.getElementById('p-country').value = p.country || '';
  document.getElementById('p-rating').value = p.rating || '';
  document.getElementById('p-bio').value = p.bio || '';
  document.getElementById('p-career').value = p.career || '';
  if (document.getElementById('p-title')) document.getElementById('p-title').value = p.title || '';
  if (document.getElementById('p-style')) document.getElementById('p-style').value = p.style || '';
  const achievements = Array.isArray(p.achievements) ? p.achievements : [];
  const best_games   = Array.isArray(p.best_games)   ? p.best_games   : [];
  document.getElementById('p-achievements').value = achievements.map(a => a.title + '|' + a.year).join('\n');
  document.getElementById('p-bestgames').value    = best_games.map(g => g.title + '|' + g.event + '|' + g.year).join('\n');
  if (p.image) { document.getElementById('p-img-data').value = p.image; const prev = document.getElementById('p-img-preview'); const img = document.getElementById('p-img-preview-img'); if (img) img.src = p.image; if (prev) prev.style.display = 'flex'; const drop = document.getElementById('p-img-drop'); if (drop) drop.style.display = 'none'; }
  document.getElementById('player-form-heading').textContent = 'Edit Player';
  document.getElementById('p-submit-label').textContent = 'Save Changes \u2192';
  document.getElementById('player-cancel-edit').style.display = 'inline-block';
  document.querySelector('#admin-players .admin-form').classList.add('editing');
  document.getElementById('admin-players').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function addGame() {
  const editId    = v('g-edit-id'), title = v('g-title');
  const white_title = document.getElementById('g-white-title') && document.getElementById('g-white-title').value || '';
  const black_title = document.getElementById('g-black-title') && document.getElementById('g-black-title').value || '';
  const white_name  = v('g-white'), black_name = v('g-black');
  const white = white_title ? white_title + ' ' + white_name : white_name;
  const black = black_title ? black_title + ' ' + black_name : black_name;
  const year = v('g-year'), event = v('g-event'), result = v('g-result'), description = v('g-desc'), pgn = v('g-pgn');
  if (!title || !white_name || !black_name) { showToast('Title, White, and Black are required.'); return; }
  const item = { id: editId ? Number(editId) : Date.now(), title, white, black, white_title, black_title, white_name, black_name, year: year || '', event: event || '', result: result || '', description: description || '', pgn: pgn || '' };
  const ok = await upsertItem('games', item);
  if (!ok) return;
  showToast(editId ? 'Game updated!' : 'Game added!');
  cancelEdit('game');
  siteData = await loadData();
  renderAdminLists(); renderAll();
}

function editGame(id) {
  const g = siteData.games.find(x => x.id === id); if (!g) return;
  showAdminTab('games');
  document.getElementById('g-edit-id').value = String(g.id);
  document.getElementById('g-title').value = g.title || '';
  document.getElementById('g-white').value = g.white_name || g.white || '';
  document.getElementById('g-black').value = g.black_name || g.black || '';
  if (document.getElementById('g-white-title')) document.getElementById('g-white-title').value = g.white_title || '';
  if (document.getElementById('g-black-title')) document.getElementById('g-black-title').value = g.black_title || '';
  document.getElementById('g-year').value   = g.year   || '';
  document.getElementById('g-event').value  = g.event  || '';
  document.getElementById('g-result').value = g.result || '';
  document.getElementById('g-desc').value   = g.description || '';
  document.getElementById('g-pgn').value    = g.pgn    || '';
  document.getElementById('game-form-heading').textContent  = 'Edit Game';
  document.getElementById('g-submit-label').textContent     = 'Save Changes \u2192';
  document.getElementById('game-cancel-edit').style.display = 'inline-block';
  document.querySelector('#admin-games .admin-form').classList.add('editing');
  document.getElementById('admin-games').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function addPdf() {
  const editId = v('d-edit-id'), title = v('d-title'), author = v('d-author'), description = v('d-desc'), content = v('d-content'), url = v('d-url');
  const tag         = document.getElementById('d-tag') && document.getElementById('d-tag').value || '';
  const file_data   = document.getElementById('d-file-data').value || '';
  const file_name   = document.getElementById('d-file-name').value || '';
  const cover_image = document.getElementById('d-img-data').value || '';
  let size = '';
  if (file_data) { const bytes = Math.round((file_data.length * (3 / 4)) / 1024); size = bytes > 1024 ? (bytes / 1024).toFixed(1) + ' MB' : bytes + ' KB'; }
  if (!title || !author) { showToast('Title and author are required.'); return; }
  const existing = editId ? siteData.pdfs.find(p => String(p.id) === editId) : null;
  const item = {
    id: editId ? Number(editId) : Date.now(),
    title, author, tag, description: description || '', content: content || '',
    url: url || (existing ? existing.url : ''),
    file_data: file_data || (existing ? existing.file_data : ''),
    file_name: file_name || (existing ? existing.file_name : ''),
    size: size || (existing ? existing.size : ''),
    cover_image: cover_image || (existing ? existing.cover_image : ''),
  };
  const ok = await upsertItem('pdfs', item);
  if (!ok) return;
  showToast(editId ? 'PDF updated!' : 'PDF added!');
  cancelEdit('pdf');
  siteData = await loadData();
  renderAdminLists(); renderAll();
}

function editPdf(id) {
  const p = siteData.pdfs.find(x => x.id === id); if (!p) return;
  showAdminTab('pdfs');
  document.getElementById('d-edit-id').value  = String(p.id);
  document.getElementById('d-title').value    = p.title   || '';
  document.getElementById('d-author').value   = p.author  || '';
  document.getElementById('d-desc').value     = p.description || '';
  document.getElementById('d-content').value  = p.content || '';
  document.getElementById('d-url').value      = p.url     || '';
  if (document.getElementById('d-tag')) document.getElementById('d-tag').value = p.tag || '';
  if (p.file_data) { document.getElementById('d-file-data').value = p.file_data; document.getElementById('d-file-name').value = p.file_name || p.title + '.pdf'; document.getElementById('d-pdf-preview-name').textContent = p.file_name || p.title + '.pdf'; document.getElementById('d-pdf-preview-size').textContent = p.size || ''; document.getElementById('d-pdf-preview').style.display = 'flex'; document.getElementById('d-pdf-drop').style.display = 'none'; }
  if (p.cover_image) { document.getElementById('d-img-data').value = p.cover_image; const prev = document.getElementById('d-img-preview'); const img = document.getElementById('d-img-preview-img'); if (img) img.src = p.cover_image; if (prev) prev.style.display = 'flex'; const drop = document.getElementById('d-img-drop'); if (drop) drop.style.display = 'none'; }
  document.getElementById('pdf-form-heading').textContent  = 'Edit PDF';
  document.getElementById('d-submit-label').textContent    = 'Save Changes \u2192';
  document.getElementById('pdf-cancel-edit').style.display = 'inline-block';
  document.querySelector('#admin-pdfs .admin-form').classList.add('editing');
  document.getElementById('admin-pdfs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit(type) {
  const map = { article: 'articles', player: 'players', game: 'games', pdf: 'pdfs' };
  const formMap = { article: 'a', player: 'p', game: 'g', pdf: 'd' };
  const p = formMap[type];
  const editId = document.getElementById(p + '-edit-id'); if (editId) editId.value = '';
  const headings = { article: 'Add Article', player: 'Add Player Profile', game: 'Add Game of the Century', pdf: 'Add PDF to Library' };
  const hEl = document.getElementById(type + '-form-heading'); if (hEl) hEl.textContent = headings[type];
  const submitLabels = { article: 'Add Article \u2192', player: 'Add Player \u2192', game: 'Add Game \u2192', pdf: 'Add PDF \u2192' };
  const sEl = document.getElementById(p + '-submit-label'); if (sEl) sEl.textContent = submitLabels[type] || 'Submit \u2192';
  const cancelBtn = document.getElementById(type + '-cancel-edit'); if (cancelBtn) cancelBtn.style.display = 'none';
  document.querySelector('#admin-' + map[type] + ' .admin-form') && document.querySelector('#admin-' + map[type] + ' .admin-form').classList.remove('editing');
  const section = document.getElementById('admin-' + map[type]);
  if (section) {
    section.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=file])').forEach(function (el) { el.value = ''; });
    section.querySelectorAll('textarea').forEach(function (el) { el.value = ''; });
    section.querySelectorAll('select').forEach(function (el) { el.selectedIndex = 0; });
    section.querySelectorAll('input[type=checkbox]').forEach(function (el) { if (el.id.endsWith('-published')) el.checked = true; });
  }
  if (type === 'article') clearImgField('a-img-preview', 'a-img-data', 'a-img-drop', 'a-img-input');
  if (type === 'player') clearImgField('p-img-preview', 'p-img-data', 'p-img-drop', 'p-img-input');
  if (type === 'pdf') { removePdfUpload(); clearImgField('d-img-preview', 'd-img-data', 'd-img-drop', 'd-img-input'); }
}

async function resetToDefault() {
  if (!confirm('Reset ALL content to defaults? This cannot be undone.')) return;
  showToast('Resetting...');
  await seedDefaultData();
  siteData = await loadData();
  renderAdminLists(); renderAll(); showToast('Content reset to defaults.');
}

document.addEventListener('change', function (e) {
  if (e.target.id === 'a-published') { const lbl = document.getElementById('a-published-label'); if (lbl) lbl.textContent = e.target.checked ? 'Published' : 'Draft'; }
});

// ============================================
// UTILITIES
// ============================================
function v(id) { return (document.getElementById(id) && document.getElementById(id).value || '').trim(); }
function nowDate() { return new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); }
function showToast(msg) { const t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2800); }
function initFadeIn() {
  const obs = new IntersectionObserver(function (entries) { entries.forEach(function (e, i) { if (e.isIntersecting) { setTimeout(function () { e.target.classList.add('visible'); }, i * 80); obs.unobserve(e.target); } }); }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
}
function initScrollSpy() {
  const sections = ['articles', 'players', 'games', 'library'];
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function () {
    if (currentPage !== 'home') return;
    let cur = '';
    sections.forEach(function (id) { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 120) cur = id; });
    links.forEach(function (l, i) { l.classList.toggle('active', sections[i] === cur); });
  });
}

// ============================================
// INIT
// ============================================
window.addEventListener('DOMContentLoaded', async function () {
  applyStoredTheme();
  syncDarkSelects();

  // Render board immediately so the hero isn't empty while DB loads
  buildHomeBoard();

  // Verify the Supabase client was created properly
  if (!db) {
    console.error('[supabase] client is undefined — check CDN script order');
    showToast('Database not connected. Check console.');
    return;
  }

  showToast('Loading content\u2026');

  siteData = await loadData();
  console.log('[64squares] loaded:', siteData.articles.length, 'articles,',
    siteData.players.length, 'players,', siteData.games.length, 'games,', siteData.pdfs.length, 'pdfs');

  // Auto-seed defaults only when DB is completely empty
  if (!siteData.articles.length && !siteData.players.length && !siteData.games.length) {
    showToast('First run — loading default content\u2026');
    await seedDefaultData();
    siteData = await loadData();
  }

  renderAll();
  buildHomeBoard();   // rebuild now that player names are loaded
  buildLatestStrip();
  initScrollSpy();
  setTimeout(initFadeIn, 120);

  const pwInput = document.getElementById('adminPwInput');
  if (pwInput) pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitAdminLogin(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && searchOpen) closeSearch(); });
});
