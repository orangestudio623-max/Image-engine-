const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
const templates = require("../lib/templates");
const { sanitize } = require("../lib/sanitize");

// 1. REGISTER THE FONTS
// This tells the server where to find the Roboto font files
try {
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"),
    "Roboto"
  );
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff"),
    "Roboto"
  );
} catch (e) {
  console.error("Font loading failed:", e);
}

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
    
    // 2. RUN THE TEMPLATE
    await fn({ canvas, ctx, width, height, params });
    
    const png = canvas.toBuffer("image/png");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store"
      },
      body: png.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Render Error: " + err.message };
  }
};
