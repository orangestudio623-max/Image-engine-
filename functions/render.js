const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

// Register fonts for the canvas context
try {
  GlobalFonts.registerFromPath(path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"), "Roboto");
  GlobalFonts.registerFromPath(path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff"), "Roboto");
} catch (e) {
  console.error("Font loading failed", e);
}

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};

  // 🔒 OPTIONAL SECURITY: Uncomment the next line and set a secret key to protect your function
  // if (q.key !== "my-super-secret-key-123") return { statusCode: 401, body: "Unauthorized" };

  const code = q.code;
  if (!code) return { statusCode: 400, body: "Missing 'code' parameter" };

  const width = Math.max(1, Math.min(1600, Number(q.w) || 900));
  const height = Math.max(1, Math.min(1600, Number(q.h) || 520));

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  try {
    // Execute the JavaScript string sent by the bot
    const execute = new Function("canvas", "ctx", "width", "height", `"use strict";\n${code}`);
    execute(canvas, ctx, width, height);

    // Return the generated PNG
    const png = canvas.toBuffer("image/png");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store" // Prevent Telegram from caching the image
      },
      body: png.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: "Execution Error: " + err.message };
  }
};
