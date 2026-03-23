// =========== TOUCH CONTROLS & HAND PREFERENCE ===========

// DOM参照・定数
const moveZone   = document.getElementById('dpad-left');
const attackZone = document.getElementById('dpad-right');
const superZone  = document.getElementById('dpad-super');
const moveKnob   = document.getElementById('move-knob');
const attackKnob = document.getElementById('attack-knob');
const superKnob  = document.getElementById('super-knob');
const superRing  = document.getElementById('super-base-ring');
const STICK_R    = 56;


function selectHand(hand){
  handedness = hand;
  localStorage.setItem('bs_hand', hand);
  const right = document.getElementById('hand-right');
  const left  = document.getElementById('hand-left');
  if(right){
    right.style.borderColor = hand==='right' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    right.style.background  = hand==='right' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const rl = right.querySelectorAll('div');
    if(rl[1]) rl[1].style.color = hand==='right' ? '#ffcc00' : '#aaa';
  }
  if(left){
    left.style.borderColor  = hand==='left' ? 'rgba(255,200,0,0.7)' : 'rgba(255,255,255,0.12)';
    left.style.background   = hand==='left' ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.05)';
    const ll = left.querySelectorAll('div');
    if(ll[1]) ll[1].style.color = hand==='left' ? '#ffcc00' : '#aaa';
  }
}

function applyHandedness(){
  const dpadL = document.getElementById('dpad-left');
  const dpadR = document.getElementById('dpad-right');
  const dpadS = document.getElementById('dpad-super');
  if(!dpadL||!dpadR||!dpadS) return;
  if(handedness === 'right'){
    // 右利き: dpad-left=移動(左), dpad-right=射撃(右)
    dpadL.style.left  = '60px';  dpadL.style.right = '';
    dpadR.style.right = '60px';  dpadR.style.left  = '';
    // 必殺=射撃(右)の真上
    dpadS.style.right = '60px';  dpadS.style.left  = '';
  } else {
    // 左利き: dpad-left=射撃(左), dpad-right=移動(右)
    dpadL.style.left  = '60px';  dpadL.style.right = '';
    dpadR.style.right = '60px';  dpadR.style.left  = '';
    // 必殺=射撃(左)の真上
    dpadS.style.left  = '60px';  dpadS.style.right = '';
  }
}

// 左利き時のスティック入れ替え
const _origMoveZone   = document.getElementById('dpad-left');
const _origAttackZone = document.getElementById('dpad-right');

function getEffectiveMoveZone(){
  return handedness==='left' ? document.getElementById('dpad-right') : document.getElementById('dpad-left');
}
function getEffectiveAttackZone(){
  return handedness==='left' ? document.getElementById('dpad-left') : document.getElementById('dpad-right');
}

function showTouchUI(){
  moveZone.style.display='block';
  attackZone.style.display='block';
  superZone.style.display='block';
  document.getElementById('hint').style.display='none';
  setupTouchControls();
}
function isTouchDevice(){
  return window.matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
}
if(isTouchDevice()) showTouchUI();
window.addEventListener('touchstart',()=>showTouchUI(),{once:true});
// 名前画面の利き手選択状態を初期化
if(document.getElementById('hand-right')) selectHand(handedness);

function clampKnob(dx,dy){
  const len=Math.sqrt(dx*dx+dy*dy);
  if(len>STICK_R){return{x:dx/len*STICK_R,y:dy/len*STICK_R};}
  return{x:dx,y:dy};
}

// ---- 利き手対応タッチセットアップ ----
let superStick = null;
function setupTouchControls(){
  // 利き手に応じてゾーンを決定
  const isLeft = handedness === 'left';
  // 右利き: 左=攻撃(武器), 右=移動
  // 左利き: 左=移動, 右=攻撃
  // 右利き: 左=移動, 右=射撃 / 左利き: 右=移動, 左=射撃
  const moveEl   = document.getElementById(isLeft ? 'dpad-right' : 'dpad-left');
  const attackEl = document.getElementById(isLeft ? 'dpad-left'  : 'dpad-right');
  const superEl  = document.getElementById('dpad-super');
  if(!moveEl||!attackEl||!superEl) return;

  // 位置を適用
  applyHandedness();

  // 既存リスナーをdata属性で管理（replaceElを使わない）
  // abortControllerで前のリスナーを無効化
  // AbortController フォールバック（iOS13以下対応）
  if(window._touchAC) { try{ window._touchAC.abort(); }catch(e){} }
  let sig;
  if(typeof AbortController !== 'undefined'){
    window._touchAC = new AbortController();
    sig = { signal: window._touchAC.signal, passive: false };
  } else {
    // フォールバック：古いiOSではsignal非対応なのでpassive:falseのみ
    window._touchAC = null;
    sig = { passive: false };
    // 手動でリスナーを除去（要素を置き換え）
    const _replace = el => { const n=el.cloneNode(true); el.parentNode.replaceChild(n,el); return n; };
    const newMove   = _replace(moveEl);
    const newAttack = _replace(attackEl);
    const newSuper  = _replace(superEl);
    Object.assign(moveEl,   {addEventListener: newMove.addEventListener.bind(newMove)});
    Object.assign(attackEl, {addEventListener: newAttack.addEventListener.bind(newAttack)});
    Object.assign(superEl,  {addEventListener: newSuper.addEventListener.bind(newSuper)});
  }

  // ---- MOVE ----
  moveEl.addEventListener('touchstart', e=>{
    e.preventDefault();
    const t=e.changedTouches[0];
    moveStick.tid=t.identifier; moveStick.ox=t.clientX; moveStick.oy=t.clientY;
    moveKnob.style.left='50%'; moveKnob.style.top='50%'; moveKnob.style.transform='translate(-50%,-50%)';
  }, sig);
  moveEl.addEventListener('touchmove', e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier!==moveStick.tid) continue;
      const raw={x:t.clientX-moveStick.ox, y:t.clientY-moveStick.oy};
      const c=clampKnob(raw.x,raw.y);
      moveKnob.style.left=(90+c.x)+'px'; moveKnob.style.top=(90+c.y)+'px'; moveKnob.style.transform='translate(-50%,-50%)';
      moveStick.dx=c.x/STICK_R; moveStick.dy=c.y/STICK_R;
    }
  }, sig);
  const resetM=()=>{
    moveStick.tid=null; moveStick.dx=0; moveStick.dy=0;
    moveKnob.style.left='50%'; moveKnob.style.top='50%'; moveKnob.style.transform='translate(-50%,-50%)';
  };
  moveEl.addEventListener('touchend',    e=>{e.preventDefault(); resetM();}, sig);
  moveEl.addEventListener('touchcancel', e=>{e.preventDefault(); resetM();}, sig);

  // ---- FIRE BUTTON ----
  let _fireTimer = null;
  attackEl.addEventListener('touchstart', e=>{
    e.preventDefault();
    attackStick.active = true;
    try{ playerShoot(); }catch(err){}
    _fireTimer = setInterval(()=>{ if(attackStick.active) try{ playerShoot(); }catch(err){} }, 350);
    attackKnob.style.transform='translate(-50%,-50%) scale(0.85)';
  }, sig);
  const resetA=()=>{
    attackStick.active = false;
    if(_fireTimer){ clearInterval(_fireTimer); _fireTimer=null; }
    attackKnob.style.transform='translate(-50%,-50%)';
  };
  attackEl.addEventListener('touchend',    e=>{e.preventDefault(); resetA();}, sig);
  attackEl.addEventListener('touchcancel', e=>{e.preventDefault(); resetA();}, sig);

  // ---- SUPER ----
  superEl.addEventListener('touchstart', e=>{
    e.preventDefault();
    const t=e.changedTouches[0];
    superStick={tid:t.identifier, ox:t.clientX, oy:t.clientY};
    superKnob.style.left='50%'; superKnob.style.top='50%'; superKnob.style.transform='translate(-50%,-50%)';
  }, sig);
  superEl.addEventListener('touchmove', e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(!superStick||t.identifier!==superStick.tid) continue;
      const raw={x:t.clientX-superStick.ox, y:t.clientY-superStick.oy};
      const c=clampKnob(raw.x,raw.y);
      superKnob.style.left=(65+c.x)+'px'; superKnob.style.top=(65+c.y)+'px'; superKnob.style.transform='translate(-50%,-50%)';
      if(Math.sqrt(raw.x*raw.x+raw.y*raw.y)>10){
        const angle=Math.atan2(raw.y,raw.x);
        if(state.running&&state.player) state.player.facing=angle;
      }
    }
  }, sig);
  const resetS=()=>{
    try{ playerSuper(); }catch(e){}
    superStick=null;
    superKnob.style.left='50%'; superKnob.style.top='50%'; superKnob.style.transform='translate(-50%,-50%)';
  };
  superEl.addEventListener('touchend',    e=>{e.preventDefault(); resetS();}, sig);
  superEl.addEventListener('touchcancel', e=>{e.preventDefault(); resetS();}, sig);
}
// setupTouchControls は showTouchUI() 経由で呼び出される
