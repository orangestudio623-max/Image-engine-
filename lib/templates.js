function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgAspect = img.width / img.height;
  const boxAspect = w / h;
  let sx, sy, sw, sh;

  if (imgAspect > boxAspect) {
    sh = img.height; sw = sh * boxAspect; sx = (img.width - sw) / 2; sy = 0;
  } else {
    sw = img.width; sh = sw / boxAspect; sx = 0; sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function drawClassCard(ctx, loadImage, x, y, name, imgUrl) {
  const cardW = 380; const cardH = 160;
  ctx.fillStyle = "#25221d"; ctx.beginPath(); ctx.roundRect(x, y, cardW, cardH, 12); ctx.fill();
  ctx.strokeStyle = "#c49b62"; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, cardW, cardH, 12); ctx.stroke();

  const imgX = x + 10; const imgY = y + 10; const imgW = 120; const imgH = 140;
  if (imgUrl) {
    try {
      const img = await loadImage(imgUrl);
      ctx.save(); ctx.beginPath(); ctx.roundRect(imgX, imgY, imgW, imgH, 6); ctx.clip();
      drawImageCover(ctx, img, imgX, imgY, imgW, imgH); ctx.restore();
    } catch (e) { ctx.fillStyle = "#333"; ctx.fillRect(imgX, imgY, imgW, imgH); }
  } else { ctx.fillStyle = "#333"; ctx.fillRect(imgX, imgY, imgW, imgH); }

  ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 28px Poppins"; ctx.textAlign = "left"; ctx.fillText(name, x + 150, y + 85);
}

function drawHealthBar(ctx, x, y, w, h, current, max, isEnemy = false) {
  const pct = Math.max(0, Math.min(1, current / max));
  ctx.fillStyle = "#111"; ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.fill();
  ctx.fillStyle = isEnemy ? "#a63b3b" : "#559955"; ctx.beginPath(); ctx.roundRect(x, y, w * pct, h, h/2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 14px Poppins"; ctx.textAlign = "center"; ctx.fillText(`${current} / ${max}`, x + w/2, y + h - 3); ctx.textAlign = "left";
}

module.exports = {
  profile: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Profile remains unchanged)
    const name = params.name || "Lost Adventurer"; const heroClass = params.class || "Novice";
    const level = params.level || "1"; const gold = params.gold || "50";
    const hp = params.hp || "100 / 100"; const location = params.location || "The Whispering Woods";
    const portraitUrl = params.img;

    ctx.fillStyle = "#1a1614"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#25221d"; ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.fill();

    if (portraitUrl) {
      try {
        const img = await loadImage(portraitUrl);
        ctx.save(); ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.clip();
        const imgX = width - 450; const imgY = 35; const imgW = 415; const imgH = height - 70;
        drawImageCover(ctx, img, imgX, imgY, imgW, imgH);
        const fade = ctx.createLinearGradient(imgX, 0, imgX + 250, 0);
        fade.addColorStop(0, "rgba(37, 34, 29, 1)"); fade.addColorStop(0.5, "rgba(37, 34, 29, 0.8)"); fade.addColorStop(1, "rgba(37, 34, 29, 0)");
        ctx.fillStyle = fade; ctx.fillRect(imgX, imgY, imgW, imgH); ctx.restore();
      } catch (e) {}
    }

    ctx.strokeStyle = "#c49b62"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.stroke();
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 20px Orbitron"; ctx.fillText("RIXHELM  /  HERO FILE", 65, 85);
    ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 48px Poppins"; ctx.fillText(name, 65, 150);
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 24px Poppins"; ctx.fillText("Class: " + heroClass, 65, 195);

    const stats = [["LEVEL", level], ["GOLD", gold], ["HP", hp]];
    stats.forEach(([label, value], i) => {
      const x = 65 + i * 160; 
      ctx.fillStyle = "#8c7a6b"; ctx.font = "14px Poppins"; ctx.fillText(label, x, 260);
      ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 28px Poppins"; ctx.fillText(value, x, 295);
    });
    ctx.fillStyle = "#8c7a6b"; ctx.font = "16px Poppins"; ctx.fillText("LOCATION  •  " + location, 65, height - 65);
  },

  combat: async ({ ctx, width, height, params = {}, loadImage }) => {
    const playerName = params.player || "Adventurer";
    const playerHp   = Number(params.php) || 100;
    const playerMax  = Number(params.pmax) || 100;
    const pImgUrl    = params.p_img;

    const enemyName  = params.enemy || "Slime";
    const enemyHp    = Number(params.ehp) || 50;
    const enemyMax   = Number(params.emax) || 50;
    const eImgUrl    = params.e_img;
    const bgUrl      = params.bg;

    ctx.fillStyle = "#1a1614"; ctx.fillRect(0, 0, width, height);
    
    // Top HUD
    ctx.fillStyle = "#e8dfc8"; ctx.beginPath(); ctx.roundRect(20, 20, width - 40, 100, 12); ctx.fill();
    
    // Player HUD (Left)
    ctx.fillStyle = "#333"; ctx.font = "bold 22px Poppins"; ctx.fillText(playerName, 40, 50);
    drawHealthBar(ctx, 40, 65, 250, 24, playerHp, playerMax, false);

    // Enemy HUD (Right)
    ctx.textAlign = "right"; ctx.fillStyle = "#333"; ctx.font = "bold 22px Poppins"; ctx.fillText(enemyName, width - 40, 50);
    drawHealthBar(ctx, width - 290, 65, 250, 24, enemyHp, enemyMax, true); ctx.textAlign = "left";

    // Battlefield Scene
    ctx.save(); ctx.beginPath(); ctx.roundRect(20, 130, width - 40, 260, 12); ctx.clip();
    
    if (bgUrl) {
      try { const bg = await loadImage(bgUrl); drawImageCover(ctx, bg, 20, 130, width - 40, 260); } 
      catch(e) { ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 130, width - 40, 260); }
    } else { ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 130, width - 40, 260); }

    // Draw Player Avatar (SQUARE / TROPHY STYLE)
    if (pImgUrl) {
      try {
        const pImg = await loadImage(pImgUrl);
        // Draw a thick border behind the square
        ctx.fillStyle = "#c49b62"; 
        ctx.beginPath(); ctx.roundRect(130, 210, 140, 140, 16); ctx.fill();
        
        // Draw the cropped image inside the square
        ctx.save(); ctx.beginPath(); ctx.roundRect(135, 215, 130, 130, 12); ctx.clip();
        drawImageCover(ctx, pImg, 135, 215, 130, 130); ctx.restore();
      } catch(e) {}
    }

    // Draw Enemy Avatar (SQUARE / TROPHY STYLE)
    if (eImgUrl) {
      try {
        const eImg = await loadImage(eImgUrl);
        // Draw a thick border behind the square
        ctx.fillStyle = "#a63b3b"; 
        ctx.beginPath(); ctx.roundRect(width - 270, 210, 140, 140, 16); ctx.fill();
        
        // Draw the cropped image inside the square
        ctx.save(); ctx.beginPath(); ctx.roundRect(width - 265, 215, 130, 130, 12); ctx.clip();
        drawImageCover(ctx, eImg, width - 265, 215, 130, 130); ctx.restore();
      } catch(e) {}
    }
    ctx.restore(); 

    // Bottom Action Area
    ctx.fillStyle = "#25221d"; ctx.beginPath(); ctx.roundRect(20, 400, width - 40, 90, 12); ctx.fill();
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 20px Poppins"; ctx.textAlign = "center";
    ctx.fillText("Roll the dice to determine your fate...", width / 2, 450); ctx.textAlign = "left";
  },

  event: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Event remains unchanged)
    const sceneTitle = params.title || "Rixhelm Outskirts"; const imageUrl = params.img || null;
    ctx.fillStyle = "#e8dfc8"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#2c251e"; ctx.fillRect(0, 0, width, 60);
    ctx.fillStyle = "#fff"; ctx.font = "bold 24px Poppins"; ctx.fillText(sceneTitle, 20, 38);
    if (imageUrl) {
      try {
        const img = await loadImage(imageUrl);
        ctx.save(); ctx.beginPath(); ctx.roundRect(20, 80, width - 40, 400, 8); ctx.clip();
        drawImageCover(ctx, img, 20, 80, width - 40, 400); ctx.restore();
      } catch (e) { ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 80, width - 40, 400); }
    } else { ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 80, width - 40, 400); }
  },

  classes: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Classes remain unchanged)
    ctx.fillStyle = "#1a1614"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#2c251e"; ctx.fillRect(0, 0, width, 80);
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 32px Orbitron"; ctx.textAlign = "center"; ctx.fillText("CHOOSE YOUR PATH", width / 2, 52); ctx.textAlign = "left";
    const c1 = params.c1_img, c2 = params.c2_img, c3 = params.c3_img, c4 = params.c4_img;
    await drawClassCard(ctx, loadImage, 40, 110, params.c1_name || "Warrior", c1);
    await drawClassCard(ctx, loadImage, 480, 110, params.c2_name || "Mage", c2);
    await drawClassCard(ctx, loadImage, 40, 300, params.c3_name || "Archer", c3);
    await drawClassCard(ctx, loadImage, 480, 300, params.c4_name || "Rogue", c4);
  },
  inventory: async ({ ctx, width, height, params = {} }) => {
  const name = params.name || "Adventurer";
  const gold = params.gold || "50";
  const items = JSON.parse(params.items || "[]");

  // 1. Dark Background
  ctx.fillStyle = "#1a1614"; 
  ctx.fillRect(0, 0, width, height);

  // 2. Main Card
  ctx.fillStyle = "#25221d";
  ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.fill();
  ctx.strokeStyle = "#c49b62"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.stroke();

  // 3. Headers
  ctx.fillStyle = "#c49b62"; ctx.font = "bold 20px Orbitron"; 
  ctx.fillText(name.toUpperCase() + "  /  INVENTORY", 65, 85);
  
  ctx.fillStyle = "#8c7a6b"; ctx.font = "bold 20px Poppins";
  ctx.textAlign = "right"; ctx.fillText("🪙 " + gold + " Gold", width - 65, 85); ctx.textAlign = "left";

  // 4. Draw Items in a Grid
  if (items.length === 0) {
    ctx.fillStyle = "#8c7a6b"; ctx.font = "24px Poppins";
    ctx.fillText("Your bag is empty.", 65, 180);
  } else {
    items.forEach((item, index) => {
      // Calculate position (2 columns)
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 65 + (col * 390);
      const y = 140 + (row * 90);

      // Item Box
      ctx.fillStyle = "#1a1614";
      ctx.beginPath(); ctx.roundRect(x, y, 360, 70, 8); ctx.fill();
      
      // Item Name & Qty
      ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 20px Poppins";
      ctx.fillText(item.name, x + 20, y + 30);
      ctx.fillStyle = "#c49b62"; ctx.font = "16px Poppins";
      ctx.fillText("Qty: " + item.qty, x + 20, y + 55);
    });
  }
    }
};
