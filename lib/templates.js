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
      ctx.drawImage(img, imgX, imgY, imgW, imgH);
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

module.exports = {
  // UPDATED: Profile now has a portrait frame!
  profile: async ({ ctx, width, height, params = {}, loadImage }) => {
    const name     = params.name     || "Lost Adventurer";
    const heroClass= params.class    || "Novice";
    const level    = params.level    || "1";
    const gold     = params.gold     || "50";
    const hp       = params.hp       || "100 / 100";
    const location = params.location || "The Whispering Woods";
    const portraitUrl = params.img; // The class image URL

    // 1. Dark Background
    ctx.fillStyle = "#1a1614"; 
    ctx.fillRect(0, 0, width, height);

    // 2. Main Card
    ctx.fillStyle = "#25221d";
    ctx.beginPath();
    ctx.roundRect(35, 35, width - 70, height - 70, 16);
    ctx.fill();

    ctx.strokeStyle = "#c49b62";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(35, 35, width - 70, height - 70, 16);
    ctx.stroke();

    // 3. Draw the Portrait Frame (Right Side)
    const pX = width - 300;
    const pY = 75;
    const pW = 230;
    const pH = 370;

    // Portrait Background/Frame
    ctx.fillStyle = "#151210";
    ctx.beginPath();
    ctx.roundRect(pX - 5, pY - 5, pW + 10, pH + 10, 12);
    ctx.fill();
    ctx.strokeStyle = "#8c7a6b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pX - 5, pY - 5, pW + 10, pH + 10, 12);
    ctx.stroke();

    // Draw the Class Image if provided
    if (portraitUrl) {
      try {
        const img = await loadImage(portraitUrl);
        // We use clip to ensure the image doesn't overflow the frame
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, 8);
        ctx.clip();
        ctx.drawImage(img, pX, pY, pW, pH);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = "#333";
        ctx.fillRect(pX, pY, pW, pH);
      }
    }

    // 4. Text & Stats (Left Side)
    ctx.fillStyle = "#c49b62";
    ctx.font = "bold 20px Orbitron"; 
    ctx.fillText("RIXHELM  /  HERO FILE", 65, 85);

    // Name
    ctx.fillStyle = "#f4ebd8";
    ctx.font = "bold 48px Poppins"; 
    ctx.fillText(name, 65, 150);

    // Class Name (Under the name)
    ctx.fillStyle = "#c49b62";
    ctx.font = "bold 24px Poppins";
    ctx.fillText("Class: " + heroClass, 65, 195);

    // Stats
    const stats = [
      ["LEVEL", level],
      ["GOLD", gold],
      ["HP", hp]
    ];
    
    stats.forEach(([label, value], i) => {
      const x = 65 + i * 160; // Adjusted spacing to fit left side
      
      ctx.fillStyle = "#8c7a6b";
      ctx.font = "14px Poppins"; 
      ctx.fillText(label, x, 260);
      
      ctx.fillStyle = "#f4ebd8";
      ctx.font = "bold 28px Poppins"; 
      ctx.fillText(value, x, 295);
    });

    // Location Footer
    ctx.fillStyle = "#8c7a6b";
    ctx.font = "16px Poppins"; 
    ctx.fillText("LOCATION  •  " + location, 65, height - 65);
  },

  combat: async ({ ctx, width, height, params = {} }) => {
    // ... (Keep your existing combat code here, no changes needed) ...
    const playerName = params.player || "Aerert";
    const playerHp   = Number(params.php) || 324;
    const playerMax  = Number(params.pmax) || 324;
    const enemyName  = params.enemy || "Slime";
    const enemyHp    = Number(params.ehp) || 202;
    const enemyMax   = Number(params.emax) || 202;

    ctx.fillStyle = "#2c251e";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#e8dfc8"; 
    ctx.fillRect(20, 20, width - 40, 90);

    ctx.fillStyle = "#333";
    ctx.font = "bold 24px Poppins";
    ctx.fillText(playerName, 40, 55);
    ctx.fillStyle = "#a0c4a0"; 
    ctx.fillRect(40, 70, 300, 20);
    ctx.fillStyle = "#559955";
    ctx.fillRect(40, 70, 300 * (Math.max(0, playerHp) / playerMax), 20);
    ctx.fillStyle = "#333";
    ctx.font = "14px Poppins";
    ctx.fillText(`${playerHp}/${playerMax}`, 40, 86);

    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "bold 24px Poppins";
    ctx.fillText(enemyName, width - 40, 55);
    ctx.fillStyle = "#d49b9b";
    ctx.fillRect(width - 340, 70, 300, 20);
    ctx.fillStyle = "#a63b3b";
    ctx.fillRect(width - 340, 70, 300 * (Math.max(0, enemyHp) / enemyMax), 20);
    ctx.fillStyle = "#333";
    ctx.fillText(`${enemyHp}/${enemyMax}`, width - 40, 86);
    ctx.textAlign = "left";

    ctx.fillStyle = "#8fa9e8";
    ctx.fillRect(20, 120, width - 40, 220);
    ctx.fillStyle = "#a3b19b";
    ctx.fillRect(20, 250, width - 40, 90);
    
    ctx.fillStyle = "#4a6741"; 
    ctx.beginPath(); ctx.arc(200, 220, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a8a8a"; 
    ctx.beginPath(); ctx.arc(width - 200, 250, 30, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#e8dfc8";
    ctx.fillRect(20, 350, width - 40, 130);
    ctx.fillStyle = "#b3a387";
    ctx.fillRect(40, 370, 160, 90);
    ctx.fillRect(220, 370, 160, 90);
    ctx.fillRect(400, 370, 160, 90);

    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("ATTACK", 120, 420);
    ctx.fillText("MAGIC", 300, 420);
    ctx.fillText("FLEE", 480, 420);
    ctx.textAlign = "left";
  },

  event: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Keep your existing event code here, no changes needed) ...
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
        ctx.drawImage(img, 20, 80, width - 40, 400);
      } catch (e) {
        ctx.fillStyle = "#a3b19b"; 
        ctx.fillRect(20, 80, width - 40, 400);
        ctx.fillStyle = "#333";
        ctx.font = "bold 24px Poppins";
        ctx.textAlign = "center";
        ctx.fillText("❌ Failed to load image", width/2, 250);
        ctx.textAlign = "left";
      }
    } else {
      ctx.fillStyle = "#a3b19b"; 
      ctx.fillRect(20, 80, width - 40, 400);
    }
  },

  classes: async ({ ctx, width, height, params = {}, loadImage }) => {
    // ... (Keep your existing classes code here, no changes needed) ...
    ctx.fillStyle = "#1a1614";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#2c251e";
    ctx.fillRect(0, 0, width, 80);
    ctx.fillStyle = "#c49b62";
    ctx.font = "bold 32px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE YOUR PATH", width / 2, 52);
    ctx.textAlign = "left";

    const c1_name = params.c1_name || "Warrior";
    const c1_img  = params.c1_img;
    const c2_name = params.c2_name || "Mage";
    const c2_img  = params.c2_img;
    const c3_name = params.c3_name || "Archer";
    const c3_img  = params.c3_img;
    const c4_name = params.c4_name || "Rogue";
    const c4_img  = params.c4_img;

    await drawClassCard(ctx, loadImage, 40, 110, c1_name, c1_img);
    await drawClassCard(ctx, loadImage, 480, 110, c2_name, c2_img);
    await drawClassCard(ctx, loadImage, 40, 300, c3_name, c3_img);
    await drawClassCard(ctx, loadImage, 480, 300, c4_name, c4_img);
  }
};
