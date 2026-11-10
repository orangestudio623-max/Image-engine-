const { loadImage: napiLoadImage } = require("@napi-rs/canvas");

const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "render-js.vercel.app",
  "js-renderer.netlify.app"
]);

async function loadImage(url) {
  const parsed = new URL(url);
  
  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS images are allowed");
  }
  
  if (!ALLOWED_IMAGE_HOSTS.has(parsed.host)) {
    throw new Error("Image host not allowed: " + parsed.host);
  }
  
  // Use fetch to download the image, then pass the buffer to canvas
  const response = await fetch(parsed.href);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  
  const arrayBuffer = await response.arrayBuffer();
  return napiLoadImage(Buffer.from(arrayBuffer));
}

module.exports = { loadImage };
