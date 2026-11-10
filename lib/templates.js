// Helper function to wrap long text (we keep it just in case you need it later)
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

module.exports = {
  // 1. FANTASY PROFILE CARD
  profile: async ({ ctx, width, height, params = {} }) => {
    const name     = params.name     || "Lost Adventurer";
    const level    = params.level    || "1";
    const gold     = params.gold     || "50";
    const hp       = params.hp       || "100 / 100";
    const location = params.location || "The Whispering Woods";

    ctx.fillStyle = "#1a1614"; 
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#2c2420";
    ctx.beginPath();
    ctx.arc(width - 100, 85, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#25221d";
    ctx.beginPath();
    ctx.roundRect(35, 35, width - 70, height - 70, 16);
    ctx.fill();

    ctx.strokeStyle = "#c49b62";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(35, 35, width - 70, height - 70, 16);
    ctx.stroke();

    ctx.fillStyle = "#c49b62";
    ctx.font = "bold 20px Orbitron"; 
    ctx.fillText("RIXHELM  /  HERO FILE", 65, 85);

    ctx.fillStyle = "#f4ebd8";
    ctx.font = "bold 52px Poppins"; 
    ctx.fillText(name, 65, 165);

    const stats = [["LEVEL", level], ["GOLD", gold], ["HP", hp]];
    stats.forEach(([label, value], i) => {
      const x = 65 + i * 245;
      ctx.fillStyle = "#8c7a6b";
      ctx.font = "14px Poppins"; 
      ctx.fillText(label, x, 245);
      
      ctx.fillStyle = "#f4ebd8";
      ctx.font = "bold 32px Poppins"; 
      ctx.fillText(value, x, 285);
    });

    ctx.fillStyle = "#8c7a6b";
    ctx.font = "16px Poppins"; 
    ctx.fillText("LOCATION  •  " + location, 65, height - 75);
  },

  // 2. COMBAT SCREEN
  combat: async ({ ctx, width, height, params = {} }) => {
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

    // Player Info
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

    // Enemy Info
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

    // Scene Window
    ctx.fillStyle = "#8fa9e8";
    ctx.fillRect(20, 120, width - 40, 220);
    ctx.fillStyle = "#a3b19b";
    ctx.fillRect(20, 250, width - 40, 90);
    
    // Characters
    ctx.fillStyle = "#4a6741"; 
    ctx.beginPath(); ctx.arc(200, 220, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a8a8a"; 
    ctx.beginPath(); ctx.arc(width - 200, 250, 30, 0, Math.PI * 2); ctx.fill();

    // Bottom Actions
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

  // 3. EVENT / SCENE SCREEN
  event: async ({ ctx, width, height, params = {}, loadImage }) => {
  const sceneTitle = params.title || "Rixhelm Outskirts";
  const imageUrl = params.img || null;

  // Parchment Background
  ctx.fillStyle = "#e8dfc8"; 
  ctx.fillRect(0, 0, width, height);

  // Top Title Bar
  ctx.fillStyle = "#2c251e";
  ctx.fillRect(0, 0, width, 60);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Poppins";
  ctx.fillText(sceneTitle, 20, 38);

  // Draw the actual image if a URL is provided
  if (imageUrl) {
    try {
      const img = await loadImage(imageUrl);
      // Draw the image to fit the 400px height area
      ctx.drawImage(img, 20, 80, width - 40, 400);
    } catch (e) {
      console.error("Image failed to load", e);
      // Fallback if image fails
      ctx.fillStyle = "#a3b19b"; 
      ctx.fillRect(20, 80, width - 40, 400);
    }
  } else {
    // Placeholder if no image is provided
    ctx.fillStyle = "#a3b19b"; 
    ctx.fillRect(20, 80, width - 40, 400);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("[ SCENE ART PLACEHOLDER ]", width/2, 280);
    ctx.textAlign = "left";
  }
  }
};
