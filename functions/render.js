const { createCanvas } = require("@napi-rs/canvas");
const templates = require("../lib/templates");
const { sanitize } = require("../lib/sanitize");

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
    
    // Run the template function
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
