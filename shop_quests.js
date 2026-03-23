// =========== SHOP & QUEST SYSTEM ===========
// ===== SHOP =====
const SHOP_POWERUPS = [
  {id:'hp_up',    icon:'❤️',  name:'HPアップ',    desc:'最大HPを10%強化',     price:500, max:5},
  {id:'atk_up',   icon:'⚔️',  name:'攻撃アップ',  desc:'攻撃力を10%強化',     price:520, max:5},
  {id:'spd_up',   icon:'👟',  name:'速度アップ',  desc:'移動速度を5%強化',     price:480, max:5},
  {id:'regen_up', icon:'💚',  name:'回復アップ',  desc:'回復速度を2倍に',       price:550, max:1},
];
const SHOP_SPECIALS = [
  {id:'ammo_up',  icon:'🔫',  name:'弾数アップ',  desc:'最大弾数+1',          price:600, max:3},
  {id:'super_up', icon:'⚡',  name:'スーパー強化', desc:'スーパーダメージ+20%', price:650, max:3},
  {id:'lucky',    icon:'🍀',  name:'ラッキーボックス', desc:'コイン50〜200獲得',price:700, max:99},
];

// エメラルド（💎）は コインで購入してブロスター解放に使う
const SHOP_GEMS = [
  {id:'gems_s', icon:'🟢',  name:'エメラルド×5',  desc:'ブロスター解放に使用', price:100,  gems:5},
  {id:'gems_m', icon:'🟢🟢', name:'エメラルド×15', desc:'お得パック',           price:250,  gems:15},
  {id:'gems_l', icon:'🟢🟢🟢',name:'エメラルド×40', desc:'大量パック',           price:600,  gems:40},
];

// デフォルト解放キャラ
// ブロスター解放価格 (コイン / エメラルド)
const BRAWLER_UNLOCK = {
  'トロフィーロード': {coins:0,   gems:0},
  'レア':            {coins:300,  gems:0},
  'スーパーレア':    {coins:0,    gems:110},
  'エピック':        {coins:0,    gems:180},
  'ミシック':        {coins:0,    gems:240},
  'レジェンダリー':  {coins:0,    gems:300},
  'ウルトラレジェンダリー': {coins:0, gems:800},
};


function saveUnlocked(){ localStorage.setItem('bs_unlocked', JSON.stringify(unlockedBrawlers)); }
function isUnlocked(id){ return unlockedBrawlers.includes(id); }

function getUpgradeCount(id){ return purchases[id]||0; }

function buildShop(){
  buildShopSection('shop-powerup-items', SHOP_POWERUPS);
  buildShopSection('shop-special-items', SHOP_SPECIALS);
  buildGemShop();
  buildBrawlerShop();
  // ショップにレベル情報表示
  const lvInfo=document.getElementById('shop-level-info');
  if(lvInfo) lvInfo.textContent=`⭐ Lv${playerLevel}  エピック:Lv1 / ミシック:Lv10 / レジェンダリー:Lv20 / ウルトラ:Lv50`;
  // gem count in shop header
  const gc=document.getElementById('shop-gem-count');
  if(gc) gc.textContent=gemCount;
}

function buildGemShop(){
  const el=document.getElementById('shop-gem-items');
  if(!el) return;
  el.innerHTML='';
  SHOP_GEMS.forEach(item=>{
    const div=document.createElement('div');
    div.className='shop-item';
    div.innerHTML=`
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-price">🪙 ${item.price}</div>`;
    div.onclick=()=>{
      if(coins<item.price){showToast('コインが足りません！');return;}
      coins-=item.price; gemCount+=item.gems;
      saveCoins(); saveGems(); buildShop(); updateAllDisplays();
      showToast(`🟢 エメラルド${item.gems}個ゲット！`);
    };
    el.appendChild(div);
  });
}

// レベル制解放条件
const RARITY_LEVEL_REQ = {
  'トロフィーロード': 1,
  'レア':            1,
  'スーパーレア':    1,
  'エピック':        1,   // Lv1から
  'ミシック':        10,  // Lv10から
  'レジェンダリー':  20,  // Lv20から
  'ウルトラレジェンダリー': 50, // Lv50から
};

function getRarityLevelReq(rarity){ return RARITY_LEVEL_REQ[rarity] || 1; }

function buildBrawlerShop(){
  const el=document.getElementById('shop-brawler-items');
  if(!el) return;
  el.innerHTML='';
  let count=0;
  SORTED_BRAWLERS.forEach(b=>{
    if(isUnlocked(b.id)) return;
    count++;
    const req=BRAWLER_UNLOCK[b.rarity]||{coins:999,gems:0};
    const lvReq=getRarityLevelReq(b.rarity);
    const lvOk=playerLevel>=lvReq;
    const div=document.createElement('div');
    div.className='shop-item';
    if(!lvOk) div.style.cssText='opacity:0.5;filter:grayscale(0.6);';
    const priceHtml = !lvOk
      ? `<div class="shop-item-price" style="color:#ef5350;">🔒 Lv${lvReq}必要</div>`
      : req.gems>0
        ? `<div class="shop-item-price" style="color:#66bb6a;">🟢 ${req.gems}</div>`
        : `<div class="shop-item-price">🪙 ${req.coins}</div>`;
    div.innerHTML=`
      <canvas id="shop-cv-${b.id}" width="50" height="50" style="display:block;margin:0 auto 6px;"></canvas>
      <div class="shop-item-name" style="font-size:13px;">${b.name}</div>
      <div class="shop-item-desc" style="color:${b.rarityColor}">${b.rarity}</div>
      ${priceHtml}`;
    if(lvOk) div.onclick=()=>unlockBrawler(b, req);
    else div.onclick=()=>showToast(`🔒 Lv${lvReq}に達すると解放可能！（現在Lv${playerLevel}）`);
    el.appendChild(div);
    setTimeout(()=>{ const c=document.getElementById('shop-cv-'+b.id); if(c) drawCharacterSprite(c,b,50); },50);
  });
  if(count===0){
    el.innerHTML='<div style="color:#555;font-size:13px;padding:12px;">全ブロスター解放済み！</div>';
  }
}

function unlockBrawler(b, req){
  if(req.gems>0){
    if(gemCount<req.gems){showToast('エメラルドが足りません！');return;}
    gemCount-=req.gems; saveGems();
  } else {
    if(coins<req.coins){showToast('コインが足りません！');return;}
    coins-=req.coins; saveCoins();
  }
  unlockedBrawlers.push(b.id);
  saveUnlocked(); buildShop(); updateAllDisplays();
  showToast(`🎉 ${b.name} を解放しました！`);
  rebuildSelectScreen();
}


// ===== GADGET MODAL =====
let _gadgetModalBrawler = null;

function openGadgetModal(b){
  _gadgetModalBrawler = b;
  const m = document.getElementById('gadget-modal');
  m.style.display = 'flex';
  // キャラ描画
  const c = document.getElementById('gm-canvas');
  drawCharacterSprite(c, b, 64);
  document.getElementById('gm-name').textContent = b.name;
  document.getElementById('gm-rarity').textContent = b.rarity;
  document.getElementById('gm-rarity').style.color = b.rarityColor;
  // ガジェット情報
  const g = GADGETS[b.id];
  if(g){
    document.getElementById('gm-gadget-icon').textContent = g.icon;
    document.getElementById('gm-gadget-name').textContent = g.name;
    document.getElementById('gm-gadget-desc').textContent = g.desc;
    const btn = document.getElementById('gm-gadget-btn');
    if(hasGadget(g.id)){
      btn.textContent = '✓ 所持済';
      btn.className = 'gadget-buy-btn owned';
    } else {
      btn.textContent = '🪙 800';
      btn.className = 'gadget-buy-btn';
    }
  } else {
    document.getElementById('gm-gadget-icon').textContent = '—';
    document.getElementById('gm-gadget-name').textContent = 'ガジェットなし';
    document.getElementById('gm-gadget-desc').textContent = '未実装';
    document.getElementById('gm-gadget-btn').style.display = 'none';
  }
}

function closeGadgetModal(e){
  if(!e || e.target === document.getElementById('gadget-modal'))
    document.getElementById('gadget-modal').style.display = 'none';
}

function buyGadgetFromModal(){
  const b = _gadgetModalBrawler;
  if(!b) return;
  const g = GADGETS[b.id];
  if(!g) return;
  if(hasGadget(g.id)){ showToast('すでに所持しています'); return; }
  if(coins < 800){ showToast('コインが足りません！'); return; }
  coins -= 800;
  ownedGadgets.push(g.id);
  saveCoins(); saveGadgets();
  updateAllDisplays();
  openGadgetModal(b); // 表示更新
  showToast(`🎉 ${g.name} を入手！`);
}

// ===== GADGET IN GAME =====
let gadgetCooldown = 0;
const GADGET_COOLDOWN = 20; // 20秒クールダウン

function useGadget(){
  if(!state.running || !state.player?.alive) return;
  if(gadgetCooldown > 0){ showToast(`あと${Math.ceil(gadgetCooldown)}秒`); return; }
  const p = state.player;
  const g = GADGETS[p.id];
  if(!g){ showToast('ガジェットなし'); return; }
  if(!hasGadget(g.id)){ showToast('ガジェット未所持'); return; }
  g.use(p);
  gadgetCooldown = GADGET_COOLDOWN;
  addQuestProgress('gadget');
  updateGadgetHUD();
}

function updateGadgetHUD(){
  const btn = document.getElementById('gadget-hud-btn');
  const cd = document.getElementById('gadget-hud-cd');
  if(!btn) return;
  if(!state.player) return;
  const g = GADGETS[state.player.id];
  if(g && hasGadget(g.id)){
    btn.textContent = g.icon;
    btn.className = gadgetCooldown > 0 ? 'gadget-hud-btn' : 'gadget-hud-btn ready';
    cd.textContent = gadgetCooldown > 0 ? Math.ceil(gadgetCooldown)+'s' : '';
  } else {
    btn.textContent = '❓';
    btn.className = 'gadget-hud-btn';
    cd.textContent = '';
  }
}

function rebuildSelectScreen(){
  const g=document.getElementById('char-grid');
  g.innerHTML='';
  SORTED_BRAWLERS.forEach(b=>{
    const unlocked=isUnlocked(b.id);
    const card=document.createElement('div');
    card.className='char-card';
    card.style.setProperty('--col',unlocked?b.col:'#555');
    card.style.setProperty('--glow',unlocked?b.glow:'#333');
    if(!unlocked) card.style.opacity='0.45';
    const req=BRAWLER_UNLOCK[b.rarity]||{};
    const lockBadge=unlocked?'':`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);border-radius:14px;font-size:11px;color:#aaa;">`
      +(req.gems>0?`🔒 🟢${req.gems}`:`🔒 🪙${req.coins}`)
      +`</div>`;
    card.innerHTML=`
      <div class="char-rarity" style="background:${b.rarityColor}22;color:${b.rarityColor}">${b.rarity}</div>
      <div class="char-preview"><canvas class="char-canvas" id="cv-${b.id}"></canvas></div>
      <div class="char-name">${b.name}</div>
      <div class="char-weapon">${b.weapon}</div>
      <div class="char-stats">
        <div class="stat"><div class="stat-label">体力</div><div class="stat-bar"><div class="stat-fill" style="width:${b.stats.hp*10}%;background:${b.col}"></div></div></div>
        <div class="stat"><div class="stat-label">速度</div><div class="stat-bar"><div class="stat-fill" style="width:${b.stats.speed*10}%;background:${b.col}"></div></div></div>
        <div class="stat"><div class="stat-label">攻撃力</div><div class="stat-bar"><div class="stat-fill" style="width:${b.stats.power*10}%;background:${b.col}"></div></div></div>
      </div>
      ${lockBadge}`;
    if(unlocked){
      card.onclick=()=>{
        // まず選択状態にする
        document.querySelectorAll('.char-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        selectedBrawler=b;
        const _sb2=document.getElementById('select-btn'); if(_sb2) _sb2.disabled=false;
        const _sn=document.getElementById('sel-name'); if(_sn){_sn.textContent=b.name;_sn.style.color=b.col;}
        const _sw=document.getElementById('sel-weapon'); if(_sw) _sw.textContent=b.weapon+' · '+b.rarity;
        drawCharacterSprite(document.getElementById('sel-canvas'),b,40);
        const hc=document.getElementById('home-brawler-canvas');
        if(hc) drawCharacterSprite(hc,b,80);
        const hn=document.getElementById('home-brawler-name');
        if(hn) hn.textContent=b.name;
        const hr=document.getElementById('home-brawler-rarity');
        if(hr){hr.textContent=b.rarity;hr.style.color=b.rarityColor;}
        const hw=document.getElementById('home-brawler-weapon');
        if(hw) hw.textContent=b.weapon;
        // ガジェットモーダルを開く
        openGadgetModal(b);
      };
    }
    g.appendChild(card);
    setTimeout(()=>drawCharacterSprite(document.getElementById('cv-'+b.id),b,70),50);
  });
}

// 全宣言・定義完了後にセレクト画面を構築
rebuildSelectScreen();

function buildShopSection(containerId, items){
  const el=document.getElementById(containerId);
  el.innerHTML='';
  items.forEach(item=>{
    const count=getUpgradeCount(item.id);
    const owned=count>=item.max;
    const div=document.createElement('div');
    div.className='shop-item'+(owned?' owned':'');
    div.innerHTML=`
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      ${item.max>1?`<div style="font-size:10px;color:#555;margin-top:2px;">${count}/${item.max}</div>`:''}
      <div class="shop-item-price">${owned?'✓ 購入済':'🪙 '+item.price}</div>`;
    if(!owned) div.onclick=()=>buyItem(item);
    el.appendChild(div);
  });
}

function buyItem(item){
  if(coins<item.price){ showToast('コインが足りません！'); return; }
  const count=getUpgradeCount(item.id);
  if(count>=item.max){ showToast('これ以上強化できません'); return; }
  // ラッキーボックス特別処理
  if(item.id==='lucky'){
    const gain=Math.floor(Math.random()*151)+50;
    const bonusGems=Math.random()<0.3?Math.floor(Math.random()*5)+1:0;
    coins+=gain; coins-=item.price; gemCount+=bonusGems;
    saveCoins(); saveGems(); buildShop(); updateAllDisplays();
    showToast(bonusGems>0?`🍀 コイン${gain}枚 + 🟢${bonusGems}個！`:`🍀 コイン${gain}枚ゲット！`);
    return;
  }
  coins-=item.price;
  purchases[item.id]=(count+1);
  localStorage.setItem('bs_purchases', JSON.stringify(purchases));
  saveCoins(); buildShop(); updateAllDisplays();
  showToast(`${item.name} を購入しました！`);
}



// ===== QUEST SYSTEM =====
const QUEST_DEFS = [
  {id:'q_win1',    title:'初勝利',           desc:'バトルで1位になる',           goal:1,  type:'win',    reward:{coins:500}},
  {id:'q_win5',    title:'連勝街道',         desc:'バトルで1位を5回取る',         goal:5,  type:'win',    reward:{coins:2000}},
  {id:'q_kill10',  title:'バトルハンター',   desc:'合計10体倒す',                 goal:10, type:'kill',   reward:{coins:800}},
  {id:'q_kill50',  title:'殲滅者',           desc:'合計50体倒す',                 goal:50, type:'kill',   reward:{gems:5}},
  {id:'q_play5',   title:'バトル慣れ',       desc:'バトルを5回プレイ',            goal:5,  type:'play',   reward:{coins:300}},
  {id:'q_top3',    title:'メダリスト',       desc:'3位以内を3回達成',             goal:3,  type:'top3',   reward:{coins:1000}},
  {id:'q_soccer1', title:'サッカー入門',     desc:'サッカーで1点取る',            goal:1,  type:'soccer', reward:{coins:400}},
  {id:'q_gadget5', title:'ガジェットマスター',desc:'ガジェットを5回使う',         goal:5,  type:'gadget', reward:{gems:3}},
  {id:'q_coin5000',title:'コインコレクター', desc:'累計コイン5000枚獲得',         goal:5000,type:'totalcoins',reward:{gems:10}},
  {id:'q_trophy20',title:'トロフィーロード', desc:'トロフィーを20個集める',       goal:20, type:'trophy', reward:{coins:1500}},
];

let questRewardQueue = []; // 受取待ちキュー
function saveQuests(){ localStorage.setItem('bs_quests', JSON.stringify(questProgress)); localStorage.setItem('bs_quests_done', JSON.stringify(questCompleted)); }

function getQuestProgress(id){ return questProgress[id]||0; }
function isQuestDone(id){ return questCompleted.includes(id); }

function addQuestProgress(type, amount=1){
  QUEST_DEFS.forEach(q=>{
    if(isQuestDone(q.id)) return;
    if(q.type!==type) return;
    questProgress[q.id]=(questProgress[q.id]||0)+amount;
    if(questProgress[q.id]>=q.goal) completeQuest(q);
  });
  saveQuests();
}

function completeQuest(q){
  if(isQuestDone(q.id)) return;
  questCompleted.push(q.id);
  saveQuests();
  // 報酬キューに積む
  questRewardQueue.push(q);
  updateQuestBadge();
  updateLevelDisplay();
  showToast(`🎯「${q.title}」達成！報酬を受け取ろう！`);
}

function updateQuestBadge(){ /* バッジ非表示 */ }

let _rewardCurrentQuest=null;
function showQuestReward(q){
  _rewardCurrentQuest=q;
  const r=q.reward;
  document.getElementById('reward-quest-name').textContent=q.title;
  // アイコンと金額
  if(r.coins){
    document.getElementById('reward-icon').textContent='🪙🪙🪙';
    document.getElementById('reward-amount').textContent='+'+r.coins+' コイン';
    document.getElementById('reward-amount').style.color='#ffcc00';
  } else if(r.gems){
    document.getElementById('reward-icon').textContent='🟢🟢🟢';
    document.getElementById('reward-amount').textContent='+'+r.gems+' エメラルド';
    document.getElementById('reward-amount').style.color='#66bb6a';
  }
  const qrm=document.getElementById('quest-reward-modal');
  qrm.style.display='flex';
  qrm.style.zIndex='9000';
}

function claimQuestReward(){
  if(!_rewardCurrentQuest) return;
  const r=_rewardCurrentQuest.reward;
  if(r.coins){coins+=r.coins; saveCoins();}
  if(r.gems){gemCount+=r.gems; saveGems();}
  updateAllDisplays();
  document.getElementById('quest-reward-modal').style.display='none';
  _rewardCurrentQuest=null;
  // 次の報酬があれば続けて表示
  questRewardQueue.shift();
  updateQuestBadge();
  updateLevelDisplay();
  if(questRewardQueue.length>0){
    setTimeout(()=>showQuestReward(questRewardQueue[0]),300);
  }
}

function buildQuestScreen(){
  const el=document.getElementById('quest-items');
  if(!el) return;
  el.innerHTML='';
  QUEST_DEFS.forEach(q=>{
    const done=isQuestDone(q.id);
    const prog=getQuestProgress(q.id);
    const pct=Math.min(100,Math.floor(prog/q.goal*100));
    const r=q.reward;
    const div=document.createElement('div');
    div.className='quest-card'+(done?' done':'');
    div.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${done?'#4deb4d':'#fff'};letter-spacing:1px;">${done?'✅ ':''} ${q.title}</div>
          <div style="font-size:11px;color:#666;margin-top:2px;">${q.desc}</div>
        </div>
        <div style="font-size:12px;color:#ffcc00;white-space:nowrap;margin-left:8px;">${r.coins?'🪙'+r.coins:''} ${r.gems?'🟢'+r.gems:''}</div>
      </div>
      ${!done?`<div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:#ffcc00;border-radius:2px;"></div>
      </div>
      <div style="font-size:10px;color:#555;margin-top:3px;text-align:right;">${prog} / ${q.goal}</div>`:''}`;
    el.appendChild(div);
  });
}

function openQuests(){
  hideAllScreens();
  document.getElementById('quest-screen').style.display='flex';
  buildQuestScreen();
  // 未受取報酬があればモーダル表示
  if(questRewardQueue.length>0){
    setTimeout(()=>showQuestReward(questRewardQueue[0]),400);
  }
}

// =============================================
// ラッキードロップ（スタードロップ風）
// =============================================
const DROP_PRIZES = [
  {tier:'RARE',      col:'#4fc3f7', prizes:[
    {type:'coins', amount:100, label:'🪙 100'},
    {type:'coins', amount:150, label:'🪙 150'},
    {type:'coins', amount:200, label:'🪙 200'},
    {type:'gems',  amount:2,   label:'🟢 2'},
  ]},
  {tier:'SUPER RARE',col:'#66bb6a', prizes:[
    {type:'coins', amount:300, label:'🪙 300'},
    {type:'coins', amount:400, label:'🪙 400'},
    {type:'gems',  amount:5,   label:'🟢 5'},
    {type:'gems',  amount:8,   label:'🟢 8'},
  ]},
  {tier:'EPIC',      col:'#ce93d8', prizes:[
    {type:'coins', amount:600, label:'🪙 600'},
    {type:'gems',  amount:15,  label:'🟢 15'},
    {type:'gems',  amount:20,  label:'🟢 20'},
  ]},
  {tier:'MYTHIC',    col:'#ef9a9a', prizes:[
    {type:'coins', amount:1000,label:'🪙 1000'},
    {type:'gems',  amount:30,  label:'🟢 30'},
  ]},
  {tier:'LEGENDARY', col:'#ffd700', prizes:[
    {type:'coins', amount:2000,label:'🪙 2000'},
    {type:'gems',  amount:60,  label:'🟢 60'},
  ]},
];


function openLuckyDrop(){
  if(luckyDrops<=0){ showToast('ラッキードロップがありません！'); return; }
  hideAllScreens();
  document.getElementById('lucky-drop-screen').style.display='flex';
  startDropAnimation();
}

function startDropAnimation(){
  const screen=document.getElementById('lucky-drop-screen');
  // ランダムにティア決定（本家風：低ティアが多い）
  const roll=Math.random();
  let tierIdx=0;
  if(roll<0.45) tierIdx=0;       // RARE 45%
  else if(roll<0.75) tierIdx=1;  // SUPER RARE 30%
  else if(roll<0.90) tierIdx=2;  // EPIC 15%
  else if(roll<0.97) tierIdx=3;  // MYTHIC 7%
  else tierIdx=4;                 // LEGENDARY 3%

  const tier=DROP_PRIZES[tierIdx];
  const prize=tier.prizes[Math.floor(Math.random()*tier.prizes.length)];

  // アニメーション表示
  const canvas=document.getElementById('drop-canvas');
  const ctx=canvas.getContext('2d');
  canvas.width=300; canvas.height=300;

  let frame=0;
  let phase='spin'; // spin → reveal → done
  let spinSpeed=0.15;

  document.getElementById('drop-tier').textContent=tier.tier;
  document.getElementById('drop-tier').style.color=tier.col;
  document.getElementById('drop-prize').textContent='';
  document.getElementById('drop-claim-btn').style.display='none';

  function drawDrop(){
    ctx.clearRect(0,0,300,300);
    const cx=150,cy=150,r=100;

    if(phase==='spin'){
      // 回転する虹色の球
      frame++;
      spinSpeed=Math.max(0.02, spinSpeed-0.001);
      const hue=(frame*spinSpeed*180)%360;
      const grd=ctx.createRadialGradient(cx-30,cy-30,10,cx,cy,r);
      grd.addColorStop(0,'hsl('+hue+',100%,80%)');
      grd.addColorStop(0.5,'hsl('+(hue+60)+',100%,50%)');
      grd.addColorStop(1,'hsl('+(hue+120)+',80%,30%)');
      ctx.fillStyle=grd;
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
      // 光沢
      ctx.fillStyle='rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.ellipse(cx-28,cy-28,30,20,-0.5,0,Math.PI*2); ctx.fill();

      if(frame>120 && spinSpeed<0.025){
        phase='reveal';
        frame=0;
      }
      requestAnimationFrame(drawDrop);
    } else {
      // 開封エフェクト
      frame++;
      const t=Math.min(1,frame/40);
      // 爆発パーティクル
      ctx.fillStyle=tier.col;
      ctx.beginPath(); ctx.arc(cx,cy,r*(1+t*0.5),0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.6)';
      ctx.beginPath(); ctx.arc(cx,cy,r*0.85*(1-t*0.3),0,Math.PI*2); ctx.fill();
      // 輝き
      for(let i=0;i<12;i++){
        const a=i/12*Math.PI*2+frame*0.05;
        const len=r*(0.3+t*0.7);
        ctx.strokeStyle=tier.col; ctx.lineWidth=3*(1-t);
        ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r*0.9,cy+Math.sin(a)*r*0.9);
        ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len)); ctx.stroke();
      }
      // 賞品テキスト
      if(t>0.5){
        ctx.fillStyle='#fff';
        ctx.font=`bold ${Math.floor(30*t)}px 'Bebas Neue',sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(prize.label,cx,cy);
      }
      if(frame===41){
        document.getElementById('drop-prize').textContent=prize.label;
        document.getElementById('drop-claim-btn').style.display='block';
        document.getElementById('drop-claim-btn').onclick=()=>claimDrop(prize);
        return;
      }
      requestAnimationFrame(drawDrop);
    }
  }
  drawDrop();
}

function claimDrop(prize){
  if(prize.type==='coins'){coins+=prize.amount; saveCoins();}
  else if(prize.type==='gems'){gemCount+=prize.amount; saveGems();}
  luckyDrops--; saveDrops();
  updateAllDisplays();
  showHome();
  showToast(`✨ ${prize.label} ゲット！`);
  addQuestProgress('drop');
}


