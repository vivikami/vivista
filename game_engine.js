// ===== GAME ENGINE =====
const canvas = document.getElementById('game-canvas');
const gctx = canvas.getContext('2d');
let W, H;
function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

const TILE = 44;
const MAP_W = 22, MAP_H = 18;
const MPX = MAP_W*TILE, MPY = MAP_H*TILE;

let state = {running:false, player:null, enemies:[], bullets:[], particles:[], gems:[], bushes:[], walls:[], trees:[], poison:{r:2000,speed:15,dmg:110}, camX:0, camY:0};
let keys={}, mouseX=0, mouseY=0;

function rand(a,b){return a+Math.random()*(b-a);}
function randi(a,b){return Math.floor(rand(a,b+1));}
function dist(a,b){const dx=a.x-b.x,dy=a.y-b.y;return Math.sqrt(dx*dx+dy*dy);}

// ブロック・木と重ならない安全なスポーン座標を返す
function safeSpawn(r, excludeCenter, existingPositions=[]) {
  const minDist = r * 5; // キャラ同士の最低距離
  for(let attempt=0; attempt<400; attempt++) {
    const x = rand(TILE*2, MPX-TILE*2);
    const y = rand(TILE*2, MPY-TILE*2);
    if(wallCollide(x, y, r+8)) continue;
    if(inBush(x, y)) continue;
    if(excludeCenter && dist({x,y},{x:MPX/2,y:MPY/2}) < TILE*3) continue;
    // 既存スポーン位置と重なっていないかチェック
    let tooClose = false;
    for(const p of existingPositions){
      if(dist({x,y},p) < minDist){ tooClose=true; break; }
    }
    if(tooClose) continue;
    existingPositions.push({x,y}); // 新しい位置を登録
    return {x, y};
  }
  return {x: MPX/2, y: MPY/2};
}

function makePlayer(brawler) {
  const pos = safeSpawn(15, false);
  return {
    ...brawler,
    x: pos.x, y: pos.y, r:15,
    hp: brawler.hp, maxHp: brawler.hp,
    ammo: brawler.maxAmmo,
    superCharge: 0, maxSuper: 100,
    gems: 0, alive: true,
    invTimer: 0, reloadTimer: 0,
    vx:0, vy:0, facing:0,
    isPlayer: true,
    walkAnim: 0
  };
}

const ENEMY_BRAWLERS = BRAWLERS; // 全キャラからランダム選出

function getBotMult(){
  // レベルごとにボット強化（Lv1=1.0, Lv10=1.45, Lv20=1.95, Lv50=3.45）
  return 1.0 + (playerLevel - 1) * 0.05;
}

function makeEnemy(i) {
  const base = ENEMY_BRAWLERS[i % ENEMY_BRAWLERS.length];
  const pos = safeSpawn(14, true, []);
  const m = getBotMult();
  return {
    ...base,
    x: pos.x, y: pos.y, r:14,
    hp: Math.round(base.hp * rand(0.85,1.1) * m),
    maxHp: Math.round(base.hp * m),
    dmg: Math.round(base.dmg * m),
    superDmg: Math.round((base.superDmg||0) * m),
    speed: Math.round(base.speed * (1 + (m-1)*0.3)),
    ammo: base.maxAmmo,
    superCharge: 0, maxSuper: 100,
    alive: true, invTimer: 0, reloadTimer: rand(0,1.5),
    shootTimer: rand(Math.max(0.4, 1.5/m), Math.max(1.0, 2.5/m)),
    moveTimer: rand(0,2),
    vx:0, vy:0, facing: Math.random()*Math.PI*2,
    isPlayer: false, walkAnim: 0,
    eIdx: i
  };
}

function genMap() {
  state.bushes = []; state.walls = []; state.trees = [];
  for(let i=0;i<18;i++) {
    state.bushes.push({x:randi(1,MAP_W-2)*TILE+4,y:randi(1,MAP_H-2)*TILE+4,w:randi(1,3)*TILE-6,h:randi(1,2)*TILE-6});
  }
  for(let i=0;i<10;i++) {
    state.walls.push({x:randi(1,MAP_W-2)*TILE,y:randi(1,MAP_H-2)*TILE,w:randi(1,2)*TILE+TILE*0.5,h:randi(1,2)*TILE});
  }
  for(let i=0;i<6;i++) {
    state.trees.push({x:rand(TILE,MPX-TILE),y:rand(TILE,MPY-TILE),r:14+Math.random()*10});
  }
}

function wallCollide(x,y,r) {
  for(const w of state.walls) {
    const nx=Math.max(w.x,Math.min(x,w.x+w.w)), ny=Math.max(w.y,Math.min(y,w.y+w.h));
    const dx=x-nx,dy=y-ny;
    if(dx*dx+dy*dy<r*r) return true;
  }
  for(const t of state.trees) {
    const dx=x-t.x,dy=y-t.y;
    if(dx*dx+dy*dy<(r+t.r-4)*(r+t.r-4)) return true;
  }
  return false;
}

function inBush(x,y) {
  for(const b of state.bushes) if(x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h) return true;
  return false;
}


// ===== キャラ別弾描画 =====
function drawBulletCustom(ctx, b){
  const id = b.owner?.id || '';
  ctx.save();
  ctx.translate(b.x, b.y);
  const a = Math.atan2(b.vy, b.vx);

  if(b.isRocket){
    // ロケット系（共通・色変え）
    ctx.rotate(a);
    const rg = ctx.createLinearGradient(-12,0,6,0);
    rg.addColorStop(0,'rgba(255,100,0,0)');
    rg.addColorStop(0.4, b.col||'#ff7043');
    rg.addColorStop(1, '#fff176');
    ctx.fillStyle=rg;
    ctx.beginPath(); ctx.ellipse(0,0,11,5,0,0,Math.PI*2); ctx.fill();
    // 炎の尾
    ctx.fillStyle='rgba(255,200,0,0.7)';
    ctx.beginPath(); ctx.ellipse(-9,0,6,3,0,0,Math.PI*2); ctx.fill();
    ctx.restore(); return;
  }

  switch(id){
    case 'godrix': case 'seraph': case 'void': case 'nova': case 'kronos': case 'inferna': case 'azura': case 'terron': case 'spectra': case 'abyssal':
      // ウルトラレジェンダリー専用弾（輝き+グラデーション）
      const ulg=ctx.createRadialGradient(-b.r*0.3,-b.r*0.3,0,0,0,b.r*1.6);
      ulg.addColorStop(0,'rgba(255,255,255,0.9)');
      ulg.addColorStop(0.35, b.col||'#ff4081');
      ulg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ulg; ctx.beginPath(); ctx.arc(0,0,b.r*1.6,0,Math.PI*2); ctx.fill();
      // 内側コア
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,0,b.r*0.55,0,Math.PI*2); ctx.fill();
      // 光線
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=b.r*0.3;
      for(let i=0;i<4;i++){const aa=a+i*Math.PI/2;ctx.beginPath();ctx.moveTo(Math.cos(aa)*b.r*0.5,Math.sin(aa)*b.r*0.5);ctx.lineTo(Math.cos(aa)*b.r*1.8,Math.sin(aa)*b.r*1.8);ctx.stroke();}
      break;

    case 'sasha': case 'rock': case 'flora': case 'dack':
      // ショットガン系 - 小さな散弾
      ctx.fillStyle=b.col||'#ffcc00';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.85,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,200,0.6)';
      ctx.beginPath(); ctx.arc(-b.r*0.3,-b.r*0.3,b.r*0.35,0,Math.PI*2); ctx.fill();
      break;

    case 'valt': case 'neon':
      // ピストル・レーザー系 - 細長い光弾
      ctx.rotate(a);
      const lg1=ctx.createLinearGradient(-b.r*2,0,b.r*2,0);
      lg1.addColorStop(0,'rgba(0,200,255,0)'); lg1.addColorStop(0.5,b.col||'#4fc3f7'); lg1.addColorStop(1,'rgba(0,200,255,0)');
      ctx.fillStyle=lg1;
      ctx.beginPath(); ctx.ellipse(0,0,b.r*2.5,b.r*0.55,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.ellipse(0,0,b.r*0.8,b.r*0.2,0,0,Math.PI*2); ctx.fill();
      break;

    case 'flare': case 'blast': case 'dyna': case 'forge':
      // ロケット・爆弾系 - 炎玉
      const fg=ctx.createRadialGradient(0,0,0,0,0,b.r*1.4);
      fg.addColorStop(0,'#fff176'); fg.addColorStop(0.4,'#ff6d00'); fg.addColorStop(1,'rgba(255,50,0,0)');
      ctx.fillStyle=fg;
      ctx.beginPath(); ctx.arc(0,0,b.r*1.4,0,Math.PI*2); ctx.fill();
      break;

    case 'thorn': case 'viper': case 'ivy':
      // 毒・植物系 - 緑の棘
      ctx.fillStyle=b.col||'#66bb6a';
      ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(b.r*1.5,0); ctx.lineTo(-b.r*0.5,-b.r*0.8); ctx.lineTo(-b.r*0.5,b.r*0.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(100,255,100,0.5)';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.5,0,Math.PI*2); ctx.fill();
      break;

    case 'shade': case 'raven': case 'kuro': case 'phantom':
      // 忍者・暗殺系 - 手裏剣
      ctx.fillStyle=b.col||'#546e7a';
      for(let i=0;i<4;i++){
        ctx.save(); ctx.rotate(a+i*Math.PI/2);
        ctx.beginPath(); ctx.moveTo(b.r*1.3,0); ctx.lineTo(-b.r*0.3,b.r*0.4); ctx.lineTo(-b.r*0.3,-b.r*0.4); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.4,0,Math.PI*2); ctx.fill();
      break;

    case 'piper': case 'aria':
      // スナイパー系 - 細長いライフル弾
      ctx.rotate(a);
      const sg=ctx.createLinearGradient(-b.r*3,0,b.r*3,0);
      sg.addColorStop(0,'rgba(255,150,180,0)'); sg.addColorStop(0.5,b.col||'#f48fb1'); sg.addColorStop(1,'rgba(255,150,180,0)');
      ctx.fillStyle=sg;
      ctx.beginPath(); ctx.ellipse(0,0,b.r*3,b.r*0.4,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.ellipse(0,0,b.r*1.2,b.r*0.18,0,0,Math.PI*2); ctx.fill();
      break;

    case 'rixo': case 'mirror':
      // バウンス・反射系 - ひし形
      ctx.fillStyle=b.col||'#4db6ac';
      ctx.rotate(a+Math.PI/4);
      ctx.fillRect(-b.r*0.85,-b.r*0.85,b.r*1.7,b.r*1.7);
      ctx.fillStyle='rgba(255,255,255,0.5)';
      ctx.fillRect(-b.r*0.4,-b.r*0.4,b.r*0.8,b.r*0.8);
      break;

    case 'penny': case 'bonny':
      // キャノン系 - 大きな砲弾
      ctx.fillStyle=b.col||'#ffca28';
      ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(0,0,b.r*1.4,b.r*0.9,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,200,0.6)';
      ctx.beginPath(); ctx.arc(-b.r*0.4,-b.r*0.3,b.r*0.5,0,Math.PI*2); ctx.fill();
      break;

    case 'grave': case 'mortis':
      // 魔法系 - 紫の蝶型
      ctx.fillStyle=b.col||'#7e57c2';
      ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(-b.r*0.3,-b.r*0.6,b.r*0.9,b.r*0.45,0.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-b.r*0.3,b.r*0.6,b.r*0.9,b.r*0.45,-0.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(200,150,255,0.6)';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.35,0,Math.PI*2); ctx.fill();
      break;

    case 'tesla': case 'spark': case 'volta':
      // 電撃系 - ジグザグ稲妻
      ctx.strokeStyle=b.col||'#ffeb3b';
      ctx.lineWidth=b.r*0.7; ctx.lineCap='round';
      ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(-b.r*1.5,0);
      ctx.lineTo(-b.r*0.5,-b.r*0.8); ctx.lineTo(b.r*0.5,b.r*0.8); ctx.lineTo(b.r*1.5,0);
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,150,0.7)';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.4,0,Math.PI*2); ctx.fill();
      break;

    case 'freeze': case 'mira':
      // 氷系 - 六角形結晶
      ctx.fillStyle=b.col||'#4fc3f7';
      for(let i=0;i<6;i++){
        const ang=a+i*Math.PI/3;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.lineTo(Math.cos(ang)*b.r*1.3,Math.sin(ang)*b.r*1.3);
        ctx.lineTo(Math.cos(ang+Math.PI/6)*b.r*0.7,Math.sin(ang+Math.PI/6)*b.r*0.7);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle='rgba(200,240,255,0.8)';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.45,0,Math.PI*2); ctx.fill();
      break;

    case 'quake': case 'boulder': case 'goro': case 'terra':
      // 岩系 - 茶色い岩
      ctx.fillStyle=b.col||'#8d6e63';
      ctx.beginPath(); ctx.arc(0,0,b.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.arc(b.r*0.2,b.r*0.2,b.r*0.35,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.arc(-b.r*0.3,-b.r*0.3,b.r*0.3,0,Math.PI*2); ctx.fill();
      break;

    case 'comet': case 'prism':
      // 宇宙・プリズム - 虹色の星
      const colors=['#ef5350','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0'];
      for(let i=0;i<6;i++){
        ctx.fillStyle=colors[i];
        ctx.rotate(Math.PI/3);
        ctx.beginPath(); ctx.moveTo(0,-b.r*1.4); ctx.lineTo(b.r*0.4,0); ctx.lineTo(0,b.r*1.4); ctx.lineTo(-b.r*0.4,0); ctx.closePath(); ctx.fill();
      }
      break;

    case 'witch': case 'nyx':
      // 魔法・月 - 紫の魔法陣
      ctx.strokeStyle=b.col||'#6a1b9a'; ctx.lineWidth=b.r*0.4;
      ctx.beginPath(); ctx.arc(0,0,b.r*0.85,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=b.col||'#6a1b9a';
      ctx.beginPath(); ctx.arc(0,0,b.r*0.45,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,200,255,0.5)';
      ctx.beginPath(); ctx.arc(-b.r*0.2,-b.r*0.2,b.r*0.25,0,Math.PI*2); ctx.fill();
      break;

    case 'ghost':
      // 幽霊 - 半透明の玉
      ctx.globalAlpha=0.65;
      const gg=ctx.createRadialGradient(0,0,0,0,0,b.r*1.2);
      gg.addColorStop(0,'rgba(255,255,255,0.9)'); gg.addColorStop(1,'rgba(200,200,220,0)');
      ctx.fillStyle=gg;
      ctx.beginPath(); ctx.arc(0,0,b.r*1.2,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
      break;

    case 'toss':
      // 突進なので弾なし（念のため）
      break;

    default:
      // デフォルト（キャラカラーの丸）
      const dg=ctx.createRadialGradient(-b.r*0.3,-b.r*0.3,0,0,0,b.r*1.1);
      dg.addColorStop(0,'rgba(255,255,255,0.6)');
      dg.addColorStop(0.4, b.col||'#ffe066');
      dg.addColorStop(1, b.owner===state.player?shadeHex(b.col||'#ffe066',40):'#ff5252');
      ctx.fillStyle=dg;
      ctx.beginPath(); ctx.arc(0,0,b.r,0,Math.PI*2); ctx.fill();
      break;
  }
  ctx.restore();
}

function shadeHex(col, amt){
  if(!col||!col.startsWith('#')) return col||'#888';
  const n=parseInt(col.replace('#',''),16);
  const r=Math.max(0,((n>>16)&0xff)-amt), g=Math.max(0,((n>>8)&0xff)-amt), bv=Math.max(0,(n&0xff)-amt);
  return `rgb(${r},${g},${bv})`;
}

function fireBullets(shooter, targetAngle, isSuper) {
  const def = isSuper ? {pellets:shooter.superPellets, range:shooter.superRange, dmg:shooter.superDmg, spread:Math.PI*2} : {pellets:shooter.pellets, range:shooter.range, dmg:shooter.dmg, spread:shooter.spreadAngle};
  if(def.pellets === 0 && isSuper && shooter.id==='leon') {
    // Leon super = invisibility (skip)
    spawnParticles(shooter.x, shooter.y, shooter.col, 12);
    return;
  }
  const angleBase = (def.spread >= Math.PI*1.9) ? 0 : targetAngle;
  for(let i=0;i<def.pellets;i++) {
    let a;
    if(def.spread >= Math.PI*1.9) a = (i/def.pellets)*Math.PI*2;
    else a = angleBase + (def.pellets>1 ? (i/(def.pellets-1)-0.5)*def.spread : 0);
    const spd = 360 + Math.random()*40;
    state.bullets.push({
      x:shooter.x+Math.cos(a)*shooter.r,
      y:shooter.y+Math.sin(a)*shooter.r,
      vx:Math.cos(a)*spd, vy:Math.sin(a)*spd,
      r: shooter.attackType==='rocket'?7:4,
      dmg: def.dmg, owner: shooter, life: def.range/spd,
      isRocket: shooter.attackType==='rocket'&&!isSuper,
      col: shooter.col
    });
  }
}

function playerShoot() {



  const p = state.player;
  if(!p.alive || p.ammo<=0) return;

  // 最近敵への自動照準（範囲内に敵がいれば自動で向く）
  if(!isTouchDevice()){
    // PCはマウス座標を優先（すでにmousemoveで更新済み）
    // 何もしない（facingはmousemoveが常に更新）
  } else {
    // タッチ操作: スティックで照準していなければ最近敵に向く
    if(!attackStick.hasAimed){
      let nearest=null, nd=Infinity;
      for(const e of state.enemies){
        if(!e.alive) continue;
        const d=dist(p,e);
        if(d<nd){nd=d;nearest=e;}
      }
      if(nearest && nd < p.range*1.3){
        p.facing=Math.atan2(nearest.y-p.y, nearest.x-p.x);
      }
    }
  }
  const angle = p.facing;

  // ===== シャンパー: 8連続発射 =====
  if(p._rapidFire && p.id==='shampa'){
    const shots = Math.min(p.ammo, 8);
    for(let i=0;i<shots;i++){
      setTimeout(()=>{
        if(!state.running||!state.player?.alive) return;
        const a=state.player.facing+rand(-0.06,0.06);
        state.bullets.push({x:state.player.x+Math.cos(a)*state.player.r,y:state.player.y+Math.sin(a)*state.player.r,vx:Math.cos(a)*320,vy:Math.sin(a)*320,r:4,dmg:state.player.dmg,owner:state.player,life:state.player.range/320,isRocket:false,col:'#e91e8c'});
        spawnParticles(state.player.x,state.player.y,'#f48fb1',2);
      }, i*80);
    }
    p.ammo = Math.max(0, p.ammo - shots);
    spawnMuzzleFlash(p.x+Math.cos(angle)*p.r, p.y+Math.sin(angle)*p.r, p.col);
    return;
  }

  // ===== トッス: 突進攻撃（弾なし）=====
  if(p._dashAttack && p.id==='toss'){
    p._dashing = true;
    p._dashDir = angle;
    p._dashSpeed = 700;
    p._dashTimer = 0.28;
    p._dashDmg = p.dmg;
    p.ammo--;
    spawnParticles(p.x,p.y,'#5c6bc0',10);
    showToast('💨 突進！');
    return;
  }

  // ===== バビ: 50%でダメージ2倍 =====
  if(p._luckyStrike && p.id==='babi'){
    const lucky = Math.random() < 0.5;
    if(lucky){
      const origDmg=p.dmg; p.dmg=Math.round(p.dmg*2);
      fireBullets(p, angle, false);
      p.dmg=origDmg;
      spawnParticles(p.x,p.y,'#ffcc00',12);
      showToast('🎰 ラッキー！ダメージ2倍！');
    } else {
      fireBullets(p, angle, false);
    }
    p.ammo--;
    spawnMuzzleFlash(p.x+Math.cos(angle)*p.r, p.y+Math.sin(angle)*p.r, p.col);
    return;
  }

  // ダメージバフ適用（通常）
  if(p._buffDmg && p._buffDmg>1){ const origDmg=p.dmg; p.dmg=Math.round(p.dmg*p._buffDmg); fireBullets(p, angle, false); p.dmg=origDmg; }
  else fireBullets(p, angle, false);
  p.ammo--;
  spawnMuzzleFlash(p.x+Math.cos(angle)*p.r, p.y+Math.sin(angle)*p.r, p.col);
}

function playerSuper() {
  const p = state.player;
  if(!p.alive || p.superCharge < p.maxSuper) return;
  p.superCharge = 0;
  fireBullets(p, p.facing, true);
  spawnParticles(p.x, p.y, '#ffcc00', 20);
}

function spawnParticles(x, y, col, n) {
  for(let i=0;i<n;i++) {
    const a=Math.random()*Math.PI*2, spd=rand(60,200);
    state.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:rand(2,5),col,life:rand(0.3,0.8),maxLife:0.6});
  }
}

function spawnMuzzleFlash(x,y,col) {
  for(let i=0;i<5;i++) {
    const a=Math.random()*Math.PI*2;
    state.particles.push({x,y,vx:Math.cos(a)*rand(80,160),vy:Math.sin(a)*rand(80,160),r:rand(2,4),col:'#ffe066',life:0.12,maxLife:0.12});
  }
}

function spawnExplosion(x,y) {
  spawnParticles(x,y,'#ff7043',16);
  spawnParticles(x,y,'#ffcc00',10);
  spawnParticles(x,y,'#fff',6);
}

function update(dt) {
  const p = state.player;
  if(!p.alive) return;

  // Player movement (keyboard + left stick)
  let dx=0,dy=0;
  if(keys['a']||keys['arrowleft']) dx-=1;
  if(keys['d']||keys['arrowright']) dx+=1;
  if(keys['w']||keys['arrowup'])   dy-=1;
  if(keys['s']||keys['arrowdown']) dy+=1;
  if(typeof moveStick!=='undefined'){ dx+=moveStick.dx; dy+=moveStick.dy; }
  if(dx||dy){
    const l=Math.sqrt(dx*dx+dy*dy);
    if(l>1){dx/=l;dy/=l;}
    p.walkAnim+=dt*8;
    if(typeof moveStick==='undefined'||(!moveStick.dx&&!moveStick.dy)){
      if(typeof attackStick==='undefined'||!attackStick.hasAimed) p.facing=Math.atan2(dy,dx);
    }
  }
  const _spd = p.speed * (p._speedBuff||1);
  const nx=p.x+dx*_spd*dt, ny=p.y+dy*_spd*dt;
  if(nx>p.r&&nx<MPX-p.r&&!wallCollide(nx,p.y,p.r)) p.x=nx;
  if(ny>p.r&&ny<MPY-p.r&&!wallCollide(p.x,ny,p.r)) p.y=ny;

  if(p.invTimer>0) p.invTimer-=dt;
  p.reloadTimer-=dt;
  if(p.reloadTimer<=0&&p.ammo<p.maxAmmo){p.ammo++;p.reloadTimer=p.reloadTime;}
  p.superCharge=Math.min(p.maxSuper,p.superCharge+dt*3);

  // ガジェットクールダウン
  if(typeof gadgetCooldown!=='undefined'&&gadgetCooldown>0){
    gadgetCooldown=Math.max(0,gadgetCooldown-dt);
    if(typeof updateGadgetHUD==='function') updateGadgetHUD();
  }
  // バフタイマー処理
  if(p._buffTimer>0){ p._buffTimer-=dt; if(p._buffTimer<=0){ p._buffDmg=1; } }
  if(p._armorTimer>0){ p._armorTimer-=dt; if(p._armorTimer<=0){ p._armor=1; } }
  if(p._speedTimer>0){ p._speedTimer-=dt; if(p._speedTimer<=0){ p._speedBuff=1; } }

  // 体力自動回復: 2秒間被弾なければ毎秒最大HPの2%回復
  if(p.regenCooldown===undefined) p.regenCooldown=0;
  if(p.invTimer>0) p.regenCooldown=3.0;
  else p.regenCooldown=Math.max(0,p.regenCooldown-dt);

  // ===== トッス 突進処理 =====
  if(p._dashing && p._dashTimer>0){
    p._dashTimer-=dt;
    const spd=p._dashSpeed||700;
    const nx=p.x+Math.cos(p._dashDir)*spd*dt;
    const ny=p.y+Math.sin(p._dashDir)*spd*dt;
    if(nx>p.r&&nx<MPX-p.r&&!wallCollide(nx,p.y,p.r)) p.x=nx;
    else p._dashTimer=0;
    if(ny>p.r&&ny<MPY-p.r&&!wallCollide(p.x,ny,p.r)) p.y=ny;
    else p._dashTimer=0;
    for(const e of state.enemies){
      if(e.alive&&e.invTimer<=0&&dist(p,e)<p.r+e.r+8){
        e.hp-=p._dashDmg||p.dmg; e.invTimer=0.4;
        spawnParticles(e.x,e.y,'#5c6bc0',8);
        if(e.hp<=0) killEnemy(e,'player');
      }
    }
    if(p._dashTimer<=0) p._dashing=false;
  }

  // Poison ring
  const cx=MPX/2,cy=MPY/2;
  const pr=state.poison;
  // 毒ガス: 距離に応じてダメージ増加（修正済み）
  const pDist = dist(p,{x:cx,y:cy});
  if(pDist > pr.r){
    const overflow = pDist - pr.r;
    const poisonDmg = 30 + overflow * 0.5;
    p.hp -= poisonDmg * dt;
    if(p.hp<=0) endGame(false);
  }
  pr.r=Math.max(70,pr.r-pr.speed*dt);

  // Gems
  // ポイズンクラウド
  if(p._poisonCloud){p._poisonCloud.timer-=dt; state.enemies.forEach(e=>{if(e.alive&&dist(p._poisonCloud,e)<80){e.hp-=40*dt;if(e.hp<=0)killEnemy(e,'player');}}); if(p._poisonCloud.timer<=0)p._poisonCloud=null;}
  for(const g of state.gems) {
    if(!g.taken&&dist(p,g)<p.r+g.r){g.taken=true;p.gems++;spawnParticles(g.x,g.y,'#ffca28',8);}
  }

  // Enemies + Friend Bots
  for(const e of state.enemies) {
    if(!e.alive) continue;
    e.invTimer-=dt; e.moveTimer-=dt;

    if(e.isFriendBot){
      // ===== 仲間ボットAI: 敵を攻撃、プレイヤーには攻撃しない =====
      const realEnemies = state.enemies.filter(o=>o!==e&&o.alive&&!o.isFriendBot);
      let nearestEnemy=null, ned=Infinity;
      for(const re of realEnemies){const d=dist(e,re);if(d<ned){ned=d;nearestEnemy=re;}}
      if(e.moveTimer<=0){
        if(nearestEnemy&&ned<280&&Math.random()<0.75) e.facing=Math.atan2(nearestEnemy.y-e.y,nearestEnemy.x-e.x);
        else if(nearestEnemy) e.facing=Math.atan2(nearestEnemy.y-e.y,nearestEnemy.x-e.x);
        else e.facing+=rand(-0.5,0.5);
        e.vx=Math.cos(e.facing)*e.speed*0.8; e.vy=Math.sin(e.facing)*e.speed*0.8;
        e.moveTimer=rand(0.5,1.5);
      }
      const enx=e.x+e.vx*dt,eny=e.y+e.vy*dt;
      if(enx>e.r&&enx<MPX-e.r&&!wallCollide(enx,e.y,e.r)) e.x=enx;
      if(eny>e.r&&eny<MPY-e.r&&!wallCollide(e.x,eny,e.r)) e.y=eny;
      e.walkAnim+=dt*6;
      if(dist(e,{x:cx,y:cy})>pr.r){e.hp-=pr.dmg*dt;if(e.hp<=0){killEnemy(e,'poison');}}
      e.reloadTimer-=dt;
      if(e.reloadTimer<=0&&e.ammo<e.maxAmmo){e.ammo++;e.reloadTimer=e.reloadTime;}
      e.shootTimer-=dt;
      if(e.shootTimer<=0&&e.ammo>0&&nearestEnemy&&ned<e.range*1.1){
        fireBullets(e,Math.atan2(nearestEnemy.y-e.y,nearestEnemy.x-e.x)+rand(-0.1,0.1),false);
        e.ammo--;
        e.shootTimer=rand(0.6,1.8);
      }
      continue;
    }

    // ===== 通常敵AI =====
    if(e.moveTimer<=0) {
      const d=dist(p,e);
      // 仲間ボットがいれば仲間にも向かう（プレイヤー優先）
      const friendBots=state.enemies.filter(o=>o.isFriendBot&&o.alive);
      let targetAngle;
      if(d<220&&Math.random()<0.65) targetAngle=Math.atan2(p.y-e.y,p.x-e.x);
      else if(friendBots.length>0&&Math.random()<0.4){
        const fb=friendBots[Math.floor(Math.random()*friendBots.length)];
        targetAngle=Math.atan2(fb.y-e.y,fb.x-e.x);
      } else targetAngle=e.facing+rand(-0.8,0.8);
      e.facing=targetAngle??e.facing;
      const _espd=e.speed*(e._slowed?0.3:1);
      e.vx=Math.cos(e.facing)*_espd; e.vy=Math.sin(e.facing)*_espd;
      e.moveTimer=rand(0.6,1.8);
    }
    // スロー・凍結処理（毎フレーム）
    if(e._frozenTimer>0){e._frozenTimer-=dt;if(e._frozenTimer<=0){e._frozen=false;e._frozenTimer=0;}}
    if(e._slowTimer>0){e._slowTimer-=dt;if(e._slowTimer<=0){e._slowed=false;e._slowTimer=0;}}
    if(e._frozen) continue;
    const enx=e.x+e.vx*dt,eny=e.y+e.vy*dt;
    if(enx>e.r&&enx<MPX-e.r&&!wallCollide(enx,e.y,e.r)) e.x=enx;
    if(eny>e.r&&eny<MPY-e.r&&!wallCollide(e.x,eny,e.r)) e.y=eny;
    e.walkAnim+=dt*6;

    if(dist(e,{x:cx,y:cy})>pr.r){e.hp-=pr.dmg*dt;if(e.hp<=0){killEnemy(e,'poison');}}

    e.reloadTimer-=dt;
    if(e.reloadTimer<=0&&e.ammo<e.maxAmmo){e.ammo++;e.reloadTimer=e.reloadTime;}
    e.shootTimer-=dt;
    if(e.shootTimer<=0&&e.ammo>0) {
      const d=dist(p,e);
      if(d<e.range*1.1) {
        fireBullets(e,Math.atan2(p.y-e.y,p.x-e.x)+rand(-0.12,0.12),false);
        e.ammo--;
      }
      e.shootTimer=rand(0.8,2.0);
    }
  }

  // Bullets
  for(let i=state.bullets.length-1;i>=0;i--) {
    const b=state.bullets[i];
    b.x+=b.vx*dt; b.y+=b.vy*dt; b.life-=dt;
    if(b.life<=0||wallCollide(b.x,b.y,b.r)) {
      if(b.isRocket) spawnExplosion(b.x,b.y);
      state.bullets.splice(i,1); continue;
    }
    if(b.owner===p) { // player bullet
      for(const e of state.enemies) {
        if(!e.alive||e.invTimer>0||e.isFriendBot) continue; // 仲間ボットには当たらない
        if(dist(b,e)<b.r+e.r) {
          e.hp-=b.dmg; e.invTimer=0.15;
          p.superCharge=Math.min(p.maxSuper,p.superCharge+10);
          if(b.isRocket) spawnExplosion(b.x,b.y);
          spawnParticles(b.x,b.y,b.col,6);
          state.bullets.splice(i,1);
          if(e.hp<=0) killEnemy(e,'player'); break;
        }
      }
    } else if(!b.owner?.isFriendBot) { // 仲間ボットの弾はプレイヤーに当たらない
      if(p.invTimer<=0&&dist(b,p)<b.r+p.r) {
        p.hp-=b.dmg; p.invTimer=0.18;
        spawnParticles(b.x,b.y,b.col,6);
        if(b.isRocket) spawnExplosion(b.x,b.y);
        state.bullets.splice(i,1);
        if(p.hp<=0) endGame(false);
      }
    }
  }

  // Particles
  for(let i=state.particles.length-1;i>=0;i--) {
    const pt=state.particles[i];
    pt.x+=pt.vx*dt; pt.y+=pt.vy*dt;
    pt.vx*=0.88; pt.vy*=0.88;
    pt.life-=dt; if(pt.life<=0) state.particles.splice(i,1);
  }

  const alive=state.enemies.filter(e=>e.alive).length;
  if(alive===0) {endGame(true);return;}

  state.camX=Math.max(0,Math.min(MPX-W,p.x-W/2));
  state.camY=Math.max(0,Math.min(MPY-H,p.y-H/2));

  updateHUD();
  // スーパースティックの光り方を更新
  // スーパースティックの光り方を更新
  if(state.player){
    const isReady = state.player.superCharge >= state.player.maxSuper;
    const _sr = document.getElementById('super-base-ring');
    const _sk = document.getElementById('super-knob');
    if(_sr) _sr.className = isReady ? 'ready' : '';
    if(_sk) _sk.className = isReady ? 'ready' : '';
  }
}

function killEnemy(e, by) {
  e.alive=false;
  spawnExplosion(e.x,e.y);
  for(let i=0;i<randi(1,3);i++) state.gems.push({x:e.x+rand(-20,20),y:e.y+rand(-20,20),r:8,taken:false});
  if(by==='player'){
    addKillFeed(`${playerName||'あなた'}が ${e.name} を倒した！`);
    addQuestProgress('kill');
    state.player.superCharge=Math.min(state.player.maxSuper,state.player.superCharge+25);
  } else if(by==='bot'){
    addKillFeed(`${e.name} がやられた`);
  }
}

function addKillFeed(msg) {
  const feed=document.getElementById('kill-feed');
  const el=document.createElement('div');
  el.className='kill-msg'; el.textContent=msg;
  feed.appendChild(el);
  setTimeout(()=>el.remove(),3000);
}

function updateHUD() {
  const p=state.player;
  const hpPct=Math.max(0,p.hp/p.maxHp*100);
  document.getElementById('hp-fill').style.width=hpPct+'%';
  document.getElementById('hp-fill').style.background=hpPct>50?'#4deb4d':hpPct>25?'#ffcc00':'#e24b4a';
  const ammoRow=document.getElementById('ammo-row');
  ammoRow.innerHTML='';
  for(let i=0;i<p.maxAmmo;i++){const pip=document.createElement('div');pip.className='ammo-pip'+(i<p.ammo?' full':'');ammoRow.appendChild(pip);}
  const sPct=p.superCharge/p.maxSuper*100;
  document.getElementById('super-gauge-fill').style.width=sPct+'%';
  document.getElementById('super-ready').style.display=sPct>=100?'block':'none';
  document.getElementById('super-label').style.display=sPct>=100?'none':'block';
  document.getElementById('hud-alive').textContent=state.enemies.filter(e=>e.alive).length+1;
  document.getElementById('gem-num').textContent=p.gems;
  updateFriendHUD();
}

// ===== DRAWING =====
function draw() {
  gctx.clearRect(0,0,W,H);
  gctx.save();
  gctx.translate(-state.camX,-state.camY);

  drawMap();

  // Gems
  for(const g of state.gems) {
    if(g.taken) continue;
    // コイン（黄色い丸）
    gctx.fillStyle='#ffca28';
    gctx.beginPath(); gctx.arc(g.x,g.y,g.r,0,Math.PI*2); gctx.fill();
    gctx.strokeStyle='#e65100'; gctx.lineWidth=2; gctx.stroke();
    // ¥マーク風の刻印
    gctx.fillStyle='rgba(230,100,0,0.7)';
    gctx.font=`bold ${g.r*1.3}px sans-serif`;
    gctx.textAlign='center'; gctx.textBaseline='middle';
    gctx.fillText('¢',g.x,g.y+0.5);
    // ハイライト
    gctx.fillStyle='rgba(255,255,255,0.45)';
    gctx.beginPath(); gctx.ellipse(g.x-2,g.y-2,2.5,1.5,Math.PI*0.7,0,Math.PI*2); gctx.fill();
  }

  // Particles
  for(const pt of state.particles) {
    const alpha=pt.life/pt.maxLife;
    gctx.globalAlpha=alpha*0.9;
    gctx.fillStyle=pt.col;
    gctx.beginPath(); gctx.arc(pt.x,pt.y,pt.r*alpha,0,Math.PI*2); gctx.fill();
  }
  gctx.globalAlpha=1;

  // Bullets（キャラ別描画）
  for(const b of state.bullets) { drawBulletCustom(gctx, b); }

  // Entities
  const allEntities=[...state.enemies.filter(e=>e.alive), state.player.alive?state.player:null].filter(Boolean);
  allEntities.sort((a,b)=>a.y-b.y);
  for(const e of allEntities) {
    if(!e.isPlayer&&inBush(e.x,e.y)) continue;
    drawBrawler(gctx, e, e===state.player);
  }

  drawPoisonRing();
  drawAimLine();

  gctx.restore();
}

function drawMap() {
  const c = gctx;

  // ---- 地面 (テクスチャ風グリッド) ----
  c.fillStyle='#4a8c38'; c.fillRect(0,0,MPX,MPY);
  for(let x=0;x<MAP_W;x++) for(let y=0;y<MAP_H;y++) {
    const shade = ((x+y)%2===0) ? 'rgba(0,0,0,0.055)' : 'rgba(255,255,255,0.018)';
    c.fillStyle=shade; c.fillRect(x*TILE,y*TILE,TILE,TILE);
    // 草のテクスチャ点
    if((x*7+y*13)%5===0){
      c.fillStyle='rgba(0,0,0,0.07)';
      c.fillRect(x*TILE+8, y*TILE+10, 3, 1);
      c.fillRect(x*TILE+22, y*TILE+28, 2, 1);
    }
  }

  // ---- 草むら (茂み) ----
  for(const b of state.bushes) {
    // ベース影
    c.fillStyle='rgba(0,0,0,0.18)';
    c.beginPath(); c.ellipse(b.x+b.w/2+3, b.y+b.h/2+4, b.w/2+2, b.h/2+2, 0, 0, Math.PI*2); c.fill();

    // ベース色
    c.fillStyle='#4a7c28';
    c.beginPath(); c.roundRect(b.x+1, b.y+3, b.w-2, b.h-3, 6); c.fill();

    // 葉っぱクラスター（ランダム風だが決定論的）
    const leafCols = ['#5a9e32','#4e8a2a','#66b83c','#3d7022','#72cc44'];
    const nx = Math.ceil(b.w/16), ny = Math.ceil(b.h/14);
    for(let i=0;i<nx;i++) for(let j=0;j<ny;j++) {
      const seed = i*17+j*31;
      const lx = b.x + i*(b.w/(nx)) + (seed%7)-3;
      const ly = b.y + j*(b.h/(ny)) + (seed%5)-2;
      const lr = 7 + (seed%5);
      c.fillStyle = leafCols[seed%leafCols.length];
      // 葉っぱ形（楕円+少しランダムな傾き）
      c.save();
      c.translate(lx+lr/2, ly+lr/2);
      c.rotate((seed%8-4)*0.12);
      c.beginPath(); c.ellipse(0, 0, lr, lr*0.72, 0, 0, Math.PI*2); c.fill();
      c.restore();
    }

    // ハイライト（上面の光）
    c.fillStyle='rgba(180,255,100,0.13)';
    c.beginPath(); c.ellipse(b.x+b.w*0.35, b.y+b.h*0.28, b.w*0.28, b.h*0.18, -0.3, 0, Math.PI*2); c.fill();

    // 葉先のシルエット（上縁ギザギザ）
    c.fillStyle='#5aaa33';
    for(let i=0;i<Math.floor(b.w/10);i++) {
      const lx2 = b.x+4+i*10 + (i*7)%4;
      c.beginPath(); c.arc(lx2, b.y+3, 5+(i*3)%4, Math.PI, 0); c.fill();
    }
  }

  // ---- 石壁ブロック ----
  for(const w of state.walls) {
    const wx=w.x, wy=w.y, ww=w.w, wh=w.h;

    // 落ち影
    c.fillStyle='rgba(0,0,0,0.28)';
    c.beginPath(); c.roundRect(wx+5, wy+6, ww, wh, 5); c.fill();

    // 石の主面
    const grd = c.createLinearGradient(wx, wy, wx, wy+wh);
    grd.addColorStop(0, '#8d8070');
    grd.addColorStop(0.4, '#7a6e60');
    grd.addColorStop(1, '#5c5248');
    c.fillStyle=grd;
    c.beginPath(); c.roundRect(wx, wy, ww, wh, 4); c.fill();

    // 石のブロック割り（目地）
    c.strokeStyle='rgba(0,0,0,0.30)'; c.lineWidth=1.5;
    const brickH = 18;
    for(let row=0; row*brickH<wh; row++) {
      const by2 = wy+row*brickH;
      // 横線
      c.beginPath(); c.moveTo(wx+2, by2+brickH); c.lineTo(wx+ww-2, by2+brickH); c.stroke();
      // 縦線（互い違い）
      const offset = (row%2===0) ? 0 : 16;
      for(let bx2=wx+offset; bx2<wx+ww; bx2+=32) {
        c.beginPath(); c.moveTo(bx2, by2+2); c.lineTo(bx2, Math.min(by2+brickH-2, wy+wh-2)); c.stroke();
      }
    }

    // 石の表面テクスチャ（斑点）
    c.fillStyle='rgba(255,255,255,0.07)';
    for(let i=0;i<Math.floor(ww*wh/280);i++) {
      const seed=i*29+wx;
      c.beginPath(); c.arc(wx+5+(seed*13)%( ww-10), wy+4+(seed*7)%(wh-8), 1.5+(seed%3), 0, Math.PI*2); c.fill();
    }
    c.fillStyle='rgba(0,0,0,0.1)';
    for(let i=0;i<Math.floor(ww*wh/400);i++) {
      const seed=i*41+wy;
      c.beginPath(); c.arc(wx+4+(seed*17)%(ww-8), wy+4+(seed*11)%(wh-8), 2+(seed%2), 0, Math.PI*2); c.fill();
    }

    // 上面ハイライト
    c.fillStyle='rgba(255,255,255,0.12)';
    c.beginPath(); c.roundRect(wx+3, wy+2, ww-6, 5, 2); c.fill();

    // 輪郭
    c.strokeStyle='rgba(0,0,0,0.45)'; c.lineWidth=1.5;
    c.beginPath(); c.roundRect(wx, wy, ww, wh, 4); c.stroke();
  }

  // ---- 木 ----
  for(const t of state.trees) {
    const tx=t.x, ty=t.y, tr=t.r;

    // 根元の影
    c.fillStyle='rgba(0,0,0,0.22)';
    c.beginPath(); c.ellipse(tx+3, ty+tr*0.55, tr*0.55, tr*0.18, 0, 0, Math.PI*2); c.fill();

    // 幹
    const tGrd = c.createLinearGradient(tx-6, 0, tx+6, 0);
    tGrd.addColorStop(0,'#4e342e'); tGrd.addColorStop(0.4,'#6d4c41'); tGrd.addColorStop(1,'#3e2723');
    c.fillStyle=tGrd;
    c.beginPath(); c.roundRect(tx-5, ty-tr*0.1, 10, tr*0.7, 3); c.fill();
    // 幹の木目
    c.strokeStyle='rgba(0,0,0,0.2)'; c.lineWidth=1;
    c.beginPath(); c.moveTo(tx-2,ty+tr*0.1); c.bezierCurveTo(tx-1,ty+tr*0.3,tx+2,ty+tr*0.4,tx+1,ty+tr*0.6); c.stroke();

    // 葉の影（一番下のレイヤー）
    c.fillStyle='rgba(0,0,0,0.2)';
    c.beginPath(); c.arc(tx+4, ty-tr*0.1+4, tr*1.1, 0, Math.PI*2); c.fill();

    // 葉の本体（3層グラデーション）
    const layers = [
      {dx:0,  dy:0,      r:tr*1.08, col:'#2d6b24'},
      {dx:-tr*0.22, dy:-tr*0.28, r:tr*0.82, col:'#388e3c'},
      {dx: tr*0.18, dy:-tr*0.38, r:tr*0.72, col:'#43a047'},
    ];
    for(const l of layers) {
      c.fillStyle=l.col;
      c.beginPath(); c.arc(tx+l.dx, ty+l.dy, l.r, 0, Math.PI*2); c.fill();
    }

    // 葉の細かいクラスター
    const leafSeeds = [0,1,2,3,4,5,6];
    for(const s of leafSeeds) {
      const angle = s*(Math.PI*2/7)+0.3;
      const dist2 = tr*0.55;
      const lx2 = tx + Math.cos(angle)*dist2;
      const ly2 = ty - tr*0.15 + Math.sin(angle)*dist2*0.7;
      c.fillStyle = s%2===0 ? '#4caf50' : '#388e3c';
      c.beginPath(); c.arc(lx2, ly2, tr*0.32, 0, Math.PI*2); c.fill();
    }

    // ハイライト
    c.fillStyle='rgba(200,255,150,0.18)';
    c.beginPath(); c.ellipse(tx-tr*0.25, ty-tr*0.45, tr*0.42, tr*0.28, -0.4, 0, Math.PI*2); c.fill();
  }

  // ---- 外周フェンス ----
  c.strokeStyle='#3a2008'; c.lineWidth=10;
  c.strokeRect(5,5,MPX-10,MPY-10);
  c.strokeStyle='#6d4c20'; c.lineWidth=3;
  c.strokeRect(5,5,MPX-10,MPY-10);
  // フェンスポスト
  for(let i=0;i<=MAP_W;i+=4) {
    c.fillStyle='#5d3a1a';
    c.fillRect(i*TILE-4, 0, 8, 10);
    c.fillRect(i*TILE-4, MPY-10, 8, 10);
  }
  for(let i=0;i<=MAP_H;i+=4) {
    c.fillStyle='#5d3a1a';
    c.fillRect(0, i*TILE-4, 10, 8);
    c.fillRect(MPX-10, i*TILE-4, 10, 8);
  }
}

function drawPoisonRing() {
  const cx=MPX/2,cy=MPY/2,r=state.poison.r;
  gctx.save();
  gctx.beginPath(); gctx.rect(0,0,MPX,MPY); gctx.arc(cx,cy,r,0,Math.PI*2,true);
  gctx.fillStyle='rgba(160,0,160,0.22)'; gctx.fill();
  gctx.strokeStyle='rgba(220,50,220,0.8)'; gctx.lineWidth=4;
  gctx.beginPath(); gctx.arc(cx,cy,r,0,Math.PI*2); gctx.stroke();
  gctx.restore();
}

function drawAimLine() {
  const p=state.player;
  if(!p||!p.alive) return;
  const angle=p.facing;
  const startX=p.x+Math.cos(angle)*p.r;
  const startY=p.y+Math.sin(angle)*p.r;
  const lineLen=p.range||220;

  // Dashed glow outline
  gctx.save();
  gctx.globalAlpha=0.18;
  gctx.strokeStyle='#ff1744';
  gctx.lineWidth=10;
  gctx.lineCap='round';
  gctx.setLineDash([18,10]);
  gctx.beginPath();
  gctx.moveTo(startX,startY);
  gctx.lineTo(startX+Math.cos(angle)*lineLen, startY+Math.sin(angle)*lineLen);
  gctx.stroke();

  // Main red line
  gctx.globalAlpha=0.72;
  gctx.strokeStyle='#ff1744';
  gctx.lineWidth=4;
  gctx.setLineDash([14,8]);
  gctx.beginPath();
  gctx.moveTo(startX,startY);
  gctx.lineTo(startX+Math.cos(angle)*lineLen, startY+Math.sin(angle)*lineLen);
  gctx.stroke();

  // Bright core
  gctx.globalAlpha=0.95;
  gctx.strokeStyle='#ff8a80';
  gctx.lineWidth=1.5;
  gctx.setLineDash([10,10]);
  gctx.beginPath();
  gctx.moveTo(startX,startY);
  gctx.lineTo(startX+Math.cos(angle)*lineLen, startY+Math.sin(angle)*lineLen);
  gctx.stroke();

  // Tip circle
  const tipX=startX+Math.cos(angle)*lineLen;
  const tipY=startY+Math.sin(angle)*lineLen;
  gctx.globalAlpha=0.7;
  gctx.setLineDash([]);
  gctx.strokeStyle='#ff1744';
  gctx.lineWidth=2.5;
  gctx.beginPath(); gctx.arc(tipX,tipY,7,0,Math.PI*2); gctx.stroke();
  gctx.fillStyle='rgba(255,23,68,0.35)';
  gctx.beginPath(); gctx.arc(tipX,tipY,7,0,Math.PI*2); gctx.fill();

  gctx.restore();
}

function drawBrawler(ctx, b, isPlayer) {
  ctx.save();
  ctx.translate(b.x, b.y);
  if(b.invTimer>0) ctx.globalAlpha=0.45;

  const r=b.r, facing=b.facing;
  const walkOff=Math.sin(b.walkAnim)*2.5;

  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0,r*1.2,r*0.7,r*0.2,0,0,Math.PI*2); ctx.fill();

  // Body
  ctx.fillStyle=b.col;
  ctx.beginPath(); ctx.ellipse(0,r*0.55+walkOff*0.3,r*0.65,r*0.85,0,0,Math.PI*2); ctx.fill();

  // Legs animation
  ctx.fillStyle=b.skinColor;
  const legAngle=Math.sin(b.walkAnim)*0.35;
  ctx.save(); ctx.rotate(legAngle);
  ctx.fillStyle=b.col; ctx.beginPath(); ctx.ellipse(-r*0.25,r*1.15,r*0.22,r*0.35,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.rotate(-legAngle);
  ctx.fillStyle=b.col; ctx.beginPath(); ctx.ellipse(r*0.25,r*1.15,r*0.22,r*0.35,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle=b.skinColor;
  ctx.beginPath(); ctx.arc(0,-r*0.18+walkOff*0.15,r*0.78,0,Math.PI*2); ctx.fill();
  if(isPlayer){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
  else{ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1.5;ctx.stroke();}

  // Hair
  ctx.fillStyle=b.hairColor;
  ctx.beginPath(); ctx.arc(0,-r*0.18+walkOff*0.15,r*0.6,-Math.PI,0); ctx.fill();

  // Face (facing direction)
  const ex=Math.cos(facing)*r*0.32, ey=Math.sin(facing)*r*0.32;
  const faceX=-r*0.18+walkOff*0.15;
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.ellipse(ex-ey*0.2,faceX+ey*0.5+ex*0.2,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex*0.4+ey*0.2,faceX-ey*0.3+ex*0.2,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1a1a2e';
  ctx.beginPath(); ctx.arc(ex-ey*0.2+Math.cos(facing)*r*0.1,faceX+ey*0.5+ex*0.2+Math.sin(facing)*r*0.1,r*0.11,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex*0.4+ey*0.2+Math.cos(facing)*r*0.1,faceX-ey*0.3+ex*0.2+Math.sin(facing)*r*0.1,r*0.11,0,Math.PI*2); ctx.fill();
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(ex-ey*0.2-r*0.07,faceX+ey*0.5+ex*0.2-r*0.07,r*0.05,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex*0.4+ey*0.2-r*0.07,faceX-ey*0.3+ex*0.2-r*0.07,r*0.05,0,Math.PI*2); ctx.fill();

  // Weapon arm + weapon
  drawWeaponInGame(ctx, b, facing, r, walkOff, isPlayer);

  // HP bar
  const barW=r*2.8, barH=5;
  ctx.fillStyle='rgba(0,0,0,0.5)';
  ctx.fillRect(-barW/2,-r*1.55,barW,barH);
  const hpPct=Math.max(0,b.hp/b.maxHp);
  ctx.fillStyle=hpPct>0.5?'#4deb4d':hpPct>0.25?'#ffcc00':'#e24b4a';
  ctx.fillRect(-barW/2,-r*1.55,barW*hpPct,barH);

  // Name
  ctx.fillStyle=isPlayer?'#fff':'#ddd';
  ctx.font=`bold ${isPlayer?10:9}px 'Barlow Condensed',sans-serif`;
  ctx.textAlign='center';
  ctx.fillText(b.name,-0,-r*1.65);

  // Ammo pips (player only)
  if(isPlayer) {
    for(let i=0;i<b.maxAmmo;i++) {
      ctx.fillStyle=i<b.ammo?'#ffcc00':'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.arc(-b.maxAmmo*5/2+i*6+3,r*1.5,2.8,0,Math.PI*2); ctx.fill();
    }
  }

  ctx.restore();
}



let animId;
function gameLoop(now) {
  if(!state.running) return;
  const dt=Math.min((now-(gameLoop.last||now))/1000,0.05);
  gameLoop.last=now;
  update(dt);
  draw();
  animId=requestAnimationFrame(gameLoop);
}

function endGame(won) {
  state.running=false;
  cancelAnimationFrame(animId);

  // 順位計算: 生き残っている敵の数+1が自分の順位（勝利=1位）
  const aliveCount = state.enemies.filter(e=>e.alive).length;
  const rank = won ? 1 : Math.max(2, aliveCount + 1); // 最低2位（負けたら1位にならない）

  // トロフィー増減: 1位+10, 2位+7, 3位+5, 4位+3, 5位+1, 6位以下-1
  let delta;
  if(rank === 1)      delta = 10;
  else if(rank === 2) delta = 7;
  else if(rank === 3) delta = 5;
  else if(rank === 4) delta = 3;
  else if(rank === 5) delta = 1;
  else                delta = -1;

  trophies = Math.max(0, trophies + delta);
  // クエスト進捗
  addQuestProgress('play');
  if(rank===1){ addQuestProgress('win'); addLevelWin(); }
  if(rank<=3) addQuestProgress('top3');
  // コイン報酬: 順位に応じて付与
  const gemBonus = (state.player?.gems||0)*10; // 戦場コイン1個=10コイン
  // 順位別コイン報酬
  const coinReward = rank<=3 ? 500 : rank<=7 ? 200 : 50;
  coins += coinReward + gemBonus;
  saveTrophies(); saveCoins();
  // Firebaseへランキング投稿
  if(window._firebaseReady && typeof submitRanking==='function') submitRanking();
  // ドロップ付与: 1位は確定, 2-5位は50%, 6位以下は20%
  const dropRoll=Math.random();
  if(rank===1||(rank<=5&&dropRoll<0.5)||(rank>5&&dropRoll<0.2)){
    luckyDrops++; saveDrops(); updateAllDisplays();
  }

  const rankLabel = ['', '🥇 1位', '🥈 2位', '🥉 3位', '4位', '5位', '6位', '7位', '8位', '9位', '10位'][rank] || `${rank}位`;
  const deltaStr = delta >= 0 ? `+${delta}` : String(delta);

  const ov=document.getElementById('overlay');
  document.getElementById('ov-title').textContent = won ? '勝利！' : 'やられた…';
  document.getElementById('ov-title').style.color = won ? '#ffcc00' : '#e24b4a';
  document.getElementById('ov-sub').textContent = `${rankLabel}  🏆 ${deltaStr}  🪙 +${coinReward+gemBonus}`;
  ov.style.display='flex';
}

