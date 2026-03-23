// =========== SCREEN NAVIGATION & UI ===========
// ===== 画面ナビゲーション =====
function hideAllScreens(){
  document.getElementById('home-screen').style.display='none';
  document.getElementById('select-screen').style.display='none';
  document.getElementById('shop-screen').style.display='none';
  document.getElementById('mode-screen').style.display='none';
  document.getElementById('quest-screen').style.display='none';
  document.getElementById('lucky-drop-screen').style.display='none';
  document.getElementById('name-screen').style.display='none';
  document.getElementById('friend-screen').style.display='none';
  const rs=document.getElementById('ranking-screen'); if(rs) rs.style.display='none';
  const rnm=document.getElementById('rename-modal'); if(rnm) rnm.style.display='none';
  const hnm=document.getElementById('hand-modal'); if(hnm) hnm.style.display='none';
  const fgm=document.getElementById('firebase-guide-modal'); if(fgm) fgm.style.display='none';
}


function goHome(){
  // ゲーム停止
  if(state) state.running = false;
  if(typeof animId !== 'undefined') cancelAnimationFrame(animId);
  // ゲーム画面を隠す
  const gw = document.getElementById('game-wrap');
  if(gw) gw.style.display = 'none';
  // オーバーレイを隠す
  const ov = document.getElementById('overlay');
  if(ov) ov.style.display = 'none';
  // タッチUIを隠す
  const dl = document.getElementById('dpad-left');
  const dr = document.getElementById('dpad-right');
  const ds = document.getElementById('dpad-super');
  const gh = document.getElementById('gadget-hud');
  if(dl) dl.style.display='none';
  if(dr) dr.style.display='none';
  if(ds) ds.style.display='none';
  if(gh) gh.style.display='none';
  // HUDを隠す
  const hudTl=document.getElementById('hud-tl');
  const hudTr=document.getElementById('hud-tr');
  const hudBot=document.getElementById('hud-bot');
  const fa=document.getElementById('friend-ally-hud');
  if(hudTl) hudTl.style.display='none';
  if(hudTr) hudTr.style.display='none';
  if(hudBot) hudBot.style.display='none';
  if(fa) fa.innerHTML='';
  // ホームへ
  showHome();
}

function showHome(){
  hideAllScreens();
  document.getElementById('home-screen').style.display='flex';
  updateAllDisplays();
  refreshHomeChar();
  updatePartySlots();
  updateQuestBadge();
  updateLevelDisplay();
  if(window._firebaseReady) updateMyPresence();
}

function refreshHomeChar(){
  const bigCanvas = document.getElementById('home-char-canvas-big');
  const noChar = document.getElementById('home-no-char');
  const namDisp = document.getElementById('home-player-name-disp');
  if(namDisp) namDisp.textContent = playerName || '—';

  if(selectedBrawler){
    noChar.style.display='none';
    bigCanvas.style.display='block';
    // 大きなサイズで描画
    const sz = Math.min(window.innerWidth*0.55, 280);
    drawCharacterSprite(bigCanvas, selectedBrawler, sz);
    // キャラ名バブル
    let bubble = document.getElementById('home-char-bubble');
    if(!bubble){
      bubble=document.createElement('div');
      bubble.id='home-char-bubble';
      bubble.style.cssText='position:absolute;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:6px 14px;text-align:center;z-index:5;white-space:nowrap;';
      document.getElementById('home-char-stage').appendChild(bubble);
    }
    bubble.innerHTML='<div style="font-family:Bebas Neue,sans-serif;font-size:16px;color:#fff;letter-spacing:2px;">'+selectedBrawler.name+'</div><div style="font-size:10px;letter-spacing:2px;margin-top:1px;color:'+selectedBrawler.rarityColor+';">'+selectedBrawler.rarity+'</div>';
  } else {
    bigCanvas.style.display='none';
    noChar.style.display='flex';
    const bubble=document.getElementById('home-char-bubble');
    if(bubble) bubble.remove();
  }
}

function openSelect(){
  hideAllScreens();
  document.getElementById('select-screen').style.display='flex';
}

function openShop(){
  hideAllScreens();
  document.getElementById('shop-screen').style.display='flex';
  buildShop();
  updateAllDisplays();
}


function updateFriendHUD(){
  // 仲間HUDエリア（既存のkill-feedの下に追加）
  let hud = document.getElementById('friend-ally-hud');
  if(!hud){
    hud=document.createElement('div');
    hud.id='friend-ally-hud';
    hud.style.cssText='position:absolute;top:70px;left:10px;display:flex;flex-direction:column;gap:4px;pointer-events:none;';
    document.getElementById('hud').appendChild(hud);
  }
  hud.innerHTML='';
  const allies = state.enemies?.filter(e=>e.isFriendBot)||[];
  allies.forEach(a=>{
    const div=document.createElement('div');
    div.style.cssText='background:rgba(0,0,0,0.6);border:1px solid #4fc3f7;border-radius:8px;padding:4px 8px;display:flex;align-items:center;gap:6px;';
    const hpPct=Math.max(0,a.hp/a.maxHp*100);
    div.innerHTML=`<span style="font-size:11px;color:#4fc3f7;font-family:Bebas Neue,sans-serif;letter-spacing:1px;">👥 ${a.friendName||a.name}</span><div style="width:50px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;"><div style="width:${hpPct}%;height:100%;background:#4fc3f7;"></div></div>`;
    hud.appendChild(div);
  });
}

function updateAllDisplays(){
  document.getElementById('home-trophy-count').textContent=trophies;
  document.getElementById('home-coins-count').textContent=coins;
  const sc=document.getElementById('shop-coins-count');
  if(sc) sc.textContent=coins;
  const gc=document.getElementById('shop-gem-count');
  if(gc) gc.textContent=gemCount;
  const hg=document.getElementById('home-gem-count');
  if(hg) hg.textContent=gemCount;
  const hd=document.getElementById('home-drop-count');
  if(hd) hd.textContent=luckyDrops;
  const hpn=document.getElementById('home-player-name-disp');
  if(hpn) hpn.textContent=playerName||'—';
  // クエストバッジ
  updateQuestBadge();
  updateLevelDisplay();
  const dl=document.getElementById('nav-drop-label');
  if(dl) dl.textContent=luckyDrops>0?`🎁 ${luckyDrops}`:'ドロップ';
}


// ===== MODE SYSTEM =====
let currentMode = 'royale'; // 'royale' のみ

const MODE_INFO = {
  royale: { icon:'⚔️', name:'バトルロワイヤル', desc:'10人で最後まで生き残れ' },
  soccer: { icon:'⚽', name:'サッカー',         desc:'3対3チーム戦' },
};

function openModeSelect(){
  hideAllScreens();
  document.getElementById('mode-screen').style.display='flex';
}

function selectMode(mode){
  currentMode = mode;
  const info = MODE_INFO[mode];
  document.getElementById('home-mode-icon').textContent = info.icon;
  document.getElementById('home-mode-name').textContent = info.name;
  document.getElementById('home-mode-desc').textContent = info.desc;
  showHome();
}

function startSelectedMode(){
  if(!selectedBrawler){ openSelect(); return; }
  if(currentMode === 'royale') beginGame();
}

function beginGame(){
  hideAllScreens();
  document.getElementById('game-wrap').style.display='block';
  document.getElementById('overlay').style.display='none';
  resizeCanvas();
  genMap();

  // 全スポーン位置を共有して重なりを防ぐ
  const _sharedSpawnPos = [];
  function _patchedMakePlayer(brawler){
    const pos = safeSpawn(15, false, _sharedSpawnPos);
    return {...brawler, x:pos.x, y:pos.y, r:15, hp:brawler.hp, maxHp:brawler.hp, ammo:brawler.maxAmmo, superCharge:0, maxSuper:100, gems:0, alive:true, invTimer:0, reloadTimer:0, vx:0, vy:0, facing:0, isPlayer:true, walkAnim:0};
  }
  function _patchedMakeEnemy(i){
    const base = ENEMY_BRAWLERS[i % ENEMY_BRAWLERS.length];
    const pos = safeSpawn(14, true, _sharedSpawnPos);
    const m = getBotMult();
    return {...base, x:pos.x, y:pos.y, r:14, hp:Math.round(base.hp*rand(0.85,1.1)*m), maxHp:Math.round(base.hp*m), dmg:Math.round(base.dmg*m), superDmg:Math.round((base.superDmg||0)*m), speed:Math.round(base.speed*(1+(m-1)*0.3)), ammo:base.maxAmmo, superCharge:0, maxSuper:100, alive:true, invTimer:0, reloadTimer:rand(0,1.5), shootTimer:rand(1,3), moveTimer:rand(0,2), vx:0, vy:0, facing:Math.random()*Math.PI*2, isPlayer:false, walkAnim:0, eIdx:i};
  }

  state.player = applyUpgrades(_patchedMakePlayer(selectedBrawler));
  if(state.player) state.player.name = playerName || selectedBrawler.name;
  state.enemies = [];

  const filledFriends = friendSlots.filter(f=>f!==null);
  const enemyCount = 9 - filledFriends.length;
  for(let i=0; i<enemyCount; i++) state.enemies.push(_patchedMakeEnemy(i));

  filledFriends.forEach((f,fi)=>{
    const brawler = BRAWLERS.find(b=>b.id===f.b) || BRAWLERS[Math.floor(Math.random()*BRAWLERS.length)];
    const pos = safeSpawn(14, false, _sharedSpawnPos);
    state.enemies.push({
      ...brawler, x:pos.x, y:pos.y, r:14,
      hp:brawler.hp, maxHp:brawler.hp, ammo:brawler.maxAmmo,
      superCharge:0, maxSuper:100, alive:true, invTimer:0,
      reloadTimer:rand(0,1.5), shootTimer:rand(0.5,2), moveTimer:rand(0,1.5),
      vx:0, vy:0, facing:Math.random()*Math.PI*2,
      isPlayer:false, isFriendBot:true, friendName:f.n, walkAnim:0, eIdx:enemyCount+fi,
    });
  });

  if(typeof updateFriendHUD === 'function') updateFriendHUD();
  state.bullets=[]; state.particles=[]; state.gems=[];
  state.poison={r:2000, speed:14, dmg:110};
  state.camX=0; state.camY=0;
  state.running=true;

  if(typeof attackStick!=='undefined') attackStick.hasAimed=false;
  gadgetCooldown=0;
  updateGadgetHUD();

  // HUD
  document.getElementById('hud-tl').style.display='block';
  document.getElementById('hud-tr').style.display='block';
  document.getElementById('hud-bot').style.display='block';
  document.getElementById('hud-name').textContent = playerName || selectedBrawler.name;
  document.getElementById('hud-alive-label').textContent='生存';

  // コイン配置
  for(let i=0;i<12;i++){
    const pos=safeSpawn(8,true,[]);
    state.gems.push({x:pos.x,y:pos.y,r:8,taken:false});
  }

  if(isTouchDevice()) showTouchUI();

  gameLoop.last = performance.now();
  requestAnimationFrame(gameLoop);
}

// ===== SOCCER MODE =====
const SOCCER_COLS = ['#4fc3f7','#ef5350']; // 青・赤
