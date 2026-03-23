// =========== ADMIN, RESET & PLAYER NAME ===========
// ===== ADMIN & RESET =====
// openAdminModal is defined above

// 管理者ログイン状態
let adminLoggedIn = false;
let _adminSavedUnlocked = null; // ログイン前の解放状態を保存

function checkAdminCode(code){
  if(code==='123'){
    document.getElementById('admin-input').value='';
    // ログイン処理
    adminLoggedIn = true;
    _adminSavedUnlocked = [...unlockedBrawlers]; // 現状保存
    // 全キャラ解放
    unlockedBrawlers = BRAWLERS.map(b=>b.id);
    saveUnlocked();
    rebuildSelectScreen();
    // リソース付与
    coins+=50000; gemCount+=500; luckyDrops+=50; trophies+=100;
    playerLevel+=100; levelWins=0;
    saveCoins(); saveGems(); saveDrops(); saveTrophies(); saveLevel(); updateAllDisplays(); updateLevelDisplay();
    // UIをログイン後に切り替え
    document.getElementById('admin-login-view').style.display='none';
    document.getElementById('admin-loggedin-view').style.display='block';
    showToast('👑 管理者ログイン！全キャラ解放＋リソース付与＋⭐Lv+100！');
  } else if(code==='0303'){
    document.getElementById('admin-modal').style.display='none';
    coins+=10000; gemCount+=2000;
    saveCoins(); saveGems(); updateAllDisplays();
    showToast('🎉 🪙+10000  🟢+2000');
  } else if(code==='1027'){
    document.getElementById('admin-modal').style.display='none';
    luckyDrops+=30;
    saveDrops(); updateAllDisplays();
    showToast('🎁 +30ドロップ');
  } else {
    showToast('❌ コードが違います');
    document.getElementById('admin-input').value='';
  }
}

function adminGiveResources(){
  coins+=50000; gemCount+=500; luckyDrops+=50;
  saveCoins(); saveGems(); saveDrops(); updateAllDisplays();
  showToast('🪙+50000  🟢+500  🎁+50');
}

function adminLogout(){
  adminLoggedIn = false;
  // 解放状態を元に戻す
  if(_adminSavedUnlocked){
    unlockedBrawlers = [..._adminSavedUnlocked];
    _adminSavedUnlocked = null;
    saveUnlocked();
    rebuildSelectScreen();
    if(selectedBrawler && !unlockedBrawlers.includes(selectedBrawler.id)){
      selectedBrawler = null;
      refreshHomeChar && refreshHomeChar();
    }
  }
  // UIをログイン前に戻す
  document.getElementById('admin-loggedin-view').style.display='none';
  document.getElementById('admin-login-view').style.display='block';
  document.getElementById('admin-modal').style.display='none';
  updateAllDisplays();
  showToast('🚪 管理者ログアウトしました。キャラ解放を元に戻しました。');
}

function openAdminModal(){
  document.getElementById('admin-input').value='';
  // ログイン中なら直接ログイン後画面を表示
  if(adminLoggedIn){
    document.getElementById('admin-login-view').style.display='none';
    document.getElementById('admin-loggedin-view').style.display='block';
  } else {
    document.getElementById('admin-login-view').style.display='block';
    document.getElementById('admin-loggedin-view').style.display='none';
  }
  document.getElementById('admin-modal').style.display='flex';
  setTimeout(()=>document.getElementById('admin-input').focus(),100);
}

function openResetModal(){
  document.getElementById('reset-modal').style.display='flex';
}

function doReset(){
  // 全localStorageデータ削除
  ['bs_trophies','bs_coins','bs_gems','bs_unlocked','bs_purchases','bs_gadgets','bs_last_login','bs_quests','bs_quests_done','bs_drops','bs_player_name','bs_hand','bs_level','bs_level_wins'].forEach(k=>localStorage.removeItem(k));
  handedness='right';
  // 変数リセット
  trophies=0; coins=0; gemCount=0;
  unlockedBrawlers=[...DEFAULT_UNLOCKED];
  purchases={}; ownedGadgets=[]; questProgress={}; questCompleted=[]; luckyDrops=0;
  selectedBrawler=null; playerName=''; playerLevel=1; levelWins=0;
  document.getElementById('reset-modal').style.display='none';
  updateAllDisplays();
  rebuildSelectScreen();
  // 名前もリセットするので名前入力画面へ
  hideAllScreens();
  document.getElementById('name-screen').style.display='flex';
  showToast('🗑️ データをリセットしました');
}


// ===== PLAYER NAME =====

function confirmName(){
  const input = document.getElementById('name-input');
  const name = (input.value||'').trim();
  if(!name){ showToast('名前を入力してください'); return; }
  playerName = name;
  localStorage.setItem('bs_player_name', playerName);
  document.getElementById('name-screen').style.display='none';
  document.getElementById('friend-screen').style.display='none';
  const rnm=document.getElementById('rename-modal'); if(rnm) rnm.style.display='none';
  const hnm=document.getElementById('hand-modal'); if(hnm) hnm.style.display='none';
  const fgm=document.getElementById('firebase-guide-modal'); if(fgm) fgm.style.display='none';
  showHome();
  updateAllDisplays();
}



function openRenameModal(){
  const inp = document.getElementById('rename-input');
  if(inp) inp.value = playerName || '';
  document.getElementById('rename-modal').style.display = 'flex';
  setTimeout(() => inp && inp.focus(), 100);
}

function confirmRename(){
  const inp = document.getElementById('rename-input');
  const name = (inp.value || '').trim();
  if(!name){ showToast('名前を入力してください'); return; }
  playerName = name;
  localStorage.setItem('bs_player_name', playerName);
  document.getElementById('rename-modal').style.display = 'none';
  updateAllDisplays();
  refreshHomeChar();
  updatePartySlots();
  showToast('✅ 名前を「' + playerName + '」に変更しました！');
}


// ===== 利き手変更モーダル =====
let _pendingHand = handedness;

function openHandModal(){
  _pendingHand = handedness;
  const mr = document.getElementById('hand-modal-right');
  const ml = document.getElementById('hand-modal-left');
  if(mr){
    mr.style.borderColor = handedness==='right' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    mr.style.background  = handedness==='right' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const mrd = mr.querySelectorAll('div'); if(mrd[1]) mrd[1].style.color = handedness==='right' ? '#ffcc00' : '#aaa';
  }
  if(ml){
    ml.style.borderColor = handedness==='left' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    ml.style.background  = handedness==='left' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const mld = ml.querySelectorAll('div'); if(mld[1]) mld[1].style.color = handedness==='left' ? '#ffcc00' : '#aaa';
  }
  document.getElementById('hand-modal').style.display = 'flex';
}

function changeHandModal(hand){
  _pendingHand = hand;
  const mr = document.getElementById('hand-modal-right');
  const ml = document.getElementById('hand-modal-left');
  if(mr){
    mr.style.borderColor = hand==='right' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    mr.style.background  = hand==='right' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const mrd = mr.querySelectorAll('div'); if(mrd[1]) mrd[1].style.color = hand==='right' ? '#ffcc00' : '#aaa';
  }
  if(ml){
    ml.style.borderColor = hand==='left' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    ml.style.background  = hand==='left' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const mld = ml.querySelectorAll('div'); if(mld[1]) mld[1].style.color = hand==='left' ? '#ffcc00' : '#aaa';
  }
}

function confirmHandChange(){
  handedness = _pendingHand;
  localStorage.setItem('bs_hand', handedness);
  document.getElementById('hand-modal').style.display = 'none';
  // タッチコントロールを再セットアップ（入れ替え反映）
  setupTouchControls();
  showToast(handedness==='right' ? '✅ 右利きに設定しました' : '✅ 左利きに設定しました');
}

// 名前タップ → 名前変更 or 利き手変更を選べるシートを開く
function openProfileMenu(){
  // シンプルに名前変更と利き手変更の両方を開く
  // まず名前変更モーダルを開き、その下に利き手変更ボタンを表示
  openRenameModal();
}

function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 20px;border-radius:10px;font-size:14px;z-index:999;pointer-events:none;letter-spacing:1px;';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

// 購入済みアップグレードをプレイヤーに適用する関数
function applyUpgrades(player){
  const hpUp=getUpgradeCount('hp_up');
  const atkUp=getUpgradeCount('atk_up');
  const spdUp=getUpgradeCount('spd_up');
  const regenUp=getUpgradeCount('regen_up');
  const ammoUp=getUpgradeCount('ammo_up');
  const superUp=getUpgradeCount('super_up');
  if(hpUp>0){ const m=1+hpUp*0.1; player.hp=Math.round(player.hp*m); player.maxHp=player.hp; }
  if(atkUp>0){ player.dmg=Math.round(player.dmg*(1+atkUp*0.1)); }
  if(spdUp>0){ player.speed=Math.round(player.speed*(1+spdUp*0.05)); }
  if(regenUp>0){ player._regenRate=0.12; } // 毎秒12%に強化
  if(ammoUp>0){ player.maxAmmo+=ammoUp; player.ammo=player.maxAmmo; }
  if(superUp>0){ player.superDmg=Math.round(player.superDmg*(1+superUp*0.2)); }
  return player;
}



window.addEventListener('resize',()=>{if(state.running)resizeCanvas();});
window.addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key===' '){e.preventDefault();playerSuper();}
  if(e.key==='q'||e.key==='Q') useGadget();
});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
canvas.addEventListener('click',playerShoot);
canvas.addEventListener('mousemove',e=>{
  const rect=canvas.getBoundingClientRect();
  mouseX=(e.clientX-rect.left)*(canvas.width/rect.width);
  mouseY=(e.clientY-rect.top)*(canvas.height/rect.height);
  if(state.running&&state.player?.alive){
    state.player.facing=Math.atan2(mouseY+state.camY-state.player.y,mouseX+state.camX-state.player.x);
  }


});

