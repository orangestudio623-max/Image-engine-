const { loadImage: napiLoadImage } = require("@napi-rs/canvas");

// List of allowed hosts for loading images to prevent Server-Side Request Forgery (SSRF)
const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",       // Allowed for testing fantasy backgrounds
  "render-js.vercel.app",      // Your Vercel app
  "js-renderer.netlify.app"    // Your old Netlify app (just in case)
]);

function loadImage(url) {
  const parsed = new URL(url);
  
  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS images are allowed");
  }
  
  if (!ALLOWED_IMAGE_HOSTS.has(parsed.host)) {
    throw new Error("Image host not allowed: " + parsed.host);
  }
  
  return napiLoadImage(parsed.href);
}

module.exports = { loadImage };
