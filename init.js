// =========== INITIALIZATION ===========

// ログインボーナス
(function loginBonus(){
  const today = new Date().toDateString();
  const last  = localStorage.getItem('bs_last_login');
  if(!last){
    coins += 1000;
    saveCoins();
    setTimeout(()=>showToast('🎁 初回ボーナス！🪙1000コイン獲得！'),800);
  } else if(last !== today){
    coins += 200;
    saveCoins();
    setTimeout(()=>showToast('📅 ログインボーナス！🪙200コイン獲得！'),800);
  }
  localStorage.setItem('bs_last_login', today);
})();

// 初期画面: 名前未設定なら名前入力画面、設定済みならホーム
if(!playerName){
  document.getElementById('name-screen').style.display='flex';
} else {
  document.getElementById('name-screen').style.display='none';
  document.getElementById('friend-screen').style.display='none';
  const rnm=document.getElementById('rename-modal'); if(rnm) rnm.style.display='none';
  const hnm=document.getElementById('hand-modal');   if(hnm) hnm.style.display='none';
  const fgm=document.getElementById('firebase-guide-modal'); if(fgm) fgm.style.display='none';
  showHome();
}
