const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");
const templates = require("../lib/templates");
const { sanitize } = require("../lib/sanitize");
const { loadImage } = require("../lib/assets");

const fontBuffers = [];

function registerFont(pkg, fileName, familyName) {
  try {
    const fontPath = path.join(process.cwd(), "node_modules", pkg, "files", fileName);
    if (fs.existsSync(fontPath)) {
      const buffer = fs.readFileSync(fontPath);
      fontBuffers.push(buffer); 
      GlobalFonts.register(buffer, familyName);
    } else {
      console.error(`Font file not found: ${fontPath}`);
    }
  } catch (err) {
    console.error(`Failed to load ${familyName}:`, err.message);
  }
}

// Register fonts here at the top
registerFont("@fontsource/roboto", "roboto-latin-400-normal.woff", "Roboto");
registerFont("@fontsource/roboto", "roboto-latin-700-normal.woff", "Roboto");
registerFont("@fontsource/orbitron", "orbitron-latin-400-normal.woff", "Orbitron");
registerFont("@fontsource/orbitron", "orbitron-latin-700-normal.woff", "Orbitron");
registerFont("@fontsource/poppins", "poppins-latin-400-normal.woff", "Poppins");
registerFont("@fontsource/poppins", "poppins-latin-700-normal.woff", "Poppins");

module.exports = async (req, res) => {
  const q = req.query || {};
  const { template = "profile", w, h, ...rest } = q;

  const fn = templates[template];
  if (!fn) return res.status(404).send("Unknown template");

  const width = Math.max(1, Math.min(1600, Number(w) || 900));
  const height = Math.max(1, Math.min(1600, Number(h) || 520));
  const params = sanitize(rest);

  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    
    // Pass loadImage to the templates so they can draw pictures!
    await fn({ canvas, ctx, width, height, params, loadImage });
    
    const png = canvas.toBuffer("image/png");
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(png);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Render Error: " + err.message);
  }
};
