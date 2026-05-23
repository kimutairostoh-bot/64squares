// ═══════════════════════════════════════════
// 64 SQUARES — script.js
// ═══════════════════════════════════════════

// ── STORAGE ──
const STORAGE_KEY = 'chess64_v2';
function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

// ── DEFAULT DATA ──
const defaultData = {
  articles: [
    { id: 1, tag: "Strategy", title: "The Art of the Endgame: Rook & Pawn Mastery", excerpt: "Understanding why endgames are where true chess understanding is revealed — and how the world's best navigated them.", date: "May 2026", readTime: "8 min" },
    { id: 2, tag: "History", title: "Fischer vs. Spassky: The Match That Stopped the World", excerpt: "A look back at the 1972 World Championship in Reykjavík — a Cold War showdown played on 64 squares.", date: "Apr 2026", readTime: "12 min" },
    { id: 3, tag: "Opening Theory", title: "The Sicilian Dragon: Fire on the Board", excerpt: "One of chess's most double-edged openings — why the Dragon keeps burning generations of players.", date: "Mar 2026", readTime: "6 min" },
  ],
  players: [
    { id: 1, name: "Garry Kasparov", country: "Russia", rating: "2851", bio: "Widely regarded as the greatest chess player of all time, Garry Kasparov dominated competitive chess for two decades. Born in Baku in 1963, he became World Champion at 22.", achievements: [{ title: "World Chess Champion", year: "1985–2000" }, { title: "Peak FIDE Rating 2851", year: "1999" }], career: "Kasparov defeated Karpov in five legendary World Championship matches. He famously lost to IBM's Deep Blue in 1997.", bestGames: [{ title: "The Immortal Game vs. Topalov", event: "Wijk aan Zee", year: "1999" }] },
    { id: 2, name: "Magnus Carlsen", country: "Norway", rating: "2882", bio: "Magnus Carlsen is a Norwegian grandmaster and the highest-rated player in history. Born in 1990, he became a grandmaster at 13.", achievements: [{ title: "FIDE World Chess Champion", year: "2013–2023" }, { title: "Peak FIDE Rating 2882", year: "2014" }], career: "Carlsen became World Champion in 2013, defeating Anand. He defended the title four times.", bestGames: [{ title: "Carlsen vs. Karjakin, Game 10", event: "WCC Match", year: "2016" }] },
    { id: 3, name: "Bobby Fischer", country: "USA", rating: "2785", bio: "Robert James Fischer, 11th World Chess Champion. Born in 1943, became a grandmaster at 15.", achievements: [{ title: "World Chess Champion", year: "1972–1975" }, { title: "US Chess Champion (8x)", year: "1957–1967" }], career: "Fischer's 1972 Reykjavík match against Spassky was a global media event.", bestGames: [{ title: "The Game of the Century vs. Byrne", event: "Rosenwald Trophy", year: "1956" }] },
  ],
  games: [
    { id: 1, title: "The Opera Game", white: "Paul Morphy", black: "Duke of Brunswick & Count Isouard", year: "1858", event: "Paris Opera", result: "1–0", pgn: "1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#" },
    { id: 2, title: "The Immortal Game", white: "Adolf Anderssen", black: "Lionel Kieseritzky", year: "1851", event: "London", result: "1–0", pgn: "1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7#" },
    { id: 3, title: "Game of the Century", white: "Donald Byrne", black: "Robert J. Fischer", year: "1956", event: "Rosenwald Trophy", result: "0–1", pgn: "1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2#" },
  ],
  pdfs: [
    { id: 1, title: "My System", author: "Nimzowitsch", desc: "The foundational text of modern positional chess strategy.", size: "2.4 MB" },
    { id: 2, title: "Chess Fundamentals", author: "Capablanca", desc: "The World Champion's essential guide covering endings, middle games, and openings.", size: "1.8 MB" },
  ],
};

let siteData = loadData() || JSON.parse(JSON.stringify(defaultData));

// ════════════════════════════════
// CHESSBOARD ENGINE
// ════════════════════════════════
const GLYPHS = { wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙', bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟' };
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

function fenToBoard(fen) {
  const rows = fen.split(' ')[0].split('/');
  const board = [];
  for (const row of rows) {
    const r = [];
    for (const ch of row) {
      if (isNaN(ch)) {
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        const type = ch.toUpperCase();
        const map = {K:'K',Q:'Q',R:'R',B:'B',N:'N',P:'P'};
        r.push(color + map[type]);
      } else {
        for (let i = 0; i < parseInt(ch); i++) r.push(null);
      }
    }
    board.push(r);
  }
  return board;
}

function parsePGN(pgn) {
  // Returns array of board states (after each half-move)
  const moves = pgn.replace(/\d+\./g, '').replace(/\s+/g, ' ').trim().split(' ').filter(m => m && !m.match(/^\d/) && m !== '1-0' && m !== '0-1' && m !== '1/2-1/2');
  const states = [];
  let board = fenToBoard(START_FEN);
  states.push(board.map(r => [...r]));
  let turn = 'w';
  for (const move of moves) {
    board = applyMove(board, move, turn);
    states.push(board.map(r => [...r]));
    turn = turn === 'w' ? 'b' : 'w';
  }
  return states;
}

function applyMove(board, san, color) {
  const b = board.map(r => [...r]);
  try {
    // Castling
    if (san === 'O-O' || san === '0-0') {
      const row = color === 'w' ? 7 : 0;
      b[row][6] = color + 'K'; b[row][4] = null; b[row][5] = color + 'R'; b[row][7] = null;
      return b;
    }
    if (san === 'O-O-O' || san === '0-0-0') {
      const row = color === 'w' ? 7 : 0;
      b[row][2] = color + 'K'; b[row][4] = null; b[row][3] = color + 'R'; b[row][0] = null;
      return b;
    }
    // Strip check/mate symbols
    const clean = san.replace(/[+#!?]/g, '');
    // Promotion
    const promo = clean.includes('=') ? clean.split('=')[1][0] : null;
    const s = clean.split('=')[0];
    // Determine piece type
    let piece, rest;
    if ('KQRBN'.includes(s[0])) { piece = s[0]; rest = s.slice(1); }
    else { piece = 'P'; rest = s; }
    // Capture
    const isCapture = rest.includes('x');
    rest = rest.replace('x', '');
    // Destination
    const dest = rest.slice(-2);
    const toC = dest.charCodeAt(0) - 97;
    const toR = 8 - parseInt(dest[1]);
    // Disambiguation hint
    const hint = rest.slice(0, -2);
    // Find piece
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c] !== color + piece) continue;
        if (hint) {
          if (hint.length === 2) { if (r !== 8 - parseInt(hint[1]) || c !== hint.charCodeAt(0) - 97) continue; }
          else if (isNaN(hint)) { if (c !== hint.charCodeAt(0) - 97) continue; }
          else { if (r !== 8 - parseInt(hint)) continue; }
        }
        if (canMove(b, r, c, toR, toC, color, piece)) {
          b[toR][toC] = promo ? color + promo : b[r][c];
          b[r][c] = null;
          // En passant
          if (piece === 'P' && isCapture && !board[toR][toC]) {
            b[r][toC] = null;
          }
          return b;
        }
      }
    }
  } catch(e) {}
  return b;
}

function canMove(board, fr, fc, tr, tc, color, piece) {
  const dr = tr - fr, dc = tc - fc;
  const enemy = color === 'w' ? 'b' : 'w';
  const target = board[tr][tc];
  if (target && target[0] === color) return false;
  if (piece === 'P') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    if (dc === 0 && dr === dir && !target) return true;
    if (dc === 0 && dr === 2 * dir && fr === startRow && !board[fr+dir][fc] && !target) return true;
    if (Math.abs(dc) === 1 && dr === dir && target) return true;
    if (Math.abs(dc) === 1 && dr === dir && !target) return true; // en passant simplified
    return false;
  }
  if (piece === 'N') return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
  if (piece === 'K') return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  if (piece === 'R') {
    if (dr !== 0 && dc !== 0) return false;
    return pathClear(board, fr, fc, tr, tc);
  }
  if (piece === 'B') {
    if (Math.abs(dr) !== Math.abs(dc)) return false;
    return pathClear(board, fr, fc, tr, tc);
  }
  if (piece === 'Q') {
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return false;
    return pathClear(board, fr, fc, tr, tc);
  }
  return false;
}

function pathClear(board, fr, fc, tr, tc) {
  const dr = Math.sign(tr - fr), dc = Math.sign(tc - fc);
  let r = fr + dr, c = fc + dc;
  while (r !== tr || c !== tc) {
    if (board[r][c]) return false;
    r += dr; c += dc;
  }
  return true;
}

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getLegalMoves(board, r, c, color) {
  const piece = board[r][c];
  if (!piece || piece[0] !== color) return [];
  const type = piece[1];
  const moves = [];
  const enemy = color === 'w' ? 'b' : 'w';

  const slide = (dirs) => {
    for (const [dr, dc] of dirs) {
      let nr = r+dr, nc = c+dc;
      while (inBounds(nr,nc)) {
        const t = board[nr][nc];
        if (!t) { moves.push([nr,nc]); }
        else { if (t[0]===enemy) moves.push([nr,nc]); break; }
        nr+=dr; nc+=dc;
      }
    }
  };
  const step = (dirs) => {
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (inBounds(nr,nc)) { const t=board[nr][nc]; if (!t||t[0]===enemy) moves.push([nr,nc]); }
    }
  };

  if (type==='P') {
    const dir=color==='w'?-1:1, sr=color==='w'?6:1;
    if (inBounds(r+dir,c)&&!board[r+dir][c]) { moves.push([r+dir,c]); if(r===sr&&!board[r+2*dir][c]) moves.push([r+2*dir,c]); }
    for (const dc of [-1,1]) { if(inBounds(r+dir,c+dc)&&board[r+dir][c+dc]?.[0]===enemy) moves.push([r+dir,c+dc]); }
  } else if (type==='R') slide([[1,0],[-1,0],[0,1],[0,-1]]);
  else if (type==='B') slide([[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if (type==='Q') slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if (type==='N') step([[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]);
  else if (type==='K') step([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);

  return moves;
}

// ── HOMEPAGE INTERACTIVE BOARD ──
let homeBoard = fenToBoard(START_FEN);
let homeSel = null, homeMoves = [], homeTurn = 'w';

function buildHomeBoard() {
  const el = document.getElementById('chessBoard');
  if (!el) return;
  el.innerHTML = '';
  el.className = 'chess-board-interactive';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = 'isq ' + ((r+c)%2===0?'isq-light':'isq-dark');
      sq.dataset.r = r; sq.dataset.c = c;
      const piece = homeBoard[r][c];
      if (piece && GLYPHS[piece]) {
        const sp = document.createElement('span');
        sp.className = 'ipiece '+(piece[0]==='w'?'wpiece':'bpiece');
        sp.textContent = GLYPHS[piece];
        sq.appendChild(sp);
      }
      if (homeSel && homeSel[0]===r && homeSel[1]===c) sq.classList.add('isq-selected');
      if (homeMoves.some(m=>m[0]===r&&m[1]===c)) sq.classList.add('isq-legal');
      sq.addEventListener('click', ()=>homeClick(r,c));
      el.appendChild(sq);
    }
  }
  const ti = document.getElementById('turnIndicator');
  if (ti) ti.textContent = homeTurn==='w' ? '⬜ White to move' : '⬛ Black to move';
}

function homeClick(r, c) {
  const piece = homeBoard[r][c];
  if (homeSel) {
    const legal = homeMoves.some(m=>m[0]===r&&m[1]===c);
    if (legal) {
      homeBoard[r][c] = homeBoard[homeSel[0]][homeSel[1]];
      homeBoard[homeSel[0]][homeSel[1]] = null;
      homeTurn = homeTurn==='w'?'b':'w';
      homeSel = null; homeMoves = [];
      buildHomeBoard(); return;
    }
    homeSel = null; homeMoves = [];
  }
  if (piece && piece[0]===homeTurn) {
    homeSel = [r,c];
    homeMoves = getLegalMoves(homeBoard, r, c, homeTurn);
  }
  buildHomeBoard();
}

function resetBoard() {
  homeBoard = fenToBoard(START_FEN);
  homeSel = null; homeMoves = []; homeTurn = 'w';
  buildHomeBoard();
}

// ── GAME VIEWER BOARD ──
function buildGameBoard(containerId, boardState) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  el.className = 'chess-board-viewer';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = 'vsq ' + ((r+c)%2===0?'vsq-light':'vsq-dark');
      const piece = boardState[r][c];
      if (piece && GLYPHS[piece]) {
        const sp = document.createElement('span');
        sp.className = 'vpiece '+(piece[0]==='w'?'wpiece':'bpiece');
        sp.textContent = GLYPHS[piece];
        sq.appendChild(sp);
      }
      el.appendChild(sq);
    }
  }
}

// ── GAME VIEWER STATE ──
const gameViewerStates = {};

function initGameViewer(gameId, pgn) {
  const states = pgn ? parsePGN(pgn) : [fenToBoard(START_FEN)];
  gameViewerStates[gameId] = { states, idx: 0 };
  buildGameBoard('board-'+gameId, states[0]);
  updateGameNav(gameId);
}

function updateGameNav(gameId) {
  const v = gameViewerStates[gameId];
  if (!v) return;
  const el = document.getElementById('movenav-'+gameId);
  if (el) el.textContent = `Move ${v.idx} / ${v.states.length-1}`;
  const prev = document.getElementById('prev-'+gameId);
  const next = document.getElementById('next-'+gameId);
  if (prev) prev.disabled = v.idx === 0;
  if (next) next.disabled = v.idx === v.states.length-1;
}

function gameStep(gameId, dir) {
  const v = gameViewerStates[gameId];
  if (!v) return;
  v.idx = Math.max(0, Math.min(v.states.length-1, v.idx+dir));
  buildGameBoard('board-'+gameId, v.states[v.idx]);
  updateGameNav(gameId);
}

function gameJump(gameId, pos) {
  const v = gameViewerStates[gameId];
  if (!v) return;
  v.idx = pos === 'start' ? 0 : v.states.length-1;
  buildGameBoard('board-'+gameId, v.states[v.idx]);
  updateGameNav(gameId);
}

// ════════════════════════════════
// RENDER SECTIONS
// ════════════════════════════════

function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  if (!siteData.articles.length) {
    grid.innerHTML = '<p class="empty-msg">No articles yet. Add some from the admin panel.</p>'; return;
  }
  grid.innerHTML = siteData.articles.map(a => `
    <div class="article-card fade-in">
      <div class="article-tag">${a.tag||'General'}</div>
      <div class="article-title">${a.title}</div>
      <div class="article-excerpt">${a.excerpt}</div>
      <div class="article-meta">${a.date||''} &nbsp;·&nbsp; ${a.readTime||''} read</div>
      <div class="article-arrow">→</div>
    </div>`).join('');
}

function renderPlayers() {
  const grid = document.getElementById('playersGrid');
  if (!grid) return;
  if (!siteData.players.length) {
    grid.innerHTML = '<p class="empty-msg">No players yet. Add some from the admin panel.</p>'; return;
  }
  grid.innerHTML = siteData.players.map((p,i) => `
    <div class="player-card fade-in" onclick="openPlayer(${i})">
      <div class="player-card-header">
        <div class="player-avatar">${p.name[0]}</div>
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-country">${p.country||''}</div>
        </div>
      </div>
      <div class="player-card-body">
        <div class="player-rating">Peak Rating <strong>${p.rating||'N/A'}</strong></div>
        <div class="player-tabs">
          <span class="player-tab-pill">Bio</span>
          <span class="player-tab-pill">Achievements</span>
          <span class="player-tab-pill">Career</span>
          <span class="player-tab-pill">Best Games</span>
        </div>
      </div>
    </div>`).join('');
}

function renderGames() {
  const list = document.getElementById('gamesList');
  if (!list) return;
  if (!siteData.games.length) {
    list.innerHTML = '<p class="empty-msg">No games yet. Add some from the admin panel.</p>'; return;
  }
  list.innerHTML = siteData.games.map((g,i) => `
    <div class="game-entry fade-in">
      <div class="game-row" onclick="toggleGameViewer('gv-${g.id}')">
        <div class="game-num">${String(i+1).padStart(2,'0')}</div>
        <div>
          <div class="game-title">${g.title}</div>
          <div class="game-meta">${g.white||''} vs ${g.black||''} &nbsp;·&nbsp; ${g.event||''} &nbsp;·&nbsp; ${g.result||''}</div>
        </div>
        <div class="game-right">
          <div class="game-year">${g.year||''}</div>
          <div class="game-expand-icon">▾</div>
        </div>
      </div>
      <div class="game-viewer" id="gv-${g.id}" style="display:none;">
        <div class="game-viewer-inner">
          <div class="gv-board-wrap">
            <div id="board-${g.id}" class="chess-board-viewer"></div>
          </div>
          <div class="gv-controls">
            <div class="gv-pgn">${g.pgn ? '<pre>'+g.pgn+'</pre>' : '<em>No PGN provided</em>'}</div>
            <div class="gv-nav">
              <button class="gv-btn" id="prev-start-${g.id}" onclick="gameJump(${g.id},'start')">|◀</button>
              <button class="gv-btn" id="prev-${g.id}" onclick="gameStep(${g.id},-1)">◀</button>
              <span class="gv-movenav" id="movenav-${g.id}">Move 0</span>
              <button class="gv-btn" id="next-${g.id}" onclick="gameStep(${g.id},1)">▶</button>
              <button class="gv-btn" id="next-end-${g.id}" onclick="gameJump(${g.id},'end')">▶|</button>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function toggleGameViewer(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const gameId = parseInt(id.replace('gv-',''));
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    const game = siteData.games.find(g => g.id === gameId);
    if (game) setTimeout(() => initGameViewer(gameId, game.pgn||''), 50);
  }
}

function renderPDFs() {
  const grid = document.getElementById('pdfGrid');
  if (!grid) return;
  if (!siteData.pdfs.length) {
    grid.innerHTML = '<p class="empty-msg">No PDFs yet. Add some from the admin panel.</p>'; return;
  }
  grid.innerHTML = siteData.pdfs.map(p => `
    <div class="pdf-card fade-in">
      <div class="pdf-icon">PDF</div>
      <div class="pdf-title">${p.title}</div>
      <div class="pdf-desc">${p.desc}<br><br><em style="font-size:.78rem;">— ${p.author}</em></div>
      <div class="pdf-size">↓ Download &nbsp;·&nbsp; ${p.size||''}</div>
    </div>`).join('');
}

// ── PLAYER MODAL ──
function openPlayer(i) {
  const p = siteData.players[i];
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalCountry').textContent = (p.country||'').toUpperCase();
  document.getElementById('tab-bio').innerHTML = `<p>${p.bio||''}</p>`;
  document.getElementById('tab-achievements').innerHTML = `<ul class="achievement-list">${(p.achievements||[]).map(a=>`<li>${a.title}<span>${a.year}</span></li>`).join('')}</ul>`;
  document.getElementById('tab-career').innerHTML = `<p>${p.career||''}</p>`;
  document.getElementById('tab-bestgames').innerHTML = (p.bestGames||[]).map(g=>`<div class="best-game"><div class="bg-title">${g.title}</div><div class="bg-meta">${g.event} · ${g.year}</div></div>`).join('');
  document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.modal-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.modal-tab')[0].classList.add('active');
  document.getElementById('tab-bio').classList.add('active');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function switchTab(el, tabId) {
  document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.modal-tab-content').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-'+tabId).classList.add('active');
}

// ── SCROLL ──
function scrollTo(id) { document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),i*80); obs.unobserve(e.target); } });
  },{threshold:0.1});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
}

function initScrollSpy() {
  const sections = ['articles','players','games','library'];
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', ()=>{
    let cur='';
    sections.forEach(id=>{ const el=document.getElementById(id); if(el&&window.scrollY>=el.offsetTop-120) cur=id; });
    links.forEach((l,i)=>l.classList.toggle('active',sections[i]===cur));
  });
}

// ════════════════════════════════
// ADMIN PANEL (TOGGLE)
// ════════════════════════════════
const ADMIN_PW = 'chess2026';
let adminUnlocked = false;
let adminOpen = false;
let currentAdminTab = 'articles';

function toggleAdmin() {
  if (!adminUnlocked) {
    document.getElementById('adminLoginOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(()=>document.getElementById('adminPwInput').focus(),150);
    return;
  }
  toggleAdminPanel();
}

function toggleAdminPanel() {
  adminOpen = !adminOpen;
  const panel = document.getElementById('adminPanel');
  const btn = document.getElementById('adminToggleBtn');
  if (adminOpen) {
    panel.classList.add('open');
    btn.textContent = '✕ Close Admin';
    renderAdminLists();
  } else {
    panel.classList.remove('open');
    btn.textContent = '⚙ Admin';
  }
}

function submitAdminLogin() {
  const pw = document.getElementById('adminPwInput').value;
  if (pw === ADMIN_PW) {
    adminUnlocked = true;
    document.getElementById('adminLoginOverlay').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('adminPwInput').value = '';
    document.getElementById('adminPwError').style.display = 'none';
    toggleAdminPanel();
  } else {
    document.getElementById('adminPwError').style.display = 'block';
    document.getElementById('adminPwInput').value = '';
    document.getElementById('adminPwInput').focus();
  }
}

function closeAdminLogin() {
  document.getElementById('adminLoginOverlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('adminPwInput').value = '';
  document.getElementById('adminPwError').style.display = 'none';
}

function showAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.admin-section').forEach(s=>s.style.display='none');
  document.getElementById('admin-'+tab).style.display='block';
  renderAdminLists();
}

function renderAdminLists() {
  document.getElementById('adminArticleList').innerHTML = siteData.articles.map((a,i)=>`
    <div class="admin-item"><span>${a.title}</span><button class="admin-del-btn" onclick="deleteItem('articles',${i})">✕</button></div>`).join('') || '<p class="admin-empty">No articles yet.</p>';

  document.getElementById('adminPlayerList').innerHTML = siteData.players.map((p,i)=>`
    <div class="admin-item"><span>${p.name}</span><button class="admin-del-btn" onclick="deleteItem('players',${i})">✕</button></div>`).join('') || '<p class="admin-empty">No players yet.</p>';

  document.getElementById('adminGameList').innerHTML = siteData.games.map((g,i)=>`
    <div class="admin-item"><span>${g.title} (${g.year})</span><button class="admin-del-btn" onclick="deleteItem('games',${i})">✕</button></div>`).join('') || '<p class="admin-empty">No games yet.</p>';

  document.getElementById('adminPdfList').innerHTML = siteData.pdfs.map((p,i)=>`
    <div class="admin-item"><span>${p.title} — ${p.author}</span><button class="admin-del-btn" onclick="deleteItem('pdfs',${i})">✕</button></div>`).join('') || '<p class="admin-empty">No PDFs yet.</p>';
}

function deleteItem(type, idx) {
  if (!confirm('Delete this item?')) return;
  siteData[type].splice(idx,1);
  saveData(siteData);
  renderAdminLists();
  renderAll();
}

function addArticle() {
  const tag=v('a-tag'), title=v('a-title'), excerpt=v('a-excerpt'), date=v('a-date'), rt=v('a-readtime');
  if (!title||!excerpt) { alert('Title and excerpt are required.'); return; }
  siteData.articles.unshift({ id:Date.now(), tag:tag||'General', title, excerpt, date:date||now(), readTime:rt||'5 min' });
  saveData(siteData); clear(['a-tag','a-title','a-excerpt','a-date','a-readtime']);
  renderAdminLists(); renderAll(); showToast('Article added!');
}

function addPlayer() {
  const name=v('p-name'), country=v('p-country'), rating=v('p-rating'), bio=v('p-bio'), career=v('p-career');
  if (!name||!bio) { alert('Name and bio are required.'); return; }
  siteData.players.push({ id:Date.now(), name, country:country||'', rating:rating||'N/A', bio, career:career||'', achievements:[], bestGames:[] });
  saveData(siteData); clear(['p-name','p-country','p-rating','p-bio','p-career']);
  renderAdminLists(); renderAll(); showToast('Player added!');
}

function addGame() {
  const title=v('g-title'), white=v('g-white'), black=v('g-black'), year=v('g-year'), event=v('g-event'), result=v('g-result'), pgn=v('g-pgn');
  if (!title||!white||!black) { alert('Title, White, and Black are required.'); return; }
  siteData.games.push({ id:Date.now(), title, white, black, year:year||'', event:event||'', result:result||'', pgn:pgn||'' });
  saveData(siteData); clear(['g-title','g-white','g-black','g-year','g-event','g-result','g-pgn']);
  renderAdminLists(); renderAll(); showToast('Game added!');
}

function addPdf() {
  const title=v('d-title'), author=v('d-author'), desc=v('d-desc'), size=v('d-size');
  if (!title||!author) { alert('Title and author are required.'); return; }
  siteData.pdfs.push({ id:Date.now(), title, author, desc:desc||'', size:size||'' });
  saveData(siteData); clear(['d-title','d-author','d-desc','d-size']);
  renderAdminLists(); renderAll(); showToast('PDF added!');
}

function resetToDefault() {
  if (!confirm('Reset ALL content to defaults?')) return;
  siteData = JSON.parse(JSON.stringify(defaultData));
  saveData(siteData);
  renderAdminLists(); renderAll(); showToast('Content reset to defaults.');
}

function v(id) { return document.getElementById(id)?.value.trim()||''; }
function clear(ids) { ids.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); }
function now() { return new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'}); }
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

function renderAll() {
  renderArticles(); renderPlayers(); renderGames(); renderPDFs();
  setTimeout(initFadeIn, 80);
}

// ── INIT ──
window.addEventListener('DOMContentLoaded', ()=>{
  renderAll();
  buildHomeBoard();
  initScrollSpy();
  setTimeout(initFadeIn, 120);
  document.getElementById('adminPwInput').addEventListener('keydown', e=>{ if(e.key==='Enter') submitAdminLogin(); });
});
