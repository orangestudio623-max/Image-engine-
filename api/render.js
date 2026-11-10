const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");
const templates = require("../lib/templates");
const { sanitize } = require("../lib/sanitize");

// 1. KEEP FONTS IN MEMORY
const fontBuffers = [];

// 2. HELPER TO REGISTER FONTS SAFELY
function registerFont(pkg, fileName, familyName) {
  try {
    const fontPath = path.join(process.cwd(), "node_modules", pkg, "files", fileName);
    if (fs.existsSync(fontPath)) {
      const buffer = fs.readFileSync(fontPath);
      fontBuffers.push(buffer); // Prevent Node from garbage collecting the buffer
      GlobalFonts.register(buffer, familyName);
      console.log(`✅ Successfully registered: ${familyName}`);
    } else {
      console.error(`❌ Font file not found: ${fontPath}`);
    }
  } catch (err) {
    console.error(`❌ Failed to load ${familyName}:`, err.message);
  }
}

// 3. REGISTER ALL FONTS
// Roboto
registerFont("@fontsource/roboto", "roboto-latin-400-normal.woff", "Roboto");
registerFont("@fontsource/roboto", "roboto-latin-700-normal.woff", "Roboto");

// Orbitron
registerFont("@fontsource/orbitron", "orbitron-latin-400-normal.woff", "Orbitron");
registerFont("@fontsource/orbitron", "orbitron-latin-700-normal.woff", "Orbitron");

// Poppins
registerFont("@fontsource/poppins", "poppins-latin-400-normal.woff", "Poppins");
registerFont("@fontsource/poppins", "poppins-latin-700-normal.woff", "Poppins");


// 4. MAIN HANDLER
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const { template = "profile", w, h, ...rest } = q;

  const fn = templates[template];
  if (!fn) return { statusCode: 404, body: "Unknown template" };

  const width = Math.max(1, Math.min(1600, Number(w) || 900));
  const height = Math.max(1, Math.min(1600, Number(h) || 520));
  const params = sanitize(rest);

  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    
    // Run the template function from lib/templates.js
    await fn({ canvas, ctx, width, height, params });
    
    const png = canvas.toBuffer("image/png");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store" // Prevents Telegram from showing old images
      },
      body: png.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("Render error:", err);
    return { statusCode: 500, body: "Render Error: " + err.message };
  }
};
