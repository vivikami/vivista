// =========== SAVE / LOAD / FRIENDS / LEVEL / ONLINE ===========
function saveAll(){
  localStorage.setItem('bs_trophies',  String(trophies));
  localStorage.setItem('bs_coins',     String(coins));
  localStorage.setItem('bs_gems',      String(gemCount));
  localStorage.setItem('bs_unlocked',  JSON.stringify(unlockedBrawlers));
  localStorage.setItem('bs_purchases', JSON.stringify(purchases));
  localStorage.setItem('bs_gadgets',   JSON.stringify(ownedGadgets));
  localStorage.setItem('bs_quests',    JSON.stringify(questProgress));
  localStorage.setItem('bs_quests_done',JSON.stringify(questCompleted));
  localStorage.setItem('bs_drops',     String(luckyDrops));
  localStorage.setItem('bs_player_name', playerName);
  localStorage.setItem('bs_friends', JSON.stringify(friends));
}


// ===== FRIEND SLOTS =====

function openFriendPick(slotIdx){
  _pickingSlot = slotIdx;
  const list = document.getElementById('friend-pick-list');
  list.innerHTML='';
  if(friends.length===0){
    list.innerHTML='<div style="color:#555;text-align:center;padding:16px;font-size:12px;">フレンドがいません。<br>まずフレンドを追加しましょう！</div>';
  } else {
    // スロットを外すオプション
    if(friendSlots[slotIdx]){
      const removeItem=document.createElement('div');
      removeItem.className='friend-pick-item';
      removeItem.style.borderColor='rgba(229,57,53,0.4)';
      removeItem.innerHTML='<div style="font-size:24px;flex-shrink:0;">✖</div><div class="friend-pick-info"><div class="friend-pick-name" style="color:#ef5350;">スロットを外す</div><div class="friend-pick-detail">このスロットを空にする</div></div>';
      removeItem.onclick=()=>{ friendSlots[slotIdx]=null; updateFriendSlots(); document.getElementById('friend-pick-modal').style.display='none'; };
      list.appendChild(removeItem);
    }
    friends.forEach((f,i)=>{
      // すでに別のスロットに入っていればスキップ
      const usedInOther = friendSlots.some((s,si)=>si!==slotIdx&&s&&s.n===f.n);
      if(usedInOther) return;
      const brawler = BRAWLERS.find(b=>b.id===f.b);
      const item=document.createElement('div');
      item.className='friend-pick-item';
      item.innerHTML=`
        <div class="friend-pick-avatar" id="fpick-av-${i}"></div>
        <div class="friend-pick-info">
          <div class="friend-pick-name" style="color:${f.bc||'#fff'}">${f.n}</div>
          <div class="friend-pick-detail">🏆 ${f.t||0}  ${brawler?brawler.name:'?'}</div>
        </div>`;
      item.onclick=()=>{ friendSlots[slotIdx]=f; updateFriendSlots(); document.getElementById('friend-pick-modal').style.display='none'; };
      list.appendChild(item);
      // キャラ描画
      setTimeout(()=>{
        const av=document.getElementById('fpick-av-'+i);
        if(av&&brawler){
          const c=document.createElement('canvas');c.width=40;c.height=40;
          drawCharacterSprite(c,brawler,40); av.appendChild(c);
        } else if(av){ av.innerHTML='<span style="font-size:22px;">👤</span>'; }
      },30);
    });
  }
  document.getElementById('friend-pick-modal').style.display='flex';
}
let _pickingSlot=0;

function closeFriendPick(e){
  if(e.target===document.getElementById('friend-pick-modal'))
    document.getElementById('friend-pick-modal').style.display='none';
}

function updateFriendSlots(){
  for(let i=0;i<3;i++){
    const f=friendSlots[i];
    const av=document.getElementById('fslot-avatar-'+i);
    const nm=document.getElementById('fslot-name-'+i);
    if(!av||!nm) continue;
    if(f){
      av.className='friend-slot-avatar filled';
      av.innerHTML='';
      const brawler=BRAWLERS.find(b=>b.id===f.b);
      const c=document.createElement('canvas');c.width=52;c.height=52;
      if(brawler) setTimeout(()=>drawCharacterSprite(c,brawler,52),30);
      av.appendChild(c);
      // 削除ボタン
      const rmBtn=document.createElement('div');
      rmBtn.className='friend-slot-remove';
      rmBtn.textContent='×';
      rmBtn.onclick=(e)=>{ e.stopPropagation(); friendSlots[i]=null; updateFriendSlots(); };
      av.appendChild(rmBtn);
      nm.className='friend-slot-name filled';
      nm.textContent=f.n;
    } else {
      av.className='friend-slot-avatar empty';
      av.innerHTML='<span style="font-size:22px;color:#444;">＋</span>';
      nm.className='friend-slot-name';
      nm.textContent='追加';
    }
  }
}


// セーブデータをコード（Base64）に変換
function generateSaveCode(){
  const extraUnlocked = unlockedBrawlers.filter(id => !DEFAULT_UNLOCKED.includes(id));
  const data = {
    t: trophies,
    c: coins,
    g: gemCount,
    u: extraUnlocked,
    p: purchases,
    gd: ownedGadgets,
    n: playerName || '',
    d: luckyDrops,
    v: 2
  };
  try {
    // TextEncoder で日本語名も確実にエンコード
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for(let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  } catch(e){
    console.error('save error', e);
    showToast('❌ セーブに失敗しました');
    return '';
  }
}


// ===== FRIEND SYSTEM =====

// フレンドコード = セーブコード + 名前情報
function generateFriendCode(){
  const data = {
    n: playerName || 'PLAYER',
    t: trophies,
    b: selectedBrawler ? selectedBrawler.id : 'sasha',
    bc: selectedBrawler ? selectedBrawler.col : '#e8a020',
    v: 'fc1'
  };
  try { return 'FC:' + btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
  catch(e){ return ''; }
}

function parseFriendCode(code){
  try {
    const raw = code.trim();
    if(!raw.startsWith('FC:')) return null;
    const data = JSON.parse(decodeURIComponent(escape(atob(raw.slice(3)))));
    if(!data.v || data.v !== 'fc1') return null;
    if(!data.n) return null;
    return data;
  } catch(e){ return null; }
}



// ===== HOME PARTY SYSTEM =====
// friendSlots は既存のものを流用（select screen と共有）

function openPartyPick(slotIdx){
  const list = document.getElementById('party-pick-list');
  const title = document.getElementById('party-pick-title');
  title.textContent = `スロット${slotIdx+1}のフレンドを選択`;
  list.innerHTML = '';

  // 外すオプション
  if(friendSlots[slotIdx]){
    const removeItem = document.createElement('div');
    removeItem.className = 'party-pick-item remove-item';
    removeItem.innerHTML = `<div style="font-size:22px;flex-shrink:0;width:42px;text-align:center;">✖</div>
      <div class="ppi-name" style="color:#ef5350;">スロットを外す</div>`;
    removeItem.onclick = () => {
      friendSlots[slotIdx] = null;
      updatePartySlots();
      updateFriendSlots();
      document.getElementById('party-pick-modal').style.display = 'none';
    };
    list.appendChild(removeItem);
  }

  if(friends.length === 0){
    list.innerHTML += '<div style="color:#555;text-align:center;padding:20px;font-size:12px;">フレンドがいません。<br>フレンド画面でコードを交換しよう！</div>';
  } else {
    friends.forEach((f, fi) => {
      // 他スロット使用中はスキップ
      if(friendSlots.some((s,si) => si !== slotIdx && s && s.n === f.n)) return;
      const brawler = BRAWLERS.find(b => b.id === f.b);
      const item = document.createElement('div');
      item.className = 'party-pick-item';
      item.innerHTML = `
        <div class="ppi-avatar" id="ppi-av-${fi}"></div>
        <div>
          <div class="ppi-name" style="color:${f.bc||'#4fc3f7'}">${f.n}</div>
          <div class="ppi-detail">🏆 ${f.t||0}  ${brawler ? brawler.name : '?'}</div>
        </div>`;
      item.onclick = () => {
        friendSlots[slotIdx] = f;
        updatePartySlots();
        updateFriendSlots(); // select screen も更新
        document.getElementById('party-pick-modal').style.display = 'none';
      };
      list.appendChild(item);
      setTimeout(() => {
        const av = document.getElementById('ppi-av-' + fi);
        if(av && brawler){
          const c = document.createElement('canvas');
          c.width = 42; c.height = 42;
          drawCharacterSprite(c, brawler, 42);
          av.appendChild(c);
        } else if(av){
          av.innerHTML = '<div style="font-size:22px;text-align:center;line-height:42px;">👤</div>';
        }
      }, 30);
    });
  }

  document.getElementById('party-pick-modal').style.display = 'flex';
}

function updatePartySlots(){
  // 自分のアバター更新
  const meCanvas = document.getElementById('party-me-canvas');
  const meLabel  = document.getElementById('party-me-label');
  if(meCanvas && selectedBrawler){
    drawCharacterSprite(meCanvas, selectedBrawler, 56);
  }
  if(meLabel) meLabel.textContent = playerName || 'あなた';

  // フレンドスロット3つ更新
  for(let i = 0; i < 3; i++){
    const f = friendSlots[i];
    const avatar = document.getElementById('party-avatar-' + i);
    const label  = document.getElementById('party-label-' + i);
    const slot   = document.getElementById('party-slot-' + i);
    if(!avatar || !label) continue;

    if(f){
      avatar.className = 'party-avatar filled';
      avatar.innerHTML = '';
      // キャラcanvas
      const brawler = BRAWLERS.find(b => b.id === f.b);
      const c = document.createElement('canvas');
      c.width = 56; c.height = 56;
      if(brawler) setTimeout(() => drawCharacterSprite(c, brawler, 56), 30);
      avatar.appendChild(c);
      // 削除ボタン
      const rm = document.createElement('div');
      rm.className = 'party-remove';
      rm.textContent = '×';
      rm.onclick = (e) => {
        e.stopPropagation();
        friendSlots[i] = null;
        updatePartySlots();
        updateFriendSlots();
      };
      avatar.appendChild(rm);
      label.className = 'party-label filled';
      label.textContent = f.n;
      // タップでピック
      slot.onclick = () => openPartyPick(i);
    } else {
      avatar.className = 'party-avatar empty';
      avatar.innerHTML = '<span class="plus-icon">＋</span>';
      label.className = 'party-label';
      label.textContent = '追加';
      slot.onclick = () => openPartyPick(i);
    }
  }
}


// ===== LEVEL SYSTEM =====

function winsNeededForLevel(lv){
  // Lv1→2: 5回, Lv2→3: 10回, Lv3→4: 15回... (5×lv)
  return lv * 5;
}

function addLevelWin(){
  levelWins++;
  const needed = winsNeededForLevel(playerLevel);
  if(levelWins >= needed){
    levelWins = 0;
    playerLevel++;
    saveLevel();
    showLevelUp(playerLevel);
  } else {
    saveLevel();
  }
  updateLevelDisplay();
}

function updateLevelDisplay(){
  const numEl  = document.getElementById('home-level-num');
  const barEl  = document.getElementById('home-level-bar');
  if(numEl) numEl.textContent = playerLevel;
  if(barEl){
    const needed = winsNeededForLevel(playerLevel);
    barEl.style.width = Math.min(100, (levelWins / needed) * 100) + '%';
  }
}

function showLevelUp(lv){
  const toast = document.getElementById('levelup-toast');
  if(!toast) return;
  document.getElementById('lu-level-num').textContent = lv;
  document.getElementById('lu-next-wins').textContent = winsNeededForLevel(lv);
  toast.style.display = 'flex';
  setTimeout(()=>{ toast.style.display='none'; }, 3000);
}

function showLevelInfo(){
  const needed = winsNeededForLevel(playerLevel);
  const remain = needed - levelWins;
  showToast(`⭐ Lv${playerLevel}  次のレベルまであと${remain}回1位`);
}

// ===== ONLINE PRESENCE SYSTEM =====
let _myPresenceRef = null;
let _onlineUsersRef = null;
let _onlineListener = null;

function startOnlinePresence(){
  if(!window._firebaseReady || !window._db) return;
  const db=window._db, refFn=window._ref, setFn=window._set,
        onValueFn=window._onValue, removeFn=window._remove,
        serverTs=window._serverTimestamp, onDiscFn=window._onDisconnect;
  const uid = 'user_' + playerName.replace(/[^a-zA-Z0-9]/g,'_') + '_' + Math.random().toString(36).slice(2,7);
  _myPresenceRef = refFn(db, 'online/' + uid);
  const presenceData = {
    name: playerName || 'PLAYER',
    trophy: trophies,
    brawler: selectedBrawler ? selectedBrawler.id : 'sasha',
    brawlerCol: selectedBrawler ? selectedBrawler.col : '#e8a020',
    ts: serverTs()
  };
  setFn(_myPresenceRef, presenceData);
  onDiscFn(_myPresenceRef).remove();

  // オンラインユーザー監視
  _onlineUsersRef = refFn(db, 'online');
  _onlineListener = onValueFn(_onlineUsersRef, (snapshot)=>{
    const data = snapshot.val() || {};
    updateOnlineUI(data);
  });

  // Firebase設定済み表示更新
  updateFirebaseStatus(true);
}

function updateFirebaseStatus(ready){
  const area = document.getElementById('firebase-status-area');
  if(!area) return;
  if(ready){
    area.innerHTML='<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:rgba(77,235,77,0.1);border:1px solid rgba(77,235,77,0.2);border-radius:8px;font-size:11px;color:#4deb4d;"><span class=\"online-dot\"></span>Firebaseに接続済み</div>';
  }
}

function updateOnlineUI(data){
  const users = Object.values(data);
  const count = users.length;
  const el = document.getElementById('online-count');
  if(el) el.textContent = count;
  const list = document.getElementById('online-users-list');
  if(!list) return;
  list.innerHTML='';
  if(count===0){
    list.innerHTML='<div style="color:#555;font-size:12px;text-align:center;padding:16px;">オンラインのプレイヤーはいません</div>';
    return;
  }
  users.forEach(u=>{
    if(u.name===playerName) return; // 自分を除外
    const brawler = BRAWLERS.find(b=>b.id===u.brawler);
    const div=document.createElement('div');
    div.className='online-user-item';
    const isFriend = friends.some(f=>f.n===u.name);
    div.innerHTML=`
      <div style="width:36px;height:36px;border-radius:50%;background:${u.brawlerCol||'#888'}22;border:1px solid ${u.brawlerCol||'#888'}44;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👤</div>
      <div style="flex:1;">
        <div class="online-user-name" style="color:${u.brawlerCol||'#fff'}">${u.name}${isFriend?' 👥':''}</div>
        <div class="online-user-detail">${brawler?brawler.name:(u.brawler||'?').toUpperCase()}</div>
        <div class="online-user-trophy">🏆 ${u.trophy||0}</div>
      </div>
      <span class="online-dot"></span>`;
    list.appendChild(div);
  });

  // オンラインフレンド
  const onlineFriendList = document.getElementById('online-friends-list');
  if(!onlineFriendList) return;
  onlineFriendList.innerHTML='';
  const onlineFriends = friends.filter(f=>users.some(u=>u.name===f.n));
  if(onlineFriends.length===0){
    onlineFriendList.innerHTML='<div style="color:#555;font-size:12px;text-align:center;padding:8px;">オンラインのフレンドはいません</div>';
  } else {
    onlineFriends.forEach(f=>{
      const brawler=BRAWLERS.find(b=>b.id===f.b);
      const div=document.createElement('div');
      div.className='online-user-item';
      div.style.borderColor='rgba(79,195,247,0.3)';
      div.innerHTML=`<span class="online-dot"></span><div style="flex:1;"><div class="online-user-name" style="color:#4fc3f7">${f.n}</div><div class="online-user-detail">${brawler?brawler.name:'?'}</div><div class="online-user-trophy">🏆 ${f.t||0}</div></div>`;
      onlineFriendList.appendChild(div);
    });
  }
}

function switchFriendTab(tab){
  document.getElementById('tab-content-friend').style.display = tab==='friend'?'flex':'none';
  document.getElementById('tab-content-online').style.display = tab==='online'?'flex':'none';
  const tf=document.getElementById('tab-friend'), to=document.getElementById('tab-online');
  if(tab==='friend'){
    tf.style.background='rgba(255,200,0,0.1)'; tf.style.borderBottomColor='#ffcc00'; tf.style.color='#ffcc00';
    to.style.background='transparent'; to.style.borderBottomColor='transparent'; to.style.color='#666';
  } else {
    to.style.background='rgba(79,195,247,0.1)'; to.style.borderBottomColor='#4fc3f7'; to.style.color='#4fc3f7';
    tf.style.background='transparent'; tf.style.borderBottomColor='transparent'; tf.style.color='#666';
    // Firebase未設定チェック
    if(!window._firebaseReady) updateFirebaseStatus(false);
  }
}

function showFirebaseSetupGuide(){
  document.getElementById('firebase-guide-modal').style.display='flex';
}

// バトル開始/終了時にプレゼンス更新
function updateMyPresence(){
  if(!window._firebaseReady || !_myPresenceRef) return;
  const data = {
    name: playerName||'PLAYER',
    trophy: trophies,
    brawler: selectedBrawler?selectedBrawler.id:'sasha',
    brawlerCol: selectedBrawler?selectedBrawler.col:'#e8a020',
    ts: window._serverTimestamp()
  };
  window._set(_myPresenceRef, data);
}


function openFriends(){
  hideAllScreens();
  document.getElementById('friend-screen').style.display='flex';
  // 自分のコード表示
  const myCode = generateFriendCode();
  document.getElementById('my-friend-code').textContent = myCode;
  buildFriendList();
  // Firebaseが設定済みならオンラインプレゼンス開始
  if(window._firebaseReady && !_myPresenceRef) startOnlinePresence();
  else if(window._firebaseReady) updateMyPresence();
}

function copyFriendCode(){
  const code = document.getElementById('my-friend-code').textContent;
  navigator.clipboard?.writeText(code).catch(()=>{});
  // フォールバック
  const ta=document.createElement('textarea'); ta.value=code; document.body.appendChild(ta);
  ta.select(); document.execCommand('copy'); ta.remove();
  showToast('📋 フレンドコードをコピーしました！');
}

function addFriend(){
  const raw = document.getElementById('friend-add-input').value.trim();
  if(!raw){ showToast('コードを入力してください'); return; }
  const data = parseFriendCode(raw);
  if(!data){ showToast('❌ 無効なフレンドコードです'); return; }
  // 自分自身は追加できない
  if(data.n === playerName){ showToast('自分は追加できません'); return; }
  // 重複チェック
  if(friends.some(f=>f.n===data.n && f.bc===data.bc)){
    showToast('すでにフレンドです'); return;
  }
  // 追加
  friends.push({
    n:  data.n,
    t:  data.t,
    b:  data.b,
    bc: data.bc,
    addedAt: Date.now()
  });
  saveFriends();
  document.getElementById('friend-add-input').value='';
  buildFriendList();
  showToast(`✅ ${data.n} をフレンドに追加しました！`);
}

function removeFriend(idx){
  const name = friends[idx]?.n;
  friends.splice(idx,1);
  saveFriends();
  buildFriendList();
  showToast(`${name} をフレンドから削除しました`);
}

function buildFriendList(){
  const el = document.getElementById('friend-list');
  if(!el) return;
  el.innerHTML='';
  const label = document.getElementById('friend-count-label');
  if(label) label.textContent = friends.length + '人';

  if(friends.length===0){
    el.innerHTML='<div style="color:#555;font-size:13px;padding:16px;text-align:center;">まだフレンドがいません<br>コードを交換して追加しよう！</div>';
    return;
  }

  friends.forEach((f,i)=>{
    const card=document.createElement('div');
    card.className='friend-card';
    // アバター（キャラカラー）
    const brawlerData = BRAWLERS.find(b=>b.id===f.b);
    const col = f.bc || '#888';
    const addedDate = f.addedAt ? new Date(f.addedAt).toLocaleDateString('ja') : '不明';

    card.innerHTML=`
      <div class="friend-avatar" style="background:${col}22;border-color:${col}44;">
        <span style="font-size:28px;">👤</span>
      </div>
      <div class="friend-info">
        <div class="friend-name" style="color:${col}">${f.n}</div>
        <div class="friend-detail">使用キャラ: ${brawlerData?brawlerData.name:(f.b||'—').toUpperCase()}</div>
        <div class="friend-trophy">🏆 ${f.t || 0} トロフィー</div>
        <div class="friend-detail" style="color:#444;">追加日: ${addedDate}</div>
      </div>
      <button class="friend-delete" onclick="removeFriend(${i})">削除</button>`;

    // アバターにキャラ描画
    const canvas = document.createElement('canvas');
    canvas.width=48; canvas.height=48;
    if(brawlerData){
      setTimeout(()=>drawCharacterSprite(canvas,brawlerData,48),30);
    }
    const avatarEl = card.querySelector('.friend-avatar');
    avatarEl.innerHTML='';
    avatarEl.appendChild(canvas);

    el.appendChild(card);
  });
}


// ===== ONLINE RANKING =====

// ゲーム終了時にFirebaseへトロフィー数を投稿
function submitRanking(){
  if(!window._firebaseReady || !window._db) return;
  if(!playerName) return;
  // 名前を安全なキーに変換（日本語対応）
  const key = 'p_' + Array.from(playerName).map(c=>c.charCodeAt(0).toString(16)).join('').slice(0,30);
  const rankRef = window._ref(window._db, 'rankings/' + key);
  window._set(rankRef, {
    name: playerName,
    trophies: trophies,
    brawler: selectedBrawler ? selectedBrawler.id : '',
    brawlerCol: selectedBrawler ? selectedBrawler.col : '#888',
    updatedAt: window._serverTimestamp ? window._serverTimestamp() : Date.now()
  });
}

// ランキング画面を開く
function openRanking(){
  hideAllScreens();
  document.getElementById('ranking-screen').style.display='flex';
  loadRanking();
}

// Firebaseからランキングデータを取得
function loadRanking(){
  const body = document.getElementById('ranking-body');
  if(!body) return;
  if(!window._firebaseReady || !window._db){
    body.innerHTML='<div style="color:#555;font-size:13px;text-align:center;padding:30px;">Firebase未接続のため<br>ランキングを表示できません</div>';
    return;
  }
  body.innerHTML='<div style="color:#555;font-size:13px;text-align:center;padding:30px;">読み込み中...</div>';
  const rankRef = window._ref(window._db, 'rankings');
  window._onValue(rankRef, (snapshot)=>{
    const data = snapshot.val() || {};
    const users = Object.values(data).sort((a,b)=>(b.trophies||0)-(a.trophies||0));
    buildRankingList(users);
  }, {onlyOnce:true});
}

// ランキングリストを描画
function buildRankingList(users){
  const body = document.getElementById('ranking-body');
  body.innerHTML='';
  if(users.length===0){
    body.innerHTML='<div style="color:#555;font-size:13px;text-align:center;padding:30px;">まだランキングデータがありません<br>ゲームをプレイするとここに表示されます！</div>';
    return;
  }
  const header=document.createElement('div');
  header.style.cssText='font-family:"Bebas Neue",sans-serif;font-size:12px;color:#555;letter-spacing:2px;padding:4px 8px;';
  header.textContent='TOP '+Math.min(users.length,50)+' プレイヤー';
  body.appendChild(header);

  users.slice(0,50).forEach((u,i)=>{
    const rank=i+1;
    const isMe=(u.name===playerName);
    const brawler=BRAWLERS.find(b=>b.id===u.brawler);
    const div=document.createElement('div');
    div.className='ranking-item'+(isMe?' me':'');
    let rankIcon=rank, rankClass='';
    if(rank===1){rankIcon='🥇';rankClass='gold';}
    else if(rank===2){rankIcon='🥈';rankClass='silver';}
    else if(rank===3){rankIcon='🥉';rankClass='bronze';}
    div.innerHTML=`
      <div class="ranking-rank ${rankClass}">${rankIcon}</div>
      <div style="width:36px;height:36px;border-radius:50%;background:${u.brawlerCol||'#888'}22;border:1px solid ${u.brawlerCol||'#888'}44;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;" id="rank-av-${i}">👤</div>
      <div style="flex:1;">
        <div class="ranking-name" style="color:${isMe?'#ffcc00':(u.brawlerCol||'#fff')}">${u.name}${isMe?' ◀ あなた':''}</div>
        <div class="ranking-brawler">${brawler?brawler.name:(u.brawler||'—')}</div>
        <div class="ranking-trophy">🏆 ${u.trophies||0}</div>
      </div>`;
    body.appendChild(div);
    if(brawler){
      setTimeout(()=>{
        const av=document.getElementById('rank-av-'+i);
        if(!av) return;
        av.innerHTML='';
        const c=document.createElement('canvas');c.width=36;c.height=36;
        drawCharacterSprite(c,brawler,36);
        av.appendChild(c);
      },30);
    }
  });
}

// コードからセーブデータを復元
function loadFromCode(code){
  try {
    const raw = atob(code.trim());
    const bytes = new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if(typeof data.t !== 'number') throw new Error('invalid');
    trophies         = data.t || 0;
    coins            = data.c || 0;
    gemCount         = data.g || 0;
    unlockedBrawlers = data.u || DEFAULT_UNLOCKED;
    purchases        = data.p || {};
    ownedGadgets     = data.gd || [];
    saveAll();
    updateAllDisplays();
    rebuildSelectScreen();
    return true;
  } catch(e){ return false; }
}

function manualSave(){
  saveAll();
  const code = generateSaveCode();
  if(!code){ showToast('❌ セーブコード生成に失敗しました'); return; }
  showSaveCodeModal(code);
}

function showSaveCodeModal(code){
  const m = document.getElementById('save-code-modal');
  document.getElementById('save-code-text').value = code;
  m.style.display = 'flex';
  m.style.zIndex = '9999'; // 確実に最前面
}

function openLoadModal(){
  document.getElementById('load-code-modal').style.display = 'flex';
  document.getElementById('load-code-input').value = '';
}

function doLoad(){
  const code = document.getElementById('load-code-input').value;
  if(!code){ showToast('コードを入力してください'); return; }
  if(loadFromCode(code)){
    document.getElementById('load-code-modal').style.display = 'none';
    showHome();
    showToast('✅ ロード成功！');
  } else {
    showToast('❌ コードが無効です');
  }
}

function copyCode(){
  const t = document.getElementById('save-code-text');
  t.select();
  document.execCommand('copy');
  showToast('📋 コピーしました！');
}
