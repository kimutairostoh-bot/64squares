// ═══════════════════════════════════════════
// 64 SQUARES — script.js  (v4 — full admin)
// ═══════════════════════════════════════════

const STORAGE_KEY = 'chess64_v4';
function loadData() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch(e) { showToast('Storage full — try removing large images.'); } }

// ── DEFAULT DATA ──
const defaultData = {
  articles: [
    { id:1, tag:"Strategy", title:"The Art of the Endgame: Rook & Pawn Mastery", excerpt:"Understanding why endgames are where true chess understanding is revealed — and how the world's best navigated them.", content:"The endgame is where champions are made. While openings can be memorized and middlegames can be calculated, the endgame demands pure understanding — an intuitive grasp of piece coordination, king activity, and pawn promotion that separates true masters from the rest.\n\nRook endgames constitute the vast majority of practical endgame situations, and mastering them is perhaps the single greatest investment a club player can make. The Lucena position and the Philidor defense are not merely theoretical curiosities; they are the pillars upon which practical rook endgame technique is built.\n\nThe key insight is activity. In rook endgames, the rook must be active at all costs. A passive rook is almost always losing; an active rook can often hold or even win seemingly hopeless positions.\n\nPractice these positions repeatedly until the moves become second nature. The champions of the game did not merely study endgames — they absorbed them.", date:"May 2026", readTime:"8 min", published:true, image:"" },
    { id:2, tag:"History", title:"Fischer vs. Spassky: The Match That Stopped the World", excerpt:"A look back at the 1972 World Championship in Reykjavík — a Cold War showdown played on 64 squares.", content:"In the summer of 1972, the world held its breath — not over a military confrontation, but over a chess match. In Reykjavík, Iceland, an eccentric American prodigy named Robert James Fischer faced the calm Soviet champion Boris Spassky in what would become the most watched chess match in history.\n\nThe backdrop was unmistakable: the Cold War was at its height. The Soviet chess machine had dominated the World Championship for decades, and Fischer's challenge was seen in Washington and Moscow alike as something far greater than sport.\n\nFischer won the match 12.5–8.5, becoming the 11th World Chess Champion and the first American to hold the title. He never defended it. The chess world was never quite the same.", date:"Apr 2026", readTime:"12 min", published:true, image:"" },
    { id:3, tag:"Opening Theory", title:"The Sicilian Dragon: Fire on the Board", excerpt:"One of chess's most double-edged openings — why the Dragon keeps burning generations of players.", content:"Few opening systems in chess generate as much heat as the Sicilian Dragon. Named for the pawn structure that resembles the constellation Draco, the Dragon has seduced generations of attacking players with its promise of sharp, uncompromising chess.\n\nThe position arises after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6, with Black fianchettoing the bishop on g7 — the fabled Dragon bishop, the soul of the entire system.\n\nThe Dragon demands deep theoretical preparation. A single misplaced move can be catastrophic for either side. Yet this is precisely the appeal: the Dragon rewards the player who has studied hardest and calculated most precisely.", date:"Mar 2026", readTime:"6 min", published:true, image:"" },
  ],
  players: [
    { id:1, name:"Garry Kasparov", country:"Russia", rating:"2851", style:"Universal", bio:"Widely regarded as the greatest chess player of all time, Garry Kasparov dominated competitive chess for two decades. Born in Baku in 1963, he became World Champion at 22 — the youngest in history at the time — defeating the formidable Anatoly Karpov in a legendary five-match series.", career:"Kasparov defeated Karpov in five legendary World Championship matches from 1984 to 1990. He held the world number one ranking for 225 months. In 1997, he famously lost a match to IBM's Deep Blue.", achievements:[{title:"World Chess Champion",year:"1985–2000"},{title:"Peak FIDE Rating 2851",year:"1999"},{title:"World number 1 for 225 months",year:"1984–2005"}], bestGames:[{title:"Kasparov vs. Topalov — The Immortal Game",event:"Wijk aan Zee",year:"1999"}], image:"" },
    { id:2, name:"Magnus Carlsen", country:"Norway", rating:"2882", style:"Universal", bio:"Magnus Carlsen is a Norwegian grandmaster and the highest-rated player in chess history, achieving a peak rating of 2882 in 2014. Born in 1990, he became a grandmaster at just 13 years of age.", career:"Carlsen became World Chess Champion in 2013 by defeating Viswanathan Anand. He defended the title four times. In 2022 he declined to defend against Nepomniachtchi.", achievements:[{title:"FIDE World Chess Champion",year:"2013–2023"},{title:"Peak FIDE Rating 2882",year:"2014"}], bestGames:[{title:"Carlsen vs. Karjakin — Game 10",event:"World Championship Match",year:"2016"}], image:"" },
    { id:3, name:"Bobby Fischer", country:"USA", rating:"2785", style:"Tactical", bio:"Robert James Fischer, the 11th World Chess Champion. Born in 1943, became a grandmaster at 15 — a world record at the time. His intensity, genius, and turbulent personality made him a cultural phenomenon.", career:"Fischer annihilated Taimanov and Larsen 6-0 in the 1971 Candidates before defeating Petrosian. His 1972 match against Spassky became a global media sensation.", achievements:[{title:"World Chess Champion",year:"1972–1975"},{title:"US Chess Champion (8 times)",year:"1957–1967"}], bestGames:[{title:"The Game of the Century vs. Donald Byrne",event:"Rosenwald Trophy",year:"1956"}], image:"" },
  ],
  games: [
    { id:1, title:"The Opera Game", white:"Paul Morphy", black:"Duke of Brunswick & Count Isouard", year:"1858", event:"Paris Opera", result:"1–0", desc:"Played during a performance of Norma at the Paris Opera House, this game is the quintessential illustration of rapid development. Morphy declined material repeatedly, culminating in a breathtaking queen sacrifice on move 16.", pgn:"1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#" },
    { id:2, title:"The Immortal Game", white:"Adolf Anderssen", black:"Lionel Kieseritzky", year:"1851", event:"London", result:"1–0", desc:"Anderssen sacrificed both rooks, his bishop, and finally his queen — then delivered checkmate with three minor pieces. Perhaps the most celebrated attacking game in chess history.", pgn:"1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7#" },
    { id:3, title:"Game of the Century", white:"Donald Byrne", black:"Robert J. Fischer", year:"1956", event:"Rosenwald Trophy", result:"0–1", desc:"A 13-year-old Bobby Fischer sacrificed his queen on move 17, launching a forcing sequence of extraordinary depth. Hans Kmoch declared it 'The Game of the Century' — the name has stuck for 70 years.", pgn:"1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2#" },
  ],
  pdfs: [
    { id:1, title:"My System", author:"Nimzowitsch", desc:"The foundational text of modern positional chess strategy.", content:"Nimzowitsch's My System, published in 1925, is arguably the most influential chess book ever written. It systematized concepts like the blockade, prophylaxis, and overprotection into a coherent framework.\n\nNimzowitsch's prose is colorful; he anthropomorphizes pawns and pieces, describing the passed pawn's 'lust to expand.' Whether this makes the book more or less accessible depends on the reader, but it is rarely dull.\n\nMy System remains essential reading for any player seeking to move beyond tactical calculation into strategic understanding.", size:"2.4 MB", url:"" },
    { id:2, title:"Chess Fundamentals", author:"Capablanca", desc:"The World Champion's essential guide covering endings, middle games, and openings.", content:"Capablanca's Chess Fundamentals, published in 1921, is lean and direct. Capablanca believed chess knowledge should be built from the endgame backward — understand the endings first, and the rest of the game makes more sense.\n\nThe book covers king and pawn endgames, rook endgames, basic tactical motifs, and key opening principles, all illustrated with Capablanca's own games.\n\nFor the improving player, Chess Fundamentals remains one of the most efficient paths to genuine chess understanding.", size:"1.8 MB", url:"" },
  ],
};

let siteData = loadData() || JSON.parse(JSON.stringify(defaultData));

// ════════════════════════════════
// CHESS ENGINE
// ════════════════════════════════
const GLYPHS = { wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟' };
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

function fenToBoard(fen) {
  return fen.split(' ')[0].split('/').map(row => {
    const r = [];
    for (const ch of row) isNaN(ch) ? r.push((ch===ch.toUpperCase()?'w':'b')+ch.toUpperCase()) : [...Array(+ch)].forEach(()=>r.push(null));
    return r;
  });
}
function parsePGN(pgn) {
  const moves = pgn.replace(/\d+\./g,'').replace(/\s+/g,' ').trim().split(' ').filter(m=>m&&!m.match(/^\d/)&&!['1-0','0-1','1/2-1/2'].includes(m));
  const states = []; let board = fenToBoard(START_FEN); let turn = 'w';
  states.push(board.map(r=>[...r]));
  for (const move of moves) { board = applyMove(board,move,turn); states.push(board.map(r=>[...r])); turn=turn==='w'?'b':'w'; }
  return states;
}
function applyMove(board, san, color) {
  const b = board.map(r=>[...r]);
  try {
    if (san==='O-O'||san==='0-0') { const row=color==='w'?7:0; b[row][6]=color+'K';b[row][4]=null;b[row][5]=color+'R';b[row][7]=null; return b; }
    if (san==='O-O-O'||san==='0-0-0') { const row=color==='w'?7:0; b[row][2]=color+'K';b[row][4]=null;b[row][3]=color+'R';b[row][0]=null; return b; }
    const clean=san.replace(/[+#!?]/g,''); const promo=clean.includes('=')?clean.split('=')[1][0]:null; const s=clean.split('=')[0];
    let piece,rest; if('KQRBN'.includes(s[0])){piece=s[0];rest=s.slice(1);}else{piece='P';rest=s;}
    const isCapture=rest.includes('x'); rest=rest.replace('x','');
    const dest=rest.slice(-2); const toC=dest.charCodeAt(0)-97; const toR=8-parseInt(dest[1]); const hint=rest.slice(0,-2);
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
      if(b[r][c]!==color+piece) continue;
      if(hint){if(hint.length===2){if(r!==8-parseInt(hint[1])||c!==hint.charCodeAt(0)-97)continue;}else if(isNaN(hint)){if(c!==hint.charCodeAt(0)-97)continue;}else{if(r!==8-parseInt(hint))continue;}}
      if(canMove(b,r,c,toR,toC,color,piece)){b[toR][toC]=promo?color+promo:b[r][c];b[r][c]=null;if(piece==='P'&&isCapture&&!board[toR][toC])b[r][toC]=null;return b;}
    }
  } catch(e) {}
  return b;
}
function canMove(board,fr,fc,tr,tc,color,piece){
  const dr=tr-fr,dc=tc-fc,target=board[tr][tc];
  if(target&&target[0]===color)return false;
  if(piece==='P'){const dir=color==='w'?-1:1,sr=color==='w'?6:1;if(dc===0&&dr===dir&&!target)return true;if(dc===0&&dr===2*dir&&fr===sr&&!board[fr+dir][fc]&&!target)return true;if(Math.abs(dc)===1&&dr===dir)return true;return false;}
  if(piece==='N')return(Math.abs(dr)===2&&Math.abs(dc)===1)||(Math.abs(dr)===1&&Math.abs(dc)===2);
  if(piece==='K')return Math.abs(dr)<=1&&Math.abs(dc)<=1;
  if(piece==='R'){if(dr!==0&&dc!==0)return false;return pathClear(board,fr,fc,tr,tc);}
  if(piece==='B'){if(Math.abs(dr)!==Math.abs(dc))return false;return pathClear(board,fr,fc,tr,tc);}
  if(piece==='Q'){if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc))return false;return pathClear(board,fr,fc,tr,tc);}
  return false;
}
function pathClear(board,fr,fc,tr,tc){const dr=Math.sign(tr-fr),dc=Math.sign(tc-fc);let r=fr+dr,c=fc+dc;while(r!==tr||c!==tc){if(board[r][c])return false;r+=dr;c+=dc;}return true;}
function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function getLegalMoves(board,r,c,color){
  const piece=board[r][c]; if(!piece||piece[0]!==color)return [];
  const type=piece[1],enemy=color==='w'?'b':'w',moves=[];
  const slide=dirs=>{for(const[dr,dc]of dirs){let nr=r+dr,nc=c+dc;while(inBounds(nr,nc)){const t=board[nr][nc];if(!t){moves.push([nr,nc]);}else{if(t[0]===enemy)moves.push([nr,nc]);break;}nr+=dr;nc+=dc;}}};
  const step=dirs=>{for(const[dr,dc]of dirs){const nr=r+dr,nc=c+dc;if(inBounds(nr,nc)){const t=board[nr][nc];if(!t||t[0]===enemy)moves.push([nr,nc]);}}};
  if(type==='P'){const dir=color==='w'?-1:1,sr=color==='w'?6:1;if(inBounds(r+dir,c)&&!board[r+dir][c]){moves.push([r+dir,c]);if(r===sr&&!board[r+2*dir][c])moves.push([r+2*dir,c]);}for(const dc of[-1,1]){if(inBounds(r+dir,c+dc)&&board[r+dir][c+dc]?.[0]===enemy)moves.push([r+dir,c+dc]);}}
  else if(type==='R')slide([[1,0],[-1,0],[0,1],[0,-1]]);
  else if(type==='B')slide([[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if(type==='Q')slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if(type==='N')step([[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]);
  else if(type==='K')step([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  return moves;
}

// ── HOME BOARD ──
let homeBoard=fenToBoard(START_FEN),homeSel=null,homeMoves=[],homeTurn='w';
function buildHomeBoard(){
  const el=document.getElementById('chessBoard'); if(!el)return;
  el.innerHTML=''; el.className='chess-board-interactive';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const sq=document.createElement('div');
    sq.className='isq '+((r+c)%2===0?'isq-light':'isq-dark');
    const piece=homeBoard[r][c];
    if(piece&&GLYPHS[piece]){const sp=document.createElement('span');sp.className='ipiece '+(piece[0]==='w'?'wpiece':'bpiece');sp.textContent=GLYPHS[piece];sq.appendChild(sp);}
    if(homeSel&&homeSel[0]===r&&homeSel[1]===c)sq.classList.add('isq-selected');
    if(homeMoves.some(m=>m[0]===r&&m[1]===c))sq.classList.add('isq-legal');
    sq.addEventListener('click',()=>homeClick(r,c)); el.appendChild(sq);
  }
  const ti=document.getElementById('turnIndicator'); if(ti)ti.textContent=homeTurn==='w'?'⬜ White to move':'⬛ Black to move';
}
function homeClick(r,c){
  const piece=homeBoard[r][c];
  if(homeSel){if(homeMoves.some(m=>m[0]===r&&m[1]===c)){homeBoard[r][c]=homeBoard[homeSel[0]][homeSel[1]];homeBoard[homeSel[0]][homeSel[1]]=null;homeTurn=homeTurn==='w'?'b':'w';homeSel=null;homeMoves=[];buildHomeBoard();return;}homeSel=null;homeMoves=[];}
  if(piece&&piece[0]===homeTurn){homeSel=[r,c];homeMoves=getLegalMoves(homeBoard,r,c,homeTurn);}
  buildHomeBoard();
}
function resetBoard(){homeBoard=fenToBoard(START_FEN);homeSel=null;homeMoves=[];homeTurn='w';buildHomeBoard();}

// ── GAME VIEWER ──
function buildGameBoard(containerId,boardState){
  const el=document.getElementById(containerId); if(!el)return;
  el.innerHTML=''; el.className='chess-board-viewer';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const sq=document.createElement('div'); sq.className='vsq '+((r+c)%2===0?'vsq-light':'vsq-dark');
    const piece=boardState[r][c];
    if(piece&&GLYPHS[piece]){const sp=document.createElement('span');sp.className='vpiece '+(piece[0]==='w'?'wpiece':'bpiece');sp.textContent=GLYPHS[piece];sq.appendChild(sp);}
    el.appendChild(sq);
  }
}
const gameViewerStates={};
function initGameViewer(gameId,pgn){
  const states=pgn?parsePGN(pgn):[fenToBoard(START_FEN)];
  gameViewerStates[gameId]={states,idx:0};
  buildGameBoard('board-'+gameId,states[0]); updateGameNav(gameId);
}
function updateGameNav(gameId){
  const v=gameViewerStates[gameId]; if(!v)return;
  const el=document.getElementById('movenav-'+gameId); if(el)el.textContent=`Move ${v.idx} / ${v.states.length-1}`;
  const prev=document.getElementById('prev-'+gameId); const next=document.getElementById('next-'+gameId);
  if(prev)prev.disabled=v.idx===0; if(next)next.disabled=v.idx===v.states.length-1;
}
function gameStep(gameId,dir){const v=gameViewerStates[gameId];if(!v)return;v.idx=Math.max(0,Math.min(v.states.length-1,v.idx+dir));buildGameBoard('board-'+gameId,v.states[v.idx]);updateGameNav(gameId);}
function gameJump(gameId,pos){const v=gameViewerStates[gameId];if(!v)return;v.idx=pos==='start'?0:v.states.length-1;buildGameBoard('board-'+gameId,v.states[v.idx]);updateGameNav(gameId);}

// ════════════════════════════════
// PAGE ROUTING
// ════════════════════════════════
let currentPage='home';
function goHome(){currentPage='home';document.getElementById('homePage').style.display='block';document.getElementById('detailPage').style.display='none';window.scrollTo(0,0);}
function showDetailPage(html){currentPage='detail';document.getElementById('homePage').style.display='none';document.getElementById('detailPage').style.display='block';document.getElementById('detailContent').innerHTML=html;window.scrollTo(0,0);}
function scrollToSection(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});}

// ── ARTICLE DETAIL ──
function openArticle(id){
  const a=siteData.articles.find(x=>x.id===id); if(!a)return;
  const bodyHTML=(a.content||a.excerpt||'').split('\n').filter(p=>p.trim()).map(p=>`<p>${p.trim()}</p>`).join('');
  const heroImg=a.image?`<img class="article-detail-hero-img" src="${a.image}" alt="${a.title}"/>`:'';
  showDetailPage(`
    <div onclick="goHome()" class="detail-back">← Back to Journal</div>
    <div class="article-detail">
      ${heroImg}
      <div class="article-detail-tag">${a.tag||'General'}</div>
      <h1 class="article-detail-title">${a.title}</h1>
      <div class="article-detail-meta">${a.date||''} &nbsp;·&nbsp; ${a.readTime||''} read</div>
      <div class="article-detail-body">${bodyHTML}</div>
    </div>`);
}

// ── PLAYER DETAIL ──
function openPlayer(id){
  const p=siteData.players.find(x=>x.id===id); if(!p)return;
  const avatarHTML=p.image
    ?`<img class="player-detail-photo" src="${p.image}" alt="${p.name}"/>`
    :`<div class="player-detail-avatar">${p.name[0]}</div>`;
  const achievementsHTML=(p.achievements||[]).map(a=>`<tr><td>${a.title}</td><td>${a.year}</td></tr>`).join('')||'<tr><td colspan="2" style="color:var(--mid);font-size:.8rem;">No achievements listed.</td></tr>';
  const bestGamesHTML=(p.bestGames||[]).map(g=>`<div class="bestgame-row"><h4>${g.title}</h4><p>${g.event} · ${g.year}</p></div>`).join('')||'<p style="color:var(--mid);font-size:.9rem;">No games listed.</p>';
  const styleBadge=p.style?`<span class="style-badge">${p.style}</span>`:'';
  showDetailPage(`
    <div onclick="goHome()" class="detail-back">← Back to Journal</div>
    <div class="player-detail">
      <div class="player-detail-hero">
        ${avatarHTML}
        <div>
          <div class="player-detail-name">${p.name}</div>
          <div class="player-detail-country">${(p.country||'').toUpperCase()}</div>
          <div class="player-detail-rating-badge">Peak Rating: ${p.rating||'N/A'}</div>
          ${styleBadge}
        </div>
      </div>
      <div class="player-detail-tabs">
        <button class="pd-tab active" onclick="switchPdTab(this,'bio')">Biography</button>
        <button class="pd-tab" onclick="switchPdTab(this,'achievements')">Achievements</button>
        <button class="pd-tab" onclick="switchPdTab(this,'career')">Career</button>
        <button class="pd-tab" onclick="switchPdTab(this,'bestgames')">Best Games</button>
      </div>
      <div class="pd-panel active" id="pd-bio"><p>${p.bio||'No biography available.'}</p></div>
      <div class="pd-panel" id="pd-achievements"><table class="achievement-table"><tbody>${achievementsHTML}</tbody></table></div>
      <div class="pd-panel" id="pd-career"><p>${p.career||'No career summary available.'}</p></div>
      <div class="pd-panel" id="pd-bestgames">${bestGamesHTML}</div>
    </div>`);
}
function switchPdTab(btn,id){
  document.querySelectorAll('.pd-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.pd-panel').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active'); const panel=document.getElementById('pd-'+id); if(panel)panel.classList.add('active');
}

// ── GAME DETAIL ──
function openGame(id){
  const g=siteData.games.find(x=>x.id===id); if(!g)return;
  const boardId='detail-board-'+g.id;
  showDetailPage(`
    <div onclick="goHome()" class="detail-back">← Back to Journal</div>
    <div class="game-detail">
      <div class="game-detail-header">
        <div class="game-detail-num">Game of the Century</div>
        <h1 class="game-detail-title">${g.title}</h1>
        <div class="game-detail-players">${g.white} (White) vs ${g.black} (Black) &nbsp;·&nbsp; ${g.event} ${g.year} &nbsp;·&nbsp; ${g.result}</div>
      </div>
      <div class="game-detail-body">
        <div class="game-detail-left">
          <p class="game-detail-desc">${g.desc||'A landmark game in chess history.'}</p>
          ${g.pgn?`<div class="game-detail-pgn-label">PGN Notation</div><div class="game-detail-pgn-box"><pre>${g.pgn}</pre></div>`:''}
        </div>
        <div class="game-detail-right">
          <div id="${boardId}" class="chess-board-viewer"></div>
          <div class="gv-nav">
            <button class="gv-btn" onclick="gameJump('d${g.id}','start')">|◀</button>
            <button class="gv-btn" id="prev-d${g.id}" onclick="gameStep('d${g.id}',-1)">◀</button>
            <span class="gv-movenav" id="movenav-d${g.id}">Move 0</span>
            <button class="gv-btn" id="next-d${g.id}" onclick="gameStep('d${g.id}',1)">▶</button>
            <button class="gv-btn" onclick="gameJump('d${g.id}','end')">▶|</button>
          </div>
        </div>
      </div>
    </div>`);
  setTimeout(()=>{
    const states=g.pgn?parsePGN(g.pgn):[fenToBoard(START_FEN)];
    gameViewerStates['d'+g.id]={states,idx:0};
    buildGameBoard(boardId,states[0]); updateGameNav('d'+g.id);
  },50);
}

// ── PDF DETAIL ──
function openPdf(id){
  const p=siteData.pdfs.find(x=>x.id===id); if(!p)return;
  const contentHTML=(p.content||'').split('\n').filter(x=>x.trim()).map(x=>`<p>${x.trim()}</p>`).join('');

  // Build download/view button
  let downloadBtn='';
  if(p.fileData){
    downloadBtn=`<a class="pdf-download-btn" href="${p.fileData}" download="${p.fileName||p.title+'.pdf'}">↓ Download PDF</a>`;
  } else if(p.url){
    downloadBtn=`<a class="pdf-download-btn" href="${p.url}" target="_blank">↓ Open PDF</a>`;
  } else {
    downloadBtn=`<button class="pdf-download-btn" onclick="showToast('No file attached to this PDF.')">↓ Download PDF</button>`;
  }

  // Build viewer section
  let viewerHTML='';
  if(p.fileData){
    viewerHTML=`
      <div style="margin-top:2rem;">
        <p style="font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;">Document Preview</p>
        <iframe class="pdf-viewer-embed" src="${p.fileData}" title="${p.title}">
          <div class="pdf-viewer-fallback">
            <p>Your browser cannot display this PDF inline.</p>
            <a class="pdf-download-btn" href="${p.fileData}" download="${p.fileName||p.title+'.pdf'}">↓ Download instead</a>
          </div>
        </iframe>
      </div>`;
  } else if(p.url){
    viewerHTML=`
      <div style="margin-top:2rem;">
        <p style="font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;">Document Preview</p>
        <iframe class="pdf-viewer-embed" src="${p.url}" title="${p.title}">
          <div class="pdf-viewer-fallback"><p>Cannot display PDF inline.</p><a class="pdf-download-btn" href="${p.url}" target="_blank">↓ Open in new tab</a></div>
        </iframe>
      </div>`;
  }

  const coverImg=p.coverImage?`<img src="${p.coverImage}" alt="${p.title}" style="width:100%;max-height:280px;object-fit:cover;margin-bottom:2rem;border:1px solid var(--rule);">`:'';

  showDetailPage(`
    <div onclick="goHome()" class="detail-back">← Back to Journal</div>
    <div class="pdf-detail">
      ${coverImg}
      <div class="pdf-detail-header">
        <div class="pdf-detail-icon">PDF</div>
        <div>
          <h1 class="pdf-detail-title">${p.title}</h1>
          <div class="pdf-detail-author">by ${p.author}</div>
          ${p.size?`<div class="pdf-detail-size">${p.size}</div>`:''}
          ${p.fileName?`<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);margin-top:.3rem;">File: ${p.fileName}</div>`:''}
        </div>
      </div>
      ${p.desc?`<p class="pdf-detail-desc">${p.desc}</p>`:''}
      ${downloadBtn}
      ${viewerHTML}
      ${contentHTML?`<div class="pdf-detail-content" style="margin-top:2.5rem;padding-top:2.5rem;border-top:1px solid var(--rule);">${contentHTML}</div>`:''}
    </div>`);
}

// ════════════════════════════════
// RENDER SECTIONS
// ════════════════════════════════
function renderArticles(){
  const grid=document.getElementById('articlesGrid'); if(!grid)return;
  const pub=siteData.articles.filter(a=>a.published!==false);
  if(!pub.length){grid.innerHTML='<p class="empty-msg">No articles yet. Add some from the admin panel.</p>';return;}
  grid.innerHTML=pub.map(a=>`
    <div class="article-card fade-in" onclick="openArticle(${a.id})">
      ${a.image?`<img class="article-card-img" src="${a.image}" alt="${a.title}"/>`:''}
      <div style="padding:${a.image?'1.5rem':'0'};${a.image?'':''}">
        <div class="article-tag">${a.tag||'General'}</div>
        <div class="article-title">${a.title}</div>
        <div class="article-excerpt">${a.excerpt}</div>
        <div class="article-meta">${a.date||''} &nbsp;·&nbsp; ${a.readTime||''} read</div>
        <div class="article-arrow">→</div>
      </div>
    </div>`).join('');
}

function renderPlayers(){
  const grid=document.getElementById('playersGrid'); if(!grid)return;
  if(!siteData.players.length){grid.innerHTML='<p class="empty-msg">No players yet.</p>';return;}
  grid.innerHTML=siteData.players.map(p=>{
    const avatarHTML=p.image
      ?`<img class="player-avatar-photo" src="${p.image}" alt="${p.name}"/>`
      :`<div class="player-avatar">${p.name[0]}</div>`;
    return `<div class="player-card fade-in" onclick="openPlayer(${p.id})">
      <div class="player-card-header">${avatarHTML}<div><div class="player-name">${p.name}</div><div class="player-country">${p.country||''}</div></div></div>
      <div class="player-card-body">
        <div class="player-rating">Peak Rating <strong>${p.rating||'N/A'}</strong></div>
        ${p.style?`<div style="font-family:var(--mono);font-size:.6rem;color:var(--mid);letter-spacing:.1em;text-transform:uppercase;margin-top:.5rem;">${p.style}</div>`:''}
        <div style="margin-top:1rem;font-family:var(--mono);font-size:.62rem;color:var(--mid);letter-spacing:.08em;">Click to view full profile →</div>
      </div>
    </div>`;
  }).join('');
}

function renderGames(){
  const list=document.getElementById('gamesList'); if(!list)return;
  if(!siteData.games.length){list.innerHTML='<p class="empty-msg">No games yet.</p>';return;}
  list.innerHTML=siteData.games.map((g,i)=>`
    <div class="game-entry fade-in">
      <div class="game-row" onclick="toggleGameViewer('gv-${g.id}',${g.id})">
        <div class="game-num">${String(i+1).padStart(2,'0')}</div>
        <div>
          <div class="game-title">${g.title}</div>
          <div class="game-meta">${g.white||''} vs ${g.black||''} &nbsp;·&nbsp; ${g.event||''} &nbsp;·&nbsp; ${g.result||''}</div>
        </div>
        <div class="game-right"><div class="game-year">${g.year||''}</div><div class="game-expand-icon">▾</div></div>
      </div>
      <div class="game-viewer" id="gv-${g.id}" style="display:none;">
        <div class="game-viewer-inner">
          <div class="gv-board-wrap"><div id="board-${g.id}" class="chess-board-viewer"></div></div>
          <div class="gv-controls">
            <div class="gv-pgn">${g.pgn?'<pre>'+g.pgn+'</pre>':'<em>No PGN provided</em>'}</div>
            <div class="gv-nav">
              <button class="gv-btn" onclick="gameJump(${g.id},'start')">|◀</button>
              <button class="gv-btn" id="prev-${g.id}" onclick="gameStep(${g.id},-1)">◀</button>
              <span class="gv-movenav" id="movenav-${g.id}">Move 0</span>
              <button class="gv-btn" id="next-${g.id}" onclick="gameStep(${g.id},1)">▶</button>
              <button class="gv-btn" onclick="gameJump(${g.id},'end')">▶|</button>
            </div>
            <button class="gv-open-page" onclick="openGame(${g.id})">Open full game page →</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function toggleGameViewer(id,gameId){
  const el=document.getElementById(id); if(!el)return;
  const isOpen=el.style.display!=='none'; el.style.display=isOpen?'none':'block';
  if(!isOpen){const game=siteData.games.find(g=>g.id===gameId);if(game)setTimeout(()=>initGameViewer(gameId,game.pgn||''),50);}
}

function renderPDFs(){
  const grid=document.getElementById('pdfGrid'); if(!grid)return;
  if(!siteData.pdfs.length){grid.innerHTML='<p class="empty-msg">No PDFs yet.</p>';return;}
  grid.innerHTML=siteData.pdfs.map(p=>{
    const hasCover=p.coverImage;
    const hasFile=p.fileData||p.url;
    const fileBadge=p.fileData?'<span style="font-family:var(--mono);font-size:.55rem;letter-spacing:.08em;padding:.2rem .5rem;background:#d4edda;color:#155724;border:1px solid #28a745;">FILE ATTACHED</span>':'';
    return `<div class="pdf-card fade-in" onclick="openPdf(${p.id})">
      ${hasCover?`<img class="pdf-card-cover" src="${p.coverImage}" alt="${p.title}"/>`:''}
      <div class="pdf-icon">PDF</div>
      <div class="pdf-title">${p.title} ${fileBadge}</div>
      <div class="pdf-desc">${p.desc||''}<br><br><em style="font-size:.78rem;">— ${p.author}</em></div>
      <div class="pdf-size">${hasFile?'↓ View / Download':'↓ View'} &nbsp;·&nbsp; ${p.size||''}</div>
    </div>`;
  }).join('');
}

function renderAll(){renderArticles();renderPlayers();renderGames();renderPDFs();setTimeout(initFadeIn,80);}

// ════════════════════════════════
// IMAGE UPLOAD
// ════════════════════════════════
function handleImgUpload(inputId, previewId, dataId) {
  const input = document.getElementById(inputId);
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Image too large — max 2MB.'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    document.getElementById(dataId).value = data;
    const preview = document.getElementById(previewId);
    const img = document.getElementById(previewId + '-img');
    if (img) img.src = data;
    preview.style.display = 'flex';
    // hide dropzone
    const drop = document.getElementById(inputId.replace('-input','-drop'));
    if (drop) drop.style.display = 'none';
    showToast('Image loaded ✓');
  };
  reader.readAsDataURL(file);
}

// ── PDF FILE UPLOAD ──
function handlePdfUpload() {
  const input = document.getElementById('d-pdf-input');
  const file = input.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { showToast('Please select a PDF file.'); input.value = ''; return; }
  if (file.size > 5 * 1024 * 1024) { showToast('PDF too large — max 5MB.'); input.value = ''; return; }
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('d-file-data').value = e.target.result;
    document.getElementById('d-file-name').value = file.name;
    document.getElementById('d-pdf-preview-name').textContent = file.name;
    document.getElementById('d-pdf-preview-size').textContent = sizeMB;
    document.getElementById('d-pdf-preview').style.display = 'flex';
    document.getElementById('d-pdf-drop').style.display = 'none';
    // auto-fill size field if empty
    const sizeHidden = document.getElementById('d-size');
    if (sizeHidden) sizeHidden.value = sizeMB;
    showToast('PDF loaded ✓ — ' + sizeMB);
  };
  reader.onerror = () => showToast('Failed to read file.');
  reader.readAsDataURL(file);
}

function removePdfUpload() {
  document.getElementById('d-file-data').value = '';
  document.getElementById('d-file-name').value = '';
  document.getElementById('d-pdf-preview').style.display = 'none';
  document.getElementById('d-pdf-drop').style.display = 'flex';
  document.getElementById('d-pdf-input').value = '';
}

function removeImg(previewId, dataId, dropId) {
  document.getElementById(previewId).style.display = 'none';
  document.getElementById(dataId).value = '';
  const drop = document.getElementById(dropId);
  if (drop) drop.style.display = 'flex';
}

function clearImgField(previewId, dataId, dropId, inputId) {
  removeImg(previewId, dataId, dropId);
  const inp = document.getElementById(inputId);
  if (inp) inp.value = '';
}

// ════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════
const ADMIN_PW='chess2026';
let adminUnlocked=false, adminOpen=false;

function toggleAdmin(){
  if(!adminUnlocked){
    document.getElementById('adminLoginOverlay').classList.add('open');
    document.getElementById('adminPwError').classList.remove('visible');
    setTimeout(()=>document.getElementById('adminPwInput').focus(),150);
    return;
  }
  if(adminOpen)closeAdminPanel(); else openAdminPanel();
}
function openAdminPanel(){
  adminOpen=true;
  document.getElementById('adminPanel').classList.add('open');
  document.getElementById('adminToggleBtn').textContent='✕ Close Admin';
  showAdminTab('articles'); renderAdminLists();
}
function closeAdminPanel(){
  adminOpen=false;
  document.getElementById('adminPanel').classList.remove('open');
  document.getElementById('adminToggleBtn').textContent='⚙ Admin';
}
function submitAdminLogin(){
  const pw=document.getElementById('adminPwInput').value;
  if(pw===ADMIN_PW){adminUnlocked=true;document.getElementById('adminLoginOverlay').classList.remove('open');document.getElementById('adminPwInput').value='';document.getElementById('adminPwError').classList.remove('visible');openAdminPanel();}
  else{document.getElementById('adminPwError').classList.add('visible');document.getElementById('adminPwInput').value='';document.getElementById('adminPwInput').focus();}
}
function closeAdminLogin(){document.getElementById('adminLoginOverlay').classList.remove('open');document.getElementById('adminPwInput').value='';document.getElementById('adminPwError').classList.remove('visible');}
function showAdminTab(tab){
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  const sec=document.getElementById('admin-'+tab); if(sec)sec.classList.add('active');
}

// ── RENDER ADMIN LISTS ──
function renderAdminLists(){
  // Articles — split published / drafts
  const pubA=siteData.articles.filter(a=>a.published!==false);
  const draftA=siteData.articles.filter(a=>a.published===false);
  const al=document.getElementById('adminArticleList');
  if(al)al.innerHTML=pubA.map(a=>{const i=siteData.articles.indexOf(a);return`<div class="admin-item"><span>${a.title}</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle(${i})">Edit</button><button class="admin-del-btn" onclick="deleteItem('articles',${i})">✕</button></div></div>`;}).join('')||'<p class="admin-empty">None yet.</p>';
  const dal=document.getElementById('adminArticleDraftList');
  if(dal)dal.innerHTML=draftA.map(a=>{const i=siteData.articles.indexOf(a);return`<div class="admin-item"><span>${a.title} <span class="draft-badge">Draft</span></span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editArticle(${i})">Edit</button><button class="admin-del-btn" onclick="deleteItem('articles',${i})">✕</button></div></div>`;}).join('')||'<p class="admin-empty">No drafts.</p>';

  const pl=document.getElementById('adminPlayerList');
  if(pl)pl.innerHTML=siteData.players.map((p,i)=>`<div class="admin-item"><span>${p.name} ${p.country?'— '+p.country:''}</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPlayer(${i})">Edit</button><button class="admin-del-btn" onclick="deleteItem('players',${i})">✕</button></div></div>`).join('')||'<p class="admin-empty">No players yet.</p>';

  const gl=document.getElementById('adminGameList');
  if(gl)gl.innerHTML=siteData.games.map((g,i)=>`<div class="admin-item"><span>${g.title} (${g.year})</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editGame(${i})">Edit</button><button class="admin-del-btn" onclick="deleteItem('games',${i})">✕</button></div></div>`).join('')||'<p class="admin-empty">No games yet.</p>';

  const dl=document.getElementById('adminPdfList');
  if(dl)dl.innerHTML=siteData.pdfs.map((p,i)=>`<div class="admin-item"><span>${p.title} — ${p.author}</span><div class="admin-item-actions"><button class="admin-edit-btn" onclick="editPdf(${i})">Edit</button><button class="admin-del-btn" onclick="deleteItem('pdfs',${i})">✕</button></div></div>`).join('')||'<p class="admin-empty">No PDFs yet.</p>';
}

function deleteItem(type,idx){
  if(!confirm('Delete this item?'))return;
  siteData[type].splice(idx,1); saveData(siteData); renderAdminLists(); renderAll(); showToast('Item deleted.');
}

// ── ADD / SAVE ARTICLE ──
function addArticle(){
  const editId=v('a-edit-id');
  const tag=v('a-tag'),title=v('a-title'),content=v('a-content'),excerpt=v('a-excerpt'),date=v('a-date'),rt=v('a-readtime');
  const published=document.getElementById('a-published').checked;
  const image=document.getElementById('a-img-data').value||'';
  if(!title){showToast('Title is required.');return;}
  if(!content&&!excerpt){showToast('Add content or an excerpt.');return;}
  const newExcerpt=excerpt||content.slice(0,160)+(content.length>160?'…':'');

  if(editId){
    const idx=siteData.articles.findIndex(a=>String(a.id)===editId);
    if(idx>-1){
      siteData.articles[idx]={...siteData.articles[idx],tag:tag||'General',title,content,excerpt:newExcerpt,date:date||siteData.articles[idx].date,readTime:rt||siteData.articles[idx].readTime,published,image:image||siteData.articles[idx].image};
      showToast('Article updated!');
    }
  } else {
    siteData.articles.unshift({id:Date.now(),tag:tag||'General',title,content,excerpt:newExcerpt,date:date||nowDate(),readTime:rt||'5 min',published,image});
    showToast(published?'Article published!':'Draft saved!');
  }
  saveData(siteData); cancelEdit('article'); renderAdminLists(); renderAll();
}

function editArticle(idx){
  const a=siteData.articles[idx]; if(!a)return;
  showAdminTab('articles');
  document.getElementById('a-edit-id').value=String(a.id);
  document.getElementById('a-tag').value=a.tag||'';
  document.getElementById('a-title').value=a.title||'';
  document.getElementById('a-content').value=a.content||'';
  document.getElementById('a-excerpt').value=a.excerpt||'';
  document.getElementById('a-date').value=a.date||'';
  document.getElementById('a-readtime').value=a.readTime||'';
  document.getElementById('a-published').checked=a.published!==false;
  document.getElementById('a-published-label').textContent=a.published!==false?'Published':'Draft';
  if(a.image){
    document.getElementById('a-img-data').value=a.image;
    const prev=document.getElementById('a-img-preview');
    const img=document.getElementById('a-img-preview-img');
    if(img)img.src=a.image; if(prev)prev.style.display='flex';
    const drop=document.getElementById('a-img-drop'); if(drop)drop.style.display='none';
  }
  document.getElementById('article-form-heading').textContent='Edit Article';
  document.getElementById('a-submit-label').textContent='Save Changes →';
  document.getElementById('article-cancel-edit').style.display='inline-block';
  document.querySelector('#admin-articles .admin-form').classList.add('editing');
  document.getElementById('admin-articles').scrollIntoView({behavior:'smooth',block:'start'});
}

function previewArticle(){
  const title=v('a-title'); const content=v('a-content'); const excerpt=v('a-excerpt'); const tag=v('a-tag'); const date=v('a-date'); const rt=v('a-readtime'); const image=document.getElementById('a-img-data').value;
  if(!title&&!content){showToast('Add a title or content to preview.');return;}
  const bodyHTML=(content||excerpt||'').split('\n').filter(p=>p.trim()).map(p=>`<p>${p.trim()}</p>`).join('');
  const heroImg=image?`<img class="article-detail-hero-img" src="${image}" alt="${title}"/>`:'';
  showDetailPage(`
    <div onclick="goHome(); setTimeout(()=>{ openAdminPanel(); showAdminTab('articles'); },100)" class="detail-back">← Back to Editor</div>
    <div class="article-detail">
      ${heroImg}
      <div class="article-detail-tag">${tag||'General'} &nbsp;<span style="background:#fff3cd;color:#856404;padding:.2rem .5rem;font-size:.6rem;">PREVIEW</span></div>
      <h1 class="article-detail-title">${title||'Untitled'}</h1>
      <div class="article-detail-meta">${date||nowDate()} &nbsp;·&nbsp; ${rt||'5 min'} read</div>
      <div class="article-detail-body">${bodyHTML||'<p style="color:var(--mid);">[No content yet]</p>'}</div>
    </div>`);
}

// ── ADD / SAVE PLAYER ──
function addPlayer(){
  const editId=v('p-edit-id');
  const name=v('p-name'),country=v('p-country'),rating=v('p-rating'),bio=v('p-bio'),career=v('p-career');
  const style=document.getElementById('p-style')?.value||'';
  const image=document.getElementById('p-img-data').value||'';
  if(!name||!bio){showToast('Name and bio are required.');return;}
  const achievements=v('p-achievements').split('\n').filter(l=>l.trim()).map(l=>{const parts=l.split('|');return{title:(parts[0]||'').trim(),year:(parts[1]||'').trim()};});
  const bestGames=v('p-bestgames').split('\n').filter(l=>l.trim()).map(l=>{const parts=l.split('|');return{title:(parts[0]||'').trim(),event:(parts[1]||'').trim(),year:(parts[2]||'').trim()};});
  if(editId){
    const idx=siteData.players.findIndex(p=>String(p.id)===editId);
    if(idx>-1){siteData.players[idx]={...siteData.players[idx],name,country:country||'',rating:rating||'N/A',style,bio,career:career||'',achievements,bestGames,image:image||siteData.players[idx].image};showToast('Player updated!');}
  } else {
    siteData.players.push({id:Date.now(),name,country:country||'',rating:rating||'N/A',style,bio,career:career||'',achievements,bestGames,image});
    showToast('Player added!');
  }
  saveData(siteData); cancelEdit('player'); renderAdminLists(); renderAll();
}

function editPlayer(idx){
  const p=siteData.players[idx]; if(!p)return;
  showAdminTab('players');
  document.getElementById('p-edit-id').value=String(p.id);
  document.getElementById('p-name').value=p.name||'';
  document.getElementById('p-country').value=p.country||'';
  document.getElementById('p-rating').value=p.rating||'';
  document.getElementById('p-bio').value=p.bio||'';
  document.getElementById('p-career').value=p.career||'';
  if(document.getElementById('p-style'))document.getElementById('p-style').value=p.style||'';
  document.getElementById('p-achievements').value=(p.achievements||[]).map(a=>a.title+'|'+a.year).join('\n');
  document.getElementById('p-bestgames').value=(p.bestGames||[]).map(g=>g.title+'|'+g.event+'|'+g.year).join('\n');
  if(p.image){
    document.getElementById('p-img-data').value=p.image;
    const prev=document.getElementById('p-img-preview'); const img=document.getElementById('p-img-preview-img');
    if(img)img.src=p.image; if(prev)prev.style.display='flex';
    const drop=document.getElementById('p-img-drop'); if(drop)drop.style.display='none';
  }
  document.getElementById('player-form-heading').textContent='Edit Player';
  document.getElementById('p-submit-label').textContent='Save Changes →';
  document.getElementById('player-cancel-edit').style.display='inline-block';
  document.querySelector('#admin-players .admin-form').classList.add('editing');
  document.getElementById('admin-players').scrollIntoView({behavior:'smooth',block:'start'});
}

// ── ADD / SAVE GAME ──
function addGame(){
  const editId=v('g-edit-id');
  const title=v('g-title'),white=v('g-white'),black=v('g-black'),year=v('g-year'),event=v('g-event'),result=v('g-result'),desc=v('g-desc'),pgn=v('g-pgn');
  if(!title||!white||!black){showToast('Title, White, and Black are required.');return;}
  if(editId){
    const idx=siteData.games.findIndex(g=>String(g.id)===editId);
    if(idx>-1){siteData.games[idx]={...siteData.games[idx],title,white,black,year:year||'',event:event||'',result:result||'',desc:desc||'',pgn:pgn||''};showToast('Game updated!');}
  } else {
    siteData.games.push({id:Date.now(),title,white,black,year:year||'',event:event||'',result:result||'',desc:desc||'',pgn:pgn||''});
    showToast('Game added!');
  }
  saveData(siteData); cancelEdit('game'); renderAdminLists(); renderAll();
}

function editGame(idx){
  const g=siteData.games[idx]; if(!g)return;
  showAdminTab('games');
  document.getElementById('g-edit-id').value=String(g.id);
  document.getElementById('g-title').value=g.title||'';
  document.getElementById('g-white').value=g.white||'';
  document.getElementById('g-black').value=g.black||'';
  document.getElementById('g-year').value=g.year||'';
  document.getElementById('g-event').value=g.event||'';
  document.getElementById('g-result').value=g.result||'';
  document.getElementById('g-desc').value=g.desc||'';
  document.getElementById('g-pgn').value=g.pgn||'';
  document.getElementById('game-form-heading').textContent='Edit Game';
  document.getElementById('g-submit-label').textContent='Save Changes →';
  document.getElementById('game-cancel-edit').style.display='inline-block';
  document.querySelector('#admin-games .admin-form').classList.add('editing');
  document.getElementById('admin-games').scrollIntoView({behavior:'smooth',block:'start'});
}

// ── ADD / SAVE PDF ──
function addPdf(){
  const editId=v('d-edit-id');
  const title=v('d-title'),author=v('d-author'),desc=v('d-desc'),content=v('d-content'),url=v('d-url');
  const fileData=document.getElementById('d-file-data').value||'';
  const fileName=document.getElementById('d-file-name').value||'';
  const coverImage=document.getElementById('d-img-data').value||'';
  // auto-compute size from base64 if uploaded
  let size='';
  if(fileData){const bytes=Math.round((fileData.length*(3/4))/1024);size=bytes>1024?(bytes/1024).toFixed(1)+' MB':bytes+' KB';}
  if(!title||!author){showToast('Title and author are required.');return;}
  if(editId){
    const idx=siteData.pdfs.findIndex(p=>String(p.id)===editId);
    if(idx>-1){
      const existing=siteData.pdfs[idx];
      siteData.pdfs[idx]={...existing,title,author,desc:desc||'',content:content||'',
        url:url||existing.url,
        fileData:fileData||existing.fileData||'',
        fileName:fileName||existing.fileName||'',
        size:size||existing.size||'',
        coverImage:coverImage||existing.coverImage||''
      };
      showToast('PDF updated!');
    }
  } else {
    siteData.pdfs.push({id:Date.now(),title,author,desc:desc||'',content:content||'',url:url||'',fileData,fileName,size,coverImage});
    showToast('PDF added!');
  }
  saveData(siteData); cancelEdit('pdf'); renderAdminLists(); renderAll();
}

function editPdf(idx){
  const p=siteData.pdfs[idx]; if(!p)return;
  showAdminTab('pdfs');
  document.getElementById('d-edit-id').value=String(p.id);
  document.getElementById('d-title').value=p.title||'';
  document.getElementById('d-author').value=p.author||'';
  document.getElementById('d-desc').value=p.desc||'';
  document.getElementById('d-content').value=p.content||'';
  document.getElementById('d-url').value=p.url||'';
  // Restore uploaded PDF if present
  if(p.fileData){
    document.getElementById('d-file-data').value=p.fileData;
    document.getElementById('d-file-name').value=p.fileName||p.title+'.pdf';
    document.getElementById('d-pdf-preview-name').textContent=p.fileName||p.title+'.pdf';
    document.getElementById('d-pdf-preview-size').textContent=p.size||'';
    document.getElementById('d-pdf-preview').style.display='flex';
    document.getElementById('d-pdf-drop').style.display='none';
  }
  // Restore cover image if present
  if(p.coverImage){
    document.getElementById('d-img-data').value=p.coverImage;
    const prev=document.getElementById('d-img-preview'); const img=document.getElementById('d-img-preview-img');
    if(img)img.src=p.coverImage; if(prev)prev.style.display='flex';
    const drop=document.getElementById('d-img-drop'); if(drop)drop.style.display='none';
  }
  document.getElementById('pdf-form-heading').textContent='Edit PDF';
  document.getElementById('d-submit-label').textContent='Save Changes →';
  document.getElementById('pdf-cancel-edit').style.display='inline-block';
  document.querySelector('#admin-pdfs .admin-form').classList.add('editing');
  document.getElementById('admin-pdfs').scrollIntoView({behavior:'smooth',block:'start'});
}

// ── CANCEL EDIT ──
function cancelEdit(type){
  const map={article:'articles',player:'players',game:'games',pdf:'pdfs'};
  const formMap={article:'a',player:'p',game:'g',pdf:'d'};
  const p=formMap[type];
  // Clear hidden ID
  const editId=document.getElementById(p+'-edit-id'); if(editId)editId.value='';
  // Reset heading & button
  const headings={article:'Add Article',player:'Add Player Profile',game:'Add Game of the Century',pdf:'Add PDF to Library'};
  const hEl=document.getElementById(type+'-form-heading'); if(hEl)hEl.textContent=headings[type];
  const sEl=document.getElementById(p+'-submit-label'); if(sEl)sEl.textContent=headings[type].replace('Add ','Add ')+' →';
  const cancelBtn=document.getElementById(type+'-cancel-edit'); if(cancelBtn)cancelBtn.style.display='none';
  document.querySelector('#admin-'+map[type]+' .admin-form')?.classList.remove('editing');
  // Clear all inputs
  const section=document.getElementById('admin-'+map[type]);
  if(section){
    section.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=file])').forEach(el=>el.value='');
    section.querySelectorAll('textarea').forEach(el=>el.value='');
    section.querySelectorAll('select').forEach(el=>el.selectedIndex=0);
    section.querySelectorAll('input[type=checkbox]').forEach(el=>{if(el.id.endsWith('-published'))el.checked=true;});
  }
  // Clear image previews
  if(type==='article'){clearImgField('a-img-preview','a-img-data','a-img-drop','a-img-input');}
  if(type==='player'){clearImgField('p-img-preview','p-img-data','p-img-drop','p-img-input');}
  if(type==='pdf'){
    removePdfUpload();
    clearImgField('d-img-preview','d-img-data','d-img-drop','d-img-input');
  }

function resetToDefault(){
  if(!confirm('Reset ALL content to defaults? This cannot be undone.'))return;
  siteData=JSON.parse(JSON.stringify(defaultData)); saveData(siteData); renderAdminLists(); renderAll(); showToast('Content reset to defaults.');
}

// ── TOGGLE LABEL ──
document.addEventListener('change',e=>{
  if(e.target.id==='a-published'){
    const lbl=document.getElementById('a-published-label');
    if(lbl)lbl.textContent=e.target.checked?'Published':'Draft';
  }
});

// ── UTILITIES ──
function v(id){return(document.getElementById(id)?.value||'').trim();}
function nowDate(){return new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'});}
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}

function initFadeIn(){
  const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);obs.unobserve(e.target);}});},{threshold:0.1});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
}
function initScrollSpy(){
  const sections=['articles','players','games','library'];
  const links=document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',()=>{
    if(currentPage!=='home')return;
    let cur='';
    sections.forEach(id=>{const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-120)cur=id;});
    links.forEach((l,i)=>l.classList.toggle('active',sections[i]===cur));
  });
}

window.addEventListener('DOMContentLoaded',()=>{
  renderAll(); buildHomeBoard(); initScrollSpy(); setTimeout(initFadeIn,120);
  document.getElementById('adminPwInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')submitAdminLogin();});
});
