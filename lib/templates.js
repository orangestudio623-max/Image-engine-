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
    sh = img.height;
    sw = sh * boxAspect;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxAspect;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function drawClassCard(ctx, loadImage, x, y, name, imgUrl) {
  const cardW = 380;
  const cardH = 160;

  ctx.fillStyle = "#25221d";
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 12);
  ctx.fill();

  ctx.strokeStyle = "#c49b62";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 12);
  ctx.stroke();

  const imgX = x + 10;
  const imgY = y + 10;
  const imgW = 120;
  const imgH = 140;

  if (imgUrl) {
    try {
      const img = await loadImage(imgUrl);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 6);
      ctx.clip();
      drawImageCover(ctx, img, imgX, imgY, imgW, imgH);
      ctx.restore();
    } catch (e) {
      ctx.fillStyle = "#333";
      ctx.fillRect(imgX, imgY, imgW, imgH);
    }
  } else {
    ctx.fillStyle = "#333";
    ctx.fillRect(imgX, imgY, imgW, imgH);
  }

  ctx.fillStyle = "#f4ebd8";
  ctx.font = "bold 28px Poppins";
  ctx.textAlign = "left";
  ctx.fillText(name, x + 150, y + 85);
}

// Helper to draw a health bar
function drawHealthBar(ctx, x, y, w, h, current, max, isEnemy = false) {
  const pct = Math.max(0, Math.min(1, current / max));
  
  // Background
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.fill();
  
  // Fill
  ctx.fillStyle = isEnemy ? "#a63b3b" : "#559955"; // Red for enemy, Green for player
  ctx.beginPath(); ctx.roundRect(x, y, w * pct, h, h/2); ctx.fill();
  
  // Text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(`${current} / ${max}`, x + w/2, y + h - 3);
  ctx.textAlign = "left";
}

module.exports = {
  profile: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Keep your existing profile code, no changes needed) ...
    const name     = params.name     || "Lost Adventurer";
    const heroClass= params.class    || "Novice";
    const level    = params.level    || "1";
    const gold     = params.gold     || "50";
    const hp       = params.hp       || "100 / 100";
    const location = params.location || "The Whispering Woods";
    const portraitUrl = params.img;

    ctx.fillStyle = "#1a1614"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#25221d";
    ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.fill();

    if (portraitUrl) {
      try {
        const img = await loadImage(portraitUrl);
        ctx.save();
        ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.clip();
        const imgX = width - 450; const imgY = 35; const imgW = 415; const imgH = height - 70;
        drawImageCover(ctx, img, imgX, imgY, imgW, imgH);
        const fade = ctx.createLinearGradient(imgX, 0, imgX + 250, 0);
        fade.addColorStop(0, "rgba(37, 34, 29, 1)");
        fade.addColorStop(0.5, "rgba(37, 34, 29, 0.8)");
        fade.addColorStop(1, "rgba(37, 34, 29, 0)");
        ctx.fillStyle = fade; ctx.fillRect(imgX, imgY, imgW, imgH);
        ctx.restore();
      } catch (e) { console.error(e); }
    }

    ctx.strokeStyle = "#c49b62"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(35, 35, width - 70, height - 70, 16); ctx.stroke();

    ctx.fillStyle = "#c49b62"; ctx.font = "bold 20px Orbitron"; 
    ctx.fillText("RIXHELM  /  HERO FILE", 65, 85);
    ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 48px Poppins"; 
    ctx.fillText(name, 65, 150);
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 24px Poppins";
    ctx.fillText("Class: " + heroClass, 65, 195);

    const stats = [["LEVEL", level], ["GOLD", gold], ["HP", hp]];
    stats.forEach(([label, value], i) => {
      const x = 65 + i * 160; 
      ctx.fillStyle = "#8c7a6b"; ctx.font = "14px Poppins"; 
      ctx.fillText(label, x, 260);
      ctx.fillStyle = "#f4ebd8"; ctx.font = "bold 28px Poppins"; 
      ctx.fillText(value, x, 295);
    });

    ctx.fillStyle = "#8c7a6b"; ctx.font = "16px Poppins"; 
    ctx.fillText("LOCATION  •  " + location, 65, height - 65);
  },

  // UPDATED: COMBAT TEMPLATE
  combat: async ({ ctx, width, height, params = {}, loadImage }) => {
    const playerName = params.player || "Adventurer";
    const playerHp   = Number(params.php) || 100;
    const playerMax  = Number(params.pmax) || 100;
    const pImgUrl    = params.p_img; // Player Avatar

    const enemyName  = params.enemy || "Slime";
    const enemyHp    = Number(params.ehp) || 50;
    const enemyMax   = Number(params.emax) || 50;
    const eImgUrl    = params.e_img; // Enemy Avatar

    const bgUrl      = params.bg; // Optional battle background

    // 1. Dark Base Background
    ctx.fillStyle = "#1a1614";
    ctx.fillRect(0, 0, width, height);

    // 2. Top HUD (Parchment)
    ctx.fillStyle = "#e8dfc8";
    ctx.beginPath(); ctx.roundRect(20, 20, width - 40, 100, 12); ctx.fill();

    // Player HUD (Left)
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Poppins";
    ctx.fillText(playerName, 40, 50);
    drawHealthBar(ctx, 40, 65, 250, 24, playerHp, playerMax, false);
    // Player Avatar (Top Left corner)
    if (pImgUrl) {
      try {
        const pImg = await loadImage(pImgUrl);
        ctx.save(); ctx.beginPath(); ctx.arc(300, 65, 35, 0, Math.PI * 2); ctx.clip();
        drawImageCover(ctx, pImg, 265, 30, 70, 70);
        ctx.restore();
      } catch(e) {}
    }

    // Enemy HUD (Right)
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Poppins";
    ctx.fillText(enemyName, width - 40, 50);
    drawHealthBar(ctx, width - 290, 65, 250, 24, enemyHp, enemyMax, true);
    // Enemy Avatar (Top Right corner)
    if (eImgUrl) {
      try {
        const eImg = await loadImage(eImgUrl);
        ctx.save(); ctx.beginPath(); ctx.arc(width - 300, 65, 35, 0, Math.PI * 2); ctx.clip();
        drawImageCover(ctx, eImg, width - 335, 30, 70, 70);
        ctx.restore();
      } catch(e) {}
    }
    ctx.textAlign = "left";

    // 3. Battlefield Scene
    ctx.save();
    ctx.beginPath(); ctx.roundRect(20, 130, width - 40, 260, 12); ctx.clip();
    
    // Scene Background (Image or Default Grass)
    if (bgUrl) {
      try {
        const bg = await loadImage(bgUrl);
        drawImageCover(ctx, bg, 20, 130, width - 40, 260);
      } catch(e) {
        ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 130, width - 40, 260);
      }
    } else {
      // Default Scene (Sky and Ground)
      ctx.fillStyle = "#8fa9e8"; ctx.fillRect(20, 130, width - 40, 260);
      ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 260, width - 40, 130);
    }

    // Draw Player Avatar in Scene (Left)
    if (pImgUrl) {
      try {
        const pImg = await loadImage(pImgUrl);
        ctx.beginPath(); ctx.arc(200, 280, 60, 0, Math.PI * 2); 
        ctx.fillStyle = "#25221d"; ctx.fill(); // Base circle
        ctx.save(); ctx.beginPath(); ctx.arc(200, 280, 55, 0, Math.PI * 2); ctx.clip();
        drawImageCover(ctx, pImg, 145, 225, 110, 110);
        ctx.restore();
      } catch(e) {}
    }

    // Draw Enemy Avatar in Scene (Right)
    if (eImgUrl) {
      try {
        const eImg = await loadImage(eImgUrl);
        ctx.beginPath(); ctx.arc(width - 200, 280, 60, 0, Math.PI * 2); 
        ctx.fillStyle = "#25221d"; ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(width - 200, 280, 55, 0, Math.PI * 2); ctx.clip();
        drawImageCover(ctx, eImg, width - 255, 225, 110, 110);
        ctx.restore();
      } catch(e) {}
    }
    ctx.restore(); // End Battlefield Clip

    // 4. Bottom Action Text (Buttons will be sent by Bot)
    ctx.fillStyle = "#25221d";
    ctx.beginPath(); ctx.roundRect(20, 400, width - 40, 90, 12); ctx.fill();
    
    ctx.fillStyle = "#c49b62";
    ctx.font = "bold 20px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("What will you do?", width / 2, 445);
    
    ctx.font = "16px Poppins";
    ctx.fillStyle = "#8c7a6b";
    ctx.fillText("Use the buttons below to attack, use magic, or flee.", width / 2, 470);
    ctx.textAlign = "left";
  },

  event: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Keep your existing event code, no changes needed) ...
    const sceneTitle = params.title || "Rixhelm Outskirts";
    const imageUrl = params.img || null;

    ctx.fillStyle = "#e8dfc8"; 
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#2c251e";
    ctx.fillRect(0, 0, width, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Poppins";
    ctx.fillText(sceneTitle, 20, 38);

    if (imageUrl) {
      try {
        const img = await loadImage(imageUrl);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(20, 80, width - 40, 400, 8);
        ctx.clip();
        drawImageCover(ctx, img, 20, 80, width - 40, 400);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = "#a3b19b"; ctx.fillRect(20, 80, width - 40, 400);
        ctx.fillStyle = "#333"; ctx.font = "bold 24px Poppins";
        ctx.textAlign = "center"; ctx.fillText("❌ Failed to load image", width/2, 250);
        ctx.textAlign = "left";
      }
    } else {
      ctx.fillStyle = "#a3b19b"; 
      ctx.fillRect(20, 80, width - 40, 400);
    }
  },

  classes: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Keep your existing classes code, no changes needed) ...
    ctx.fillStyle = "#1a1614"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#2c251e"; ctx.fillRect(0, 0, width, 80);
    ctx.fillStyle = "#c49b62"; ctx.font = "bold 32px Orbitron";
    ctx.textAlign = "center"; ctx.fillText("CHOOSE YOUR PATH", width / 2, 52);
    ctx.textAlign = "left";

    const c1_name = params.c1_name || "Warrior"; const c1_img = params.c1_img;
    const c2_name = params.c2_name || "Mage"; const c2_img = params.c2_img;
    const c3_name = params.c3_name || "Archer"; const c3_img = params.c3_img;
    const c4_name = params.c4_name || "Rogue"; const c4_img = params.c4_img;

    await drawClassCard(ctx, loadImage, 40, 110, c1_name, c1_img);
    await drawClassCard(ctx, loadImage, 480, 110, c2_name, c2_img);
    await drawClassCard(ctx, loadImage, 40, 300, c3_name, c3_img);
    await drawClassCard(ctx, loadImage, 480, 300, c4_name, c4_img);
  }
};
