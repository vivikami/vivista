// =========== CANVAS DRAW HELPERS ===========
// ===== CANVAS DRAW HELPERS FOR CHARACTER CARD =====
function drawCharacterSprite(canvas, brawler, size) {
  const ctx = canvas.getContext('2d');
  canvas.width = size; canvas.height = size;
  ctx.clearRect(0, 0, size, size);
  const cx = size/2, cy = size*0.36, r = size*0.20;
  const id = brawler.id;

  // --- リアル描画ヘルパー ---
  function shadow(){
    const g=ctx.createRadialGradient(cx,size*0.96,0,cx,size*0.96,r*0.9);
    g.addColorStop(0,'rgba(0,0,0,0.35)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,size*0.95,r*0.9,r*0.16,0,0,Math.PI*2); ctx.fill();
  }
  function body(col, sx=0.62, sy=0.68, offY=0){
    // グラデーションボディ（立体感）
    const g=ctx.createLinearGradient(cx-r*sx,cy,cx+r*sx,cy);
    g.addColorStop(0, shadeColor(col,-25));
    g.addColorStop(0.35, col);
    g.addColorStop(1, shadeColor(col,-40));
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.ellipse(cx,cy+r*0.50+offY,r*sx,r*sy,0,0,Math.PI*2); ctx.fill();
    // ハイライト
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(cx-r*sx*0.25,cy+r*0.1+offY,r*sx*0.4,r*sy*0.35,0,0,Math.PI*2); ctx.fill();
  }
  function head(skin, hR=1.0, offX=0, offY=0){
    const g=ctx.createRadialGradient(cx+offX-r*0.2,cy-r*0.35+offY,0,cx+offX,cy-r*0.2+offY,r*hR);
    g.addColorStop(0,lightenColor(skin,20)); g.addColorStop(0.6,skin); g.addColorStop(1,shadeColor(skin,15));
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(cx+offX,cy-r*0.2+offY,r*hR,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=size*0.01; ctx.stroke();
  }
  function hair(col, hR=0.72, offX=0, offY=0){
    const g=ctx.createLinearGradient(cx-r*hR+offX,cy-r*1.1+offY,cx+r*hR+offX,cy-r*0.38+offY);
    g.addColorStop(0,lightenColor(col,15)); g.addColorStop(1,shadeColor(col,20));
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(cx+offX,cy-r*0.38+offY,r*hR,Math.PI,0); ctx.fill();
  }
  function eyes(offX=0, offY=0){
    // 白目（グラデーション）
    [[-r*0.28,0],[r*0.28,0]].forEach(([ex,ey])=>{
      const g=ctx.createRadialGradient(cx+ex+offX-r*0.04,cy-r*0.2+offY,0,cx+ex+offX,cy-r*0.15+offY,r*0.2);
      g.addColorStop(0,'#fff'); g.addColorStop(1,'#ddd');
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx+ex+offX,cy-r*0.15+offY,r*0.18,r*0.22,0,0,Math.PI*2); ctx.fill();
    });
    // 瞳
    ctx.fillStyle=brawler.col||'#1a237e';
    ctx.beginPath(); ctx.arc(cx-r*0.26+offX,cy-r*0.15+offY,r*0.12,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+r*0.26+offX,cy-r*0.15+offY,r*0.12,0,Math.PI*2); ctx.fill();
    // 黒目
    ctx.fillStyle='#0d0d1a';
    ctx.beginPath(); ctx.arc(cx-r*0.25+offX,cy-r*0.15+offY,r*0.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+r*0.25+offX,cy-r*0.15+offY,r*0.08,0,Math.PI*2); ctx.fill();
    // ハイライト
    ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.arc(cx-r*0.22+offX,cy-r*0.19+offY,r*0.045,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+r*0.28+offX,cy-r*0.19+offY,r*0.045,0,Math.PI*2); ctx.fill();
  }
  function weapon(){ drawWeaponPreview(ctx,brawler,cx,cy,r,size); }

  // 色のシェーディングヘルパー
  function shadeColor(c,pct){
    if(!c||!c.startsWith('#')) return c||'#888';
    const n=parseInt(c.replace('#',''),16),r2=(n>>16)&0xff,g2=(n>>8)&0xff,b2=n&0xff;
    return `rgb(${Math.max(0,r2-pct)},${Math.max(0,g2-pct)},${Math.max(0,b2-pct)})`;
  }
  function lightenColor(c,pct){
    if(!c||!c.startsWith('#')) return c||'#888';
    const n=parseInt(c.replace('#',''),16),r2=(n>>16)&0xff,g2=(n>>8)&0xff,b2=n&0xff;
    return `rgb(${Math.min(255,r2+pct)},${Math.min(255,g2+pct)},${Math.min(255,b2+pct)})`;
  }


  function legs(col, skin){
    // 太もも～すね
    const lg=ctx.createLinearGradient(cx-r*0.6,cy+r*0.8,cx+r*0.6,cy+r*2.2);
    lg.addColorStop(0,shadeColor(col,10)); lg.addColorStop(1,shadeColor(col,35));
    ctx.fillStyle=lg;
    ctx.beginPath(); ctx.roundRect(cx-r*0.56,cy+r*0.75,r*0.40,r*1.05,r*0.12); ctx.fill();
    ctx.beginPath(); ctx.roundRect(cx+r*0.16,cy+r*0.75,r*0.40,r*1.05,r*0.12); ctx.fill();
    // ひざハイライト
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(cx-r*0.36,cy+r*1.05,r*0.13,r*0.09,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+r*0.36,cy+r*1.05,r*0.13,r*0.09,0,0,Math.PI*2); ctx.fill();
    // 靴
    ctx.fillStyle=shadeColor(col,55);
    ctx.beginPath(); ctx.roundRect(cx-r*0.62,cy+r*1.72,r*0.52,r*0.22,r*0.09); ctx.fill();
    ctx.beginPath(); ctx.roundRect(cx+r*0.10,cy+r*1.72,r*0.52,r*0.22,r*0.09); ctx.fill();
    // 靴先端（丸め）
    ctx.beginPath(); ctx.ellipse(cx-r*0.36,cy+r*1.83,r*0.15,r*0.1,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+r*0.36,cy+r*1.83,r*0.15,r*0.1,0,0,Math.PI*2); ctx.fill();
    // 靴ハイライト
    ctx.fillStyle='rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(cx-r*0.44,cy+r*1.74,r*0.12,r*0.05,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+r*0.28,cy+r*1.74,r*0.12,r*0.05,0,0,Math.PI*2); ctx.fill();
  }
  function arms(col, skin){
    const ag=ctx.createLinearGradient(cx-r*1.05,cy,cx+r*1.05,cy+r*0.55);
    ag.addColorStop(0,shadeColor(col,20)); ag.addColorStop(0.5,col); ag.addColorStop(1,shadeColor(col,35));
    ctx.fillStyle=ag;
    // 左腕（上腕〜前腕）
    ctx.beginPath(); ctx.roundRect(cx-r*1.05,cy+r*0.0,r*0.36,r*0.68,r*0.14); ctx.fill();
    // 右腕
    ctx.beginPath(); ctx.roundRect(cx+r*0.69,cy+r*0.0,r*0.36,r*0.68,r*0.14); ctx.fill();
    // 手（グー）
    const hg1=ctx.createRadialGradient(cx-r*0.88,cy+r*0.66,0,cx-r*0.88,cy+r*0.66,r*0.22);
    hg1.addColorStop(0,lightenColor(skin,15)); hg1.addColorStop(1,shadeColor(skin,10));
    ctx.fillStyle=hg1;
    ctx.beginPath(); ctx.arc(cx-r*0.88,cy+r*0.68,r*0.21,0,Math.PI*2); ctx.fill();
    const hg2=ctx.createRadialGradient(cx+r*0.88,cy+r*0.66,0,cx+r*0.88,cy+r*0.66,r*0.22);
    hg2.addColorStop(0,lightenColor(skin,15)); hg2.addColorStop(1,shadeColor(skin,10));
    ctx.fillStyle=hg2;
    ctx.beginPath(); ctx.arc(cx+r*0.88,cy+r*0.68,r*0.21,0,Math.PI*2); ctx.fill();
    // 指の線
    ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=r*0.04;
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.moveTo(cx-r*1.0+i*r*0.1,cy+r*0.62); ctx.lineTo(cx-r*1.0+i*r*0.1,cy+r*0.75); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.77+i*r*0.1,cy+r*0.62); ctx.lineTo(cx+r*0.77+i*r*0.1,cy+r*0.75); ctx.stroke();
    }
  }

  shadow();

  // キャラ別個性的イラスト
  switch(id){
    // ===== トロフィーロード =====
    case 'sasha':
      legs(brawler.col, brawler.skinColor);
      arms(brawler.col, brawler.skinColor);
      body(brawler.col,0.62,0.68); head(brawler.skinColor); hair(brawler.hairColor,0.75);
      ctx.strokeStyle=brawler.hairColor; ctx.lineWidth=r*0.26;
      ctx.beginPath(); ctx.moveTo(cx+r*0.55,cy-r*0.55); ctx.quadraticCurveTo(cx+r*1.1,cy-r*0.2,cx+r*0.8,cy+r*0.3); ctx.stroke();
      eyes(); weapon(); break;

    // ===== レア =====
    case 'valt': // デュアルピストル・スリムな体型
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.52,0.95);
      // コート
      ctx.fillStyle=brawler.col; ctx.beginPath(); ctx.moveTo(cx-r*0.65,cy+r*0.1); ctx.lineTo(cx-r*0.85,cy+r*1.5); ctx.lineTo(cx+r*0.85,cy+r*1.5); ctx.lineTo(cx+r*0.65,cy+r*0.1); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.92); hair(brawler.hairColor,0.7);
      // ハット
      ctx.fillStyle='#1a1a2e'; ctx.fillRect(cx-r*0.85,cy-r*1.0,r*1.7,r*0.18); ctx.beginPath(); ctx.roundRect(cx-r*0.55,cy-r*1.8,r*1.1,r*0.85,4); ctx.fill();
      eyes(); weapon(); break;

    case 'nina': // パワーバンド・活発な女の子
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.65,0.82); head(brawler.skinColor,0.95); hair(brawler.hairColor,0.78);
      // ツインテール
      ctx.strokeStyle=brawler.hairColor; ctx.lineWidth=r*0.25;
      ctx.beginPath(); ctx.moveTo(cx-r*0.5,cy-r*0.55); ctx.quadraticCurveTo(cx-r*1.0,cy-r*0.1,cx-r*0.85,cy+r*0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.5,cy-r*0.55); ctx.quadraticCurveTo(cx+r*1.0,cy-r*0.1,cx+r*0.85,cy+r*0.5); ctx.stroke();
      eyes(); weapon(); break;

    case 'mira': // アイスニードル・クールな女性
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.58,0.88);
      // 氷のオーラ
      ctx.strokeStyle='rgba(0,188,212,0.4)'; ctx.lineWidth=r*0.15;
      for(let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(cx,cy,r*(1.6+i*0.3),0,Math.PI*2); ctx.stroke(); }
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72);
      eyes(); weapon(); break;

    case 'wave': // ウォーターキャノン・青い髪
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.65,0.85);
      // 水の飛沫
      ctx.fillStyle='rgba(3,169,244,0.5)';
      for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*0.5,r*0.12,0,Math.PI*2); ctx.fill(); }
      head(brawler.skinColor,0.92); hair(brawler.hairColor,0.74);
      eyes(); weapon(); break;

    case 'terra': // アースハンマー・がっしり体型
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.78,1.0);
      // 鎧プレート
      ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.roundRect(cx-r*0.55,cy+r*0.0,r*1.1,r*0.5,4); ctx.fill();
      head(brawler.skinColor,1.05); hair(brawler.hairColor,0.75);
      eyes(); weapon(); break;

    case 'lumi': // 光弾ランチャー・明るい子
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.84);
      // 光のオーラ
      ctx.fillStyle='rgba(255,241,118,0.2)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.7);
      eyes(); weapon(); break;

    case 'flint': // フリントロック・帽子キャラ
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.65,0.88);
      head(brawler.skinColor,0.92); hair(brawler.hairColor,0.7);
      // 三角帽
      ctx.fillStyle='#3e2723'; ctx.beginPath(); ctx.moveTo(cx,cy-r*1.85); ctx.lineTo(cx-r*0.9,cy-r*0.95); ctx.lineTo(cx+r*0.9,cy-r*0.95); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#ffca28'; ctx.fillRect(cx-r*0.9,cy-r*1.05,r*1.8,r*0.15);
      eyes(); weapon(); break;

    // ===== スーパーレア =====
    case 'rock': // ダブルバレル・筋肉タンク
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.88,1.05);
      // 筋肉腕
      ctx.fillStyle=brawler.skinColor; ctx.beginPath(); ctx.ellipse(cx-r*1.05,cy+r*0.3,r*0.38,r*0.52,0.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*1.05,cy+r*0.3,r*0.38,r*0.52,-0.2,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor,1.0); hair(brawler.hairColor,0.72);
      eyes(); weapon(); break;

    case 'flare': // ロケットランチャー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.9);
      // ヘルメット風ヘア
      ctx.fillStyle=brawler.hairColor; ctx.beginPath(); ctx.arc(cx,cy-r*0.2,r*1.05,Math.PI,0); ctx.fill();
      ctx.fillStyle='#ffd54f'; ctx.fillRect(cx-r*0.3,cy-r*1.2,r*0.6,r*0.12);
      head(brawler.skinColor,0.88); eyes(); weapon(); break;

    case 'tesla': // スパークコイル・発明家少女
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.85);
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.7);
      // ゴーグル
      ctx.fillStyle='#ff8a65'; ctx.beginPath(); ctx.ellipse(cx-r*0.3,cy-r*0.18,r*0.22,r*0.18,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*0.3,cy-r*0.18,r*0.22,r*0.18,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#555'; ctx.lineWidth=r*0.08; ctx.beginPath(); ctx.moveTo(cx-r*0.08,cy-r*0.18); ctx.lineTo(cx+r*0.08,cy-r*0.18); ctx.stroke();
      weapon(); break;

    case 'bonny': // ペッパーキャノン・海賊帽
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.65,0.87);
      head(brawler.skinColor,0.92); hair(brawler.hairColor,0.7);
      // 海賊帽
      ctx.fillStyle='#1a1a1a'; ctx.fillRect(cx-r*0.85,cy-r*1.0,r*1.7,r*0.16); ctx.beginPath(); ctx.roundRect(cx-r*0.5,cy-r*1.7,r*1.0,r*0.75,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+r*0.1,cy-r*1.35,r*0.15,0,Math.PI*2); ctx.fill(); // 骸骨
      eyes(); weapon(); break;

    case 'rixo': // バウンスガン・ヘッドフォン
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      head(brawler.skinColor,0.9);
      // ヘッドフォン
      ctx.strokeStyle='#004d40'; ctx.lineWidth=r*0.22; ctx.beginPath(); ctx.arc(cx,cy-r*0.25,r*0.85,-Math.PI*0.9,Math.PI*1.9); ctx.stroke();
      ctx.fillStyle='#26a69a'; ctx.beginPath(); ctx.arc(cx-r*0.85,cy-r*0.25,r*0.28,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.85,cy-r*0.25,r*0.28,0,Math.PI*2); ctx.fill();
      hair(brawler.hairColor,0.68); eyes(); weapon(); break;

    case 'flora': // ダブルパンチ・緑の植物系
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.82,1.0);
      // 葉っぱ飾り
      ctx.fillStyle='#2e7d32';
      for(let i=0;i<4;i++){ const a=-Math.PI*0.5+i*Math.PI*0.5; ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*r*1.1,cy+Math.sin(a)*r*0.2,r*0.22,r*0.42,a,0,Math.PI*2); ctx.fill(); }
      head(brawler.skinColor,0.95); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'dack': // デュアルショットガン・ロボット
      // ロボット足
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(cx-r*0.56,cy+r*0.75,r*0.38,r*1.0,r*0.1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.18,cy+r*0.75,r*0.38,r*1.0,r*0.1); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*0.62,cy+r*1.72,r*0.5,r*0.22,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.12,cy+r*1.72,r*0.5,r*0.22,r*0.08); ctx.fill();
      // メタルボディ
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*0.75,cy+r*0.05,r*1.5,r*1.05,r*0.15); ctx.fill();
      ctx.fillStyle='#78909c'; ctx.beginPath(); ctx.roundRect(cx-r*0.6,cy+r*0.15,r*1.2,r*0.75,r*0.1); ctx.fill();
      // ロボット頭
      ctx.fillStyle='#607d8b'; ctx.beginPath(); ctx.roundRect(cx-r*0.8,cy-r*1.1,r*1.6,r*1.0,r*0.12); ctx.fill();
      ctx.fillStyle='#e040fb'; ctx.beginPath(); ctx.ellipse(cx-r*0.3,cy-r*0.7,r*0.2,r*0.2,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*0.3,cy-r*0.7,r*0.2,r*0.2,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(cx-r*0.5,cy-r*0.42,r*1.0,r*0.12);
      weapon(); break;

    case 'kuro': // シャドウブレード・黒装束
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#1a1a1a',0.58,0.92);
      // マント
      ctx.fillStyle='#212121'; ctx.beginPath(); ctx.moveTo(cx,cy-r*0.1); ctx.lineTo(cx-r*1.1,cy+r*1.5); ctx.lineTo(cx+r*1.1,cy+r*1.5); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.85); hair(brawler.hairColor,0.7);
      // マスク
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(cx-r*0.55,cy-r*0.3,r*1.1,r*0.3,r*0.15); ctx.fill();
      ctx.fillStyle='#e0e0e0'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'blast': // グレネードランチャー・爆発屋
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.68,0.92);
      // 爆発マーク入りベスト
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(cx-r*0.6,cy+r*0.1,r*1.2,r*0.72,r*0.1); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.font=`bold ${r*0.6}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('💥',cx,cy+r*0.45);
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'echo': // ソナーガン・音楽系
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      head(brawler.skinColor,0.9);
      // ヘッドフォン+音符
      ctx.strokeStyle='#311b92'; ctx.lineWidth=r*0.2; ctx.beginPath(); ctx.arc(cx,cy-r*0.28,r*0.88,-Math.PI*0.85,Math.PI*1.85); ctx.stroke();
      ctx.fillStyle='#7c4dff'; ctx.beginPath(); ctx.arc(cx-r*0.88,cy-r*0.28,r*0.25,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.88,cy-r*0.28,r*0.25,0,Math.PI*2); ctx.fill();
      hair(brawler.hairColor,0.68); eyes(); weapon(); break;

    case 'kira': // スターブレード・星使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.88);
      // 星のオーラ
      ctx.fillStyle='rgba(249,168,37,0.2)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.fill();
      // 星アクセント
      for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; ctx.fillStyle='rgba(255,241,118,0.6)'; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*1.25,cy+Math.sin(a)*r*0.8,r*0.1,0,Math.PI*2); ctx.fill(); }
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'forge': // マグマキャノン・鍛冶屋
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.82,1.0);
      // エプロン
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.moveTo(cx-r*0.5,cy+r*0.1); ctx.lineTo(cx-r*0.5,cy+r*1.2); ctx.lineTo(cx+r*0.5,cy+r*1.2); ctx.lineTo(cx+r*0.5,cy+r*0.1); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.98); hair(brawler.hairColor,0.72);
      // アゴひげ
      ctx.fillStyle=brawler.hairColor; ctx.beginPath(); ctx.arc(cx,cy+r*0.08,r*0.45,0,Math.PI); ctx.fill();
      eyes(); weapon(); break;

    // ===== エピック =====
    case 'aria': // スナイパーライフル・エレガント
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.55,0.92);
      // ドレス裾
      ctx.fillStyle=brawler.col; ctx.beginPath(); ctx.moveTo(cx-r*0.55,cy+r*0.4); ctx.quadraticCurveTo(cx-r*1.0,cy+r*1.4,cx,cy+r*1.5); ctx.quadraticCurveTo(cx+r*1.0,cy+r*1.4,cx+r*0.55,cy+r*0.4); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.88); hair(brawler.hairColor,0.7);
      // リボン
      ctx.fillStyle=brawler.col; ctx.beginPath(); ctx.moveTo(cx,cy-r*0.85); ctx.lineTo(cx-r*0.45,cy-r*1.2); ctx.lineTo(cx,cy-r*1.0); ctx.lineTo(cx+r*0.45,cy-r*1.2); ctx.closePath(); ctx.fill();
      eyes(); weapon(); break;

    case 'volta': // サンダーガン・電撃使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.9);
      // 稲妻エフェクト
      ctx.strokeStyle='rgba(255,235,59,0.6)'; ctx.lineWidth=r*0.12;
      ctx.beginPath(); ctx.moveTo(cx-r*0.5,cy-r*1.5); ctx.lineTo(cx-r*0.1,cy-r*0.7); ctx.lineTo(cx-r*0.4,cy-r*0.5); ctx.lineTo(cx,cy); ctx.stroke();
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72);
      // 立った電撃ヘア
      ctx.fillStyle=brawler.hairColor; for(let i=-1;i<=1;i++){ ctx.beginPath(); ctx.moveTo(cx+i*r*0.25,cy-r*0.9); ctx.lineTo(cx+i*r*0.4,cy-r*1.45); ctx.lineWidth=r*0.18; ctx.strokeStyle=brawler.hairColor; ctx.stroke(); }
      eyes(); weapon(); break;

    case 'ivy': // ソーンウィップ・自然系少女
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.86);
      // ツタの装飾
      ctx.strokeStyle='#1b5e20'; ctx.lineWidth=r*0.1;
      ctx.beginPath(); ctx.moveTo(cx-r*0.65,cy+r*1.3); ctx.bezierCurveTo(cx-r*1.1,cy+r*0.5,cx-r*0.8,cy-r*0.1,cx-r*0.65,cy+r*0.1); ctx.stroke();
      ctx.fillStyle='#388e3c'; for(let i=0;i<4;i++){ ctx.beginPath(); ctx.ellipse(cx-r*(0.65+i*0.1),cy+r*(1.1-i*0.35),r*0.15,r*0.24,i*0.4,0,Math.PI*2); ctx.fill(); }
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'aurora': // オーロラウィング・幻想系
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      // 翼
      ctx.fillStyle='rgba(128,203,196,0.45)';
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.2); ctx.bezierCurveTo(cx-r*1.8,cy-r*0.5,cx-r*1.5,cy-r*1.2,cx-r*0.3,cy-r*0.4); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.2); ctx.bezierCurveTo(cx+r*1.8,cy-r*0.5,cx+r*1.5,cy-r*1.2,cx+r*0.3,cy-r*0.4); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.7); eyes(); weapon(); break;

    case 'punk': // エレキギター・パンクロッカー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      head(brawler.skinColor,0.9);
      // トサカヘア
      ctx.fillStyle=brawler.hairColor;
      ctx.beginPath(); ctx.moveTo(cx-r*0.3,cy-r*0.9); ctx.lineTo(cx-r*0.1,cy-r*1.7); ctx.lineTo(cx+r*0.1,cy-r*1.7); ctx.lineTo(cx+r*0.3,cy-r*0.9); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#ff80ab'; ctx.beginPath(); ctx.arc(cx,cy-r*1.5,r*0.15,0,Math.PI*2); ctx.fill();
      eyes();
      // 鼻ピアス
      ctx.fillStyle='#silver'; ctx.strokeStyle='#ccc'; ctx.lineWidth=r*0.06; ctx.beginPath(); ctx.arc(cx,cy,r*0.12,-Math.PI*0.8,Math.PI*1.8); ctx.stroke();
      weapon(); break;

    case 'vex': // ヘックスボルト・アサシン
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#1a2020',0.58,0.92);
      // フード
      ctx.fillStyle='#1a2020'; ctx.beginPath(); ctx.arc(cx,cy-r*0.15,r*1.1,Math.PI*1.1,Math.PI*1.9); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx-r*0.98,cy-r*0.15); ctx.lineTo(cx-r*0.7,cy+r*0.5); ctx.lineTo(cx+r*0.7,cy+r*0.5); ctx.lineTo(cx+r*0.98,cy-r*0.15); ctx.closePath(); ctx.fill();
      head('#b0bec5',0.82);
      // マスク目
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(cx-r*0.55,cy-r*0.28,r*1.1,r*0.28,r*0.12); ctx.fill();
      ctx.fillStyle='#4fc3f7'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.14,r*0.12,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.22,cy-r*0.14,r*0.12,0,Math.PI*2); ctx.fill();
      weapon(); break;

    // ===== ミシック =====
    case 'grave': // 魔法のシャベル・アンデッド
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#4a148c',0.62,0.9);
      // コート
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.moveTo(cx-r*0.62,cy+r*0.2); ctx.lineTo(cx-r*0.9,cy+r*1.5); ctx.lineTo(cx+r*0.9,cy+r*1.5); ctx.lineTo(cx+r*0.62,cy+r*0.2); ctx.closePath(); ctx.fill();
      head(brawler.skinColor,0.9);
      // 骸骨顔
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.ellipse(cx-r*0.25,cy-r*0.18,r*0.2,r*0.22,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*0.25,cy-r*0.18,r*0.2,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=r*0.08; for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(cx+i*r*0.18,cy+r*0.08); ctx.lineTo(cx+i*r*0.18,cy+r*0.22); ctx.stroke(); }
      hair(brawler.hairColor,0.7); weapon(); break;

    case 'rex': // ダイノクロー・恐竜人
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(cx-r*0.58,cy+r*0.8,r*0.42,r*0.95,r*0.1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.16,cy+r*0.8,r*0.42,r*0.95,r*0.1); ctx.fill();
      ctx.fillStyle='#e64a19'; ctx.beginPath(); ctx.roundRect(cx-r*0.64,cy+r*1.68,r*0.54,r*0.24,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.1,cy+r*1.68,r*0.54,r*0.24,r*0.08); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*1.08,cy+r*0.0,r*0.38,r*0.7,r*0.14); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.7,cy+r*0.0,r*0.38,r*0.7,r*0.14); ctx.fill();
      body('#bf360c',0.88,1.05);
      // 恐竜の背ビレ
      ctx.fillStyle='#e64a19';
      for(let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(cx-r*0.35+i*r*0.22,cy-r*0.65); ctx.lineTo(cx-r*0.25+i*r*0.22,cy-r*(1.0+i*0.15)); ctx.lineTo(cx-r*0.15+i*r*0.22,cy-r*0.65); ctx.closePath(); ctx.fill(); }
      head('#d84315',0.98);
      ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.arc(cx-r*0.28,cy-r*0.15,r*0.18,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.28,cy-r*0.15,r*0.18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffcc80'; ctx.beginPath(); ctx.ellipse(cx,cy+r*0.08,r*0.4,r*0.22,0,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'titan': // メガキャノン・超大型ロボ
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(cx-r*0.6,cy+r*0.75,r*0.46,r*1.05,r*0.1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.14,cy+r*0.75,r*0.46,r*1.05,r*0.1); ctx.fill();
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(cx-r*0.66,cy+r*1.72,r*0.58,r*0.25,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.08,cy+r*1.72,r*0.58,r*0.25,r*0.08); ctx.fill();
      // 巨大メカ体
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(cx-r*0.95,cy+r*0.0,r*1.9,r*1.1,r*0.1); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*0.75,cy+r*0.1,r*1.5,r*0.85,r*0.08); ctx.fill();
      // コアライト
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.arc(cx,cy+r*0.52,r*0.28,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,87,34,0.3)'; ctx.beginPath(); ctx.arc(cx,cy+r*0.52,r*0.5,0,Math.PI*2); ctx.fill();
      // ロボ頭
      ctx.fillStyle='#455a64'; ctx.beginPath(); ctx.roundRect(cx-r*0.88,cy-r*1.05,r*1.76,r*1.1,r*0.12); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.ellipse(cx-r*0.32,cy-r*0.6,r*0.22,r*0.22,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*0.32,cy-r*0.6,r*0.22,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(cx-r*0.55,cy-r*0.28,r*1.1,r*0.12);
      weapon(); break;

    case 'aether': // エーテルブレード・霊体
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('rgba(200,200,220,0.7)',0.58,0.88);
      // 霊体グロー
      ctx.fillStyle='rgba(197,202,233,0.15)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.9,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(197,202,233,0.25)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.5,0,Math.PI*2); ctx.fill();
      head('#e8eaf6',0.88);
      // 白い髪
      ctx.fillStyle='#c5cae9'; for(let i=-1;i<=1;i++){ ctx.beginPath(); ctx.moveTo(cx+i*r*0.28,cy-r*0.85); ctx.lineTo(cx+i*r*0.4,cy-r*1.4); ctx.lineWidth=r*0.16; ctx.strokeStyle='#c5cae9'; ctx.stroke(); }
      ctx.fillStyle='rgba(0,0,255,0.5)'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.2,r*0.14,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.2,r*0.14,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'drago': // ドラゴンブレス・ドラゴン
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#c62828',0.82,1.0);
      // 翼
      ctx.fillStyle='rgba(183,28,28,0.55)';
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx-r*1.7,cy-r*0.8,cx-r*1.4,cy-r*1.4,cx-r*0.4,cy-r*0.5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx+r*1.7,cy-r*0.8,cx+r*1.4,cy-r*1.4,cx+r*0.4,cy-r*0.5); ctx.closePath(); ctx.fill();
      // ドラゴン頭
      head('#b71c1c',1.0);
      ctx.fillStyle='#ff5252'; ctx.beginPath(); ctx.arc(cx-r*0.28,cy-r*0.15,r*0.18,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.28,cy-r*0.15,r*0.18,0,Math.PI*2); ctx.fill();
      // 角
      ctx.fillStyle='#ff8a80'; ctx.beginPath(); ctx.moveTo(cx-r*0.35,cy-r*1.0); ctx.lineTo(cx-r*0.5,cy-r*1.5); ctx.lineTo(cx-r*0.2,cy-r*1.0); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx+r*0.35,cy-r*1.0); ctx.lineTo(cx+r*0.5,cy-r*1.5); ctx.lineTo(cx+r*0.2,cy-r*1.0); ctx.closePath(); ctx.fill();
      weapon(); break;

    // ===== レジェンダリー =====
    case 'thorn': // サボテンスパイク・植物体
      ctx.fillStyle='#2e7d32'; ctx.beginPath(); ctx.roundRect(cx-r*0.5,cy+r*0.8,r*0.34,r*0.95,r*0.1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.16,cy+r*0.8,r*0.34,r*0.95,r*0.1); ctx.fill();
      ctx.fillStyle='#1b5e20'; ctx.beginPath(); ctx.roundRect(cx-r*0.56,cy+r*1.68,r*0.46,r*0.24,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.1,cy+r*1.68,r*0.46,r*0.24,r*0.08); ctx.fill();
      // サボテン体
      ctx.fillStyle='#388e3c'; ctx.beginPath(); ctx.roundRect(cx-r*0.55,cy-r*0.2,r*1.1,r*1.4,r*0.25); ctx.fill();
      // トゲ
      ctx.fillStyle='#1b5e20';
      for(let i=0;i<5;i++){ const y=cy+r*(0.0+i*0.28); ctx.beginPath(); ctx.moveTo(cx-r*0.55,y); ctx.lineTo(cx-r*0.9,y-r*0.12); ctx.lineTo(cx-r*0.55,y+r*0.12); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx+r*0.55,y); ctx.lineTo(cx+r*0.9,y-r*0.12); ctx.lineTo(cx+r*0.55,y+r*0.12); ctx.closePath(); ctx.fill(); }
      // サボテン顔
      ctx.fillStyle='#ffcc80'; ctx.beginPath(); ctx.arc(cx,cy-r*0.28,r*0.72,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a1a2e'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.3,r*0.13,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.22,cy-r*0.3,r*0.13,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'shade': // スピナー・忍者スタイル
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.58,0.9);
      // 忍者スカーフ
      ctx.fillStyle='#1565c0'; ctx.beginPath(); ctx.moveTo(cx-r*0.7,cy-r*0.05); ctx.quadraticCurveTo(cx,cy+r*0.3,cx+r*0.7,cy-r*0.05); ctx.lineWidth=r*0.38; ctx.strokeStyle='#1565c0'; ctx.stroke();
      head(brawler.skinColor,0.88);
      ctx.fillStyle='#1565c0'; ctx.beginPath(); ctx.arc(cx,cy-r*0.15,r*0.92,Math.PI*1.1,Math.PI*1.9); ctx.fill();
      // 目だけ見える
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx-r*0.25,cy-r*0.12,r*0.16,r*0.12,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*0.25,cy-r*0.12,r*0.16,r*0.12,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#00bfff'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.12,r*0.09,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.22,cy-r*0.12,r*0.09,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'raven': // 毒ダガー・カラス
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.58,0.88);
      // カラス翼
      ctx.fillStyle='rgba(69,90,100,0.5)';
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx-r*1.6,cy-r*0.3,cx-r*1.8,cy-r*0.9,cx-r*0.6,cy-r*0.5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx+r*1.6,cy-r*0.3,cx+r*1.8,cy-r*0.9,cx+r*0.6,cy-r*0.5); ctx.closePath(); ctx.fill();
      head('#b0bec5',0.85); hair('#1c313a',0.7);
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.18,r*0.16,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.18,r*0.16,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'nyx': // ムーンダガー・月の女神
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#1a237e',0.58,0.9);
      // 星座ローブ
      ctx.fillStyle='#283593'; ctx.beginPath(); ctx.moveTo(cx-r*0.58,cy+r*0.2); ctx.lineTo(cx-r*1.05,cy+r*1.5); ctx.lineTo(cx+r*1.05,cy+r*1.5); ctx.lineTo(cx+r*0.58,cy+r*0.2); ctx.closePath(); ctx.fill();
      for(let i=0;i<8;i++){ const a=Math.random()*Math.PI*2,d=r*(0.5+Math.random()*0.8); ctx.fillStyle='rgba(255,255,200,0.6)'; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*d,cy+r*0.85+Math.sin(a)*r*0.4,r*0.05,0,Math.PI*2); ctx.fill(); }
      head('#c5cae9',0.88); hair('#0d0d2b',0.7);
      // 三日月飾り
      ctx.strokeStyle='#7986cb'; ctx.lineWidth=r*0.15; ctx.beginPath(); ctx.arc(cx+r*0.5,cy-r*1.1,r*0.35,-Math.PI*0.2,Math.PI*1.2); ctx.stroke();
      eyes(); weapon(); break;

    case 'zorn': // デモンクロー・悪魔
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#7f0000',0.72,0.98);
      // 悪魔の翼
      ctx.fillStyle='rgba(183,28,28,0.5)';
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx-r*1.4,cy-r*1.0); ctx.lineTo(cx-r*0.8,cy-r*0.4); ctx.lineTo(cx-r*1.6,cy-r*0.6); ctx.lineTo(cx-r*0.5,cy-r*0.1); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*1.4,cy-r*1.0); ctx.lineTo(cx+r*0.8,cy-r*0.4); ctx.lineTo(cx+r*1.6,cy-r*0.6); ctx.lineTo(cx+r*0.5,cy-r*0.1); ctx.closePath(); ctx.fill();
      head('#ff6060',0.92);
      // 角
      ctx.fillStyle='#b71c1c'; ctx.beginPath(); ctx.moveTo(cx-r*0.35,cy-r*1.0); ctx.lineTo(cx-r*0.2,cy-r*1.55); ctx.lineTo(cx-r*0.05,cy-r*1.0); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx+r*0.35,cy-r*1.0); ctx.lineTo(cx+r*0.2,cy-r*1.55); ctx.lineTo(cx+r*0.05,cy-r*1.0); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#ff1744'; ctx.beginPath(); ctx.arc(cx-r*0.28,cy-r*0.18,r*0.18,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*0.28,cy-r*0.18,r*0.18,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'prism': // プリズムレーザー・レインボー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      // プリズム光エフェクト
      const cols=['#ef5350','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0'];
      for(let i=0;i<6;i++){ ctx.strokeStyle=cols[i]; ctx.lineWidth=r*0.1; ctx.globalAlpha=0.6; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(i/6*Math.PI*2)*r*1.6,cy+Math.sin(i/6*Math.PI*2)*r*1.2); ctx.stroke(); }
      ctx.globalAlpha=1;
      head(brawler.skinColor,0.88); hair(brawler.hairColor,0.7); eyes(); weapon(); break;

    case 'swift': // ウィンドカッター・超速
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.55,0.88);
      // 速度線
      ctx.strokeStyle='rgba(0,230,118,0.4)'; ctx.lineWidth=r*0.1;
      for(let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(cx-r*(1.5+i*0.2),cy+r*(0.1-i*0.25)); ctx.lineTo(cx+r*(0.5-i*0.1),cy+r*(0.1-i*0.25)); ctx.stroke(); }
      head(brawler.skinColor,0.85); hair(brawler.hairColor,0.68);
      // ヘルメット
      ctx.fillStyle='rgba(0,200,100,0.3)'; ctx.beginPath(); ctx.arc(cx,cy-r*0.22,r*1.0,Math.PI*1.05,Math.PI*1.95); ctx.fill();
      eyes(); weapon(); break;

    case 'zara': // フレイムボウ・炎使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.88);
      // 炎オーラ
      ctx.fillStyle='rgba(244,81,30,0.2)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.fill();
      for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; ctx.fillStyle='rgba(255,87,34,0.4)'; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r*1.1,cy+Math.sin(a)*r*0.7); ctx.lineTo(cx+Math.cos(a+0.3)*r*1.35,cy+Math.sin(a+0.3)*r*0.9); ctx.lineTo(cx+Math.cos(a-0.3)*r*1.35,cy+Math.sin(a-0.3)*r*0.9); ctx.closePath(); ctx.fill(); }
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    // ===== 追加キャラ =====
    case 'goro': // 鉄拳・巨体
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.95,1.1);
      ctx.fillStyle=brawler.skinColor; ctx.beginPath(); ctx.ellipse(cx-r*1.1,cy+r*0.2,r*0.45,r*0.6,0.15,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+r*1.1,cy+r*0.2,r*0.45,r*0.6,-0.15,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor,1.08); hair(brawler.hairColor,0.72);
      // 眉毛
      ctx.strokeStyle=brawler.hairColor; ctx.lineWidth=r*0.14; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(cx-r*0.42,cy-r*0.42); ctx.lineTo(cx-r*0.14,cy-r*0.38); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx+r*0.42,cy-r*0.42); ctx.lineTo(cx+r*0.14,cy-r*0.38); ctx.stroke();
      eyes(); weapon(); break;

    case 'blast': // 爆発屋
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.68,0.92);
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(cx-r*0.6,cy+r*0.1,r*1.2,r*0.72,r*0.1); ctx.fill();
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'echo': // ソナー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.68); eyes(); weapon(); break;

    case 'forge': // 鍛冶屋
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.82,1.0);
      head(brawler.skinColor,0.98); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'kira': // 星使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.88);
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72); eyes(); weapon(); break;

    case 'shampa': // シャンパー: シャンプーボトル持ち・ポップな女の子
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.84);
      // 泡のオーラ
      ctx.fillStyle='rgba(233,30,140,0.15)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.8,0,Math.PI*2); ctx.fill();
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2; ctx.fillStyle='rgba(255,128,171,0.4)'; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*0.9,r*0.13,0,Math.PI*2); ctx.fill();}
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72);
      // ポニーテール
      ctx.strokeStyle=brawler.hairColor; ctx.lineWidth=r*0.22;
      ctx.beginPath(); ctx.moveTo(cx+r*0.5,cy-r*0.55); ctx.quadraticCurveTo(cx+r*1.05,cy+r*0.1,cx+r*0.8,cy+r*0.55); ctx.stroke();
      eyes(); weapon(); break;

    case 'babi': // バビ: ラッキーバット・ギャンブラー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.68,0.9);
      // コイン飾り
      for(let i=0;i<5;i++){const a=i/5*Math.PI*2+0.3; ctx.fillStyle='rgba(255,193,7,0.5)'; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r*0.75,r*0.14,0,Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(255,152,0,0.7)'; ctx.font=`bold ${r*0.18}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('$',cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r*0.75);}
      head(brawler.skinColor,0.92); hair(brawler.hairColor,0.72);
      // サングラス
      ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.beginPath(); ctx.roundRect(cx-r*0.52,cy-r*0.25,r*0.42,r*0.24,r*0.08); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx+r*0.1,cy-r*0.25,r*0.42,r*0.24,r*0.08); ctx.fill();
      ctx.strokeStyle='#555'; ctx.lineWidth=r*0.07; ctx.beginPath(); ctx.moveTo(cx-r*0.1,cy-r*0.13); ctx.lineTo(cx+r*0.1,cy-r*0.13); ctx.stroke();
      eyes(); weapon(); break;

    case 'toss':
      legs(brawler.col, brawler.skinColor||'#e8eaf6');
      // 格闘着の足
      ctx.fillStyle='#283593'; ctx.beginPath(); ctx.roundRect(cx-r*0.58,cy+r*1.62,r*0.52,r*0.28,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.06,cy+r*1.62,r*0.52,r*0.28,r*0.08); ctx.fill();
      // がっしりした格闘家ボディ
      body(brawler.col,0.8,1.02);
      // 格闘着のライン
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=r*0.1;
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.lineTo(cx,cy+r*1.3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-r*0.5,cy+r*0.5); ctx.lineTo(cx+r*0.5,cy+r*0.5); ctx.stroke();
      // 腕（格闘ポーズ）
      ctx.fillStyle=brawler.skinColor;
      ctx.beginPath(); ctx.ellipse(cx-r*1.0,cy+r*0.1,r*0.32,r*0.55,-0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*1.0,cy+r*0.1,r*0.32,r*0.55,0.3,0,Math.PI*2); ctx.fill();
      // グローブ
      ctx.fillStyle='#c62828'; ctx.beginPath(); ctx.arc(cx-r*1.05,cy-r*0.25,r*0.3,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*1.05,cy-r*0.25,r*0.3,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor,0.95); hair(brawler.hairColor,0.72);
      // 眉毛（険しい表情）
      ctx.strokeStyle=brawler.hairColor; ctx.lineWidth=r*0.14; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(cx-r*0.45,cy-r*0.42); ctx.lineTo(cx-r*0.12,cy-r*0.36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.45,cy-r*0.42); ctx.lineTo(cx+r*0.12,cy-r*0.36); ctx.stroke();
      eyes();
      // 武器なし（素手）なのでweapon()は呼ばない
      break;

    case 'flamma': // 炎使い・火山系
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.65,0.9);
      // 炎オーラ
      for(let i=0;i<8;i++){
        const a=i/8*Math.PI*2, d=r*(1.2+Math.sin(i)*0.2);
        ctx.fillStyle=`rgba(255,${80+i*20},0,0.35)`;
        ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d*0.7);
        ctx.lineTo(cx+Math.cos(a+0.25)*(d+r*0.3),cy+Math.sin(a+0.25)*(d+r*0.3)*0.7);
        ctx.lineTo(cx+Math.cos(a-0.25)*(d+r*0.3),cy+Math.sin(a-0.25)*(d+r*0.3)*0.7);
        ctx.closePath(); ctx.fill();
      }
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72);
      // 炎の髪
      ctx.fillStyle='#ff6d00';
      for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*r*0.25,cy-r*0.88);ctx.lineTo(cx+i*r*0.35,cy-r*1.45);ctx.lineWidth=r*0.18;ctx.strokeStyle='#ff3d00';ctx.stroke();}
      eyes(); weapon(); break;

    case 'mirror': // 鏡使い・シルバー
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.88);
      // 鏡の反射エフェクト
      ctx.fillStyle='rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.ellipse(cx-r*0.3,cy-r*0.1,r*0.25,r*0.6,-0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.4,cy+r*0.2,r*0.15,r*0.4,0.2,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.7);
      // 銀髪
      ctx.fillStyle='#b0bec5'; ctx.beginPath(); ctx.arc(cx,cy-r*0.38,r*0.72,Math.PI,0); ctx.fill();
      eyes(); weapon(); break;

    case 'shield':
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(cx-r*0.6,cy+r*0.8,r*0.44,r*1.0,r*0.1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.16,cy+r*0.8,r*0.44,r*1.0,r*0.1); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(cx-r*0.66,cy+r*1.72,r*0.56,r*0.24,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.1,cy+r*1.72,r*0.56,r*0.24,r*0.08); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*1.08,cy+r*0.0,r*0.38,r*0.68,r*0.12); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.7,cy+r*0.0,r*0.38,r*0.68,r*0.12); ctx.fill();
      // 分厚い装甲ボディ
      ctx.fillStyle='#455a64'; ctx.beginPath(); ctx.roundRect(cx-r*0.9,cy+r*0.0,r*1.8,r*1.1,r*0.1); ctx.fill();
      // 盾
      ctx.fillStyle='#607d8b';
      ctx.beginPath(); ctx.moveTo(cx-r*1.2,cy-r*0.5); ctx.lineTo(cx-r*1.2,cy+r*0.8); ctx.quadraticCurveTo(cx-r*1.2,cy+r*1.2,cx-r*0.8,cy+r*1.2); ctx.lineTo(cx-r*0.2,cy+r*1.2); ctx.lineTo(cx-r*0.2,cy-r*0.5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#90a4ae'; ctx.lineWidth=r*0.1; ctx.stroke();
      ctx.fillStyle='#ef5350'; ctx.beginPath(); ctx.arc(cx-r*0.7,cy+r*0.35,r*0.2,0,Math.PI*2); ctx.fill(); // エンブレム
      // ロボット頭
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(cx-r*0.75,cy-r*1.05,r*1.5,r*1.0,r*0.1); ctx.fill();
      ctx.fillStyle='#ef5350'; ctx.beginPath(); ctx.ellipse(cx-r*0.25,cy-r*0.62,r*0.18,r*0.18,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.25,cy-r*0.62,r*0.18,r*0.18,0,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'ghost':
      ctx.globalAlpha=0.5;
      ctx.fillStyle='rgba(200,200,225,0.5)';
      ctx.beginPath(); ctx.ellipse(cx-r*0.3,cy+r*1.5,r*0.22,r*0.55,-0.1,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.3,cy+r*1.5,r*0.22,r*0.55,0.1,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=0.65;
      body('rgba(220,220,235,0.8)',0.58,0.9);
      // 幽霊の下部（揺れるふわふわ）
      ctx.fillStyle='rgba(200,200,225,0.6)';
      ctx.beginPath(); ctx.moveTo(cx-r*0.6,cy+r*0.8);
      for(let i=0;i<=8;i++){const x=cx-r*0.6+i*r*0.15; ctx.lineTo(x,cy+r*(1.4+Math.sin(i)*0.25));}
      ctx.lineTo(cx+r*0.6,cy+r*0.8); ctx.closePath(); ctx.fill();
      ctx.globalAlpha=0.7;
      head('rgba(240,240,255,0.85)',0.9);
      // 目（暗い穴）
      ctx.fillStyle='rgba(30,30,60,0.8)'; ctx.beginPath(); ctx.ellipse(cx-r*0.25,cy-r*0.18,r*0.2,r*0.25,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.25,cy-r*0.18,r*0.2,r*0.25,0,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
      weapon(); break;

    case 'dyna': // ダイナ・爆弾使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.68,0.9);
      // 爆弾ベルト
      ctx.fillStyle='#5d4037'; ctx.fillRect(cx-r*0.65,cy+r*0.25,r*1.3,r*0.22);
      for(let i=0;i<4;i++){ctx.fillStyle='#ff3d00'; ctx.beginPath(); ctx.arc(cx-r*0.45+i*r*0.3,cy+r*0.36,r*0.13,0,Math.PI*2); ctx.fill();}
      head(brawler.skinColor,0.9); hair(brawler.hairColor,0.72);
      // ゴーグル
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.ellipse(cx-r*0.28,cy-r*0.18,r*0.22,r*0.18,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.28,cy-r*0.18,r*0.22,r*0.18,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#e65100'; ctx.lineWidth=r*0.07; ctx.beginPath(); ctx.moveTo(cx-r*0.06,cy-r*0.18); ctx.lineTo(cx+r*0.06,cy-r*0.18); ctx.stroke();
      eyes(); weapon(); break;

    case 'quake': // 地震使い・岩のような体
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.85,1.05);
      // 岩のテクスチャ
      ctx.fillStyle='rgba(0,0,0,0.2)';
      for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(cx+rand(-r*0.6,r*0.6),cy+r*0.4+rand(-r*0.4,r*0.4),r*0.15,0,Math.PI*2);ctx.fill();}
      head(brawler.skinColor,1.0); hair(brawler.hairColor,0.74);
      // ゴツい眉
      ctx.strokeStyle='#3e2723';ctx.lineWidth=r*0.16;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(cx-r*0.44,cy-r*0.42);ctx.lineTo(cx-r*0.1,cy-r*0.35);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx+r*0.44,cy-r*0.42);ctx.lineTo(cx+r*0.1,cy-r*0.35);ctx.stroke();
      eyes(); weapon(); break;

    case 'neon': // ネオン・サイバー系
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.58,0.88);
      // サイバースーツのライン
      ctx.strokeStyle='#00e5ff';ctx.lineWidth=r*0.08;
      ctx.beginPath();ctx.moveTo(cx-r*0.4,cy+r*0.1);ctx.lineTo(cx-r*0.4,cy+r*1.2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx+r*0.4,cy+r*0.1);ctx.lineTo(cx+r*0.4,cy+r*1.2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx-r*0.5,cy+r*0.55);ctx.lineTo(cx+r*0.5,cy+r*0.55);ctx.stroke();
      head(brawler.skinColor,0.88);
      // ネオンヘア
      ctx.fillStyle='#00e5ff';ctx.beginPath();ctx.arc(cx,cy-r*0.38,r*0.72,Math.PI,0);ctx.fill();
      ctx.strokeStyle='#84ffff';ctx.lineWidth=r*0.08;ctx.stroke();
      eyes(); weapon(); break;

    case 'comet': // コメット・宇宙魔法使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.9);
      // 星座マント
      ctx.fillStyle='#4a148c';
      ctx.beginPath();ctx.moveTo(cx,cy+r*0.1);ctx.lineTo(cx-r*1.2,cy+r*1.5);ctx.lineTo(cx+r*1.2,cy+r*1.5);ctx.closePath();ctx.fill();
      // 星
      for(let i=0;i<6;i++){const a=Math.random()*Math.PI*2,d=rand(r*0.3,r*0.9);
        ctx.fillStyle='rgba(255,255,200,0.7)';ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+r*0.8+Math.sin(a)*r*0.4,r*0.06,0,Math.PI*2);ctx.fill();}
      head(brawler.skinColor,0.88);hair(brawler.hairColor,0.7);
      // 魔法の目
      ctx.fillStyle='#e040fb';ctx.beginPath();ctx.ellipse(cx-r*0.25,cy-r*0.18,r*0.18,r*0.22,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(cx+r*0.25,cy-r*0.18,r*0.18,r*0.22,0,0,Math.PI*2);ctx.fill();
      weapon(); break;

    case 'viper': // バイパー・蛇人間
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#2e7d32',0.65,0.9);
      // うろこ模様
      ctx.fillStyle='rgba(0,0,0,0.2)';
      for(let row=0;row<3;row++)for(let col=0;col<4;col++){
        ctx.beginPath();ctx.arc(cx-r*0.55+col*r*0.36,cy+r*0.2+row*r*0.35,r*0.14,0,Math.PI*2);ctx.fill();}
      head(brawler.skinColor,0.9);
      // 蛇の目（縦スリット）
      ctx.fillStyle='#ffff00';ctx.beginPath();ctx.ellipse(cx-r*0.26,cy-r*0.18,r*0.19,r*0.24,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(cx+r*0.26,cy-r*0.18,r*0.19,r*0.24,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1a1a00';ctx.beginPath();ctx.ellipse(cx-r*0.26,cy-r*0.18,r*0.06,r*0.2,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(cx+r*0.26,cy-r*0.18,r*0.06,r*0.2,0,0,Math.PI*2);ctx.fill();
      hair('#1b5e20',0.7); weapon(); break;

    case 'gatling': // ガトリング・重装備軍人
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#546e7a',0.88,1.05);
      // 弾帯
      ctx.fillStyle='#ffd54f';
      for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(cx-r*0.65+i*r*0.26,cy+r*0.25,r*0.1,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#f57f17';ctx.lineWidth=r*0.08;
      ctx.beginPath();ctx.moveTo(cx-r*0.65,cy+r*0.25);ctx.lineTo(cx+r*0.65,cy+r*0.25);ctx.stroke();
      head(brawler.skinColor,0.98);hair(brawler.hairColor,0.72);
      // ヘルメット
      ctx.fillStyle='rgba(55,71,79,0.7)';ctx.beginPath();ctx.arc(cx,cy-r*0.22,r*1.0,Math.PI*1.08,Math.PI*1.92);ctx.fill();
      eyes(); weapon(); break;

    case 'witch': // ウィッチ・魔女
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.6,0.9);
      // 魔女のドレス裾
      ctx.fillStyle='#4a148c';
      ctx.beginPath();ctx.moveTo(cx-r*0.6,cy+r*0.5);ctx.bezierCurveTo(cx-r*1.1,cy+r*1.3,cx-r*0.8,cy+r*1.5,cx,cy+r*1.55);
      ctx.bezierCurveTo(cx+r*0.8,cy+r*1.5,cx+r*1.1,cy+r*1.3,cx+r*0.6,cy+r*0.5);ctx.closePath();ctx.fill();
      head(brawler.skinColor,0.88);hair(brawler.hairColor,0.7);
      // 魔女帽子
      ctx.fillStyle='#1a0a2e';ctx.beginPath();ctx.moveTo(cx,cy-r*1.9);ctx.lineTo(cx-r*0.6,cy-r*0.9);ctx.lineTo(cx+r*0.6,cy-r*0.9);ctx.closePath();ctx.fill();
      ctx.fillRect(cx-r*0.8,cy-r*1.0,r*1.6,r*0.14);
      ctx.fillStyle='#7b1fa2';ctx.fillRect(cx-r*0.8,cy-r*0.98,r*1.6,r*0.1);
      eyes(); weapon(); break;

    case 'boulder': // ボルダー・岩石使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body('#6d4c41',0.9,1.05);
      // 岩のコブ
      ctx.fillStyle='#8d6e63';
      for(let i=0;i<4;i++){const a=i/4*Math.PI+Math.PI/2;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*0.7,cy+Math.sin(a)*r*0.3+r*0.5,r*0.28,0,Math.PI*2);ctx.fill();}
      head(brawler.skinColor,1.0);hair(brawler.hairColor,0.72);
      ctx.strokeStyle='#4e342e';ctx.lineWidth=r*0.14;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(cx-r*0.44,cy-r*0.42);ctx.lineTo(cx-r*0.1,cy-r*0.35);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx+r*0.44,cy-r*0.42);ctx.lineTo(cx+r*0.1,cy-r*0.35);ctx.stroke();
      eyes(); weapon(); break;

    case 'spark': // スパーク・電気使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.88);
      // 電撃エフェクト
      ctx.strokeStyle='rgba(255,235,59,0.6)';ctx.lineWidth=r*0.1;
      for(let i=0;i<4;i++){const a=i/4*Math.PI*2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*0.5,cy+Math.sin(a)*r*0.5);ctx.lineTo(cx+Math.cos(a)*r*1.5,cy+Math.sin(a)*r*1.2);ctx.stroke();}
      head(brawler.skinColor,0.9);
      // ビリビリ頭
      ctx.fillStyle='#f9a825';for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*r*0.25,cy-r*0.88);ctx.lineTo(cx+i*r*0.15,cy-r*1.5);ctx.lineWidth=r*0.18;ctx.strokeStyle='#f9a825';ctx.stroke();}
      ctx.fillStyle='rgba(255,235,59,0.4)';ctx.beginPath();ctx.arc(cx,cy,r*1.8,0,Math.PI*2);ctx.fill();
      eyes(); weapon(); break;

    case 'freeze': // フリーズ・氷使い
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col,0.62,0.88);
      // 氷の結晶
      ctx.strokeStyle='rgba(129,212,250,0.5)';ctx.lineWidth=r*0.1;
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r*1.6,cy+Math.sin(a)*r*1.2);ctx.stroke();}
      head(brawler.skinColor,0.9);hair(brawler.hairColor,0.7);
      // 氷の王冠
      ctx.fillStyle='#b3e5fc';
      for(let i=0;i<5;i++){const x=cx-r*0.6+i*r*0.3;ctx.beginPath();ctx.moveTo(x,cy-r*0.9);ctx.lineTo(x+r*0.12,cy-r*(1.2+i%2*0.25));ctx.lineTo(x+r*0.24,cy-r*0.9);ctx.closePath();ctx.fill();}
      eyes(); weapon(); break;

    case 'phantom':
      legs('#880e4f', brawler.skinColor||'#fce4ec');
      ctx.fillStyle='#560027'; ctx.beginPath(); ctx.roundRect(cx-r*0.62,cy+r*1.72,r*0.52,r*0.24,r*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.1,cy+r*1.72,r*0.52,r*0.24,r*0.08); ctx.fill();
      ctx.fillStyle='#880e4f'; ctx.beginPath(); ctx.roundRect(cx-r*1.06,cy+r*0.0,r*0.34,r*0.68,r*0.12); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.72,cy+r*0.0,r*0.34,r*0.68,r*0.12); ctx.fill();
      ctx.globalAlpha=0.75;
      body('#880e4f',0.58,0.9);
      // 残像エフェクト
      for(let i=1;i<=3;i++){ctx.globalAlpha=0.15*i;ctx.fillStyle='#f06292';ctx.beginPath();ctx.ellipse(cx-r*0.1*i,cy,r*0.55,r*0.82,0,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=0.8;
      head(brawler.skinColor,0.85);hair(brawler.hairColor,0.7);
      ctx.fillStyle='#880e4f';ctx.beginPath();ctx.arc(cx,cy-r*0.15,r*1.0,Math.PI*1.1,Math.PI*1.9);ctx.fill();
      ctx.fillStyle='#f06292';ctx.beginPath();ctx.ellipse(cx-r*0.22,cy-r*0.15,r*0.16,r*0.18,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(cx+r*0.22,cy-r*0.15,r*0.16,r*0.18,0,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1; weapon(); break;

    // ===== レア 5体 =====
    case 'blaze':
      legs(brawler.col,'#ffe0b2'); arms(brawler.col,'#ffe0b2');
      body(brawler.col,0.65,0.7);
      // 炎の髪
      ctx.fillStyle='#ff6f00'; for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*r*0.25,cy-r*0.88);ctx.lineTo(cx+i*r*0.38,cy-r*1.45);ctx.lineWidth=r*0.2;ctx.strokeStyle='#ff3d00';ctx.stroke();}
      head('#ffe0b2',0.9); eyes(); weapon(); break;

    case 'zapp':
      legs(brawler.col,'#fff9c4'); arms(brawler.col,'#fff9c4');
      body(brawler.col,0.6,0.7);
      // 電気ヘア（立ち上がり）
      ctx.strokeStyle='#ffd600'; ctx.lineWidth=r*0.16;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-r*0.28+i*r*0.28,cy-r*0.88);ctx.lineTo(cx-r*0.35+i*r*0.32,cy-r*1.5);ctx.stroke();}
      head('#fff9c4',0.88); eyes();
      // 電撃オーラ
      ctx.strokeStyle='rgba(255,214,0,0.4)'; ctx.lineWidth=r*0.1;
      ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.stroke();
      weapon(); break;

    case 'coral':
      legs('#00bcd4','#e0f7fa'); arms('#00bcd4','#e0f7fa');
      body('#00bcd4',0.62,0.7);
      // 泡エフェクト
      for(let i=0;i<5;i++){ctx.fillStyle='rgba(128,222,234,0.35)';ctx.beginPath();ctx.arc(cx+Math.cos(i/5*Math.PI*2)*r*1.3,cy+Math.sin(i/5*Math.PI*2)*r*0.7,r*0.14,0,Math.PI*2);ctx.fill();}
      head('#e0f7fa',0.9); hair('#006064',0.7); eyes(); weapon(); break;

    case 'rusty':
      legs('#a1887f','#d7ccc8'); arms('#a1887f','#d7ccc8');
      body('#a1887f',0.78,0.72);
      // サビの模様
      ctx.fillStyle='rgba(78,52,46,0.3)';
      for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cx+rand(-r*0.5,r*0.5),cy+r*0.3+rand(-r*0.3,r*0.3),r*0.12,0,Math.PI*2);ctx.fill();}
      head('#d7ccc8',0.95); hair('#4e342e',0.72); eyes(); weapon(); break;

    case 'pip':
      legs('#ce93d8','#fce4ec'); arms('#ce93d8','#fce4ec');
      body('#ce93d8',0.58,0.68);
      head('#fce4ec',0.88); hair('#7b1fa2',0.7);
      // 小さくてかわいい目
      ctx.fillStyle='#7b1fa2'; ctx.beginPath(); ctx.arc(cx-r*0.24,cy-r*0.15,r*0.14,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.24,cy-r*0.15,r*0.14,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-r*0.21,cy-r*0.18,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.27,cy-r*0.18,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    // ===== ウルトラレジェンダリー 10体 =====
    case 'godrix':
      // 神の戦士 - 赤い鎧、翼、王冠
      legs('#7f0000','#ffcdd2'); arms('#7f0000','#ffcdd2');
      // 翼（赤金）
      ctx.fillStyle='rgba(213,0,0,0.5)';
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx-r*2.0,cy-r*1.0,cx-r*1.8,cy-r*1.8,cx-r*0.4,cy-r*0.5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.bezierCurveTo(cx+r*2.0,cy-r*1.0,cx+r*1.8,cy-r*1.8,cx+r*0.4,cy-r*0.5); ctx.closePath(); ctx.fill();
      // 金のライン
      ctx.strokeStyle='#ffd740'; ctx.lineWidth=r*0.06;
      ctx.beginPath(); ctx.moveTo(cx-r*0.4,cy-r*0.5); ctx.bezierCurveTo(cx-r*1.8,cy-r*1.8,cx-r*2.0,cy-r*1.0,cx,cy+r*0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.4,cy-r*0.5); ctx.bezierCurveTo(cx+r*1.8,cy-r*1.8,cx+r*2.0,cy-r*1.0,cx,cy+r*0.1); ctx.stroke();
      body('#b71c1c',0.72,0.72);
      // 金の鎧プレート
      ctx.fillStyle='#ffd740'; ctx.fillRect(cx-r*0.6,cy+r*0.05,r*1.2,r*0.12);
      ctx.fillRect(cx-r*0.5,cy+r*0.35,r*1.0,r*0.1);
      head('#ffcdd2',0.95);
      // 王冠
      ctx.fillStyle='#ffd740';
      for(let i=0;i<5;i++){const x=cx-r*0.6+i*r*0.3; ctx.beginPath(); ctx.moveTo(x,cy-r*1.02); ctx.lineTo(x+r*0.12,cy-r*(1.3+i%2*0.22)); ctx.lineTo(x+r*0.24,cy-r*1.02); ctx.closePath(); ctx.fill();}
      ctx.fillRect(cx-r*0.6,cy-r*1.05,r*1.2,r*0.1);
      // 赤い目（輝く）
      ctx.fillStyle='#ff1744'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.17,r*0.2,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.17,r*0.2,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'seraph':
      // 天使 - 金白の翼、光輪
      legs('#ff6f00','#fffde7'); arms('#ff6f00','#fffde7');
      // 6枚翼
      ctx.fillStyle='rgba(255,215,64,0.35)';
      for(let i=0;i<3;i++){
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx-r*(1.5+i*0.5),cy-r*(0.5+i*0.4),cx-r*(1.2+i*0.4),cy-r*(1.2+i*0.3),cx-r*0.3,cy-r*0.4); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+r*(1.5+i*0.5),cy-r*(0.5+i*0.4),cx+r*(1.2+i*0.4),cy-r*(1.2+i*0.3),cx+r*0.3,cy-r*0.4); ctx.closePath(); ctx.fill();
      }
      // 光輪
      ctx.strokeStyle='rgba(255,215,64,0.8)'; ctx.lineWidth=r*0.12;
      ctx.beginPath(); ctx.ellipse(cx,cy-r*1.25,r*0.65,r*0.15,0,0,Math.PI*2); ctx.stroke();
      body('#ff6f00',0.62,0.7);
      ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(cx,cy+r*0.45,r*0.55,r*0.55,0,0,Math.PI*2); ctx.fill();
      head('#fffde7',0.9); hair('#ff6f00',0.7); eyes(); weapon(); break;

    case 'void':
      // 虚空 - 真っ黒、紫のオーラ
      legs('#1a0030','#b0bec5'); arms('#1a0030','#b0bec5');
      // 虚空オーラ
      for(let i=3;i>=1;i--){ctx.fillStyle=`rgba(80,0,120,${0.08*i})`;ctx.beginPath();ctx.arc(cx,cy,r*(1.4+i*0.4),0,Math.PI*2);ctx.fill();}
      body('#0d0d0d',0.62,0.7);
      // 裂け目エフェクト
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=r*0.08;
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(cx+Math.cos(i/4*Math.PI*2)*r*0.7,cy+Math.sin(i/4*Math.PI*2)*r*0.5);ctx.lineTo(cx+Math.cos(i/4*Math.PI*2)*r*1.4,cy+Math.sin(i/4*Math.PI*2)*r*1.0);ctx.stroke();}
      head('#263238',0.9);
      // 紫に輝く目
      ctx.fillStyle='#d500f9'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.18,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.18,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.07,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.07,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'nova':
      // 新星 - 白く輝く、星のオーラ
      legs('#01579b','#e1f5fe'); arms('#01579b','#e1f5fe');
      // 輝くオーラ
      const novaG=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2.0);
      novaG.addColorStop(0,'rgba(0,229,255,0.3)'); novaG.addColorStop(0.5,'rgba(0,229,255,0.1)'); novaG.addColorStop(1,'rgba(0,229,255,0)');
      ctx.fillStyle=novaG; ctx.beginPath(); ctx.arc(cx,cy,r*2.0,0,Math.PI*2); ctx.fill();
      // 星の粒
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*1.5,cy+Math.sin(a)*r*1.0,r*0.07,0,Math.PI*2);ctx.fill();}
      body('#00e5ff',0.6,0.7);
      head('#e1f5fe',0.9); hair('#01579b',0.7);
      // 白い輝く目
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.18,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.18,r*0.22,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#00e5ff'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'kronos':
      // 時の神 - 紫マント、砂時計
      legs('#311b92','#ede7f6'); arms('#311b92','#ede7f6');
      // 時空のマント
      ctx.fillStyle='#4a148c';
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.1); ctx.lineTo(cx-r*1.3,cy+r*1.6); ctx.lineTo(cx+r*1.3,cy+r*1.6); ctx.closePath(); ctx.fill();
      // 時計のシンボル
      ctx.strokeStyle='rgba(179,136,255,0.6)'; ctx.lineWidth=r*0.1;
      ctx.beginPath(); ctx.arc(cx,cy+r*0.9,r*0.35,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.9); ctx.lineTo(cx,cy+r*0.57); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy+r*0.9); ctx.lineTo(cx+r*0.25,cy+r*0.9); ctx.stroke();
      body('#6200ea',0.62,0.7);
      head('#ede7f6',0.9); hair('#311b92',0.7);
      ctx.fillStyle='#b388ff'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'inferna':
      // 炎の女王 - 溶岩ドレス
      legs('#bf360c','#ffccbc'); arms('#bf360c','#ffccbc');
      // 炎のドレス裾
      const infernaG=ctx.createLinearGradient(cx,cy+r*0.4,cx,cy+r*1.8);
      infernaG.addColorStop(0,'#ff3d00'); infernaG.addColorStop(0.5,'#ff6d00'); infernaG.addColorStop(1,'rgba(255,100,0,0)');
      ctx.fillStyle=infernaG;
      ctx.beginPath(); ctx.moveTo(cx-r*0.6,cy+r*0.5); ctx.bezierCurveTo(cx-r*1.2,cy+r*1.4,cx-r*0.8,cy+r*1.8,cx,cy+r*1.85); ctx.bezierCurveTo(cx+r*0.8,cy+r*1.8,cx+r*1.2,cy+r*1.4,cx+r*0.6,cy+r*0.5); ctx.closePath(); ctx.fill();
      body('#e64a19',0.62,0.7);
      head('#ffccbc',0.9); hair('#bf360c',0.7);
      // 炎の髪
      ctx.fillStyle='#ff3d00';
      for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*r*0.28,cy-r*0.9);ctx.lineTo(cx+i*r*0.38,cy-r*1.55);ctx.lineWidth=r*0.2;ctx.strokeStyle='#ff6d00';ctx.stroke();}
      ctx.fillStyle='#ff1744'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,200,0.7)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'azura':
      // 海の女王 - 青いドレス、水の翼
      legs('#0d47a1','#e3f2fd'); arms('#0d47a1','#e3f2fd');
      // 水の翼
      ctx.fillStyle='rgba(21,101,192,0.4)';
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx-r*1.8,cy-r*0.6,cx-r*1.6,cy-r*1.5,cx-r*0.35,cy-r*0.45); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+r*1.8,cy-r*0.6,cx+r*1.6,cy-r*1.5,cx+r*0.35,cy-r*0.45); ctx.closePath(); ctx.fill();
      body('#1565c0',0.62,0.7);
      ctx.fillStyle='rgba(100,181,246,0.3)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.6,0,Math.PI*2); ctx.fill();
      head('#e3f2fd',0.9); hair('#0d47a1',0.7);
      ctx.fillStyle='#29b6f6'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'terron':
      // 大地の巨人 - 岩の鎧
      legs('#1b5e20','#dcedc8'); arms('#1b5e20','#dcedc8');
      body('#33691e',0.9,0.75);
      // 岩の装甲
      ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.roundRect(cx-r*0.8,cy+r*0.05,r*1.6,r*0.88,r*0.1); ctx.fill();
      ctx.fillStyle='#558b2f'; ctx.beginPath(); ctx.roundRect(cx-r*0.7,cy+r*0.1,r*1.4,r*0.72,r*0.08); ctx.fill();
      // 石のトゲ
      ctx.fillStyle='#827717';
      for(let i=0;i<4;i++){const x=cx-r*0.55+i*r*0.37; ctx.beginPath(); ctx.moveTo(x,cy+r*0.06); ctx.lineTo(x+r*0.1,cy-r*0.22); ctx.lineTo(x+r*0.2,cy+r*0.06); ctx.closePath(); ctx.fill();}
      head('#dcedc8',1.05); hair('#1b5e20',0.72);
      ctx.fillStyle='#76ff03'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1b5e20'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'spectra':
      // スペクトラ - 虹色のオーラ、光の戦士
      legs('#880e4f','#fce4ec'); arms('#880e4f','#fce4ec');
      // 虹オーラ
      const specColors=['#ef5350','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0'];
      for(let i=0;i<6;i++){ctx.fillStyle=`${specColors[i]}22`;ctx.beginPath();ctx.arc(cx,cy,r*(1.2+i*0.15),0,Math.PI*2);ctx.fill();}
      body('#c62828',0.6,0.7);
      head('#fce4ec',0.9); hair('#880e4f',0.7);
      ctx.fillStyle='#f50057'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.17,r*0.21,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx-r*0.22,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.19,r*0.06,0,Math.PI*2); ctx.fill();
      weapon(); break;

    case 'abyssal':
      // 深淵 - 深い緑黒、触手
      legs('#00251a','#b2dfdb'); arms('#00251a','#b2dfdb');
      // 触手
      ctx.strokeStyle='rgba(0,77,64,0.7)'; ctx.lineWidth=r*0.18;
      for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI/2.2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*0.6,cy+Math.sin(a)*r*0.4);ctx.bezierCurveTo(cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r*1.0,cx+Math.cos(a+0.5)*r*1.8,cy+Math.sin(a+0.5)*r*1.3,cx+Math.cos(a+0.8)*r*2.0,cy+Math.sin(a+0.8)*r*1.5);ctx.stroke();}
      body('#004d40',0.68,0.72);
      // 深淵の輝き
      ctx.fillStyle='rgba(29,233,182,0.15)'; ctx.beginPath(); ctx.arc(cx,cy,r*1.7,0,Math.PI*2); ctx.fill();
      head('#b2dfdb',0.95); hair('#00251a',0.72);
      ctx.fillStyle='#1de9b6'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.15,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.15,r*0.19,r*0.23,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(cx-r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.25,cy-r*0.15,r*0.1,0,Math.PI*2); ctx.fill();
      weapon(); break;

    // ===== スーパーレア 素手系 =====
    case 'knux': case 'brawny': case 'striker': case 'crusher':
      legs(brawler.col,brawler.skinColor||'#ffccbc'); arms(brawler.col,brawler.skinColor||'#ffccbc');
      body(brawler.col,0.72,0.72);
      // 赤/オレンジ系格闘グローブ
      ctx.fillStyle=brawler.col; ctx.beginPath(); ctx.arc(cx-r*0.88,cy+r*0.68,r*0.26,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.88,cy+r*0.68,r*0.26,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=r*0.08; ctx.beginPath(); ctx.arc(cx-r*0.88,cy+r*0.68,r*0.26,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+r*0.88,cy+r*0.68,r*0.26,0,Math.PI*2); ctx.stroke();
      head(brawler.skinColor||'#ffccbc',0.95); hair(brawler.hairColor||'#333',0.72);
      ctx.strokeStyle=brawler.hairColor||'#333'; ctx.lineWidth=r*0.14; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(cx-r*0.44,cy-r*0.42); ctx.lineTo(cx-r*0.12,cy-r*0.35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.44,cy-r*0.42); ctx.lineTo(cx+r*0.12,cy-r*0.35); ctx.stroke();
      eyes(); break;

    case 'whirl':
      legs(brawler.col,'#e0f2f1'); arms(brawler.col,'#e0f2f1');
      body(brawler.col,0.65,0.72);
      // 回転エフェクト
      ctx.strokeStyle='rgba(0,137,123,0.4)'; ctx.lineWidth=r*0.18;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(cx,cy+r*0.45,r*(0.8+i*0.25),0,Math.PI*2);ctx.stroke();}
      head('#e0f2f1',0.9); hair('#004d40',0.7); eyes(); break;

    // ===== レア 素手系 =====
    case 'jab': case 'pummel': case 'slap': case 'bonk': case 'smack':
      legs(brawler.col,brawler.skinColor||'#ffccbc'); arms(brawler.col,brawler.skinColor||'#ffccbc');
      body(brawler.col,0.62,0.7);
      // 小さめのグー
      ctx.fillStyle=shadeColor(brawler.col,20);
      ctx.beginPath(); ctx.arc(cx-r*0.84,cy+r*0.66,r*0.2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.84,cy+r*0.66,r*0.2,0,Math.PI*2); ctx.fill();
      head(brawler.skinColor||'#fce4ec',0.88); hair(brawler.hairColor||'#333',0.7); eyes(); break;

    // ===== エピック 爆弾系 =====
    case 'grenader': case 'boomer': case 'kaboom':
      legs(brawler.col,brawler.skinColor||'#dcedc8'); arms(brawler.col,brawler.skinColor||'#dcedc8');
      body(brawler.col,0.68,0.72);
      // 爆弾ベルト
      ctx.fillStyle='#4e342e'; ctx.fillRect(cx-r*0.6,cy+r*0.2,r*1.2,r*0.18);
      for(let i=0;i<4;i++){ctx.fillStyle=brawler.col;ctx.beginPath();ctx.arc(cx-r*0.44+i*r*0.3,cy+r*0.29,r*0.12,0,Math.PI*2);ctx.fill();}
      head(brawler.skinColor||'#dcedc8',0.9);
      // ゴーグル
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.ellipse(cx-r*0.26,cy-r*0.18,r*0.2,r*0.17,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.26,cy-r*0.18,r*0.2,r*0.17,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#e65100'; ctx.lineWidth=r*0.07; ctx.beginPath(); ctx.moveTo(cx-r*0.06,cy-r*0.18); ctx.lineTo(cx+r*0.06,cy-r*0.18); ctx.stroke();
      hair(brawler.hairColor||'#333',0.72); weapon(); break;

    // ===== ミシック 素手系 =====
    case 'titan3': case 'wrath': case 'golem':
      legs(brawler.col,brawler.skinColor||'#e1bee7'); arms(brawler.col,brawler.skinColor||'#e1bee7');
      body(brawler.col,0.85,0.78);
      // 重装甲プレート
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.roundRect(cx-r*0.75,cy+r*0.05,r*1.5,r*0.78,r*0.1); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.roundRect(cx-r*0.65,cy+r*0.1,r*1.3,r*0.65,r*0.08); ctx.fill();
      // 大きなグローブ
      ctx.fillStyle=shadeColor(brawler.col,15);
      ctx.beginPath(); ctx.arc(cx-r*1.0,cy+r*0.3,r*0.32,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*1.0,cy+r*0.3,r*0.32,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=r*0.07;
      ctx.beginPath(); ctx.arc(cx-r*1.0,cy+r*0.3,r*0.32,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+r*1.0,cy+r*0.3,r*0.32,0,Math.PI*2); ctx.stroke();
      head(brawler.skinColor||'#e1bee7',1.0); hair(brawler.hairColor||'#333',0.72);
      ctx.strokeStyle=brawler.hairColor||'#333'; ctx.lineWidth=r*0.16; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(cx-r*0.46,cy-r*0.44); ctx.lineTo(cx-r*0.1,cy-r*0.36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+r*0.46,cy-r*0.44); ctx.lineTo(cx+r*0.1,cy-r*0.36); ctx.stroke();
      eyes(); break;

    // ===== レジェンダリー 弓系 =====
    case 'archer': case 'elven':
      legs(brawler.col,brawler.skinColor||'#dcedc8'); arms(brawler.col,brawler.skinColor||'#dcedc8');
      body(brawler.col,0.58,0.72);
      head(brawler.skinColor||'#dcedc8',0.88); hair(brawler.hairColor||'#1b5e20',0.72);
      // 耳（エルフ風）
      ctx.fillStyle=brawler.skinColor||'#dcedc8';
      ctx.beginPath(); ctx.moveTo(cx-r*0.88,cy-r*0.3); ctx.lineTo(cx-r*1.1,cy-r*0.55); ctx.lineTo(cx-r*0.88,cy-r*0.05); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+r*0.88,cy-r*0.3); ctx.lineTo(cx+r*1.1,cy-r*0.55); ctx.lineTo(cx+r*0.88,cy-r*0.05); ctx.closePath(); ctx.fill();
      // 矢筒（背中）
      ctx.fillStyle=shadeColor(brawler.col,20); ctx.beginPath(); ctx.roundRect(cx+r*0.55,cy-r*0.4,r*0.22,r*0.85,r*0.08); ctx.fill();
      // 矢
      for(let i=0;i<3;i++){ctx.strokeStyle='#a1887f';ctx.lineWidth=r*0.06;ctx.beginPath();ctx.moveTo(cx+r*0.66,cy-r*0.38+i*r*0.2);ctx.lineTo(cx+r*0.66,cy-r*0.55+i*r*0.2);ctx.stroke();}
      eyes(); weapon(); break;

    // ===== ウルトラレジェンダリー HEXARM 6腕 =====
    case 'hexarm':
      // 影
      {
        const g=ctx.createRadialGradient(cx,size*0.96,0,cx,size*0.96,r*0.9);
        g.addColorStop(0,'rgba(49,27,146,0.5)'); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,size*0.95,r*0.9,r*0.16,0,0,Math.PI*2); ctx.fill();
      }
      // 6本腕（上2=弓、中2=剣、下2=こぶし）
      // 上腕（弓）
      ctx.fillStyle='#4527a0';
      ctx.beginPath(); ctx.roundRect(cx-r*1.35,cy-r*0.55,r*0.32,r*0.68,r*0.12); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*1.03,cy-r*0.55,r*0.32,r*0.68,r*0.12); ctx.fill();
      // 弓（上腕の手）
      ctx.strokeStyle='#b388ff'; ctx.lineWidth=r*0.12;
      ctx.beginPath(); ctx.arc(cx-r*1.22,cy-r*0.12,r*0.32,-Math.PI*0.8,Math.PI*0.8); ctx.stroke();
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=r*0.05;
      ctx.beginPath(); ctx.moveTo(cx-r*1.22,cy-r*0.44); ctx.lineTo(cx-r*1.22,cy+r*0.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+r*1.18,cy-r*0.12,r*0.32,Math.PI*0.2,-Math.PI*0.8); ctx.stroke();
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=r*0.05;
      ctx.beginPath(); ctx.moveTo(cx+r*1.18,cy-r*0.44); ctx.lineTo(cx+r*1.18,cy+r*0.2); ctx.stroke();
      // 中腕（剣）
      ctx.fillStyle='#512da8';
      ctx.beginPath(); ctx.roundRect(cx-r*1.18,cy+r*0.05,r*0.32,r*0.65,r*0.12); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.86,cy+r*0.05,r*0.32,r*0.65,r*0.12); ctx.fill();
      // 剣
      ctx.fillStyle='#e8eaf6'; ctx.beginPath(); ctx.roundRect(cx-r*1.15,cy+r*0.55,r*0.08,r*0.65,r*0.03); ctx.fill();
      ctx.fillStyle='#9575cd'; ctx.beginPath(); ctx.roundRect(cx-r*1.22,cy+r*0.62,r*0.22,r*0.1,r*0.03); ctx.fill();
      ctx.fillStyle='#e8eaf6'; ctx.beginPath(); ctx.roundRect(cx+r*1.07,cy+r*0.55,r*0.08,r*0.65,r*0.03); ctx.fill();
      ctx.fillStyle='#9575cd'; ctx.beginPath(); ctx.roundRect(cx+r*1.0,cy+r*0.62,r*0.22,r*0.1,r*0.03); ctx.fill();
      // 下腕（こぶし）
      ctx.fillStyle='#673ab7';
      ctx.beginPath(); ctx.roundRect(cx-r*0.98,cy+r*0.55,r*0.3,r*0.62,r*0.12); ctx.fill();
      ctx.beginPath(); ctx.roundRect(cx+r*0.68,cy+r*0.55,r*0.3,r*0.62,r*0.12); ctx.fill();
      // こぶし
      ctx.fillStyle='#7e57c2'; ctx.beginPath(); ctx.arc(cx-r*0.83,cy+r*1.15,r*0.26,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+r*0.83,cy+r*1.15,r*0.26,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=r*0.07;
      ctx.beginPath(); ctx.arc(cx-r*0.83,cy+r*1.15,r*0.26,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+r*0.83,cy+r*1.15,r*0.26,0,Math.PI*2); ctx.stroke();
      // 脚
      legs('#311b92','#ede7f6');
      // 胴体
      {const g=ctx.createLinearGradient(cx-r*0.68,cy,cx+r*0.68,cy);
      g.addColorStop(0,'#1a0030');g.addColorStop(0.4,'#311b92');g.addColorStop(1,'#1a0030');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy+r*0.48,r*0.68,r*0.72,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.08)';ctx.beginPath();ctx.ellipse(cx-r*0.18,cy+r*0.15,r*0.28,r*0.35,0,0,Math.PI*2);ctx.fill();}
      // 頭
      {const g=ctx.createRadialGradient(cx-r*0.2,cy-r*0.55,0,cx,cy-r*0.2,r);
      g.addColorStop(0,lightenColor('#ede7f6',20));g.addColorStop(0.6,'#ede7f6');g.addColorStop(1,shadeColor('#ede7f6',15));
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy-r*0.2,r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=size*0.01;ctx.stroke();}
      hair('#1a0a2e',0.72);
      // 6つの目（三対）
      const eyePositions=[[-r*0.3,-r*0.08],[r*0.3,-r*0.08],[-r*0.25,-r*0.28],[r*0.25,-r*0.28],[-r*0.1,-r*0.4],[r*0.1,-r*0.4]];
      eyePositions.forEach(([ex,ey],i)=>{
        ctx.fillStyle=i<2?'#b388ff':i<4?'#ea80fc':'#ea80fc';
        ctx.beginPath();ctx.arc(cx+ex,cy+ey,r*0.1,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(0,0,0,0.5)';ctx.beginPath();ctx.arc(cx+ex,cy+ey,r*0.06,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.arc(cx+ex-r*0.03,cy+ey-r*0.04,r*0.03,0,Math.PI*2);ctx.fill();
      });
      weapon(); break;

    default:
      legs(brawler.col, brawler.skinColor||'#ffcc80');
      arms(brawler.col, brawler.skinColor||'#ffcc80');
      body(brawler.col); head(brawler.skinColor||'#ffcc80'); hair(brawler.hairColor||'#333'); eyes(); weapon(); break;
  }
}

function drawWeaponPreview(ctx, b, cx, cy, r, size) {
  ctx.save();
  ctx.translate(cx + r*0.7, cy + r*0.4);
  ctx.rotate(-0.4);
  const wl=size*0.38, wh=size*0.075;
  drawWeaponShape(ctx, b.id, wl, wh, r);
  ctx.restore();
}

function drawWeaponInGame(ctx, b, facing, r, walkOff, isPlayer) {
  ctx.save();
  const armLen=r*0.8;
  ctx.translate(Math.cos(facing)*armLen, Math.sin(facing)*armLen+walkOff*0.2+r*0.4);
  ctx.rotate(facing);
  const wl=r*2.6, wh=r*0.38;
  drawWeaponShape(ctx, b.id, wl, wh, r);
  ctx.restore();
}

function drawWeaponShape(ctx, id, wl, wh, r) {
  ctx.save();
  switch(id) {
    case 'shelly':
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*1.15,wl*1.25,wh,4); ctx.fill();
      ctx.fillStyle='#78909c'; ctx.beginPath(); ctx.roundRect(-wl*0.15,wh*0.15,wl*1.25,wh,4); ctx.fill();
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.5,-wh*1.25,wl*0.42,wh*2.5,5); ctx.fill();
      ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.roundRect(wl*1.05,-wh*1.15,wl*0.1,wh,2); ctx.fill();
      ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.roundRect(wl*1.05,wh*0.15,wl*0.1,wh,2); ctx.fill();
      break;
    case 'colt':
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.1,wl*1.1,wh*0.85,5); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.6,wl*0.5,wh*0.65,3); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(-wl*0.22,-wh*0.5,wl*0.32,wh*0.65,3); ctx.fill();
      ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(wl*0.55,-wh*0.85,wh*0.28,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.2,wh*0.25,wl*1.1,wh*0.85,5); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(wl*0.6,wh*0.28,wl*0.5,wh*0.65,3); ctx.fill();
      break;
    case 'bull':
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.3,-wh*1.3,wl*1.35,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#6d4c41'; ctx.beginPath(); ctx.roundRect(-wl*0.3,wh*0.2,wl*1.35,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#3e2723'; ctx.beginPath(); ctx.roundRect(-wl*0.65,-wh*1.5,wl*0.42,wh*3.0,6); ctx.fill();
      ctx.fillStyle='#ff8a65'; ctx.beginPath(); ctx.roundRect(wl*1.0,-wh*1.3,wl*0.1,wh*1.1,2); ctx.fill();
      ctx.fillStyle='#ff8a65'; ctx.beginPath(); ctx.roundRect(wl*1.0,wh*0.2,wl*0.1,wh*1.1,2); ctx.fill();
      break;
    case 'brock':
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.0,wl*1.4,wh*2.0,6); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.4,wl*1.3,wh*0.8,4); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.roundRect(wl*1.15,-wh*1.1,wl*0.2,wh*2.2,3); ctx.fill();
      ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.moveTo(wl*1.35,-wh*0.8); ctx.lineTo(wl*1.65,0); ctx.lineTo(wl*1.35,wh*0.8); ctx.closePath(); ctx.fill();
      break;
    case 'spike':
      ctx.fillStyle='#2e7d32'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*1.5,wl*0.85,wh*3.0,8); ctx.fill();
      ctx.fillStyle='#43a047'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.8,wl*0.75,wh*1.6,6); ctx.fill();
      ctx.fillStyle='#a5d6a7';
      for(let i=0;i<7;i++){const sx=i*(wl*0.12)-wl*0.04; ctx.beginPath();ctx.moveTo(sx,-wh*1.5);ctx.lineTo(sx-wh*0.5,-wh*2.1);ctx.lineTo(sx+wh*0.5,-wh*2.1);ctx.closePath();ctx.fill();}
      ctx.fillStyle='#81c784'; ctx.beginPath(); ctx.arc(-wl*0.05,0,wh*1.1,0,Math.PI*2); ctx.fill();
      break;
    case 'leon':
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.65,wl*1.05,wh*1.3,4); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.arc(wl*0.75,0,wh*1.05,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#26c6da'; ctx.beginPath(); ctx.arc(wl*0.75,0,wh*0.75,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#e0f7fa'; ctx.lineWidth=wh*0.3;
      for(let i=0;i<4;i++){const a=i*Math.PI/2; ctx.beginPath();ctx.moveTo(wl*0.75+Math.cos(a)*wh*0.2,Math.sin(a)*wh*0.2);ctx.lineTo(wl*0.75+Math.cos(a)*wh*0.7,Math.sin(a)*wh*0.7);ctx.stroke();}
      break;
    case 'nita':
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.7,wl*1.1,wh*1.4,5); ctx.fill();
      ctx.fillStyle='#a1887f'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.5,wl*0.5,wh*1.0,3); ctx.fill();
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*0.45,wl*0.28,wh*0.9,3); ctx.fill();
      ctx.fillStyle='#ef9a9a'; ctx.beginPath(); ctx.arc(wl*0.25,0,wh*0.45,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#e57373'; ctx.lineWidth=wh*0.25;
      ctx.beginPath(); ctx.arc(wl*0.25,0,wh*0.7,0,Math.PI*2); ctx.stroke();
      break;
    case 'jessie':
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.6,wl*1.1,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#e64a19'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.4,wl*0.5,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*0.38,wl*0.3,wh*0.76,3); ctx.fill();
      ctx.strokeStyle='#ffeb3b'; ctx.lineWidth=wh*0.4;
      for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(wl*1.05,0,wh*(0.3+i*0.18),i*Math.PI*0.5,(i+0.5)*Math.PI*0.5);ctx.stroke();}
      ctx.fillStyle='#ffeb3b'; ctx.beginPath(); ctx.arc(wl*1.05,0,wh*0.35,0,Math.PI*2); ctx.fill();
      break;
    case 'piper':
      ctx.fillStyle='#ad1457'; ctx.beginPath(); ctx.roundRect(-wl*0.3,-wh*0.55,wl*1.7,wh*1.1,4); ctx.fill();
      ctx.fillStyle='#c2185b'; ctx.beginPath(); ctx.roundRect(-wl*0.3+2,-wh*0.25,wl*1.5,wh*0.5,3); ctx.fill();
      ctx.fillStyle='#880e4f'; ctx.beginPath(); ctx.roundRect(-wl*0.6,-wh*0.65,wl*0.38,wh*1.3,4); ctx.fill();
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.roundRect(wl*0.2,-wh*1.2,wl*0.28,wh*0.75,3); ctx.fill();
      ctx.fillStyle='rgba(100,200,255,0.55)'; ctx.beginPath(); ctx.arc(wl*0.34,-wh*0.82,wh*0.22,0,Math.PI*2); ctx.fill();
      break;
    case 'penny':
      ctx.fillStyle='#e65100'; ctx.beginPath(); ctx.roundRect(-wl*0.3,-wh*1.1,wl*1.2,wh*2.2,7); ctx.fill();
      ctx.fillStyle='#ff6d00'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*0.5,wl*1.1,wh*1.0,5); ctx.fill();
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.6,-wh*1.3,wl*0.38,wh*2.6,5); ctx.fill();
      ctx.strokeStyle='#ffd54f'; ctx.lineWidth=wh*0.3;
      ctx.beginPath(); ctx.arc(-wl*0.42,0,wh*0.6,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='#ff1744'; ctx.beginPath(); ctx.arc(wl*0.85,0,wh*0.5,0,Math.PI*2); ctx.fill();
      break;
    case 'rico':
      ctx.fillStyle='#006064'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.65,wl*1.1,wh*1.3,5); ctx.fill();
      ctx.fillStyle='#00838f'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.4,wl*0.55,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#004d40'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*0.4,wl*0.32,wh*0.8,3); ctx.fill();
      ctx.strokeStyle='#80deea'; ctx.lineWidth=wh*0.25;
      ctx.beginPath(); ctx.moveTo(wl*0.15,-wh*0.5); ctx.lineTo(wl*0.45,0); ctx.lineTo(wl*0.15,wh*0.5); ctx.stroke();
      ctx.fillStyle='#80deea'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.4,0,Math.PI*2); ctx.fill();
      break;
    case 'rosa':
      ctx.fillStyle='#1b5e20'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*1.3,wl*0.7,wh*2.6,8); ctx.fill();
      ctx.fillStyle='#2e7d32'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.9,wl*0.6,wh*1.8,7); ctx.fill();
      ctx.fillStyle='#43a047'; ctx.beginPath(); ctx.roundRect(wl*0.55,-wh*1.0,wl*0.35,wh*2.0,10); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.roundRect(wl*0.58,-wh*0.2,wl*0.28,wh*0.4,3); ctx.fill();
      break;
    case 'darryl':
      ctx.fillStyle='#455a64'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.2,wl*1.3,wh*1.05,5); ctx.fill();
      ctx.fillStyle='#607d8b'; ctx.beginPath(); ctx.roundRect(-wl*0.2,wh*0.15,wl*1.3,wh*1.05,5); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(-wl*0.55,-wh*1.4,wl*0.42,wh*2.8,5); ctx.fill();
      ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.roundRect(wl*1.05,-wh*1.2,wl*0.08,wh*1.0,2); ctx.fill();
      ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.roundRect(wl*1.05,wh*0.2,wl*0.08,wh*1.0,2); ctx.fill();
      break;
    case 'crow':
      for(let i=0;i<3;i++){
        const off=(i-1)*wh*1.2;
        ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.moveTo(wl*1.1,off); ctx.lineTo(-wl*0.1,off-wh*0.35); ctx.lineTo(-wl*0.1,off+wh*0.35); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#4fc3f7'; ctx.beginPath(); ctx.moveTo(wl*1.1,off); ctx.lineTo(wl*0.2,off-wh*0.2); ctx.lineTo(wl*0.2,off+wh*0.2); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#80cbc4'; ctx.beginPath(); ctx.roundRect(-wl*0.2,off-wh*0.22,wl*0.15,wh*0.44,2); ctx.fill();
      }
      break;
    case 'mortis':
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.5,wl*1.2,wh,5); ctx.fill();
      ctx.fillStyle='#7b1fa2'; ctx.beginPath(); ctx.roundRect(wl*0.9,-wh*1.3,wl*0.3,wh*1.3,4); ctx.fill();
      ctx.fillStyle='#6a1b9a'; ctx.beginPath(); ctx.roundRect(wl*0.9,0,wl*0.3,wh*1.3,4); ctx.fill();
      ctx.strokeStyle='#e040fb'; ctx.lineWidth=wh*0.25;
      ctx.beginPath(); ctx.roundRect(wl*0.88,-wh*1.35,wl*0.34,wh*2.7,4); ctx.stroke();
      ctx.fillStyle='#e040fb'; ctx.beginPath(); ctx.arc(wl*1.05,-wh*1.3,wh*0.3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#e040fb'; ctx.beginPath(); ctx.arc(wl*1.05,wh*1.3,wh*0.3,0,Math.PI*2); ctx.fill();
      break;
    case 'zara':
      // フレイムボウ
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.5,wl*0.9,wh,5); ctx.fill();
      ctx.strokeStyle='#ff6d00'; ctx.lineWidth=wh*0.6;
      ctx.beginPath(); ctx.arc(wl*0.5,0,wh*1.4,-Math.PI*0.6,Math.PI*0.6,false); ctx.stroke();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.arc(wl*0.85,0,wh*0.6,0,Math.PI*2); ctx.fill();
      break;
    case 'kuro':
      // シャドウブレード
      ctx.fillStyle='#212121'; ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.lineTo(wl*1.1,-wh*0.9); ctx.lineTo(wl*1.2,0); ctx.lineTo(wl*1.1,wh*0.9); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#9e9e9e'; ctx.lineWidth=wh*0.25; ctx.beginPath(); ctx.moveTo(wl*0.1,-wh*0.5); ctx.lineTo(wl*0.9,0); ctx.lineTo(wl*0.1,wh*0.5); ctx.stroke();
      break;
    case 'volta':
      // サンダーガン
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.6,wl*1.1,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#ffee58'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.4,wl*0.5,wh*0.8,3); ctx.fill();
      ctx.strokeStyle='#fff176'; ctx.lineWidth=wh*0.3;
      ctx.beginPath(); ctx.moveTo(wl*1.0,-wh*0.8); ctx.lineTo(wl*1.3,0); ctx.lineTo(wl*1.0,wh*0.8); ctx.stroke();
      break;
    case 'mira':
      // アイスニードル
      ctx.fillStyle='#0097a7'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.55,wl*1.1,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#e0f7fa'; ctx.beginPath(); ctx.moveTo(wl*1.1,0); ctx.lineTo(wl*0.6,-wh*0.5); ctx.lineTo(wl*0.6,wh*0.5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#80deea'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(wl*0.1,-wh*0.4); ctx.lineTo(wl*0.8,0); ctx.lineTo(wl*0.1,wh*0.4); ctx.stroke();
      break;
    case 'goro':
      // 鉄拳グローブ
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*1.2,wl*0.65,wh*2.4,9); ctx.fill();
      ctx.fillStyle='#6d4c41'; ctx.beginPath(); ctx.roundRect(wl*0.5,-wh*1.4,wl*0.5,wh*2.8,12); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.roundRect(wl*0.52,-wh*0.25,wl*0.42,wh*0.5,3); ctx.fill();
      break;
    case 'nyx':
      // ムーンダガー
      ctx.fillStyle='#283593'; ctx.beginPath(); ctx.moveTo(wl*1.1,0); ctx.lineTo(-wl*0.1,-wh*0.3); ctx.lineTo(-wl*0.1,wh*0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#7986cb'; ctx.beginPath(); ctx.moveTo(wl*1.1,0); ctx.lineTo(wl*0.3,-wh*0.18); ctx.lineTo(wl*0.3,wh*0.18); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#c5cae9'; ctx.beginPath(); ctx.arc(wl*1.0,0,wh*0.3,0,Math.PI*2); ctx.fill();
      break;
    case 'blast':
      // グレネードランチャー
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.1,wl*1.5,wh*2.2,6); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.45,wl*1.35,wh*0.9,4); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.arc(wl*1.25,0,wh*0.7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ff8a65'; ctx.beginPath(); ctx.arc(wl*1.25,-wh*0.3,wh*0.25,0,Math.PI*2); ctx.fill();
      break;
    case 'ivy':
      // ソーンウィップ
      ctx.strokeStyle='#2e7d32'; ctx.lineWidth=wh*0.6;
      ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.bezierCurveTo(wl*0.2,-wh*1.0,wl*0.6,wh*1.0,wl*1.1,0); ctx.stroke();
      ctx.fillStyle='#a5d6a7';
      for(let i=0;i<4;i++){const t=i/3;const x=-wl*0.1+t*wl*1.2;const y=Math.sin(t*Math.PI)*(-wh)*(i%2===0?1:-1);ctx.beginPath();ctx.arc(x,y,wh*0.5,0,Math.PI*2);ctx.fill();}
      break;
    case 'rex':
      // ダイノクロー
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*1.3,wl*0.6,wh*2.6,7); ctx.fill();
      ctx.fillStyle='#ff7043';
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(wl*0.5,(-1.5+i)*wh*0.8);ctx.lineTo(wl*1.2,(-1.2+i)*wh*0.8);ctx.lineTo(wl*1.2,(-0.8+i)*wh*0.8);ctx.closePath();ctx.fill();}
      break;
    case 'wave':
      // ウォーターキャノン
      ctx.fillStyle='#01579b'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*1.0,wl*1.25,wh*2.0,7); ctx.fill();
      ctx.fillStyle='#03a9f4'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.45,wl*1.15,wh*0.9,5); ctx.fill();
      ctx.fillStyle='#e1f5fe'; ctx.beginPath(); ctx.arc(wl*0.9,0,wh*0.5,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#81d4fa'; ctx.lineWidth=wh*0.3;
      for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(wl*1.1,i*wh*0.5);ctx.lineTo(wl*1.5,i*wh*0.5);ctx.stroke();}
      break;
    case 'zorn':
      // デモンクロー（2本の曲がった爪）
      ctx.fillStyle='#7f0000';
      ctx.beginPath(); ctx.moveTo(-wl*0.1,-wh*0.2); ctx.bezierCurveTo(wl*0.3,-wh*1.2,wl*0.8,-wh*0.8,wl*1.1,-wh*0.1); ctx.lineTo(wl*0.9,0); ctx.bezierCurveTo(wl*0.6,-wh*0.5,wl*0.2,-wh*0.8,-wl*0.05,0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-wl*0.1,wh*0.2); ctx.bezierCurveTo(wl*0.3,wh*1.2,wl*0.8,wh*0.8,wl*1.1,wh*0.1); ctx.lineTo(wl*0.9,0); ctx.bezierCurveTo(wl*0.6,wh*0.5,wl*0.2,wh*0.8,-wl*0.05,0); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#e53935'; ctx.beginPath(); ctx.arc(wl*1.05,0,wh*0.35,0,Math.PI*2); ctx.fill();
      break;
    case 'kira':
      // スターブレード
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.55,wl*1.3,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#fff176';
      const starPts=5;
      ctx.save(); ctx.translate(wl*1.0,0);
      ctx.beginPath();
      for(let i=0;i<starPts*2;i++){const r2=i%2===0?wh*1.0:wh*0.45;const a=i*Math.PI/starPts-Math.PI/2;ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);}
      ctx.closePath(); ctx.fill(); ctx.restore();
      break;
    case 'punk':
      // エレキギター
      ctx.fillStyle='#880e4f'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.6,wl*1.1,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#ad1457'; ctx.beginPath(); ctx.roundRect(wl*0.65,-wh*1.3,wl*0.35,wh*2.6,7); ctx.fill();
      ctx.strokeStyle='#f48fb1'; ctx.lineWidth=wh*0.15;
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(wl*0.65,-wh*1.0+i*wh*0.6);ctx.lineTo(wl*0.3,i*wh*0.1-wh*0.15);ctx.stroke();}
      ctx.fillStyle='#ff80ab'; ctx.beginPath(); ctx.arc(wl*0.25,0,wh*0.5,0,Math.PI*2); ctx.fill();
      break;
    case 'titan':
      // メガキャノン
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*1.1,wl*1.55,wh*2.2,8); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.5,wl*1.4,wh,5); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(-wl*0.5,-wh*1.3,wl*0.35,wh*2.6,5); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.arc(wl*1.25,0,wh*0.7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(wl*1.25,0,wh*0.4,0,Math.PI*2); ctx.fill();
      break;
    case 'swift':
      // ウィンドカッター
      ctx.fillStyle='#1b5e20'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.5,wl*0.9,wh,5); ctx.fill();
      ctx.fillStyle='#00e676'; ctx.beginPath(); ctx.arc(wl*0.6,0,wh*1.0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#69f0ae';
      ctx.beginPath(); ctx.moveTo(wl*0.6,-wh); ctx.lineTo(wl*1.3,0); ctx.lineTo(wl*0.6,wh); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#fff'; ctx.lineWidth=wh*0.2;
      ctx.beginPath(); ctx.moveTo(wl*0.4,-wh*0.6); ctx.lineTo(wl*1.0,0); ctx.lineTo(wl*0.4,wh*0.6); ctx.stroke();
      break;
    case 'flint':
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.9,wl*1.2,wh*1.8,6); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(wl*0.8,-wh*0.6,wl*0.4,wh*1.2,3); ctx.fill();
      ctx.fillStyle='#ff8a65'; ctx.beginPath(); ctx.arc(wl*0.9,0,wh*0.5,0,Math.PI*2); ctx.fill();
      break;
    case 'aurora':
      // 翼型ブーメラン
      ctx.fillStyle='#00695c'; ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.bezierCurveTo(wl*0.3,-wh*1.5,wl*0.8,-wh*1.2,wl*1.1,0); ctx.bezierCurveTo(wl*0.8,wh*1.2,wl*0.3,wh*1.5,-wl*0.1,0); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#80cbc4'; ctx.beginPath(); ctx.arc(wl*0.5,0,wh*0.6,0,Math.PI*2); ctx.fill();
      break;
    case 'drago':
      // 炎の口
      ctx.fillStyle='#7f0000'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*1.0,wl*0.7,wh*2.0,8); ctx.fill();
      ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.moveTo(wl*0.6,-wh*0.8); ctx.bezierCurveTo(wl*1.3,0,wl*1.3,0,wl*0.6,wh*0.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#ffcc02'; ctx.beginPath(); ctx.moveTo(wl*0.7,-wh*0.4); ctx.bezierCurveTo(wl*1.1,0,wl*1.1,0,wl*0.7,wh*0.4); ctx.closePath(); ctx.fill();
      break;
    case 'echo':
      ctx.fillStyle='#311b92'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.6,wl*1.1,wh*1.2,5); ctx.fill();
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=wh*0.35;
      for(let i=1;i<=3;i++){ctx.globalAlpha=0.3+i*0.2; ctx.beginPath(); ctx.arc(wl*0.9,0,wh*i*0.45,Math.PI*1.3,Math.PI*0.7); ctx.stroke();}
      ctx.globalAlpha=1;
      ctx.fillStyle='#b39ddb'; ctx.beginPath(); ctx.arc(wl*0.9,0,wh*0.35,0,Math.PI*2); ctx.fill();
      break;
    case 'terra':
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.5,wl*0.5,wh,5); ctx.fill();
      ctx.fillStyle='#795548'; ctx.beginPath(); ctx.roundRect(wl*0.35,-wh*1.4,wl*0.65,wh*2.8,6); ctx.fill();
      ctx.fillStyle='#a1887f'; ctx.beginPath(); ctx.roundRect(wl*0.38,-wh*0.5,wl*0.55,wh,4); ctx.fill();
      break;
    case 'prism':
      // プリズム結晶
      ctx.fillStyle='#880e4f';
      ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.lineTo(wl*0.4,-wh*0.7); ctx.lineTo(wl*1.1,0); ctx.lineTo(wl*0.4,wh*0.7); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(224,64,251,0.6)';
      ctx.beginPath(); ctx.moveTo(wl*0.2,0); ctx.lineTo(wl*0.55,-wh*0.5); ctx.lineTo(wl*0.9,0); ctx.lineTo(wl*0.55,wh*0.5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#ea80fc'; ctx.lineWidth=wh*0.2; ctx.beginPath(); ctx.moveTo(wl*0.2,0); ctx.lineTo(wl*1.1,0); ctx.stroke();
      break;
    case 'forge':
      // マグマキャノン
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*1.05,wl*1.5,wh*2.1,7); ctx.fill();
      ctx.fillStyle='#e64a19'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.45,wl*1.35,wh*0.9,5); ctx.fill();
      ctx.fillStyle='#ff6d00'; ctx.beginPath(); ctx.arc(wl*1.2,0,wh*0.75,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(wl*1.2,0,wh*0.4,0,Math.PI*2); ctx.fill();
      break;
    case 'aether':
      // 光の剣
      ctx.fillStyle='#9fa8da'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.4,wl*0.4,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#e8eaf6'; ctx.beginPath(); ctx.moveTo(wl*0.3,-wh*0.9); ctx.lineTo(wl*1.1,0); ctx.lineTo(wl*0.3,wh*0.9); ctx.lineTo(wl*0.22,0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#c5cae9'; ctx.lineWidth=wh*0.2; ctx.beginPath(); ctx.moveTo(wl*0.4,-wh*0.6); ctx.lineTo(wl*0.9,0); ctx.lineTo(wl*0.4,wh*0.6); ctx.stroke();
      break;
    case 'vex':
      // ヘックスシュリケン
      ctx.fillStyle='#102027'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.55,wl*1.05,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#37474f';
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2; ctx.beginPath(); ctx.moveTo(wl*0.7,0); ctx.lineTo(wl*0.7+Math.cos(a)*wh*0.9,Math.sin(a)*wh*0.9); ctx.lineTo(wl*0.7+Math.cos(a+0.5)*wh*0.5,Math.sin(a+0.5)*wh*0.5); ctx.closePath(); ctx.fill();}
      break;
    case 'lumi':
      // 光弾ランチャー
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.6,wl*1.1,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#fff9c4'; ctx.beginPath(); ctx.arc(wl*0.8,0,wh*0.8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffee58'; ctx.beginPath(); ctx.arc(wl*0.8,0,wh*0.5,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#fff176'; ctx.lineWidth=wh*0.2;
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2; ctx.beginPath(); ctx.moveTo(wl*0.8+Math.cos(a)*wh*0.55,Math.sin(a)*wh*0.55); ctx.lineTo(wl*0.8+Math.cos(a)*wh*0.9,Math.sin(a)*wh*0.9); ctx.stroke();}
      break;
    case 'shampa':
      // シャンプーボトル
      ctx.fillStyle='#e91e8c'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*1.4,wl*0.55,wh*2.8,wh*0.5); ctx.fill();
      ctx.fillStyle='#f48fb1'; ctx.beginPath(); ctx.roundRect(wl*0.0,-wh*0.9,wl*0.4,wh*1.8,wh*0.4); ctx.fill();
      // ポンプノズル
      ctx.fillStyle='#ad1457'; ctx.beginPath(); ctx.roundRect(wl*0.45,-wh*1.1,wl*0.2,wh*0.5,wh*0.2); ctx.fill();
      ctx.beginPath(); ctx.roundRect(wl*0.55,-wh*1.2,wl*0.45,wh*0.22,wh*0.1); ctx.fill();
      // 泡
      ctx.fillStyle='rgba(255,255,255,0.6)';
      for(let i=0;i<4;i++){ctx.beginPath(); ctx.arc(wl*(0.85+i*0.1),rand(-wh*0.5,wh*0.5),wh*(0.15+i*0.05),0,Math.PI*2); ctx.fill();}
      break;
    case 'babi':
      // ラッキーバット（野球バット風 + コインマーク）
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.28,wl*0.35,wh*0.56,wh*0.28); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(wl*0.2,-wh*0.55,wl*0.85,wh*1.1,wh*0.45); ctx.fill();
      ctx.fillStyle='#a1887f'; ctx.beginPath(); ctx.roundRect(wl*0.22,-wh*0.4,wl*0.8,wh*0.8,wh*0.35); ctx.fill();
      // コインマーク
      ctx.fillStyle='#ffcc00'; ctx.font=`bold ${wh*1.2}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('$',wl*0.62,0);
      break;
    case 'toss':
      // 素手 - グローブ
      ctx.fillStyle='#c62828'; ctx.beginPath(); ctx.arc(wl*0.5,0,wh*1.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#b71c1c'; ctx.beginPath(); ctx.arc(wl*0.5,-wh*0.5,wh*0.6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(wl*0.35,-wh*0.3,wh*0.35,0,Math.PI*2); ctx.fill();
      // 指の線
      ctx.strokeStyle='#7f0000'; ctx.lineWidth=wh*0.14;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(wl*0.25+i*wh*0.28,wh*0.3);ctx.lineTo(wl*0.25+i*wh*0.28,wh*0.9);ctx.stroke();}
      break;
    case 'flamma':
      // インフェルノガン（炎放射器）
      ctx.fillStyle='#bf360c'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.7,wl*1.3,wh*1.4,5); ctx.fill();
      ctx.fillStyle='#e64a19'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.45,wl*1.2,wh*0.9,4); ctx.fill();
      // 炎口
      for(let i=0;i<5;i++){ctx.fillStyle=`rgba(255,${100+i*30},0,0.7)`;ctx.beginPath();ctx.arc(wl*1.1,(-2+i)*wh*0.38,wh*(0.3-i*0.02),0,Math.PI*2);ctx.fill();}
      break;
    case 'mirror':
      // リフレクトライフル（鏡面）
      ctx.fillStyle='#78909c'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.55,wl*1.2,wh*1.1,4); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.roundRect(wl*0.1,-wh*0.4,wl*0.85,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#b0bec5'; ctx.beginPath(); ctx.roundRect(wl*0.9,-wh*0.28,wl*0.3,wh*0.56,3); ctx.fill();
      break;
    case 'shield':
      // フォートレスキャノン（大砲）
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(-wl*0.25,-wh*1.1,wl*1.55,wh*2.2,6); ctx.fill();
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.5,wl*1.4,wh,5); ctx.fill();
      ctx.fillStyle='#ef5350'; ctx.beginPath(); ctx.arc(wl*1.25,0,wh*0.75,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#b71c1c'; ctx.beginPath(); ctx.arc(wl*1.25,0,wh*0.45,0,Math.PI*2); ctx.fill();
      break;
    case 'ghost':
      // ファントムガン（半透明）
      ctx.globalAlpha=0.7;
      ctx.fillStyle='rgba(200,200,220,0.8)'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.5,wl*1.1,wh,4); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.roundRect(wl*0.6,-wh*0.35,wl*0.45,wh*0.7,3); ctx.fill();
      ctx.globalAlpha=1;
      break;
    case 'dyna':
      // ボムランチャー
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.9,wl*0.5,wh*1.8,5); ctx.fill();
      ctx.fillStyle='#ffd600'; ctx.beginPath(); ctx.roundRect(wl*0.3,-wh*1.0,wl*0.85,wh*2.0,wh*0.6); ctx.fill();
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.arc(wl*0.72,-wh*0.5,wh*0.55,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ff3d00'; ctx.beginPath(); ctx.arc(wl*0.72,wh*0.5,wh*0.55,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#e65100'; ctx.lineWidth=wh*0.15; ctx.beginPath(); ctx.moveTo(wl*1.05,-wh*0.6); ctx.lineTo(wl*1.2,0); ctx.lineTo(wl*1.05,wh*0.6); ctx.stroke();
      break;
    case 'quake':
      // 地震ハンマー
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.4,wl*0.4,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(wl*0.3,-wh*1.3,wl*0.75,wh*2.6,wh*0.3); ctx.fill();
      ctx.fillStyle='#6d4c41'; ctx.beginPath(); ctx.roundRect(wl*0.32,-wh*0.6,wl*0.68,wh*1.2,wh*0.2); ctx.fill();
      // ひび割れ
      ctx.strokeStyle='#3e2723'; ctx.lineWidth=wh*0.1;
      ctx.beginPath();ctx.moveTo(wl*0.55,-wh*1.0);ctx.lineTo(wl*0.75,0);ctx.lineTo(wl*0.55,wh*1.0);ctx.stroke();
      break;
    case 'neon':
      // レーザーピストル
      ctx.fillStyle='#006064'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.55,wl*1.1,wh*1.1,4); ctx.fill();
      ctx.fillStyle='#00e5ff'; ctx.beginPath(); ctx.roundRect(wl*0.7,-wh*0.35,wl*0.4,wh*0.7,3); ctx.fill();
      ctx.strokeStyle='#84ffff'; ctx.lineWidth=wh*0.25;
      ctx.beginPath();ctx.moveTo(wl*1.05,-wh*0.2);ctx.lineTo(wl*1.5,0);ctx.lineTo(wl*1.05,wh*0.2);ctx.stroke();
      // レーザードット
      ctx.fillStyle='#ff1744'; ctx.beginPath();ctx.arc(wl*1.5,0,wh*0.18,0,Math.PI*2);ctx.fill();
      break;
    case 'comet':
      // メテオキャノン
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.8,wl*1.4,wh*1.6,6); ctx.fill();
      ctx.fillStyle='#7b1fa2'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.45,wl*1.3,wh*0.9,5); ctx.fill();
      // 流星
      ctx.fillStyle='#e040fb'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(224,64,251,0.4)'; for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(wl*1.1,0,wh*(0.8+i*0.3),0,Math.PI*2);ctx.stroke();}
      break;
    case 'viper':
      // ベノムファング（蛇の牙型）
      ctx.fillStyle='#2e7d32';
      ctx.beginPath();ctx.moveTo(-wl*0.1,0);ctx.bezierCurveTo(wl*0.2,-wh*0.8,wl*0.6,-wh*0.9,wl*1.1,-wh*0.3);ctx.bezierCurveTo(wl*0.8,0,wl*0.8,0,wl*1.1,wh*0.3);ctx.bezierCurveTo(wl*0.6,wh*0.9,wl*0.2,wh*0.8,-wl*0.1,0);ctx.closePath();ctx.fill();
      ctx.fillStyle='#00e676'; ctx.beginPath();ctx.arc(wl*1.05,0,wh*0.35,0,Math.PI*2);ctx.fill();
      break;
    case 'gatling':
      // ツインガトリング
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.2,wl*1.35,wh*1.0,4); ctx.fill();
      ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.roundRect(-wl*0.2,wh*0.2,wl*1.35,wh*1.0,4); ctx.fill();
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.55,wl*1.25,wh*0.65,3); ctx.fill();
      // バレル
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(wl*0.95,-wh*1.1,wl*0.42,wh*0.65,3); ctx.fill();
      ctx.fillStyle='#263238'; ctx.beginPath(); ctx.roundRect(wl*0.95,wh*0.45,wl*0.42,wh*0.65,3); ctx.fill();
      break;
    case 'witch':
      // 呪いの杖
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.25,wl*0.3,wh*0.5,3); ctx.fill();
      ctx.strokeStyle='#6a1b9a'; ctx.lineWidth=wh*0.45;
      ctx.beginPath();ctx.moveTo(wl*0.2,0);ctx.lineTo(wl*1.0,0);ctx.stroke();
      // 宝珠
      ctx.fillStyle='#e040fb'; ctx.beginPath();ctx.arc(wl*1.1,0,wh*0.8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.arc(wl*1.0,-wh*0.3,wh*0.3,0,Math.PI*2);ctx.fill();
      // 星形
      ctx.fillStyle='#f8bbd0'; ctx.font=`${wh*1.4}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✦',wl*1.1,0);
      break;
    case 'boulder':
      // ロックローラー（丸い岩）
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.4,wl*0.4,wh*0.8,3); ctx.fill();
      ctx.fillStyle='#795548'; ctx.beginPath(); ctx.arc(wl*0.65,0,wh*1.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#6d4c41'; ctx.beginPath(); ctx.arc(wl*0.65,0,wh*0.8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.3)';
      for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(wl*0.65+rand(-wh*0.5,wh*0.5),rand(-wh*0.5,wh*0.5),wh*0.18,0,Math.PI*2);ctx.fill();}
      break;
    case 'spark':
      // チェインザッパー
      ctx.fillStyle='#e65100'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.55,wl*1.15,wh*1.1,5); ctx.fill();
      ctx.fillStyle='#f9a825'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.38,wl*1.05,wh*0.76,4); ctx.fill();
      // 稲妻マーク
      ctx.fillStyle='#fff176'; ctx.font=`bold ${wh*1.4}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('⚡',wl*0.55,0);
      break;
    case 'freeze':
      // クライオキャノン
      ctx.fillStyle='#01579b'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.8,wl*1.4,wh*1.6,6); ctx.fill();
      ctx.fillStyle='#0288d1'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.45,wl*1.3,wh*0.9,5); ctx.fill();
      ctx.fillStyle='#b3e5fc'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.75,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(wl*1.05,-wh*0.3,wh*0.3,0,Math.PI*2); ctx.fill();
      break;
    case 'phantom':
      ctx.fillStyle='#560027';
      ctx.beginPath();ctx.moveTo(-wl*0.1,0);ctx.lineTo(wl*0.4,-wh*0.4);ctx.lineTo(wl*1.15,0);ctx.lineTo(wl*0.4,wh*0.4);ctx.closePath();ctx.fill();
      ctx.fillStyle='#880e4f';
      ctx.beginPath();ctx.moveTo(wl*0.1,0);ctx.lineTo(wl*0.45,-wh*0.28);ctx.lineTo(wl*0.9,0);ctx.lineTo(wl*0.45,wh*0.28);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f06292'; ctx.beginPath();ctx.arc(wl*1.1,0,wh*0.3,0,Math.PI*2);ctx.fill();
      break;
    case 'blaze':
      ctx.fillStyle='#e65100'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.55,wl*1.1,wh*1.1,4); ctx.fill();
      ctx.fillStyle='#ff6f00'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.38,wl*1.0,wh*0.76,4); ctx.fill();
      for(let i=0;i<4;i++){ctx.fillStyle=`rgba(255,${80+i*30},0,0.6)`;ctx.beginPath();ctx.arc(wl*0.9,(-1.5+i)*wh*0.45,wh*(0.3-i*0.02),0,Math.PI*2);ctx.fill();}
      break;
    case 'zapp':
      ctx.fillStyle='#f57f17'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.5,wl*1.1,wh,4); ctx.fill();
      ctx.fillStyle='#ffd600'; ctx.beginPath(); ctx.roundRect(-wl*0.05,-wh*0.35,wl*1.0,wh*0.7,3); ctx.fill();
      ctx.strokeStyle='#fff176'; ctx.lineWidth=wh*0.3;
      ctx.beginPath();ctx.moveTo(wl*0.6,-wh*0.55);ctx.lineTo(wl*0.8,0);ctx.lineTo(wl*0.6,wh*0.55);ctx.stroke();
      break;
    case 'coral':
      ctx.fillStyle='#006064'; ctx.beginPath(); ctx.roundRect(-wl*0.12,-wh*0.65,wl*1.15,wh*1.3,5); ctx.fill();
      ctx.fillStyle='#00bcd4'; ctx.beginPath(); ctx.roundRect(-wl*0.07,-wh*0.42,wl*1.05,wh*0.84,4); ctx.fill();
      for(let i=0;i<3;i++){ctx.fillStyle='rgba(128,222,234,0.55)';ctx.beginPath();ctx.arc(wl*(0.6+i*0.2),0,wh*(0.55-i*0.1),0,Math.PI*2);ctx.fill();}
      break;
    case 'rusty':
      ctx.fillStyle='#4e342e'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.75,wl*0.5,wh*1.5,4); ctx.fill();
      ctx.fillStyle='#8d6e63'; ctx.beginPath(); ctx.roundRect(wl*0.3,-wh*0.9,wl*0.75,wh*1.8,wh*0.3); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.25)';
      for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(wl*0.55+i*wl*0.1,0,wh*0.2,0,Math.PI*2);ctx.fill();}
      break;
    case 'pip':
      ctx.fillStyle='#7b1fa2'; ctx.beginPath(); ctx.roundRect(-wl*0.08,-wh*0.3,wl*0.3,wh*0.6,3); ctx.fill();
      ctx.strokeStyle='#ce93d8'; ctx.lineWidth=wh*0.4;
      ctx.beginPath();ctx.moveTo(wl*0.2,0);ctx.lineTo(wl*0.9,0);ctx.stroke();
      ctx.fillStyle='#e040fb'; ctx.beginPath();ctx.arc(wl*1.0,0,wh*0.65,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath();ctx.arc(wl*0.9,-wh*0.28,wh*0.25,0,Math.PI*2);ctx.fill();
      break;
    case 'godrix':
      ctx.fillStyle='#7f0000'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.85,wl*1.45,wh*1.7,6); ctx.fill();
      ctx.fillStyle='#d50000'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.5,wl*1.35,wh*1.0,5); ctx.fill();
      ctx.fillStyle='#ffd740'; ctx.fillRect(-wl*0.05,-wh*0.08,wl*1.1,wh*0.16);
      ctx.fillStyle='#ff1744'; ctx.beginPath();ctx.arc(wl*1.15,0,wh*0.72,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,200,0.6)'; ctx.beginPath();ctx.arc(wl*1.05,-wh*0.3,wh*0.28,0,Math.PI*2);ctx.fill();
      break;
    case 'seraph':
      ctx.fillStyle='#e65100'; ctx.beginPath(); ctx.roundRect(-wl*0.12,-wh*0.6,wl*1.3,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#ffd740'; ctx.beginPath(); ctx.roundRect(-wl*0.07,-wh*0.35,wl*1.2,wh*0.7,4); ctx.fill();
      ctx.strokeStyle='rgba(255,255,200,0.8)'; ctx.lineWidth=wh*0.15;
      ctx.beginPath(); ctx.moveTo(wl*0.9,-wh*0.4); ctx.lineTo(wl*1.35,0); ctx.lineTo(wl*0.9,wh*0.4); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath();ctx.arc(wl*1.3,0,wh*0.4,0,Math.PI*2);ctx.fill();
      break;
    case 'void':
      ctx.fillStyle='#0d0d0d'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*0.9,wl*1.5,wh*1.8,6); ctx.fill();
      ctx.fillStyle='#1a0030'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.5,wl*1.4,wh*1.0,5); ctx.fill();
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=wh*0.18;
      ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.8,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='#7c4dff'; ctx.beginPath();ctx.arc(wl*1.1,0,wh*0.45,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(124,77,255,0.15)'; ctx.beginPath();ctx.arc(wl*1.1,0,wh*1.4,0,Math.PI*2);ctx.fill();
      break;
    case 'nova':
      ctx.fillStyle='#01579b'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.75,wl*1.3,wh*1.5,5); ctx.fill();
      ctx.fillStyle='#00e5ff'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.45,wl*1.2,wh*0.9,4); ctx.fill();
      for(let i=0;i<5;i++){const a=i/5*Math.PI*2; ctx.fillStyle='rgba(0,229,255,0.7)'; ctx.beginPath(); ctx.arc(wl*1.1+Math.cos(a)*wh*0.45,Math.sin(a)*wh*0.45,wh*0.22,0,Math.PI*2); ctx.fill();}
      ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(wl*1.1,0,wh*0.3,0,Math.PI*2);ctx.fill();
      break;
    case 'kronos':
      ctx.fillStyle='#1a0050'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.7,wl*1.35,wh*1.4,6); ctx.fill();
      ctx.fillStyle='#4a148c'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.42,wl*1.25,wh*0.84,5); ctx.fill();
      ctx.strokeStyle='#7c4dff'; ctx.lineWidth=wh*0.2; ctx.beginPath(); ctx.arc(wl*1.0,0,wh*0.7,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth=wh*0.18; ctx.strokeStyle='#b388ff';
      ctx.beginPath(); ctx.moveTo(wl*1.0,0); ctx.lineTo(wl*1.0,-wh*0.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wl*1.0,0); ctx.lineTo(wl*1.45,0); ctx.stroke();
      break;
    case 'inferna':
      ctx.fillStyle='#7f0000'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.75,wl*1.35,wh*1.5,5); ctx.fill();
      ctx.fillStyle='#ff3d00'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.45,wl*1.25,wh*0.9,4); ctx.fill();
      for(let i=0;i<6;i++){ctx.fillStyle=`rgba(255,${60+i*25},0,0.65)`;ctx.beginPath();ctx.arc(wl*1.1,(-2.5+i)*wh*0.32,wh*(0.28-i*0.02),0,Math.PI*2);ctx.fill();}
      break;
    case 'azura':
      ctx.fillStyle='#0d47a1'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.7,wl*1.3,wh*1.4,5); ctx.fill();
      ctx.fillStyle='#1565c0'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.42,wl*1.2,wh*0.84,4); ctx.fill();
      ctx.fillStyle='rgba(41,182,246,0.6)'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(wl*1.0,-wh*0.35,wh*0.3,0,Math.PI*2); ctx.fill();
      break;
    case 'terron':
      ctx.fillStyle='#1b5e20'; ctx.beginPath(); ctx.roundRect(-wl*0.2,-wh*1.1,wl*1.6,wh*2.2,6); ctx.fill();
      ctx.fillStyle='#33691e'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.65,wl*1.5,wh*1.3,5); ctx.fill();
      ctx.fillStyle='#558b2f'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.38,wl*1.4,wh*0.76,4); ctx.fill();
      ctx.fillStyle='#76ff03'; ctx.beginPath(); ctx.arc(wl*1.2,0,wh*0.6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.3)';
      for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(wl*(0.3+i*0.22),0,wh*0.18,0,Math.PI*2);ctx.fill();}
      break;
    case 'spectra':
      ctx.fillStyle='#880e4f'; ctx.beginPath(); ctx.roundRect(-wl*0.12,-wh*0.6,wl*1.25,wh*1.2,5); ctx.fill();
      ctx.fillStyle='#c62828'; ctx.beginPath(); ctx.roundRect(-wl*0.07,-wh*0.38,wl*1.15,wh*0.76,4); ctx.fill();
      const sc2=['#ef5350','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0'];
      for(let i=0;i<6;i++){ctx.fillStyle=sc2[i]+`bb`;ctx.beginPath();ctx.arc(wl*1.1+Math.cos(i/6*Math.PI*2)*wh*0.4,Math.sin(i/6*Math.PI*2)*wh*0.4,wh*0.2,0,Math.PI*2);ctx.fill();}
      break;
    case 'abyssal':
      ctx.fillStyle='#00251a'; ctx.beginPath(); ctx.roundRect(-wl*0.18,-wh*0.85,wl*1.45,wh*1.7,6); ctx.fill();
      ctx.fillStyle='#004d40'; ctx.beginPath(); ctx.roundRect(-wl*0.13,-wh*0.52,wl*1.35,wh*1.04,5); ctx.fill();
      ctx.fillStyle='rgba(29,233,182,0.4)'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.85,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1de9b6'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.48,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(wl*1.1,0,wh*0.25,0,Math.PI*2); ctx.fill();
      break;
    // 素手系（グローブ）
    case 'knux': case 'brawny': case 'crusher': case 'wrath': case 'titan3': case 'golem':
    case 'jab': case 'pummel': case 'slap': case 'bonk': case 'smack': case 'striker': case 'whirl':
      ctx.fillStyle=ctx._col||'#c62828';
      ctx.beginPath(); ctx.arc(wl*0.5,0,wh*1.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(wl*0.5,-wh*0.45,wh*0.55,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(wl*0.32,-wh*0.28,wh*0.32,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=wh*0.13;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(wl*0.22+i*wh*0.27,wh*0.28);ctx.lineTo(wl*0.22+i*wh*0.27,wh*0.88);ctx.stroke();}
      break;
    // 爆弾系
    case 'grenader': case 'boomer': case 'kaboom':
      // 爆弾（丸い）
      ctx.fillStyle='#212121'; ctx.beginPath(); ctx.arc(wl*0.7,0,wh*1.0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#424242'; ctx.beginPath(); ctx.arc(wl*0.6,-wh*0.35,wh*0.45,0,Math.PI*2); ctx.fill();
      // 導火線
      ctx.strokeStyle='#ffd600'; ctx.lineWidth=wh*0.15;
      ctx.beginPath(); ctx.moveTo(wl*0.7,-wh*0.9); ctx.bezierCurveTo(wl*0.5,-wh*1.4,wl*0.9,-wh*1.6,wl*0.8,-wh*1.9); ctx.stroke();
      ctx.fillStyle='#ff3d00'; ctx.beginPath(); ctx.arc(wl*0.8,-wh*1.9,wh*0.2,0,Math.PI*2); ctx.fill();
      // 柄
      ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.roundRect(-wl*0.15,-wh*0.32,wl*0.55,wh*0.64,3); ctx.fill();
      break;
    // 弓系
    case 'archer': case 'elven':
      // 弓
      ctx.strokeStyle='#5d4037'; ctx.lineWidth=wh*0.28;
      ctx.beginPath(); ctx.arc(wl*0.2,0,wh*1.5,-Math.PI*0.7,Math.PI*0.7); ctx.stroke();
      ctx.strokeStyle='#a1887f'; ctx.lineWidth=wh*0.08;
      ctx.beginPath(); ctx.moveTo(wl*0.2,-wh*1.45); ctx.lineTo(wl*0.2,wh*1.45); ctx.stroke();
      // 矢
      ctx.strokeStyle='#8d6e63'; ctx.lineWidth=wh*0.12;
      ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.lineTo(wl*1.2,0); ctx.stroke();
      ctx.fillStyle='#bdbdbd'; ctx.beginPath(); ctx.moveTo(wl*1.2,0); ctx.lineTo(wl*1.0,-wh*0.28); ctx.lineTo(wl*1.0,wh*0.28); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#4caf50'; ctx.beginPath(); ctx.moveTo(-wl*0.1,0); ctx.lineTo(-wl*0.0,-wh*0.22); ctx.lineTo(-wl*0.18,-wh*0.1); ctx.closePath(); ctx.fill();
      break;
    // HEXARM専用（6腕の外見に合わせた特殊武器）
    case 'hexarm':
      // 6方向の光放射
      for(let i=0;i<6;i++){
        const a=i/6*Math.PI*2;
        ctx.strokeStyle=`rgba(179,136,255,0.6)`; ctx.lineWidth=wh*0.25;
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*wl*1.1,Math.sin(a)*wl*0.6);ctx.stroke();
      }
      ctx.fillStyle='#7c4dff'; ctx.beginPath(); ctx.arc(0,0,wh*0.7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-wh*0.2,-wh*0.2,wh*0.25,0,Math.PI*2); ctx.fill();
      break;
    default:
      ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.roundRect(-wl*0.1,-wh*0.6,wl,wh*1.2,4); ctx.fill();
  }
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r=3) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,[r]); ctx.fill ? null : ctx.stroke();
}


