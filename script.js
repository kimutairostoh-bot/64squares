// ═══════════════════════════════════════════════
// 64 SQUARES — script.js
// ═══════════════════════════════════════════════

// ── STORAGE HELPERS ──
const STORAGE_KEY = 'chess64_content';

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveContent(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── DEFAULT DATA ──
const defaultData = {
  articles: [
    { id: 1, tag: "Strategy", title: "The Art of the Endgame: Rook & Pawn Mastery", excerpt: "Understanding why endgames are where true chess understanding is revealed — and how the world's best navigated them.", date: "May 2026", readTime: "8 min" },
    { id: 2, tag: "History", title: "Fischer vs. Spassky: The Match That Stopped the World", excerpt: "A look back at the 1972 World Championship in Reykjavík — a Cold War showdown played on 64 squares.", date: "Apr 2026", readTime: "12 min" },
    { id: 3, tag: "Opening Theory", title: "The Sicilian Dragon: Fire on the Board", excerpt: "One of chess's most double-edged openings — why the Dragon keeps burning generations of players.", date: "Mar 2026", readTime: "6 min" },
    { id: 4, tag: "Psychology", title: "Tal's Mysticism: Sacrificing Logic for Chaos", excerpt: "How the Magician from Riga weaponised the irrational and made his opponents fear the board itself.", date: "Feb 2026", readTime: "10 min" },
  ],
  players: [
    { id: 1, name: "Garry Kasparov", country: "Russia", rating: "2851", bio: "Widely regarded as the greatest chess player of all time, Garry Kasparov dominated competitive chess for two decades. Born in Baku in 1963, he became World Champion at 22 and held the title from 1985 to 2000.", achievements: [{ title: "World Chess Champion", year: "1985–2000" }, { title: "Peak FIDE Rating 2851", year: "1999" }, { title: "Chess Oscar (17 times)", year: "1982–1999" }], career: "Kasparov defeated Karpov in five legendary World Championship matches. He famously lost to IBM's Deep Blue in 1997 and retired from professional chess in 2005.", bestGames: [{ title: "The Immortal Game vs. Topalov", event: "Wijk aan Zee", year: "1999" }, { title: "Kasparov vs. Karpov, Game 16", event: "WCC Match", year: "1985" }] },
    { id: 2, name: "Magnus Carlsen", country: "Norway", rating: "2830", bio: "Magnus Carlsen is a Norwegian grandmaster and the highest-rated player in history. Born in 1990, he became a grandmaster at 13 and World Champion at 22.", achievements: [{ title: "FIDE World Chess Champion", year: "2013–2023" }, { title: "Peak FIDE Rating 2882", year: "2014" }, { title: "World Rapid Champion", year: "2014, 2015, 2019, 2022" }], career: "Carlsen became World Champion in 2013, defeating Viswanathan Anand. He defended the title four times before stepping away in 2023.", bestGames: [{ title: "Carlsen vs. Karjakin, Game 10", event: "WCC Match", year: "2016" }, { title: "Carlsen vs. Aronian", event: "Tata Steel Chess", year: "2013" }] },
    { id: 3, name: "Bobby Fischer", country: "USA", rating: "2785", bio: "Robert James Fischer is an American chess legend and the 11th World Champion. Born in 1943, he became a grandmaster at 15 and remains one of the most compelling figures in chess history.", achievements: [{ title: "World Chess Champion", year: "1972–1975" }, { title: "US Chess Champion (8 times)", year: "1957–1967" }, { title: "Perfect Score, US Championship", year: "1963/64" }], career: "Fischer's rise through the 1971 Candidates Tournaments was historic — 20 consecutive wins. His 1972 Reykjavík match was a global media event.", bestGames: [{ title: "The Game of the Century vs. Byrne", event: "Rosenwald Trophy", year: "1956" }, { title: "Fischer vs. Spassky, Game 6", event: "WCC Match", year: "1972" }] },
  ],
  games: [
    { id: 1, title: "The Opera Game", players: "Paul Morphy vs. Duke of Brunswick & Count Isouard", year: "1858", event: "Paris Opera", result: "1–0" },
    { id: 2, title: "The Immortal Game", players: "Adolf Anderssen vs. Lionel Kieseritzky", year: "1851", event: "London", result: "1–0" },
    { id: 3, title: "The Game of the Century", players: "Donald Byrne vs. Robert J. Fischer", year: "1956", event: "Rosenwald Trophy, New York", result: "0–1" },
    { id: 4, title: "Fischer vs. Spassky, Game 6", players: "Bobby Fischer vs. Boris Spassky", year: "1972", event: "World Championship, Reykjavík", result: "1–0" },
    { id: 5, title: "Kasparov vs. Topalov", players: "Garry Kasparov vs. Veselin Topalov", year: "1999", event: "Wijk aan Zee", result: "1–0" },
    { id: 6, title: "The Evergreen Game", players: "Adolf Anderssen vs. Jean Dufresne", year: "1852", event: "Berlin", result: "1–0" },
  ],
  pdfs: [
    { id: 1, title: "My System", author: "Nimzowitsch", desc: "The foundational text of modern positional chess strategy, introducing concepts like blockade and prophylaxis.", size: "2.4 MB" },
    { id: 2, title: "Zurich 1953", author: "Bronstein", desc: "David Bronstein's legendary game-by-game account of the 1953 Candidates Tournament.", size: "5.1 MB" },
    { id: 3, title: "Chess Fundamentals", author: "Capablanca", desc: "The World Champion's essential guide covering endings, middle games, and openings.", size: "1.8 MB" },
    { id: 4, title: "The Life and Games of Mikhail Tal", author: "Tal", desc: "Autobiography and game collection of the Magician from Riga.", size: "3.7 MB" },
  ],
};

// ── STATE ──
let siteData = loadContent() || JSON.parse(JSON.stringify(defaultData));

// ── INTERACTIVE CHESSBOARD ──
const PIECES = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};

const initBoard = [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'],
];

let boardState = initBoard.map(r => [...r]);
let selectedSq = null;
let currentTurn = 'w';
let legalMoves = [];

function buildInteractiveBoard() {
  const board = document.getElementById('chessBoard');
  board.innerHTML = '';
  board.className = 'chess-board-interactive';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      sq.className = 'isq ' + (isLight ? 'isq-light' : 'isq-dark');
      sq.dataset.r = r; sq.dataset.c = c;
      const piece = boardState[r][c];
      if (piece) {
        const span = document.createElement('span');
        span.className = 'ipiece ' + (piece[0] === 'w' ? 'wpiece' : 'bpiece');
        span.textContent = PIECES[piece];
        sq.appendChild(span);
      }
      sq.addEventListener('click', () => handleSquareClick(r, c));
      board.appendChild(sq);
    }
  }
  updateTurnIndicator();
}

function updateTurnIndicator() {
  const el = document.getElementById('turnIndicator');
  if (el) el.textContent = currentTurn === 'w' ? '⬜ White to move' : '⬛ Black to move';
}

function handleSquareClick(r, c) {
  const piece = boardState[r][c];
  if (selectedSq) {
    const isLegal = legalMoves.some(m => m[0] === r && m[1] === c);
    if (isLegal) {
      boardState[r][c] = boardState[selectedSq[0]][selectedSq[1]];
      boardState[selectedSq[0]][selectedSq[1]] = null;
      currentTurn = currentTurn === 'w' ? 'b' : 'w';
      selectedSq = null; legalMoves = [];
      buildInteractiveBoard();
      return;
    }
    selectedSq = null; legalMoves = [];
  }
  if (piece && piece[0] === currentTurn) {
    selectedSq = [r, c];
    legalMoves = getLegalMoves(r, c, piece);
  }
  highlightBoard();
}

function highlightBoard() {
  document.querySelectorAll('.isq').forEach(sq => {
    sq.classList.remove('isq-selected', 'isq-legal');
    const r = +sq.dataset.r, c = +sq.dataset.c;
    if (selectedSq && selectedSq[0] === r && selectedSq[1] === c) sq.classList.add('isq-selected');
    if (legalMoves.some(m => m[0] === r && m[1] === c)) sq.classList.add('isq-legal');
  });
}

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getLegalMoves(r, c, piece) {
  const color = piece[0], type = piece[1];
  const moves = [];
  const enemy = color === 'w' ? 'b' : 'w';

  const slide = (dirs) => {
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        const target = boardState[nr][nc];
        if (!target) { moves.push([nr, nc]); }
        else { if (target[0] === enemy) moves.push([nr, nc]); break; }
        nr += dr; nc += dc;
      }
    }
  };
  const step = (dirs) => {
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc)) {
        const target = boardState[nr][nc];
        if (!target || target[0] === enemy) moves.push([nr, nc]);
      }
    }
  };

  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    if (inBounds(r+dir, c) && !boardState[r+dir][c]) {
      moves.push([r+dir, c]);
      if (r === startRow && !boardState[r+2*dir][c]) moves.push([r+2*dir, c]);
    }
    for (const dc of [-1, 1]) {
      if (inBounds(r+dir, c+dc) && boardState[r+dir][c+dc]?.[0] === enemy) moves.push([r+dir, c+dc]);
    }
  } else if (type === 'R') { slide([[1,0],[-1,0],[0,1],[0,-1]]); }
  else if (type === 'B') { slide([[1,1],[1,-1],[-1,1],[-1,-1]]); }
  else if (type === 'Q') { slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]); }
  else if (type === 'N') { step([[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]); }
  else if (type === 'K') { step([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]); }

  return moves;
}

function resetBoard() {
  boardState = initBoard.map(r => [...r]);
  selectedSq = null; legalMoves = []; currentTurn = 'w';
  buildInteractiveBoard();
}

// ── RENDER ARTICLES ──
function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  if (!siteData.articles.length) { grid.innerHTML = '<p style="color:var(--mid);font-family:var(--mono);font-size:.8rem;">No articles yet. Add some from the admin panel.</p>'; return; }
  grid.innerHTML = siteData.articles.map(a => `
    <div class="article-card fade-in">
      <div class="article-tag">${a.tag}</div>
      <div class="article-title">${a.title}</div>
      <div class="article-excerpt">${a.excerpt}</div>
      <div class="article-meta">${a.date} &nbsp;·&nbsp; ${a.readTime} read</div>
      <div class="article-arrow">→</div>
    </div>`).join('');
}

// ── RENDER PLAYERS ──
function renderPlayers() {
  const grid = document.getElementById('playersGrid');
  if (!grid) return;
  if (!siteData.players.length) { grid.innerHTML = '<p style="color:var(--mid);font-family:var(--mono);font-size:.8rem;">No players yet. Add some from the admin panel.</p>'; return; }
  grid.innerHTML = siteData.players.map((p, i) => `
    <div class="player-card fade-in" onclick="openPlayer(${i})">
      <div class="player-card-header">
        <div class="player-avatar">${p.name[0]}</div>
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-country">${p.country}</div>
        </div>
      </div>
      <div class="player-card-body">
        <div class="player-rating">Peak Rating <strong>${p.rating}</strong></div>
        <div class="player-tabs">
          <span class="player-tab-pill">Bio</span>
          <span class="player-tab-pill">Achievements</span>
          <span class="player-tab-pill">Career</span>
          <span class="player-tab-pill">Best Games</span>
        </div>
      </div>
    </div>`).join('');
}

// ── RENDER GAMES ──
function renderGames() {
  const list = document.getElementById('gamesList');
  if (!list) return;
  if (!siteData.games.length) { list.innerHTML = '<p style="color:var(--mid);font-family:var(--mono);font-size:.8rem;">No games yet.</p>'; return; }
  list.innerHTML = siteData.games.map((g, i) => `
    <div class="game-row fade-in">
      <div class="game-num">${String(i+1).padStart(2,'0')}</div>
      <div>
        <div class="game-title">${g.title}</div>
        <div class="game-meta">${g.players} &nbsp;·&nbsp; ${g.event} &nbsp;·&nbsp; ${g.result}</div>
      </div>
      <div class="game-year">${g.year}</div>
    </div>`).join('');
}

// ── RENDER PDFS ──
function renderPDFs() {
  const grid = document.getElementById('pdfGrid');
  if (!grid) return;
  if (!siteData.pdfs.length) { grid.innerHTML = '<p style="color:var(--mid);font-family:var(--mono);font-size:.8rem;">No PDFs yet.</p>'; return; }
  grid.innerHTML = siteData.pdfs.map(p => `
    <div class="pdf-card fade-in">
      <div class="pdf-icon">PDF</div>
      <div class="pdf-title">${p.title}</div>
      <div class="pdf-desc">${p.desc}<br><br><em style="font-size:.78rem;">— ${p.author}</em></div>
      <div class="pdf-size">↓ Download &nbsp;·&nbsp; ${p.size}</div>
    </div>`).join('');
}

// ── PLAYER MODAL ──
function openPlayer(i) {
  const p = siteData.players[i];
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalCountry').textContent = p.country.toUpperCase();
  document.getElementById('tab-bio').innerHTML = `<p>${p.bio}</p>`;
  document.getElementById('tab-achievements').innerHTML = `<ul class="achievement-list">${(p.achievements||[]).map(a=>`<li>${a.title}<span>${a.year}</span></li>`).join('')}</ul>`;
  document.getElementById('tab-career').innerHTML = `<p>${p.career}</p>`;
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

// ── SCROLL NAV ──
function scrollTo(id) { document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

// ── FADE IN ──
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e,i) => { if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),i*80); obs.unobserve(e.target); } });
  }, {threshold:0.1});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
}

// ── SCROLL SPY ──
function initScrollSpy() {
  const sections = ['articles','players','games','library'];
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id=>{ const el=document.getElementById(id); if(el&&window.scrollY>=el.offsetTop-120) current=id; });
    links.forEach((l,i)=>l.classList.toggle('active', sections[i]===current));
  });
}

// ════════════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════════════
const ADMIN_PASSWORD = 'chess2026';
let adminLoggedIn = false;

function openAdminLogin() {
  document.getElementById('adminLoginOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('adminPwInput').value = '';
  document.getElementById('adminPwError').style.display = 'none';
  setTimeout(()=>document.getElementById('adminPwInput').focus(),100);
}

function closeAdminLogin() {
  document.getElementById('adminLoginOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function submitAdminLogin() {
  const pw = document.getElementById('adminPwInput').value;
  if (pw === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    closeAdminLogin();
    openAdminPanel();
  } else {
    document.getElementById('adminPwError').style.display = 'block';
    document.getElementById('adminPwInput').value = '';
    document.getElementById('adminPwInput').focus();
  }
}

function openAdminPanel() {
  document.getElementById('adminPanelOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  showAdminTab('articles');
}

function closeAdminPanel() {
  document.getElementById('adminPanelOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.admin-section').forEach(s=>s.style.display='none');
  document.getElementById('admin-'+tab).style.display='block';
  renderAdminLists();
}

function renderAdminLists() {
  // Articles list
  const al = document.getElementById('adminArticleList');
  al.innerHTML = siteData.articles.map((a,i)=>`
    <div class="admin-item">
      <span>${a.title}</span>
      <button class="admin-del-btn" onclick="deleteItem('articles',${i})">✕</button>
    </div>`).join('') || '<p class="admin-empty">No articles yet.</p>';

  // Players list
  const pl = document.getElementById('adminPlayerList');
  pl.innerHTML = siteData.players.map((p,i)=>`
    <div class="admin-item">
      <span>${p.name}</span>
      <button class="admin-del-btn" onclick="deleteItem('players',${i})">✕</button>
    </div>`).join('') || '<p class="admin-empty">No players yet.</p>';

  // Games list
  const gl = document.getElementById('adminGameList');
  gl.innerHTML = siteData.games.map((g,i)=>`
    <div class="admin-item">
      <span>${g.title} (${g.year})</span>
      <button class="admin-del-btn" onclick="deleteItem('games',${i})">✕</button>
    </div>`).join('') || '<p class="admin-empty">No games yet.</p>';

  // PDFs list
  const dl = document.getElementById('adminPdfList');
  dl.innerHTML = siteData.pdfs.map((p,i)=>`
    <div class="admin-item">
      <span>${p.title} — ${p.author}</span>
      <button class="admin-del-btn" onclick="deleteItem('pdfs',${i})">✕</button>
    </div>`).join('') || '<p class="admin-empty">No PDFs yet.</p>';
}

function deleteItem(type, index) {
  if (!confirm('Delete this item?')) return;
  siteData[type].splice(index, 1);
  saveContent(siteData);
  renderAdminLists();
  renderAll();
}

function addArticle() {
  const tag   = document.getElementById('a-tag').value.trim();
  const title = document.getElementById('a-title').value.trim();
  const excerpt = document.getElementById('a-excerpt').value.trim();
  const date  = document.getElementById('a-date').value.trim();
  const rt    = document.getElementById('a-readtime').value.trim();
  if (!title || !excerpt) { alert('Title and excerpt are required.'); return; }
  siteData.articles.unshift({ id: Date.now(), tag: tag||'General', title, excerpt, date: date||new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'}), readTime: rt||'5 min' });
  saveContent(siteData);
  ['a-tag','a-title','a-excerpt','a-date','a-readtime'].forEach(id=>document.getElementById(id).value='');
  renderAdminLists(); renderAll();
  alert('Article added!');
}

function addPlayer() {
  const name    = document.getElementById('p-name').value.trim();
  const country = document.getElementById('p-country').value.trim();
  const rating  = document.getElementById('p-rating').value.trim();
  const bio     = document.getElementById('p-bio').value.trim();
  const career  = document.getElementById('p-career').value.trim();
  if (!name || !bio) { alert('Name and bio are required.'); return; }
  siteData.players.push({ id: Date.now(), name, country: country||'Unknown', rating: rating||'N/A', bio, career: career||'', achievements: [], bestGames: [] });
  saveContent(siteData);
  ['p-name','p-country','p-rating','p-bio','p-career'].forEach(id=>document.getElementById(id).value='');
  renderAdminLists(); renderAll();
  alert('Player added!');
}

function addGame() {
  const title   = document.getElementById('g-title').value.trim();
  const players = document.getElementById('g-players').value.trim();
  const year    = document.getElementById('g-year').value.trim();
  const event   = document.getElementById('g-event').value.trim();
  const result  = document.getElementById('g-result').value.trim();
  if (!title || !players) { alert('Title and players are required.'); return; }
  siteData.games.push({ id: Date.now(), title, players, year: year||'', event: event||'', result: result||'' });
  saveContent(siteData);
  ['g-title','g-players','g-year','g-event','g-result'].forEach(id=>document.getElementById(id).value='');
  renderAdminLists(); renderAll();
  alert('Game added!');
}

function addPdf() {
  const title  = document.getElementById('d-title').value.trim();
  const author = document.getElementById('d-author').value.trim();
  const desc   = document.getElementById('d-desc').value.trim();
  const size   = document.getElementById('d-size').value.trim();
  if (!title || !author) { alert('Title and author are required.'); return; }
  siteData.pdfs.push({ id: Date.now(), title, author, desc: desc||'', size: size||'Unknown' });
  saveContent(siteData);
  ['d-title','d-author','d-desc','d-size'].forEach(id=>document.getElementById(id).value='');
  renderAdminLists(); renderAll();
  alert('PDF added!');
}

function resetToDefault() {
  if (!confirm('Reset ALL content to default? This cannot be undone.')) return;
  siteData = JSON.parse(JSON.stringify(defaultData));
  saveContent(siteData);
  renderAdminLists(); renderAll();
  alert('Reset complete.');
}

function renderAll() {
  renderArticles(); renderPlayers(); renderGames(); renderPDFs();
  setTimeout(initFadeIn, 50);
}

// ── INIT ──
window.addEventListener('DOMContentLoaded', () => {
  buildInteractiveBoard();
  renderAll();
  initScrollSpy();
  setTimeout(initFadeIn, 100);

  // Enter key on admin password
  document.getElementById('adminPwInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAdminLogin();
  });
});
