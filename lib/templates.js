module.exports = {
  profile: async ({ ctx, width, height, params = {} }) => {
    const name     = params.name     || "COSMIC DUDE";
    const credits  = params.credits  || "250";
    const health   = params.health   || "85 / 100";
    const energy   = params.energy   || "60 / 100";
    const location = params.location || "THE NEIGHBOURHOOD";

    ctx.fillStyle = "#171b2c";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#252e49";
    ctx.beginPath();
    ctx.arc(width - 90, 75, 145, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#222941";
    ctx.beginPath();
    ctx.roundRect(35, 35, width - 70, height - 70, 24);
    ctx.fill();

    ctx.fillStyle = "#f5d58a";
    ctx.font = "bold 20px Roboto"; 
    ctx.fillText("SPACE TIME  /  PLAYER FILE", 65, 85);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Roboto"; 
    ctx.fillText(name, 65, 165);

    const stats = [["CREDITS", credits], ["HEALTH", health], ["ENERGY", energy]];
    stats.forEach(([label, value], i) => {
      const x = 65 + i * 245;
      ctx.fillStyle = "#aab6d2";
      ctx.font = "14px Roboto"; 
      ctx.fillText(label, x, 245);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 27px Roboto"; 
      ctx.fillText(value, x, 285);
    });

    ctx.fillStyle = "#9ca8c4";
    ctx.font = "16px Roboto"; 
    ctx.fillText("LOCATION  •  " + location, 65, height - 75);
  },
};
