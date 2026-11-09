
const { loadImage: napiLoadImage } = require("@napi-rs/canvas");

// SSRF-safe image loader
const ALLOWED_IMAGE_HOSTS = new Set([
  "your-site.netlify.app",
  "cdn.your-domain.com",
]);

function loadImage(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("Only https: images allowed");
  if (!ALLOWED_IMAGE_HOSTS.has(parsed.host)) throw new Error("Image host not allowed");
  return napiLoadImage(parsed.href);
}

module.exports = { loadImage };
