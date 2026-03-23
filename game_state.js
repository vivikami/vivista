// =========== GAME STATE & SELECT SCREEN ===========
// ===== BUILD SELECT SCREEN =====
let selectedBrawler = null;
const grid = document.getElementById('char-grid');
const gridWrap = document.getElementById('grid-wrap');

function scrollGrid(dir) {
  const rowH = 180;
  gridWrap.scrollBy({top: dir * rowH, behavior:'smooth'});
}
gridWrap.addEventListener('scroll', () => {
  const total = Math.ceil(BRAWLERS.length / 4);
  const row = Math.round(gridWrap.scrollTop / 170) + 1;
  document.getElementById('scroll-pos').textContent = `${Math.min(row, total)} / ${total}`;
});

// レアリティ倍率でステータスを強化してから表示
const RARITY_MULT = {
  'トロフィーロード': 1.0,
  'レア':           1.15,
  'スーパーレア':   1.30,
  'エピック':       1.50,
  'ミシック':       1.70,
  'レジェンダリー': 2.00,
  'ウルトラレジェンダリー': 2.00
};
const RARITY_ORDER = ['ウルトラレジェンダリー','レジェンダリー','ミシック','エピック','スーパーレア','レア','トロフィーロード'];

// ステータスに倍率を適用（1回だけ）
BRAWLERS.forEach(b => {
  if(!b._rarityApplied) {
    const m = RARITY_MULT[b.rarity] || 1.0;
    b.hp    = Math.round(b.hp    * m);
    b.dmg   = Math.round(b.dmg   * m);
    b.superDmg = Math.round(b.superDmg * m);
    b.speed = Math.round(b.speed * (1 + (m-1)*0.4));
    b.maxHp = b.hp;
    b._rarityApplied = true;
  }
});

// レア度順にソート
const SORTED_BRAWLERS = [...BRAWLERS].sort(
  (a,b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
);


// ===== GAME STATE VARIABLES (全て先に宣言) =====
const DEFAULT_UNLOCKED = ['darryl','colt','nita'];
let ownedGadgets    = JSON.parse(localStorage.getItem('bs_gadgets')||'[]');
function saveGadgets(){ localStorage.setItem('bs_gadgets', JSON.stringify(ownedGadgets)); }
function hasGadget(id){ return ownedGadgets.includes(id); }
let handedness      = localStorage.getItem('bs_hand') || 'right'; // 'right' or 'left'
let trophies        = parseInt(localStorage.getItem('bs_trophies')||'0');
let coins           = parseInt(localStorage.getItem('bs_coins')||'0');
let gemCount        = parseInt(localStorage.getItem('bs_gems')||'0');
let luckyDrops      = parseInt(localStorage.getItem('bs_drops')||'0');
let purchases       = JSON.parse(localStorage.getItem('bs_purchases')||'{}');
let unlockedBrawlers= JSON.parse(localStorage.getItem('bs_unlocked')||JSON.stringify(DEFAULT_UNLOCKED));
let questProgress   = JSON.parse(localStorage.getItem('bs_quests')||'{}');
let questCompleted  = JSON.parse(localStorage.getItem('bs_quests_done')||'[]');
let playerName      = localStorage.getItem('bs_player_name') || '';
let friends         = JSON.parse(localStorage.getItem('bs_friends')||'[]');
let playerLevel     = parseInt(localStorage.getItem('bs_level')||'1');
let levelWins       = parseInt(localStorage.getItem('bs_level_wins')||'0');
function saveLevel(){ localStorage.setItem('bs_level',String(playerLevel)); localStorage.setItem('bs_level_wins',String(levelWins)); }
let friendSlots     = [null, null, null];
function saveTrophies(){ localStorage.setItem('bs_trophies', String(trophies)); }
function saveCoins(){    localStorage.setItem('bs_coins',    String(coins)); }
function saveGems(){     localStorage.setItem('bs_gems',     String(gemCount)); }
function saveDrops(){    localStorage.setItem('bs_drops',    String(luckyDrops)); }
function saveFriends(){  localStorage.setItem('bs_friends',  JSON.stringify(friends)); }
// ============================================

// セレクト画面は後で構築（unlockedBrawlers宣言後）

// ===== TOUCH STATE (game_engine.jsより前に必要) =====
const moveStick   = {tid:null, ox:0, oy:0, dx:0, dy:0};
const attackStick = {tid:null, ox:0, oy:0, dx:0, dy:0, active:false, hasAimed:false};
