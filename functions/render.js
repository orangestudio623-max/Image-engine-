const { createCanvas } = require("@napi-rs/canvas");
const templates = require("../lib/templates");
const { sanitize } = require("../lib/sanitize");
const { loadImage } = require("../lib/assets");

const DEFAULT_W = 900, DEFAULT_H = 520, MAX_DIM = 1600;

function dim(v, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(MAX_DIM, Math.floor(n));
}

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const { template = "profile", w, h, ...rest } = q;

  const fn = templates[template];
  if (!fn) return { statusCode: 404, body: "Unknown template" };

  const width = dim(w, DEFAULT_W);
  const height = dim(h, DEFAULT_H);
  const params = sanitize(rest);

  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    await fn({ canvas, ctx, width, height, params, loadImage });
    const png = canvas.toBuffer("image/png");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
        "Content-Length": String(png.length),
      },
      body: png.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("render failed", err);
    return { statusCode: 500, body: "Render failed" };
  }
};